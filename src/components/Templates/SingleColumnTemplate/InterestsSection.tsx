/**
 * Single-column layout: interests section.
 * Displays each line as a bullet point.
 */
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";

interface InterestsSectionProps {
  interests: string;
  t: Record<string, string>;
}

export function InterestsSection({ interests, t }: InterestsSectionProps) {
  if (!interests?.trim()) return null;

  const lines = interests
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionTitle
        label={t.interests}
        sectionType="interests"
        className={s.label}
        style={s.sectionTitle}
      />
      <ul className="space-y-1">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
            <span className="text-slate-900 leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
