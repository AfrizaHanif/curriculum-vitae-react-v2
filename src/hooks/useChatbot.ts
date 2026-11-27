"use client";

import { useRef, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";
import { ChatMode, Message } from "@/types/chatbot";
import { SYSTEM_INSTRUCTION } from "@/data/chatbot";
import { getApiUrl } from "@/config/siteConfig";
import { useLanguage } from "@/context/LanguageContext";

const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
const CV_CONTEXT_CACHE_KEY = "cv_chatbot_context_cache";

function readCachedCvContext(): string {
  try {
    return typeof window !== "undefined"
      ? window.localStorage.getItem(CV_CONTEXT_CACHE_KEY) || ""
      : "";
  } catch {
    return "";
  }
}

function writeCachedCvContext(context: string): void {
  try {
    if (typeof window !== "undefined" && context) {
      window.localStorage.setItem(CV_CONTEXT_CACHE_KEY, context);
    }
  } catch {
    // Abaikan jika localStorage tidak tersedia (mis. mode privat)
  }
}

export function useChat() {
  const { t } = useLanguage();
  const [engine, setEngine] = useState<webllm.MLCEngineInterface | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mode, setMode] = useState<ChatMode>("cloud");
  const [error, setError] = useState<string | null>(null);
  const [cvContext, setCvContext] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const isWebGPUSupported =
    typeof navigator !== "undefined" && "gpu" in navigator;

  const resolveCvContext = async (): Promise<string> => {
    try {
      const res = await fetch(getApiUrl("chatbotContext"), {
        signal: AbortSignal.timeout(8000),
      });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (data?.context) {
          writeCachedCvContext(data.context);
          setCvContext(data.context);
          return data.context;
        }
      }
    } catch (contextError) {
      console.warn(
        "Gagal memuat konteks CV dari API, menggunakan fallback:",
        contextError,
      );
    }

    const cached = readCachedCvContext();
    if (cached) {
      setCvContext(cached);
      return cached;
    }

    const { buildFallbackCvContext } = await import("@/data/fallbackCvContext");
    const fallbackContext = await buildFallbackCvContext();
    setCvContext(fallbackContext);
    return fallbackContext;
  };

  const loadModel = async () => {
    try {
      setError(null);
      await resolveCvContext();

      if (engine) {
        await engine.unload().catch(() => {});
        setEngine(null);
        setIsModelLoaded(false);
      }

      if (!isWebGPUSupported) {
        throw new Error(t.ui.chatbot.errors.webgpuUnsupported);
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error(t.ui.chatbot.errors.webgpuNoAdapter);
      }

      setLoadingProgress(t.ui.chatbot.errors.webgpuInitializing);
      const mlcEngine = await webllm.CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (report) => {
          setLoadingProgress(report.text);
        },
      });
      setEngine(mlcEngine);
      setIsModelLoaded(true);
      setLoadingProgress("");
    } catch (err) {
      console.error(err);
      setLoadingProgress("");
      const message =
        err instanceof Error && err.message
          ? err.message
          : t.ui.chatbot.errors.unknownError;
      setError(
        message.includes("WebGPU")
          ? message
          : t.ui.chatbot.errors.loadLocalFailed.replace("{message}", message),
      );
    }
  };

  const updateLastAssistantMessage = (
    content: string,
    options?: Partial<
      Pick<
        Message,
        | "isError"
        | "provider"
        | "isFallback"
        | "canFallbackToLocal"
        | "model"
        | "timestamp"
      >
    >,
  ) => {
    setMessages((prev) => {
      const newMsg = [...prev];
      if (newMsg.length > 0 && newMsg[newMsg.length - 1].role === "assistant") {
        newMsg[newMsg.length - 1] = {
          ...newMsg[newMsg.length - 1],
          content,
          ...options,
        };
      }
      return newMsg;
    });
  };

  const isAbortError = (err: unknown): boolean =>
    err instanceof Error && err.name === "AbortError";

  const finalizeCancelledResponse = () => {
    setMessages((prev) => {
      if (
        prev.length > 0 &&
        prev[prev.length - 1].role === "assistant" &&
        !prev[prev.length - 1].content.trim()
      ) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const streamLocalResponse = async (
    payloadMessages: Array<Pick<Message, "role" | "content">>,
    activeEngine: webllm.MLCEngineInterface,
    activeContext: string,
    signal?: AbortSignal,
  ) => {
    const chunks = await activeEngine.chat.completions.create({
      messages: [
        {
          role: "system",
          content: activeContext
            ? `${SYSTEM_INSTRUCTION}\n\n${activeContext}`
            : SYSTEM_INSTRUCTION,
        },
        ...payloadMessages,
      ],
      temperature: 0.2,
      stream: true,
    });

    let assistantResponse = "";
    for await (const chunk of chunks) {
      if (isCancelledRef.current || signal?.aborted) {
        break;
      }
      const delta = chunk.choices[0]?.delta?.content || "";
      assistantResponse += delta;
      updateLastAssistantMessage(assistantResponse, { model: SELECTED_MODEL });
    }
    if (assistantResponse && !isCancelledRef.current && !signal?.aborted) {
      updateLastAssistantMessage(assistantResponse, {
        model: SELECTED_MODEL,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleLocalError = (err: unknown) => {
    console.error(err);
    const rawMessage = err instanceof Error && err.message ? err.message : "";
    const isDeviceLost = /disposed|device was lost|gpudevicelost/i.test(
      rawMessage,
    );

    if (isDeviceLost) {
      const deviceLostMessage = t.ui.chatbot.errors.webgpuDeviceLost;
      setEngine(null);
      setIsModelLoaded(false);
      setError(deviceLostMessage);
      updateLastAssistantMessage(deviceLostMessage, { isError: true });
    } else {
      updateLastAssistantMessage(
        rawMessage || t.ui.chatbot.errors.localProcessFailed,
        { isError: true },
      );
    }
  };

  const executeChatRequest = async (conversationHistory: Message[]) => {
    if (isGenerating || conversationHistory.length === 0) return;
    if (mode === "local" && !engine) return;

    const currentMode = mode;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isCancelledRef.current = false;

    setMessages([
      ...conversationHistory,
      { role: "assistant", content: "", provider: currentMode },
    ]);
    setIsGenerating(true);

    try {
      const payloadMessages = conversationHistory.map(({ role, content }) => ({
        role,
        content,
      }));

      if (currentMode === "local") {
        try {
          const activeContext = cvContext || (await resolveCvContext());
          if (isCancelledRef.current || controller.signal.aborted) {
            finalizeCancelledResponse();
            return;
          }
          await streamLocalResponse(
            payloadMessages,
            engine!,
            activeContext,
            controller.signal,
          );
          if (isCancelledRef.current || controller.signal.aborted) {
            finalizeCancelledResponse();
          }
        } catch (localError) {
          if (isCancelledRef.current || isAbortError(localError)) {
            finalizeCancelledResponse();
            return;
          }
          handleLocalError(localError);
        }
        return;
      }

      try {
        const res = await fetch(getApiUrl("chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payloadMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let errorMessage = t.ui.chatbot.errors.cloudHttpError.replace(
            "{status}",
            String(res.status),
          );
          try {
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              const data = await res.json();
              if (data?.error) {
                errorMessage = data.error;
              } else if (data?.message) {
                errorMessage = data.message;
              }
            }
          } catch {
            // Abaikan error parsing jika respons bukan JSON (mis. halaman HTML 404/502)
          }
          throw new Error(errorMessage);
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (isCancelledRef.current || controller.signal.aborted) {
            finalizeCancelledResponse();
            return;
          }
          const replyText =
            typeof data?.reply === "string"
              ? data.reply
              : typeof data?.message === "string"
                ? data.message
                : typeof data?.content === "string"
                  ? data.content
                  : "";
          if (!replyText) {
            throw new Error(t.ui.chatbot.errors.cloudEmptyJson);
          }
          updateLastAssistantMessage(replyText, {
            model: typeof data?.model === "string" ? data.model : undefined,
            timestamp:
              typeof data?.timestamp === "string" ? data.timestamp : undefined,
          });
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error(t.ui.chatbot.errors.streamUnavailable);
        }

        const decoder = new TextDecoder();
        let assistantResponse = "";

        while (true) {
          if (isCancelledRef.current || controller.signal.aborted) {
            await reader.cancel().catch(() => {});
            finalizeCancelledResponse();
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;
          assistantResponse += decoder.decode(value, { stream: true });
          updateLastAssistantMessage(assistantResponse);
        }
      } catch (cloudError) {
        if (isCancelledRef.current || isAbortError(cloudError)) {
          finalizeCancelledResponse();
          return;
        }

        console.error(cloudError);

        // Jika model lokal sudah dimuat di memori, langsung fallback otomatis ke Local
        if (engine) {
          try {
            updateLastAssistantMessage("", {
              provider: "local",
              isFallback: true,
              isError: false,
            });
            const activeContext = cvContext || (await resolveCvContext());
            if (isCancelledRef.current || controller.signal.aborted) {
              finalizeCancelledResponse();
              return;
            }
            await streamLocalResponse(
              payloadMessages,
              engine,
              activeContext,
              controller.signal,
            );
            if (isCancelledRef.current || controller.signal.aborted) {
              finalizeCancelledResponse();
            }
          } catch (fallbackError) {
            if (isCancelledRef.current || isAbortError(fallbackError)) {
              finalizeCancelledResponse();
              return;
            }
            handleLocalError(fallbackError);
          }
          return;
        }

        const rawMessage =
          cloudError instanceof Error && cloudError.message
            ? cloudError.message
            : t.ui.chatbot.errors.cloudUnavailable;
        updateLastAssistantMessage(rawMessage, {
          isError: true,
          canFallbackToLocal: isWebGPUSupported,
        });
      }
    } finally {
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;
    if (mode === "local" && !engine) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    await executeChatRequest([...messages, userMessage]);
  };

  const retryLastMessage = async () => {
    if (isGenerating) return;
    if (mode === "local" && !engine) return;

    const lastUserIndex = messages.findLastIndex((msg) => msg.role === "user");
    if (lastUserIndex === -1) return;

    await executeChatRequest(messages.slice(0, lastUserIndex + 1));
  };

  const cancelGeneration = () => {
    if (!isGenerating) return;
    isCancelledRef.current = true;
    abortControllerRef.current?.abort();
    if (engine && typeof engine.interruptGenerate === "function") {
      engine.interruptGenerate();
    }
  };

  const activateLocalFallback = async () => {
    setError(null);
    setMode("local");
    await loadModel();
  };

  const clearChat = () => {
    cancelGeneration();
    setMessages([]);
  };

  return {
    mode,
    setMode,
    messages,
    isGenerating,
    isModelLoaded,
    loadingProgress,
    error,
    clearError: () => setError(null),
    isReady: mode === "cloud" || isModelLoaded,
    loadModel,
    activateLocalFallback,
    sendMessage,
    retryLastMessage,
    cancelGeneration,
    clearChat,
  };
}
