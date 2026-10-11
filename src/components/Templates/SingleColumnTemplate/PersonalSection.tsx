/**
 * Single-column layout: personal info header.
 */
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
    <header className="mb-1">
      <div className="mb-1">
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
          <p style={s.title} className="text-sky-600 wrap-break-word">
            <EditableText
              value={personalInfo.title}
              onChange={(v) => onUpdateField("title", v)}
              placeholder={t.title}
            />
          </p>
        )}
      </div>

      <div className="flex justify-between items-center gap-6">
        <div className="text-slate-900 min-w-0 flex-1">
          {contactFields.map((f) => (
            <div key={f} className="flex items-baseline">
              <span className="font-bold shrink-0 whitespace-nowrap pr-1">
                {fieldLabels[f]}
                <span>:</span>
              </span>
              <EditableText
                value={
                  (personalInfo[f as keyof typeof personalInfo] as string) || ""
                }
                onChange={(v) => onUpdateField(f, v)}
                placeholder={fieldLabels[f]}
                className="min-w-0 wrap-break-word"
              />
            </div>
          ))}
        </div>

        {personalInfo.photo && (
          <div className="shrink-0">
            <Photo
              src={personalInfo.photo}
              size={220}
              className="rounded-full border-2 border-slate-200"
            />
          </div>
        )}
      </div>
    </header>
  );
}
