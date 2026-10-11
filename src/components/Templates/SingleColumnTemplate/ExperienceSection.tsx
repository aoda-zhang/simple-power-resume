/**
 * Single-column layout: experience section.
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
    <section className="mb-4">
      <SectionTitle
        label={tEditor.experience}
        sectionType="experience"
        className={s.label}
        style={s.sectionTitle}
      />
      {experience.map((exp) => (
        <div
          key={exp.id}
          data-exp-entry
          className="grid mb-4"
          style={{ gridTemplateColumns: "170px 1fr", alignItems: "stretch" }}
        >
          {/* Left: time (fixed width) */}
          <div
            data-exp-date
            className="text-slate-900 pr-4 mr-4 h-full flex flex-col"
            style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
          >
            <div className="whitespace-nowrap">
              {exp.startDate} – {exp.endDate || present}
            </div>
          </div>

          {/* Right: content */}
          <div className="min-w-0">
            <ExperienceEntry
              exp={exp}
              t={t}
              present={present}
              onUpdate={onUpdate}
              styles={{
                company: s.body,
                companyDescription: s.body,
                techStack: s.body,
                description: s.body,
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
