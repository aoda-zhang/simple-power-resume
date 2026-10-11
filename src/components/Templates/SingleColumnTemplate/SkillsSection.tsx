/**
 * Single-column layout: skills section with optional category grouping.
 *
 * Every category row lives in ONE grid so they share a single label track.
 * A per-row grid (or a hard-coded `6.5rem`) breaks as soon as a category name
 * is longer than the fixed width: the label wraps to two lines and the values
 * stop lining up. `fit-content()` sizes the track to the widest label instead.
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
    <section className="mb-5">
      <SectionTitle
        label={tEditor.skills}
        sectionType="skills"
        className={s.label}
        style={s.sectionTitle}
      />

      <div
        className="grid items-start gap-y-1"
        style={{
          gridTemplateColumns: s.labelColumns,
          columnGap: s.entryGap,
        }}
      >
        {groupedEntries.map(({ cat, skills: categorySkills }) => {
          const names = categorySkills
            .map((sk) => sk.name)
            .filter(Boolean)
            .join(", ");
          return (
            <Fragment key={cat}>
              <span className="font-semibold text-slate-900">{cat}:</span>
              <span className="min-w-0 text-slate-900" style={s.body}>
                {names}
              </span>
            </Fragment>
          );
        })}

        {/* Skills without a category span the full width so they start at the
            same left edge as the category labels. */}
        {ungrouped.length > 0 && (
          <>
            <span />
            <span className="min-w-0 text-slate-900" style={s.body}>
              {ungrouped
                .map((sk) => sk.name)
                .filter(Boolean)
                .join(", ")}
            </span>
          </>
        )}
      </div>
    </section>
  );
}