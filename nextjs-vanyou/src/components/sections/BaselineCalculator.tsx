"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { localizedValue, type LocalizedStr } from "@/lib/sanity/localizedValue";
import Select from "@/components/Select";

interface BaselineCalculatorProps {
  data: Record<string, unknown>;
  locale: string;
}

interface ActivityOption {
  _key: string;
  value: string;
  label: LocalizedStr;
  description?: LocalizedStr;
  multiplier: number;
}

// 与 ContactBooking 表单格式统一
const LABEL_CLASS = "label-text font-semibold text-base-content";
const INPUT_PLACEHOLDER_CLASS = "placeholder:text-base-content/40";
const FIELD_GROUP_SPACING = "space-y-5";
const LABEL_GAP = "pb-1.5";

export default function BaselineCalculator({ data, locale }: BaselineCalculatorProps) {
  const t = useTranslations("Calculator");
  const anchorId = data.anchorId as string | undefined;
  const title = localizedValue(data.title as LocalizedStr, locale);
  const subtitle = localizedValue(data.subtitle as LocalizedStr, locale);
  const disclaimerText = localizedValue(data.disclaimerText as LocalizedStr, locale);
  const activityOptions = data.activityLevelOptions as ActivityOption[] | undefined;

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityIdx, setActivityIdx] = useState(0);
  const [result, setResult] = useState<{ bmi: number; tdee: number } | null>(null);

  const multiplier = activityOptions?.[activityIdx]?.multiplier ?? 1.2;

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) return;

    const bmi = w / ((h / 100) ** 2);
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * multiplier;

    setResult({ bmi, tdee });
  };

  return (
    <section id={anchorId} className="py-20 px-4 bg-base-200">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          {title && (
            <h2 className="rv rv-1 text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          <div className="rv rv-2 accent-divider" />
          {subtitle && (
            <p className="rv rv-2 text-base-content/90 max-w-xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className="rv rv-3 card contact-form-card">
          <div className="card-body p-6 md:p-8">
            <div className={FIELD_GROUP_SPACING}>
              <div className="grid grid-cols-2 gap-5">
                <div className="form-control w-full">
                  <label className={`label ${LABEL_GAP}`}>
                    <span className={LABEL_CLASS}>{t("weight")} ({t("kg")})</span>
                  </label>
                  <input
                    type="number"
                    placeholder="70"
                    className={`input input-bordered w-full ${INPUT_PLACEHOLDER_CLASS}`}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className={`label ${LABEL_GAP}`}>
                    <span className={LABEL_CLASS}>{t("height")} ({t("cm")})</span>
                  </label>
                  <input
                    type="number"
                    placeholder="175"
                    className={`input input-bordered w-full ${INPUT_PLACEHOLDER_CLASS}`}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className={`label ${LABEL_GAP}`}>
                    <span className={LABEL_CLASS}>{t("age")}</span>
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className={`input input-bordered w-full ${INPUT_PLACEHOLDER_CLASS}`}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className={`label ${LABEL_GAP}`}>
                    <span className={LABEL_CLASS}>{t("sex")}</span>
                  </label>
                  <Select
                    name="gender"
                    value={gender}
                    onChange={(v) => setGender(v as "male" | "female")}
                    options={[
                      { value: "male", label: t("male") },
                      { value: "female", label: t("female") },
                    ]}
                  />
                </div>
              </div>
              <div className="form-control w-full">
                <label className={`label ${LABEL_GAP}`}>
                  <span className={LABEL_CLASS}>{t("activity")}</span>
                </label>
                <Select
                  name="activity"
                  value={String(activityIdx)}
                  onChange={(v) => setActivityIdx(parseInt(v, 10))}
                  options={
                    activityOptions?.length
                      ? activityOptions.map((opt, idx) => ({
                          value: String(idx),
                          label: localizedValue(opt.label, locale) ?? "",
                          description: localizedValue(opt.description, locale) ?? undefined,
                        }))
                      : [
                          { value: "0", label: "Sedentary" },
                          { value: "1", label: "Light" },
                          { value: "2", label: "Moderate" },
                          { value: "3", label: "Active" },
                          { value: "4", label: "Very Active" },
                        ]
                  }
                />
              </div>
              <div className="pt-1">
                <button type="button" className="btn btn-primary btn-block" onClick={calculate}>
                  {t("calculate")}
                </button>
              </div>
            </div>
            {result && (
              <div className="mt-5 p-5 rounded-lg border border-primary/30 bg-primary/5">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-xs text-base-content/70 mb-1">{t("bmi")}</p>
                    <p className="text-3xl font-bold text-primary">{result.bmi.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/70 mb-1">{t("tdee")}</p>
                    <p className="text-3xl font-bold text-primary">{Math.round(result.tdee)} {t("kcal")}</p>
                  </div>
                </div>
              </div>
            )}
            {disclaimerText && (
              <p className="text-xs text-base-content/55 mt-5 text-center leading-relaxed">
                {disclaimerText}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
