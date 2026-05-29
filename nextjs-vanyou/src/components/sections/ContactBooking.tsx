"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import { submitConsult, type ConsultFormState } from "@/app/actions/submitConsult";
import { useContactInView } from "@/context/ContactInViewContext";
import Select from "@/components/Select";
import BusinessCard from "./BusinessCard";

interface ContactBookingProps {
  data: Record<string, unknown>;
  locale: string;
  /** 服务端注入，防直接 POST 的批量提交 */
  formToken?: string;
}

interface FieldOption {
  _key: string;
  label: LocalizedStr;
  value: string;
}

interface FormField {
  _key: string;
  name: string;
  type: string;
  label: LocalizedStr;
  placeholder?: LocalizedStr;
  required?: boolean;
  options?: FieldOption[];
}

const initialState: ConsultFormState = { success: false };

const LABEL_CLASS = "label-text font-semibold text-base-content";
const INPUT_PLACEHOLDER_CLASS = "placeholder:text-base-content/40";
const FIELD_GROUP_SPACING = "space-y-5"; // 20px 组间距统一
const LABEL_GAP = "pb-1.5"; // label 与 input 固定 6px

export default function ContactBooking({ data, locale, formToken }: ContactBookingProps) {
  const t = useTranslations("ContactForm");
  const { setContactInView } = useContactInView();
  const sectionRef = useRef<HTMLElement>(null);
  const [showPhone, setShowPhone] = useState(false);

  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const description = localizedValue(data.description as LocalizedStr, locale);
  const fields = data.fields as FormField[] | undefined;
  const successMessage = localizedValue(data.successMessage as LocalizedStr, locale);
  const privacyNote = localizedValue(data.privacyNote as LocalizedStr, locale);

  const contactInfo = data.contactInfo as
    | {
        email?: string;
        phones?: string[];
        areaLabel?: LocalizedStr;
        areaText?: LocalizedStr;
        mapEmbedUrl?: string;
        card?: {
          name?: string;
          title?: LocalizedStr;
          company?: string;
          website?: string;
          seal?: Record<string, unknown>;
        };
      }
    | undefined;
  const areaLabel = localizedValue(contactInfo?.areaLabel, locale);
  const areaText = localizedValue(contactInfo?.areaText, locale);

  const [state, formAction, isPending] = useActionState(submitConsult, initialState);
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});

  // 仅当联系区块进入视口「上半部分」时视为“已滚到”，再隐藏浮动按钮；在 Q&A 等上方区块时按钮保持显示
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setContactInView(entry.isIntersecting));
      },
      { rootMargin: "-10% 0px -55% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setContactInView]);

  return (
    <section ref={sectionRef} id={anchorId} data-theme="vanyou-light" className="py-20 px-4 bg-[#f4f7fb] text-base-content">
      <div className={`container mx-auto ${contactInfo ? "max-w-6xl" : "max-w-2xl"}`}>
        <div className="text-center mb-12">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          <div className="rv rv-2 accent-divider" />
          {description && (
            <p className="rv rv-2 text-base-content/90 max-w-xl mx-auto">{description}</p>
          )}
        </div>
        <div className={contactInfo ? "grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch text-left" : ""}>
        {/* 左列：服务区域（位于表单上方）+ 询价表单 */}
        <div className={contactInfo ? "flex flex-col gap-6" : ""}>
        {contactInfo && areaText && (
          <div className="bg-base-100 border border-base-content/10 p-6">
            <h3 className="text-primary text-xs font-bold tracking-[0.14em] uppercase mb-2">
              {areaLabel ?? "Operating Area"}
            </h3>
            <p className="text-base-content/90 leading-relaxed">{areaText}</p>
          </div>
        )}
        <div className="rv rv-3 card contact-form-card">
          <div className="card-body p-6 md:p-8">
            <form action={formAction} className={FIELD_GROUP_SPACING}>
              <input type="hidden" name="_locale" value={locale} />
              {formToken && <input type="hidden" name="_ft" value={formToken} />}
              {fields?.map((field, index) => {
                const label = localizedValue(field.label, locale);
                const placeholder = localizedValue(field.placeholder, locale) ?? "";
                const nextField = fields?.[index + 1];
                const nextIsPhone = nextField?.type === "phone";

                if (field.type === "phone") {
                  if (!showPhone) return null;
                  return (
                    <div key={field._key} className="form-control w-full">
                      <label className={`label ${LABEL_GAP} label-row-with-action`}>
                        <span className={LABEL_CLASS}>{label}</span>
                        <button
                          type="button"
                          className="contact-form-add-phone"
                          onClick={() => setShowPhone(false)}
                        >
                          {t("removePhone")}
                        </button>
                      </label>
                      <input
                        type="tel"
                        name={field.name}
                        placeholder={placeholder}
                        className={`input input-bordered w-full ${INPUT_PLACEHOLDER_CLASS}`}
                      />
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field._key} className="form-control w-full">
                      <label className={`label ${LABEL_GAP}`}>
                        <span className={`${LABEL_CLASS} text-sm text-base-content/90`}>{label}</span>
                      </label>
                      <textarea
                        name={field.name}
                        placeholder={placeholder}
                        className={`textarea textarea-bordered w-full contact-form-textarea text-sm leading-relaxed ${INPUT_PLACEHOLDER_CLASS}`}
                        required={field.required}
                      />
                    </div>
                  );
                }

                if (field.type === "select" && field.options) {
                  const goalPlaceholder = field.name === "goal" ? t("selectGoal") : placeholder || "—";
                  const options = [
                    { value: "", label: goalPlaceholder },
                    ...field.options.map((opt) => ({
                      value: opt.value,
                      label: localizedValue(opt.label, locale) ?? "",
                    })),
                  ];
                  return (
                    <div key={field._key} className="form-control w-full">
                      <label className={`label ${LABEL_GAP}`}>
                        <span className={LABEL_CLASS}>{label}</span>
                      </label>
                      <Select
                        name={field.name}
                        value={selectValues[field.name] ?? ""}
                        onChange={(v) => setSelectValues((prev) => ({ ...prev, [field.name]: v }))}
                        options={options}
                        placeholder={goalPlaceholder}
                        required={field.required}
                      />
                    </div>
                  );
                }

                const inputType = field.type === "email" ? "email" : "text";
                const isEmailWithPhone = field.type === "email" && nextIsPhone;
                return (
                  <div key={field._key} className="form-control w-full">
                    <label className={`label ${LABEL_GAP} ${isEmailWithPhone ? "label-row-with-action" : ""}`}>
                      <span className={LABEL_CLASS}>{label}</span>
                      {isEmailWithPhone && !showPhone && (
                        <button
                          type="button"
                          className="contact-form-add-phone"
                          onClick={() => setShowPhone(true)}
                        >
                          + {t("addPhone")}
                        </button>
                      )}
                    </label>
                    <input
                      type={inputType}
                      name={field.name}
                      placeholder={placeholder}
                      className={`input input-bordered w-full ${INPUT_PLACEHOLDER_CLASS}`}
                      required={field.required}
                    />
                  </div>
                );
              })}
              <div className="pt-1">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isPending || state.success}
                >
                  {isPending ? "..." : state.success ? "✓" : t("sendMessage")}
                </button>
              </div>
              {state.success && successMessage && (
                <div className="alert alert-success text-sm">
                  <span>{successMessage}</span>
                </div>
              )}
              {state.error && (
                <div className="alert alert-error text-sm">
                  <span>{state.error}</span>
                </div>
              )}
              {privacyNote && (
                <p className="text-xs text-base-content/55 text-center mt-4">{privacyNote}</p>
              )}
            </form>
          </div>
        </div>
        </div>
        {contactInfo && (
          <aside className="rv rv-3 flex flex-col gap-6 text-left">
            {contactInfo.card && (
              <BusinessCard
                card={contactInfo.card}
                phones={contactInfo.phones}
                email={contactInfo.email}
                locale={locale}
                kaiClass="font-kai"
              />
            )}
            {contactInfo.mapEmbedUrl && (
              <div className="border border-base-content/10 flex-1 min-h-[260px]">
                <iframe
                  title="VANYOU operating area map"
                  src={contactInfo.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[260px] border-0"
                />
              </div>
            )}
          </aside>
        )}
        </div>
      </div>
    </section>
  );
}
