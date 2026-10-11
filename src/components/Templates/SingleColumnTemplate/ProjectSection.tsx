/**
 * Single-column layout: projects section.
 */
import { ProjectEntry, SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Project } from "../../../types/resume";

interface ProjectSectionProps {
  projects: Project[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  onUpdate: (id: string, data: Partial<Project>) => void;
}

export function ProjectSection({
  projects,
  t,
  tEditor,
  onUpdate,
}: ProjectSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.projects}
        sectionType="projects"
        className={s.label}
        style={s.sectionTitle}
      />
      {projects.map((proj) => (
        <ProjectEntry
          key={proj.id}
          proj={proj}
          t={t}
          onUpdate={onUpdate}
          styles={{ description: s.body }}
        />
      ))}
    </section>
  );
}
