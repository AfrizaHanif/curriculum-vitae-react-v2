"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Alert from "../bootstrap/alert";
import Button from "../bootstrap/button";
import Offcanvas from "../bootstrap/offcanvas";
import Spinner from "../bootstrap/spinner";
import { useChat } from "@/hooks/useChatbot";
import { useLanguage } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatMessageTime(timestamp: string, locale: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ChatbotUI() {
  const { t, lang } = useLanguage();
  const timeLocale = lang === "id" ? "id-ID" : "en-US";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    mode,
    setMode,
    messages,
    isGenerating,
    isModelLoaded,
    loadingProgress,
    error,
    clearError,
    isReady,
    loadModel,
    activateLocalFallback,
    sendMessage,
    retryLastMessage,
    cancelGeneration,
    clearChat,
  } = useChat();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && isReady && !isGenerating) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isReady, isGenerating]);

  const handleCopyMessage = async (content: string, idx: number) => {
    try {
      await navigator.clipboard?.writeText(content);
      setCopiedIndex(idx);
      setTimeout(() => {
        setCopiedIndex((prev) => (prev === idx ? null : prev));
      }, 1500);
    } catch {
      // Abaikan jika clipboard API tidak tersedia
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isReady || isGenerating) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div style={{ pointerEvents: "auto" }}>
        <Button
          color="primary"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0 border border-2 border-white"
          style={{
            width: "44px",
            height: "44px",
            backdropFilter: "blur(8px)",
          }}
          dataBsToggle="tooltip"
          dataBsPlacement="left"
          dataBsTitle={isOpen ? t.ui.chatbot.closeAria : t.ui.chatbot.openAria}
          dataBsCustomClass="d-none d-md-block"
          aria-label={isOpen ? t.ui.chatbot.closeAria : t.ui.chatbot.openAria}
          aria-expanded={isOpen}
        >
          <i
            className={`bi ${isOpen ? "bi-x-lg" : "bi-chat-dots-fill"} fs-5`}
          />
        </Button>
      </div>

      {/* Offcanvas Chat Drawer */}
      <Offcanvas
        id="ai-chatbot-offcanvas"
        show={isOpen}
        onClose={() => setIsOpen(false)}
        placement="end"
        style={{ width: "min(92vw, 420px)" }}
        headerClassName="border-bottom py-2 px-3"
        bodyClassName="p-0 d-flex flex-column overflow-hidden"
        resetScrollOnClose={false}
        title={
          <div className="d-flex align-items-center justify-content-between gap-2 w-100">
            <div className="d-flex align-items-center gap-2 min-w-0">
              <i className="bi bi-stars text-primary fs-5 flex-shrink-0" />
              <div className="min-w-0">
                <div className="fw-semibold fs-6 lh-sm text-truncate">
                  {t.ui.chatbot.title}
                </div>
                <div
                  className="text-body-secondary fw-normal"
                  style={{ fontSize: "0.7rem" }}
                >
                  {mode === "local"
                    ? t.ui.chatbot.modeLocalDesc
                    : t.ui.chatbot.modeCloudDesc}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1 flex-shrink-0">
              <div
                className="btn-group btn-group-sm"
                role="group"
                aria-label={t.ui.chatbot.chatModeAria}
              >
                <Button
                  type="button"
                  size="sm"
                  color={mode === "local" ? "primary" : "outline-secondary"}
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}
                  onClick={() => setMode("local")}
                >
                  {t.ui.chatbot.modeLocal}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  color={mode === "cloud" ? "primary" : "outline-secondary"}
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}
                  onClick={() => setMode("cloud")}
                >
                  {t.ui.chatbot.modeCloud}
                </Button>
              </div>

              {messages.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  color="link"
                  className="text-body-secondary p-1"
                  onClick={clearChat}
                  title={t.ui.chatbot.clearChat}
                  aria-label={t.ui.chatbot.clearChat}
                >
                  <i className="bi bi-trash" />
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Messages Body */}
        <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2 bg-body-tertiary">
          {error && (
            <Alert
              color="danger"
              dismissible
              className="py-2 px-3 small mb-1"
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          {mode === "local" && !isModelLoaded ? (
            <div className="my-auto text-center p-3">
              <i className="bi bi-cpu fs-1 text-primary d-block mb-2" />
              <p className="small text-body-secondary mb-3">
                {t.ui.chatbot.localDesc}
              </p>
              {loadingProgress ? (
                <div className="small text-primary">
                  <Spinner size="sm" color="primary" className="me-2" />
                  <span>{loadingProgress}</span>
                </div>
              ) : (
                <Button
                  color="primary"
                  size="sm"
                  rounded
                  onClick={loadModel}
                  className="px-3"
                >
                  {t.ui.chatbot.loadModel}
                </Button>
              )}
            </div>
          ) : messages.length === 0 ? (
            <div className="my-auto text-center text-body-secondary small p-3">
              <i className="bi bi-chat-square-text fs-2 d-block mb-2 opacity-50" />
              <p className="mb-3">{t.ui.chatbot.emptyGreeting}</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {t.ui.chatbot.suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    color="outline-secondary"
                    size="sm"
                    rounded
                    disabled={!isReady || isGenerating}
                    onClick={() => sendMessage(prompt)}
                    className="px-2 py-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex ${
                  msg.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`rounded-3 px-3 py-2 small ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : msg.isError
                        ? "bg-danger-subtle text-danger-emphasis border border-danger-subtle"
                        : "bg-body border"
                  }`}
                  style={{ maxWidth: "85%" }}
                >
                  {msg.content ? (
                    <>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-1">{children}</p>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {msg.role === "assistant" && msg.isFallback && (
                        <div
                          className="mt-1 pt-1 border-top text-body-secondary d-flex align-items-center gap-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          <i className="bi bi-cpu" />
                          <span>{t.ui.chatbot.fallbackBadge}</span>
                        </div>
                      )}
                      {msg.isError &&
                        (idx === messages.length - 1 ||
                          (msg.canFallbackToLocal && !isModelLoaded)) && (
                          <div className="mt-2 d-flex flex-wrap gap-2">
                            {idx === messages.length - 1 && (
                              <Button
                                color="outline-danger"
                                size="sm"
                                rounded
                                onClick={retryLastMessage}
                                disabled={
                                  isGenerating ||
                                  Boolean(loadingProgress) ||
                                  (mode === "local" && !isModelLoaded)
                                }
                                className="px-2 py-1"
                                style={{ fontSize: "0.75rem" }}
                              >
                                <i className="bi bi-arrow-clockwise me-1" />
                                {t.ui.chatbot.retry}
                              </Button>
                            )}
                            {msg.canFallbackToLocal && !isModelLoaded && (
                              <Button
                                color="primary"
                                size="sm"
                                rounded
                                onClick={activateLocalFallback}
                                disabled={
                                  isGenerating || Boolean(loadingProgress)
                                }
                                className="px-2 py-1"
                                style={{ fontSize: "0.75rem" }}
                              >
                                <i className="bi bi-cpu me-1" />
                                {t.ui.chatbot.useLocalFallback}
                              </Button>
                            )}
                          </div>
                        )}
                    </>
                  ) : isGenerating && idx === messages.length - 1 ? (
                    <div className="d-flex align-items-center gap-2 text-body-secondary">
                      <Spinner
                        size="sm"
                        className="text-body-secondary"
                        label={t.ui.chatbot.typing}
                      />
                      <span>{t.ui.chatbot.typing}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {msg.role === "user" && msg.content && msg.timestamp && (
                    <div
                      className="mt-1 text-end text-white-50"
                      style={{ fontSize: "0.68rem" }}
                      title={msg.timestamp}
                    >
                      {formatMessageTime(msg.timestamp, timeLocale)}
                    </div>
                  )}
                  {msg.role === "assistant" &&
                    msg.content &&
                    (!msg.isError || msg.model || msg.timestamp) && (
                      <div
                        className="mt-1 pt-1 border-top text-body-secondary d-flex justify-content-between align-items-center gap-2"
                        style={{ fontSize: "0.68rem" }}
                      >
                        <span className="text-truncate" title={msg.model}>
                          {msg.model}
                        </span>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          {msg.timestamp && (
                            <span title={msg.timestamp}>
                              {formatMessageTime(msg.timestamp, timeLocale)}
                            </span>
                          )}
                          {!msg.isError && (
                            <Button
                              type="button"
                              color="link"
                              size="sm"
                              className="p-0 text-body-secondary text-decoration-none"
                              style={{ fontSize: "0.75rem", lineHeight: 1 }}
                              onClick={() =>
                                handleCopyMessage(msg.content, idx)
                              }
                              title={
                                copiedIndex === idx
                                  ? t.ui.chatbot.copiedAnswer
                                  : t.ui.chatbot.copyAnswer
                              }
                              aria-label={
                                copiedIndex === idx
                                  ? t.ui.chatbot.copiedAnswer
                                  : t.ui.chatbot.copyAnswer
                              }
                            >
                              <i
                                className={`bi ${
                                  copiedIndex === idx
                                    ? "bi-check2 text-success"
                                    : "bi-clipboard"
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="border-top bg-body p-3">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder={
                isReady
                  ? t.ui.chatbot.inputPlaceholderReady
                  : t.ui.chatbot.inputPlaceholderNotReady
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isReady || isGenerating}
            />
            {input.length > 0 && isReady && !isGenerating && (
              <Button
                type="button"
                color="outline-secondary"
                onClick={() => {
                  setInput("");
                  inputRef.current?.focus();
                }}
                title={t.ui.chatbot.clearInput}
                aria-label={t.ui.chatbot.clearInput}
              >
                <i className="bi bi-x-lg" />
              </Button>
            )}
            {isGenerating ? (
              <Button
                type="button"
                color="danger"
                onClick={cancelGeneration}
                title={t.ui.chatbot.stopResponse}
                aria-label={t.ui.chatbot.stopResponse}
              >
                <i className="bi bi-stop-fill" />
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                disabled={!isReady || !input.trim()}
                aria-label={t.ui.chatbot.sendMessage}
              >
                <i className="bi bi-send-fill" />
              </Button>
            )}
          </div>
        </form>
      </Offcanvas>
    </>
  );
}
