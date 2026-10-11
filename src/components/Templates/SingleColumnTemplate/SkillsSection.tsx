/**
 * Single-column layout: skills section with optional category grouping.
 * All category labels share one content-sized grid column.
 */
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

      <div className="flex flex-col gap-y-1.5">
        {groupedEntries.map(({ cat, skills: categorySkills }) => {
          const names = categorySkills.map((sk) => sk.name).filter(Boolean).join(", ");
          return (
            <div
              key={cat}
              className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-x-2"
            >
              <span className="font-bold text-slate-900">
                {cat}:
              </span>
              <span className="min-w-0 text-slate-900" style={s.body}>
                {names}
              </span>
            </div>
          );
        })}

        {ungrouped.length > 0 && (
          <div className="text-slate-900" style={s.body}>
            {ungrouped.map((sk) => sk.name).filter(Boolean).join(", ")}
          </div>
        )}
      </div>
    </section>
  );
}
