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

/** Date column never narrower than the old fixed value. */
const MIN_DATE_COL = 170;
/** pr-4 (16px) + mr-4 (16px) consumed by the date cell itself. */
const DATE_CELL_PADDING = 32;

function dateText(exp: Experience, present: string): string {
  return `${exp.startDate} – ${exp.endDate || present}`;
}

/**
 * Widest rendered date string, measured with the real font.
 * The date column used to be a hard-coded 170px, so a longer range
 * ("September 2016 – December 2016") overflowed its cell and visually
 * collided with the right-hand content.
 */
function measureDateColumn(experience: Experience[], present: string): number {
  if (typeof document === "undefined") return MIN_DATE_COL;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return MIN_DATE_COL;
  ctx.font = `${s.body.fontSize} ${getComputedStyle(document.body).fontFamily}`;
  const widest = experience.reduce(
    (max, exp) => Math.max(max, ctx.measureText(dateText(exp, present)).width),
    0,
  );
  return Math.ceil(widest + DATE_CELL_PADDING);
}

export function ExperienceSection({
  experience,
  t,
  tEditor,
  present,
  onUpdate,
}: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  const dateCol = Math.max(MIN_DATE_COL, measureDateColumn(experience, present));

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
          style={{
            // --exp-col is reused by the @media print rules in App.css so the
            // exported PDF keeps the same column width as the preview.
            gridTemplateColumns: `var(--exp-col, ${MIN_DATE_COL}px) 1fr`,
            alignItems: "stretch",
            "--exp-col": `${dateCol}px`,
          } as React.CSSProperties}
        >
          {/* Left: time */}
          <div
            data-exp-date
            className="text-slate-900 pr-4 mr-4 h-full flex flex-col"
            style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
          >
            <div className="whitespace-nowrap">{dateText(exp, present)}</div>
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