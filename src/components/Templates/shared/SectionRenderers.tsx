import { Fragment } from "react";
import { EditableText, EditableLabel } from "../EditableComponents";
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
      data-section-title
      className={`block mb-3 ${className}`}
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
  onUpdate,
  styles,
}: ExperienceEntryProps) {
  /**
   * Only build the metadata that actually exists. Rendering every slot
   * unconditionally produced dangling separators such as "Zalando | |".
   */
  const meta: React.ReactNode[] = [];
  if (exp.companyWebsite?.trim())
    meta.push(
      <span key="website" className="text-slate-600 whitespace-nowrap">
        {exp.companyWebsite}
      </span>,
    );
  if (exp.address?.trim())
    meta.push(
      <span key="address" className="text-slate-600 whitespace-nowrap">
        {exp.address}
      </span>,
    );
  if (exp.country?.trim())
    meta.push(
      <span key="country" className="text-slate-600 whitespace-nowrap">
        <EditableText
          value={exp.country}
          onChange={(v) => onUpdate(exp.id, { country: v })}
          placeholder={t.nationality || "Country"}
        />
      </span>,
    );
  if (exp.workMode?.trim())
    meta.push(
      <span key="workMode" className="text-slate-600 whitespace-nowrap">
        <EditableText
          value={exp.workMode}
          onChange={(v) => onUpdate(exp.id, { workMode: v })}
          placeholder="Mode"
        />
      </span>,
    );

  return (
    <div>
      <h3 className="text-slate-900" style={styles.position}>
        <EditableText
          value={exp.position}
          onChange={(v) => onUpdate(exp.id, { position: v })}
          placeholder={t.position || "Position"}
          className="font-bold"
        />
      </h3>

      <div style={styles.company} className="text-slate-700">
        <EditableText
          value={exp.company}
          onChange={(v) => onUpdate(exp.id, { company: v })}
          placeholder={t.company || "Company"}
          className="font-semibold text-slate-900"
        />
        {meta.map((node, i) => (
          <Fragment key={i}>
            <span className="mx-1.5 text-slate-300">|</span>
            {node}
          </Fragment>
        ))}
      </div>

      {exp.companyDescription && (
        <p
          style={styles.companyDescription}
          className="text-slate-600 mt-0.5"
        >
          <EditableText
            value={exp.companyDescription}
            onChange={(v) => onUpdate(exp.id, { companyDescription: v })}
            placeholder={t.companyDescription || "Company Description"}
          />
        </p>
      )}

      {exp.techStack && (
        <div style={styles.techStack} className="text-slate-700 mt-0.5">
          <span className="mr-1">Tech Stack:</span>
          {exp.techStack}
        </div>
      )}

      <div style={styles.description} className="mt-1.5">
        <EditableText
          value={exp.description}
          onChange={(v) => onUpdate(exp.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          asList
          className="w-full text-slate-900"
        />
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
    <div className="mb-3">
      <h3
        style={styles.name}
        className="font-bold text-slate-900 text-base"
      >
        <EditableText
          value={proj.name}
          onChange={(v) => onUpdate(proj.id, { name: v })}
          placeholder={t.projectName || "Project Name"}
          className="font-bold"
        />
      </h3>
      {/* Not a list: a project description is a paragraph, so a lone bullet
          hanging in front of it looked like a formatting mistake. */}
      <div style={styles.description} className="mt-0.5 text-slate-900">
        <EditableText
          value={proj.description}
          onChange={(v) => onUpdate(proj.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          className="w-full"
        />
      </div>
      {proj.technologies.length > 0 && (
        <div style={styles.tech} className="mt-0.5 text-slate-700">
          <span className="mr-1">Tech Stack:</span>
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
              {idx < proj.technologies.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
