/**
 * Single-column layout: languages section (inline, comma-separated).
 * Format: "Chinese - fluent (C1), English - advanced (B2)"
 * Mother tongue: "Spanish - mother tongue" (no parentheses)
 */
import { EditableText } from "../EditableComponents";
import { singleColumnStyles as s } from "../shared/templateStyles";

interface Language {
  id: string;
  name: string;
  level: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  onUpdate: (id: string, data: Partial<Language>) => void;
}

/** Maps CEFR level codes to readable proficiency descriptions */
const proficiencyMap: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  "B2 - C1": "Advanced",
  C1: "Advanced",
  C2: "Expert",
  Native: "Native",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

function getProficiency(level: string): string {
  return proficiencyMap[level] ?? level;
}

/** Checks if a level is a "mother tongue" type label (no CEFR code) */
function isMotherTongue(level: string): boolean {
  const noParens = ["mother tongue", "native", "native speaker", "native language"];
  return noParens.some((l) => level.toLowerCase().includes(l.toLowerCase()));
}

export function LanguagesSection({
  languages,
  onUpdate,
}: LanguagesSectionProps) {
  if (languages.length === 0) return null;

  return (
    <div className="text-slate-900" style={s.body}>
      {languages.map((lang, idx) => {
        const isMT = isMotherTongue(lang.level);
        const showComma = idx < languages.length - 1;

        return (
          <span key={lang.id}>
            <EditableText
              value={lang.name}
              onChange={(v) => onUpdate(lang.id, { name: v })}
              placeholder="Language"
              className="font-medium"
            />
            <span> - </span>
            <EditableText
              value={isMT ? lang.level : getProficiency(lang.level)}
              onChange={(v) => onUpdate(lang.id, { level: v })}
              placeholder="Proficiency"
            />
            {!isMT && (
              <>
                <span>&nbsp;(</span>
                <EditableText
                  value={lang.level}
                  onChange={(v) => onUpdate(lang.id, { level: v })}
                  placeholder="Level"
                  className="font-medium"
                />
                <span>)</span>
              </>
            )}
            {showComma && <span>,&nbsp;&nbsp;</span>}
          </span>
        );
      })}
    </div>
  );
}
