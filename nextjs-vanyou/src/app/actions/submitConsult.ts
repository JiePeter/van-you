"use server";

import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SPAM_TIMING_THRESHOLD_MS = 3_000;
const SPAM_MAX_URLS = 3;
const FORM_TOKEN_COOKIE = "vy_ft";

/** 直接 POST 的脚本不会带页面下发的 token/cookie，此处校验后拒掉 */
async function validateFormToken(formData: FormData): Promise<string | null> {
  const token = formData.get("_ft") as string | null;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(FORM_TOKEN_COOKIE)?.value;
  if (!token || !cookieToken || token !== cookieToken) {
    return "Invalid request. Please reload the page and try again.";
  }
  return null;
}

export interface ConsultFormState {
  success: boolean;
  error?: string;
}

interface ConsultPayload {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  message?: string;
  locale: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(payload: ConsultPayload): string | null {
  if (!payload.fullName?.trim()) return "Full name is required";
  if (!payload.email?.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
    return "Invalid email format";
  return null;
}

function detectSpam(formData: FormData, payload: ConsultPayload): boolean {
  const honeypot = formData.get("website") as string;
  if (honeypot) return true;

  const renderedAt = Number(formData.get("_t"));
  if (renderedAt && Date.now() - renderedAt < SPAM_TIMING_THRESHOLD_MS) return true;

  const msg = payload.message ?? "";
  const urlCount = (msg.match(/https?:\/\//gi) ?? []).length;
  if (urlCount > SPAM_MAX_URLS) return true;

  return false;
}

async function sendEmailNotification(payload: ConsultPayload): Promise<void> {
  const contactTo = process.env.CONTACT_TO_EMAIL;
  if (!contactTo) {
    console.warn("CONTACT_TO_EMAIL not configured, skipping email notification");
    return;
  }

  const safeName = escapeHtml(payload.fullName);
  const safeCompany = payload.company ? escapeHtml(payload.company) : "";
  const safeEmail = escapeHtml(payload.email);
  const safeMessage = payload.message ? escapeHtml(payload.message) : "";
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "";

  // 邮件：纯文字+清晰结构，无过度样式
  const html = `
<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 1em 0;"><strong>New Inquiry</strong></p>

<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Name: ${safeName}</p>
${safeCompany ? `<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Company: ${safeCompany}</p>` : ""}
<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Email: ${safeEmail}</p>
${payload.phone ? `<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Phone: ${safePhone}</p>` : ""}
${safeMessage ? `<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Message:</p><p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 1em 0;">${safeMessage}</p>` : ""}
<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0 0 0.25em 0;">Locale: ${escapeHtml(payload.locale)}</p>
`;

  await resend.emails.send({
    // 发件人：优先 RESEND_FROM（须为已验证域，如 vanyoucargo.com）；未设则回退 Resend 测试域
    from:
      process.env.RESEND_FROM ??
      `${process.env.NEXT_PUBLIC_PROJECT_NAME ?? "VANYOU Cargo Solutions Inc."} <onboarding@resend.dev>`,
    to: contactTo,
    subject: `New Consult Request (${payload.locale})`,
    replyTo: payload.email,
    html,
  });
}

export async function submitConsult(
  _prev: ConsultFormState,
  formData: FormData
): Promise<ConsultFormState> {
  const payload: ConsultPayload = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    message: (formData.get("message") as string) || undefined,
    company: (formData.get("company") as string) || undefined,
    locale: (formData.get("_locale") as string) || "en",
  };

  const error = validate(payload);
  if (error) return { success: false, error };

  const tokenError = await validateFormToken(formData);
  if (tokenError) return { success: false, error: tokenError };

  const isSpam = detectSpam(formData, payload);

  if (!isSpam) {
    try {
      await sendEmailNotification({
        ...payload,
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || undefined,
        message: payload.message?.trim() || undefined,
      });
    } catch (emailErr) {
      console.error("Failed to send email notification via Resend", { emailErr });
    }
  }

  return { success: true };
}
