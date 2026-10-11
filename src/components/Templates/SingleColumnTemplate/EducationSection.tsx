/**
 * Single-column layout: education section.
 * Uses a two-column grid with a time column (left) + content (right).
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

/** Date column never narrower than the old fixed value. */
const MIN_DATE_COL = 170;
/** pr-4 (16px) + mr-4 (16px) consumed by the date cell itself. */
const DATE_CELL_PADDING = 32;

function dateText(edu: Education, present: string): string {
  return `${edu.startDate} – ${edu.current ? present : edu.endDate}`;
}

/**
 * Widest rendered date string, measured with the real font, so a long range
 * cannot overflow its cell and collide with the right-hand content.
 */
function measureDateColumn(education: Education[], present: string): number {
  if (typeof document === "undefined") return MIN_DATE_COL;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return MIN_DATE_COL;
  ctx.font = `${s.body.fontSize} ${getComputedStyle(document.body).fontFamily}`;
  const widest = education.reduce(
    (max, edu) => Math.max(max, ctx.measureText(dateText(edu, present)).width),
    0,
  );
  return Math.ceil(widest + DATE_CELL_PADDING);
}

export function EducationSection({
  education,
  t,
  tEditor,
  present,
}: EducationSectionProps) {
  if (education.length === 0) return null;

  const dateCol = Math.max(MIN_DATE_COL, measureDateColumn(education, present));

  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.education}
        sectionType="education"
        className={s.label}
        style={s.sectionTitle}
      />
      {education.map((edu) => (
        <div
          key={edu.id}
          className="grid mb-2"
          style={{
            gridTemplateColumns: `var(--exp-col, ${MIN_DATE_COL}px) 1fr`,
            alignItems: "stretch",
            "--exp-col": `${dateCol}px`,
          } as React.CSSProperties}
        >
          {/* Left: time */}
          <div
            className="text-slate-900 pr-4 mr-4 h-full flex flex-col"
            style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
          >
            <div className="whitespace-nowrap">{dateText(edu, present)}</div>
          </div>

          {/* Right: field + school */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-4">
              <span
                className="text-slate-900"
                style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
              >
                {edu.field || t.major || "Field of Study"}
              </span>
              <span className="text-slate-900 shrink-0">
                {edu.degree ? `, ${edu.degree}` : ""}
              </span>
            </div>
            <div
              className="text-slate-900 mt-0.5"
              style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
            >
              {edu.school || t.school || "School"}
            </div>
            {edu.address && (
              <div
                className="text-slate-900 mt-0.5"
                style={{ fontSize: s.body.fontSize }}
              >
                {edu.address}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
