"use client";

import { useActionState, useEffect, useState } from "react";
import { submitConsult, type ConsultFormState } from "@/app/actions/submitConsult";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";

interface FormField {
  name: string;
  type: "text" | "email" | "phone" | "textarea" | "file";
  label?: LocalizedStr;
  placeholder?: LocalizedStr;
  required?: boolean;
}

interface ContactFormBlockProps {
  data: Record<string, unknown>;
  locale: string;
  /** 服务端注入，防直接 POST 的批量提交 */
  formToken?: string;
}

const initialState: ConsultFormState = { success: false };

export default function ContactFormBlock({ data, locale, formToken }: ContactFormBlockProps) {
  const [state, formAction, isPending] = useActionState(submitConsult, initialState);
  // SSR 初始为 0 保证 hydration 一致；挂载后记录客户端时间戳用于反 spam
  const [renderedAt, setRenderedAt] = useState(0);
  useEffect(() => {
    queueMicrotask(() => setRenderedAt(Date.now()));
  }, []);

  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const description = localizedValue(data.description as LocalizedStr, locale);
  const submitLabel = localizedValue(data.submitLabel as LocalizedStr, locale);
  const successMessage = localizedValue(data.successMessage as LocalizedStr, locale);
  const fields = (data.fields as FormField[]) ?? [];

  // 提交成功或正在提交时锁定表单
  const locked = state.success || isPending;

  return (
    <section id={anchorId} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="opacity-90 mb-10 leading-relaxed">{description}</p>
          )}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="_locale" value={locale} />
            {formToken && <input type="hidden" name="_ft" value={formToken} />}
            {/* 反 spam：渲染时间戳（挂载时固定） */}
            <input type="hidden" name="_t" value={renderedAt} />
            {/* 反 spam：honeypot，人类不可见 */}
            <div aria-hidden="true" className="absolute opacity-0 h-0 overflow-hidden pointer-events-none" tabIndex={-1}>
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" autoComplete="off" tabIndex={-1} />
            </div>

            {/* 成功反馈：内联显示在表单顶部 */}
            {state.success && (
              <div className="alert alert-success shadow-md">
                <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage ?? "Thank you. Your message has been sent."}</span>
              </div>
            )}

            {/* 错误反馈 */}
            {state.error && (
              <div className="alert alert-error shadow-md">
                <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{state.error}</span>
              </div>
            )}

            {/* 表单字段：成功后保留可见但锁定 */}
            <fieldset disabled={locked} className={state.success ? "opacity-50" : ""}>
              <div className="space-y-4">
                {fields.map((field) => {
                  const label = localizedValue(field.label, locale);
                  const placeholder = localizedValue(field.placeholder, locale);
                  const isTextarea = field.type === "textarea";

                  return (
                    <div key={field.name} className="form-control">
                      <label htmlFor={field.name} className="label">
                        <span className="label-text font-medium">
                          {label ?? field.name}
                          {field.required && <span className="text-error ml-1">*</span>}
                        </span>
                      </label>
                      {isTextarea ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          rows={4}
                          placeholder={placeholder}
                          required={field.required}
                          className="textarea textarea-bordered textarea-sm min-h-[100px] w-full transition-shadow focus:shadow-md"
                        />
                      ) : (
                        <input
                          type={field.type === "phone" ? "tel" : field.type}
                          id={field.name}
                          name={field.name}
                          placeholder={placeholder}
                          required={field.required}
                          className="input input-bordered input-sm h-11 w-full transition-shadow focus:shadow-md"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* 提交按钮：三态 */}
            <button
              type="submit"
              disabled={locked}
              className={`btn w-full mt-6 ${state.success ? "btn-success" : "btn-primary"}`}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : state.success ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                submitLabel ?? "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
