/**
 * Single-column layout: personal info header.
 */
import { Fragment } from "react";
import { EditableText } from "../EditableComponents";
import { Photo } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { PersonalInfo } from "../../../types/resume";

interface PersonalSectionProps {
  personalInfo: PersonalInfo;
  contactFields: string[];
  fieldLabels: Record<string, string>;
  t: Record<string, string>;
  onUpdateField: (field: string, value: string) => void;
}

export function PersonalSection({
  personalInfo,
  contactFields,
  fieldLabels,
  t,
  onUpdateField,
}: PersonalSectionProps) {
  return (
    <header className="mb-5">
      <div>
        {personalInfo.fullName && (
          <h1 style={s.name} className="text-slate-900">
            <EditableText
              value={personalInfo.fullName}
              onChange={(v) => onUpdateField("fullName", v)}
              placeholder={t.name}
            />
          </h1>
        )}
        {personalInfo.title && (
          <p style={s.title} className="text-sky-700 wrap-break-word">
            <EditableText
              value={personalInfo.title}
              onChange={(v) => onUpdateField("title", v)}
              placeholder={t.title}
            />
          </p>
        )}
      </div>

      <div className="flex justify-between items-start gap-6 mt-3">
        {/* One grid for all contact rows so every label — and therefore every
            value — starts on the same vertical line. */}
        <div
          className="text-slate-900 min-w-0 flex-1 grid items-baseline gap-y-0.5"
          style={{
            gridTemplateColumns: s.labelColumns,
            columnGap: s.entryGap,
          }}
        >
          {contactFields.map((f) => (
            <Fragment key={f}>
              <span className="font-semibold text-slate-700">
                {fieldLabels[f]}:
              </span>
              <EditableText
                value={
                  (personalInfo[f as keyof typeof personalInfo] as string) || ""
                }
                onChange={(v) => onUpdateField(f, v)}
                placeholder={fieldLabels[f]}
                className="min-w-0 wrap-break-word"
              />
            </Fragment>
          ))}
        </div>

        {personalInfo.photo && (
          <div className="shrink-0">
            <Photo
              src={personalInfo.photo}
              size={200}
              className="rounded-full border-2 border-slate-200"
            />
          </div>
        )}
      </div>
    </header>
  );
}