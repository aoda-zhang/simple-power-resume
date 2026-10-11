/**
 * Single-column layout: experience section.
 *
 * Layout is a fixed-width date column + content column. The column width and
 * gap live in templateStyles / index.css so the @media print rules can rebuild
 * the exact same geometry (a mismatch shifts the exported PDF).
 */
import { ExperienceEntry } from "../shared/SectionRenderers";
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Experience } from "../../../types/resume";

interface ExperienceSectionProps {
  experience: Experience[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<Experience>) => void;
}

export function ExperienceSection({
  experience,
  t,
  tEditor,
  present,
  onUpdate,
}: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionTitle
        label={tEditor.experience}
        sectionType="experience"
        className={s.label}
        style={s.sectionTitle}
      />
      <div className="flex flex-col gap-y-3.5">
        {experience.map((exp) => {
          const date = [exp.startDate, exp.endDate || present]
            .filter(Boolean)
            .join(" – ");
          return (
            <div
              key={exp.id}
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

              {/* Right: content */}
              <div className="min-w-0">
                <ExperienceEntry
                  exp={exp}
                  t={t}
                  present={present}
                  onUpdate={onUpdate}
                  styles={{
                    position: s.body,
                    company: s.body,
                    companyDescription: s.body,
                    techStack: s.body,
                    description: s.body,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}