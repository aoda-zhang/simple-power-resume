/**
 * SingleColumnTemplate
 * Clean single-column layout. Assembles section components.
 */
import { useTemplateData } from "../shared/useTemplateData";
import { singleColumnStyles as s } from "../shared/templateStyles";
import { PersonalSection } from "./PersonalSection";
import { SummarySection } from "./SummarySection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { ProjectSection } from "./ProjectSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import type {
  Experience,
  Education,
  Project,
  Language,
} from "../../../types/resume";

export function SingleColumnTemplate() {
  const {
    t,
    tEditor,
    present,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
    interests,
    visibleSections,
    contactFields,
    fieldLabels,
    updatePersonalInfo,
    updateResumeData,
    updateExperience,
    updateEducation,
    updateProject,
    updateLanguage,
  } = useTemplateData();

  const handlePersonalField = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value } as any);
  };

  return (
    <div
      className="bg-white font-sans"
      style={{ padding: s.padding, boxSizing: "border-box", width: "100%" }}
    >
      {visibleSections.map((section) => {
        switch (section.type) {
          case "personal":
            return (
              <PersonalSection
                key={section.id}
                personalInfo={personalInfo}
                contactFields={contactFields}
                fieldLabels={fieldLabels}
                t={t}
                onUpdateField={handlePersonalField}
              />
            );
          case "summary":
            return (
              <SummarySection
                key={section.id}
                value={summary}
                t={t}
                tEditor={tEditor}
                onUpdate={(v) => updateResumeData({ summary: v })}
              />
            );
          case "experience":
            return (
              <ExperienceSection
                key={section.id}
                experience={experience}
                t={t}
                tEditor={tEditor}
                present={present}
                onUpdate={
                  updateExperience as (
                    id: string,
                    data: Partial<Experience>,
                  ) => void
                }
              />
            );
          case "education":
            return (
              <EducationSection
                key={section.id}
                education={education}
                t={t}
                tEditor={tEditor}
                present={present}
                onUpdate={
                  updateEducation as (
                    id: string,
                    data: Partial<Education>,
                  ) => void
                }
              />
            );
          case "projects":
            return (
              <ProjectSection
                key={section.id}
                projects={projects}
                t={t}
                tEditor={tEditor}
                onUpdate={
                  updateProject as (id: string, data: Partial<Project>) => void
                }
              />
            );
          case "skills":
            return (
              <SkillsSection
                key={section.id}
                skills={skills}
                tEditor={tEditor}
              />
            );
          case "additionalSkills":
            return (
              <section key={section.id} className="mb-4">
                <h2
                  className="text-xs font-bold tracking-wider text-slate-900 mb-2 border-b border-slate-900 pb-1"
                  style={s.sectionTitle}
                >
                  {tEditor.additionalSkills}
                </h2>
                {languages.length > 0 && (
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-900 mb-1">{tEditor.sectionLanguages}</h3>
                    <div className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <LanguagesSection
                        languages={languages as Language[]}
                        onUpdate={
                          updateLanguage as (
                            id: string,
                            data: Partial<Language>,
                          ) => void
                        }
                      />
                    </div>
                  </div>
                )}
                {interests && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{tEditor.sectionInterests}</h3>
                    <div className="text-slate-900" style={s.body}>
                      {interests.split("\n").filter(Boolean).map((line, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>{line.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
