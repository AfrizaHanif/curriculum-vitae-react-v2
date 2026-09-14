"use client";

import { useState, useRef } from "react";
import Form from "@/components/forms/form";
import Input from "@/components/forms/input";
import InputText from "@/components/forms/input-textarea";
import InputSelect from "@/components/forms/input-select";
import InputCheck from "@/components/forms/input-check";
import Recaptcha, { RecaptchaRef } from "@/components/forms/recaptcha";
import Button from "@/components/ui/bootstrap/button";
import Card from "@/components/ui/bootstrap/card";
import Alert from "@/components/ui/bootstrap/alert";
import Badge from "@/components/ui/bootstrap/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactForm() {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const recaptchaRef = useRef<RecaptchaRef>(null);

  const trimmedMessage = message.trim();
  const charCount = trimmedMessage.length;
  const wordCount = trimmedMessage ? trimmedMessage.split(/\s+/).length : 0;

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isRecaptchaConfigured =
    Boolean(recaptchaSiteKey) &&
    recaptchaSiteKey !== "your_recaptcha_site_key_here";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setIsSubmitted(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const isMock = process.env.NEXT_PUBLIC_MOCK_SUBMISSION === "true";
    const isPlaceholder =
      !formId || formId === "your_form_id_here" || formId.trim() === "";

    const name = ((formData.get("name") as string) || "").trim();
    const message = ((formData.get("message") as string) || "").trim();

    // Prevent very short or empty submissions that trigger Formspree spam filters
    if (name.length < 2) {
      setErrorMessage(t.sections.contact.form.nameMinError);
      setIsLoading(false);
      return;
    }

    if (message.length < 15) {
      setErrorMessage(t.sections.contact.form.messageMinError);
      setIsLoading(false);
      return;
    }

    // 1. Dev Mock Mode (preserves quota when testing UI locally without active form ID)
    if (isMock || (isPlaceholder && process.env.NODE_ENV === "development")) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      setIsLoading(false);
      form.reset();
      setMessage("");
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      return;
    }

    if (isPlaceholder) {
      setErrorMessage(t.sections.contact.form.errorAlert);
      setIsLoading(false);
      return;
    }

    // 2. reCAPTCHA verification if configured
    if (isRecaptchaConfigured && !captchaToken) {
      setErrorMessage(t.sections.contact.form.recaptchaError);
      setIsLoading(false);
      return;
    }

    if (captchaToken) {
      formData.set("g-recaptcha-response", captchaToken);
    }

    // 3. Real Submission to Formspree
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setMessage("");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        const data = await response.json().catch(() => null);
        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
          setErrorMessage(
            data.errors
              .map((err: { message: string }) => err.message)
              .join(", "),
          );
        } else {
          setErrorMessage(t.sections.contact.form.errorAlert);
        }
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch {
      setErrorMessage(t.sections.contact.form.errorAlert);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-100 shadow-lg p-4 border-0">
      {/* Header Section */}
      <div className="mb-3">
        <h4 className="fw-bold mb-1">{t.sections.contact.form.title}</h4>
        <p className="text-body-secondary small mb-0">
          {t.sections.contact.form.subtitle}
        </p>
      </div>

      {/* Success Alert Message */}
      {isSubmitted && (
        <Alert
          color="success"
          dismissable
          onClose={() => setIsSubmitted(false)}
          className="mb-3"
        >
          <i className="bi bi-check-circle-fill me-2" />
          {t.sections.contact.form.successAlert}
        </Alert>
      )}

      {/* Error Alert Message */}
      {errorMessage && (
        <Alert
          color="danger"
          dismissable
          onClose={() => setErrorMessage(null)}
          className="mb-3"
        >
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {errorMessage}
        </Alert>
      )}

      {/* Contact Form */}
      <Form onSubmit={handleSubmit}>
        {/* Anti-spam Honeypot Field (hidden from humans, off-screen, protected from password autofill) */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <div className="row g-3">
          {/* Name Field */}
          <div className="col-12 col-md-6">
            <Input
              name="name"
              id="name"
              label={t.sections.contact.form.nameLabel}
              type="text"
              placeholder={t.sections.contact.form.namePlaceholder}
              required
            />
          </div>

          {/* Email Field */}
          <div className="col-12 col-md-6">
            <Input
              name="email"
              id="email"
              label={t.sections.contact.form.emailLabel}
              type="email"
              placeholder={t.sections.contact.form.emailPlaceholder}
              required
            />
          </div>

          {/* Subject Field */}
          <div className="col-12">
            <InputSelect
              name="subject"
              id="subject"
              label={t.sections.contact.form.subjectLabel}
              required
              options={[
                {
                  value: "",
                  label: t.sections.contact.form.subjectSelectPlaceholder,
                  disabled: true,
                },
                {
                  value: "work",
                  label: t.sections.contact.form.subjectOptions.work,
                },
                {
                  value: "personal",
                  label: t.sections.contact.form.subjectOptions.personal,
                },
              ]}
            />
          </div>

          {/* Related Link Field */}
          <div className="col-12">
            <Input
              name="url"
              id="url"
              label={t.sections.contact.form.urlLabel}
              type="url"
              placeholder={t.sections.contact.form.urlPlaceholder}
            />
          </div>

          {/* Message Field */}
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="message" className="form-label mb-0">
                {t.sections.contact.form.messageLabel}
              </label>
              <Badge
                color={
                  charCount >= 15
                    ? "success"
                    : charCount > 0
                      ? "warning"
                      : "secondary"
                }
                pill
                className="fw-normal"
              >
                <i className="bi bi-fonts me-1" />
                {wordCount} {t.sections.contact.form.wordsUnit} ({charCount}/15)
              </Badge>
            </div>
            <InputText
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.sections.contact.form.messagePlaceholder}
              helpText={t.sections.contact.form.messageHelpText}
              helpTextId="message-help"
              required
            />
          </div>

          {/* Checkbox Field */}
          <div className="col-12">
            <InputCheck
              name="check"
              id="check"
              label={t.sections.contact.form.checkLabel}
              type="checkbox"
              required
            />
          </div>

          {/* Google reCAPTCHA v2 Checkbox */}
          {isRecaptchaConfigured && (
            <div className="col-12">
              <Recaptcha
                ref={recaptchaRef}
                siteKey={recaptchaSiteKey}
                onChange={setCaptchaToken}
              />
            </div>
          )}
        </div>
        <Button
          className="mt-4 px-4 d-inline-flex align-items-center gap-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
              <span>{t.sections.contact.form.submittingButton}</span>
            </>
          ) : (
            <>
              <i className="bi bi-send-fill" />
              <span>{t.sections.contact.form.submitButton}</span>
            </>
          )}
        </Button>
      </Form>
    </Card>
  );
}
