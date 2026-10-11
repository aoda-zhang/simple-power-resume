/**
 * Single-column layout: education section.
 *
 * Uses the same two-column grid as Experience so the dates line up across
 * both sections (and across the page break in print).
 */
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Education } from "../../../types/resume";

interface EducationSectionProps {
  education: Education[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<Education>) => void;
}

export function EducationSection({
  education,
  t,
  tEditor,
  present,
}: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionTitle
        label={tEditor.education}
        sectionType="education"
        className={s.label}
        style={s.sectionTitle}
      />
      <div className="flex flex-col gap-y-3">
        {education.map((edu) => {
          const date = [edu.startDate, edu.current ? present : edu.endDate]
            .filter(Boolean)
            .join(" – ");
          const field = edu.field || t.major || "Field of Study";
          return (
            <div
              key={edu.id}
              data-entry
              className="grid items-start"
              style={{
                gridTemplateColumns: s.entryColumns,
                columnGap: s.entryGap,
              }}
            >
              {/* Left: time (fixed width, aligns across all entries) */}
              <div
                data-entry-date
                className="text-slate-600"
                style={{ fontSize: s.body.fontSize }}
              >
                <div className="whitespace-nowrap">{date}</div>
              </div>

              {/* Right: field + degree, then school, then location */}
              <div className="min-w-0">
                <div className="text-slate-900">
                  {field}
                  {edu.degree && <span>, {edu.degree}</span>}
                </div>
                <div className="text-slate-900 font-semibold mt-0.5">
                  {edu.school || t.school || "School"}
                </div>
                {edu.address && (
                  <div className="text-slate-500 mt-0.5" style={s.meta}>
                    {edu.address}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}