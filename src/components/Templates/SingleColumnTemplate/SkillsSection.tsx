/**
 * Single-column layout: skills section with optional category grouping.
 * All category labels share one grid column sized to the widest label.
 */
import { Fragment } from "react";
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Skill } from "../../../types/resume";

interface SkillsSectionProps {
  skills: Skill[];
  tEditor: Record<string, string>;
}

export function SkillsSection({ skills, tEditor }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  const ungrouped = skills.filter((sk) => !sk.category?.trim());
  const groupedEntries: Array<{ cat: string; skills: Skill[] }> = [];
  const seen = new Set<string>();

  skills.forEach((sk) => {
    const cat = sk.category?.trim();
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      groupedEntries.push({
        cat,
        skills: skills.filter((item) => item.category?.trim() === cat),
      });
    }
  });

  groupedEntries.sort((a, b) => {
    const aOrder = a.skills[0]?.order ?? 999;
    const bOrder = b.skills[0]?.order ?? 999;
    return aOrder - bOrder;
  });

  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.skills}
        sectionType="skills"
        className={`${s.label} !mb-2`}
        style={s.sectionTitle}
      />

      {/*
        One grid for every row, so all categories share a single label track.
        Previously each row had its own grid with a hard-coded 6.5rem column:
        a longer category ("DevOps & Infrastructure:") wrapped to two lines and
        pushed its values out of line with the rows above it.
      */}
      <div
        className="grid items-start gap-y-1.5"
        style={{
          gridTemplateColumns: "max-content minmax(0, 1fr)",
          columnGap: "0.5rem",
          alignItems: "start",
        }}
      >
        {groupedEntries.map(({ cat, skills: categorySkills }) => {
          const names = categorySkills.map((sk) => sk.name).filter(Boolean).join(", ");
          return (
            <Fragment key={cat}>
              <span className="font-bold text-slate-900">{cat}:</span>
              <span className="min-w-0 text-slate-900 mt-0.5" style={s.body}>
                {names}
              </span>
            </Fragment>
          );
        })}

        {ungrouped.length > 0 && (
          <>
            <span />
            <span className="min-w-0 text-slate-900" style={s.body}>
              {ungrouped.map((sk) => sk.name).filter(Boolean).join(", ")}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
