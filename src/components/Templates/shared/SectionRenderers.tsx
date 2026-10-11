import { EditableText, EditableLabel } from "../EditableComponents";
export function parseDateRange(
  value: string,
  present: string,
  onSave: (dates: {
    startDate: string;
    endDate: string;
    current: boolean;
  }) => void,
) {
  const dashIdx = value.indexOf("-");
  const s1 = dashIdx >= 0 ? value.slice(0, dashIdx).trim() : value.trim();
  const s2 = dashIdx >= 0 ? value.slice(dashIdx + 1).trim() : "";
  onSave({
    startDate: s1,
    endDate: s2,
    current: s2.toLowerCase().includes(present.toLowerCase()),
  });
}
export interface PhotoProps {
  src?: string;
  size?: number;
  className?: string;
}

export function Photo({ src, size = 96, className = "" }: PhotoProps) {
  if (!src) return null;
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt="Photo" className="w-full h-full object-cover" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section title (e.g. "Experience", "Education")
// ---------------------------------------------------------------------------
export interface SectionTitleProps {
  label: string;
  sectionType: string;
  style?: React.CSSProperties;
  className?: string;
}

export function SectionTitle({
  label,
  sectionType,
  style,
  className = "",
}: SectionTitleProps) {
  return (
    <EditableLabel
      sectionType={sectionType}
      defaultLabel={label}
      className={`block mb-4 ${className}`}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Summary section
// ---------------------------------------------------------------------------
export interface SummarySectionProps {
  value: string;
  placeholder: string;
  style?: React.CSSProperties;
}

export function SummarySection({
  value,
  placeholder,
  style,
}: SummarySectionProps) {
  return (
    <p className="leading-relaxed" style={style}>
      <EditableText
        value={value}
        onChange={() => {}}
        placeholder={placeholder}
        multiline
        className="w-full"
      />
    </p>
  );
}

// ---------------------------------------------------------------------------
// Experience entry
// ---------------------------------------------------------------------------
export interface ExperienceEntryProps {
  exp: {
    id: string;
    position: string;
    company: string;
    companyWebsite?: string;
    companyDescription?: string;
    address?: string;
    country?: string;
    workMode?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    techStack?: string;
    description: string;
  };
  t: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<ExperienceEntryProps["exp"]>) => void;
  styles: {
    date?: React.CSSProperties;
    position?: React.CSSProperties;
    company?: React.CSSProperties;
    companyDescription?: React.CSSProperties;
    techStack?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

export function ExperienceEntry({
  exp,
  t,
  present: _present,
  onUpdate,
  styles,
}: ExperienceEntryProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline gap-2">
        <h3 style={styles.position}>
          <EditableText
            value={exp.position}
            onChange={(v) => onUpdate(exp.id, { position: v })}
            placeholder={t.position || "Position"}
            className="font-bold text-sky-600"
          />
        </h3>
      </div>

      <div style={styles.company} className="text-slate-900">
        <EditableText
          value={exp.company}
          onChange={(v) => onUpdate(exp.id, { company: v })}
          placeholder={t.company || "Company"}
          className="font-bold"
        />
        <span className="mx-2">|</span>
        <span>{exp.companyWebsite}</span>
        <span className="mx-2">|</span>
        <span>{exp.address}</span>
        {exp.country && (
          <span>
            <EditableText
              value={exp.country}
              onChange={(v) => onUpdate(exp.id, { country: v })}
              placeholder={t.nationality || "Country"}
            />
          </span>
        )}
        {exp.workMode && (
          <span>
            {" · "}
            <EditableText
              value={exp.workMode}
              onChange={(v) => onUpdate(exp.id, { workMode: v })}
              placeholder="Mode"
            />
          </span>
        )}
      </div>

      {exp.companyDescription && (
        <p style={styles.companyDescription}>
          <EditableText
            value={exp.companyDescription}
            onChange={(v) => onUpdate(exp.id, { companyDescription: v })}
            placeholder={t.companyDescription || "Company Description"}
            className="font-bold"
          />
        </p>
      )}

      {exp.techStack && (
        <div
          style={styles.techStack}
          className="text-slate-900 whitespace-pre-wrap"
        >
          <span className="font-bold mr-1">Tech Stack:</span>
          {exp.techStack}
        </div>
      )}

      <p
        style={styles.description}
        className="mt-4 text-slate-900 whitespace-pre-line"
      >
        <EditableText
          value={exp.description}
          onChange={(v) => onUpdate(exp.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          asList
          className="w-full"
        />
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Education entry
// ---------------------------------------------------------------------------
export interface EducationEntryProps {
  edu: {
    id: string;
    school: string;
    field?: string;
    degree?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    address?: string;
  };
  t: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<EducationEntryProps["edu"]>) => void;
  styles: {
    date?: React.CSSProperties;
    school?: React.CSSProperties;
    field?: React.CSSProperties;
    address?: React.CSSProperties;
  };
}

export function EducationEntry({
  edu,
  t,
  present: _present,
  onUpdate,
  styles,
}: EducationEntryProps) {
  return (
    <div className="mb-2 flex gap-4">
      {/* LEFT */}
      <div className="flex flex-col shrink-0">
        <span style={styles.date} className="text-slate-900">
          <EditableText
            value={`${edu.startDate}${edu.startDate ? " - " : ""}${edu.current ? _present : edu.endDate}`}
            onChange={(v) =>
              parseDateRange(v, _present, (d) => onUpdate(edu.id, d))
            }
            placeholder={t.startDate || "Start - End"}
          />
        </span>

        {edu.address && (
          <span style={styles.address} className="text-slate-900 mt-1">
            <EditableText
              value={edu.address}
              onChange={(v) => onUpdate(edu.id, { address: v })}
              placeholder={t.address || "Address"}
            />
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div style={styles.school} className="text-slate-900 flex-1">
        <div>
          <span className="font-bold">{`${edu.field}, `}</span>
          <span>{edu.school}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project entry
// ---------------------------------------------------------------------------
export interface ProjectEntryProps {
  proj: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
  };
  t: Record<string, string>;
  onUpdate: (id: string, data: Partial<ProjectEntryProps["proj"]>) => void;
  styles: {
    name?: React.CSSProperties;
    description?: React.CSSProperties;
    tech?: React.CSSProperties;
  };
}

export function ProjectEntry({ proj, t, onUpdate, styles }: ProjectEntryProps) {
  return (
    <div className="mb-2">
      <h3 style={styles.name} className="font-bold text-slate-900">
        <EditableText
          value={proj.name}
          onChange={(v) => onUpdate(proj.id, { name: v })}
          placeholder={t.projectName || "Project Name"}
          className="font-bold"
        />
      </h3>
      <p
        style={styles.description}
        className="mt-1 text-slate-900 whitespace-pre-line"
      >
        <EditableText
          value={proj.description}
          onChange={(v) => onUpdate(proj.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          asList
          className="w-full"
        />
      </p>
      {proj.technologies.length > 0 && (
        <div style={styles.tech} className="mt-1 text-slate-600">
          <span className="font-semibold">Tech: </span>
          {proj.technologies.map((tech, idx) => (
            <span key={idx}>
              <EditableText
                value={tech}
                onChange={(v) => {
                  const newTechs = [...proj.technologies];
                  newTechs[idx] = v;
                  onUpdate(proj.id, { technologies: newTechs });
                }}
                placeholder={t.skills || "Skills"}
              />
              {idx < proj.technologies.length - 1 && " · "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill entry
// ---------------------------------------------------------------------------
export interface SkillEntryProps {
  skill: { id: string; name: string };
  onUpdate: (id: string, data: Partial<SkillEntryProps["skill"]>) => void;
  style?: React.CSSProperties;
}

export function SkillEntry({ skill, onUpdate, style }: SkillEntryProps) {
  return (
    <EditableText
      value={skill.name}
      onChange={(v) => onUpdate(skill.id, { name: v })}
      placeholder="Skill"
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Language entry
// ---------------------------------------------------------------------------
export interface LanguageEntryProps {
  lang: { id: string; name: string; level: string };
  onUpdate: (id: string, data: Partial<LanguageEntryProps["lang"]>) => void;
  nameStyle?: React.CSSProperties;
  levelStyle?: React.CSSProperties;
  separator?: string;
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

/** Level labels that should NOT show parentheses */
const NO_PARENTHESIS_LEVELS = [
  "mother tongue",
  "native",
  "native speaker",
  "native language",
];

/** Checks if a level is a "mother tongue" type label (no CEFR code) */
function isMotherTongue(level: string): boolean {
  return NO_PARENTHESIS_LEVELS.some((l) =>
    level.toLowerCase().includes(l.toLowerCase()),
  );
}

export function LanguageEntry({
  lang,
  onUpdate,
  nameStyle,
}: LanguageEntryProps) {
  const level = lang.level;
  const isMT = isMotherTongue(level);

  return (
    <div className="items-baseline">
      <EditableText
        value={lang.name}
        onChange={(v) => onUpdate(lang.id, { name: v })}
        placeholder="Language"
        className="font-medium text-slate-900"
        style={nameStyle}
      />
      <span> - </span>
      <span className=" text-slate-900">
        <EditableText
          value={isMT ? level : getProficiency(level)}
          onChange={(v) => onUpdate(lang.id, { level: v })}
          placeholder="Proficiency"
        />
      </span>
      {!isMT && (
        <>
          <span>&nbsp;(</span>
          <span className="font-medium text-slate-900">
            <EditableText
              value={level}
              onChange={(v) => onUpdate(lang.id, { level: v })}
              placeholder="Level"
              className="font-medium"
            />
          </span>
          <span>)</span>
        </>
      )}
    </div>
  );
}
