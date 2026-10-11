import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeStore } from "../../store/resumeStore";
import { translations } from "../../i18n";
import { PersonalInfoSection } from "../Sections/PersonalInfoSection";
import { ExperienceSection } from "../Sections/ExperienceSection";
import { EducationSection } from "../Sections/EducationSection";
import { SkillsSection } from "../Sections/SkillsSection";
import { ProjectsSection } from "../Sections/ProjectsSection";
import { SummarySection } from "../Sections/SummarySection";
import { AdditionalSkillsSection } from "../Sections/AdditionalSkillsSection";
import {
  FileJson,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";

type SectionKey =
  | "personalInfo"
  | "summary"
  | "additionalSkills"
  | "experience"
  | "education"
  | "skills"
  | "projects";

const storeToEditor: Record<string, SectionKey> = {
  personal: "personalInfo",
  summary: "summary",
  experience: "experience",
  education: "education",
  projects: "projects",
  skills: "skills",
  additionalSkills: "additionalSkills",
};

const editorToStore: Record<SectionKey, string> = {
  personalInfo: "personal",
  summary: "summary",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
  additionalSkills: "additionalSkills",
};

const sectionIcons: Record<SectionKey, string> = {
  personalInfo: "👤",
  summary: "📝",
  experience: "💼",
  education: "🎓",
  skills: "🛠️",
  projects: "🚀",
  additionalSkills: "📋",
};

function SortableSectionItem({
  label,
  icon,
  isExpanded,
  onToggle,
  children,
  sectionKey,
}: {
  sectionKey: SectionKey;
  label: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-50" : ""}
    >
      <div className="bg-white border-b border-slate-200">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="px-2 py-3 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <button
            onClick={onToggle}
            className="flex-1 py-3 pr-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <span className="font-medium text-slate-900">{label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-100">{children}</div>
        )}
      </div>
    </div>
  );
}

export function SectionEditor() {
  const language = useResumeStore((s) => s.language);
  const {
    resumeData,
    setResumeData,
    updateResumeData,
    sectionOrder,
    reorderSections,
    resetSectionOrder,
  } = useResumeStore();
  const tEditor = translations[language].editor;
  const tConfirm = translations[language].confirm;
  const [expandedSection, setExpandedSection] =
    useState<SectionKey>("personalInfo");
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonDirty, setJsonDirty] = useState(false);

  const sectionConfig: Record<SectionKey, { label: string; icon: string }> = {
    personalInfo: {
      label: tEditor.personalInfo,
      icon: sectionIcons.personalInfo,
    },
    summary: {
      label: tEditor.summary || "Summary",
      icon: sectionIcons.summary,
    },
    experience: { label: tEditor.experience, icon: sectionIcons.experience },
    education: { label: tEditor.education, icon: sectionIcons.education },
    skills: { label: tEditor.skills, icon: sectionIcons.skills },
    projects: { label: tEditor.projects, icon: sectionIcons.projects },
    additionalSkills: { label: tEditor.additionalSkills || "Additional Skills", icon: sectionIcons.additionalSkills },
  };

  const openJson = () => {
    setJsonText(JSON.stringify(resumeData, null, 2));
    setJsonError("");
    setJsonDirty(false);
    setShowJson(true);
  };

  const closeJson = () => {
    if (jsonDirty) {
      if (!window.confirm(tConfirm.clear)) return;
    }
    setShowJson(false);
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setResumeData(parsed);
      setJsonDirty(false);
      setJsonError("");
    } catch (e) {
      setJsonError(`JSON: ${(e as Error).message}`);
    }
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    setJsonDirty(true);
    try {
      JSON.parse(text);
      setJsonError("");
    } catch (e) {
      setJsonError(`${(e as Error).message}`);
    }
  };

  const editorSections: SectionKey[] = sectionOrder
    .filter((s) => s.visible)
    .map((s) => storeToEditor[s.type] || "personalInfo")
    .filter((key, i, arr) => arr.indexOf(key) === i);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = editorSections.indexOf(active.id as SectionKey);
      const newIndex = editorSections.indexOf(over.id as SectionKey);
      const newEditorOrder = arrayMove(editorSections, oldIndex, newIndex);
      const newSectionOrder = newEditorOrder
        .map((key) => {
          const storeType = editorToStore[key];
          return sectionOrder.find((s) => s.type === storeType)!;
        })
        .filter(Boolean);
      reorderSections(newSectionOrder);
    }
  };

  const handleUpdate = <K extends keyof typeof resumeData>(
    key: K,
    value: (typeof resumeData)[K],
  ) => {
    updateResumeData({ [key]: value });
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case "personalInfo":
        return <PersonalInfoSection data={resumeData.personalInfo} />;
      case "summary":
        return (
          <SummarySection
            data={resumeData.summary}
            onChange={(v) => handleUpdate("summary", v)}
          />
        );
      case "additionalSkills":
        return (
          <AdditionalSkillsSection
            languages={resumeData.languages}
            onLanguagesChange={(v) => handleUpdate("languages", v)}
            interests={resumeData.interests}
            onInterestsChange={(v) => handleUpdate("interests", v)}
          />
        );
      case "experience":
        return (
          <ExperienceSection
            data={resumeData.experience}
            onChange={(v) => handleUpdate("experience", v)}
          />
        );
      case "education":
        return (
          <EducationSection
            data={resumeData.education}
            onChange={(v) => handleUpdate("education", v)}
          />
        );
      case "skills":
        return (
          <SkillsSection
            data={resumeData.skills}
            onChange={(v) => handleUpdate("skills", v)}
          />
        );
      case "projects":
        return (
          <ProjectsSection
            data={resumeData.projects}
            onChange={(v) => handleUpdate("projects", v)}
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-900">
            {tEditor.personalInfo}
          </h2>
          <button
            onClick={() => {
              if (window.confirm(tConfirm.clear)) {
                resetSectionOrder();
              }
            }}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title={tEditor.sectionName}
          >
            Reset order
          </button>
        </div>
        <button
          onClick={showJson ? closeJson : openJson}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            showJson
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileJson className="w-4 h-4" />
          JSON
        </button>
      </div>

      {showJson && (
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={applyJson}
                disabled={!jsonDirty || !!jsonError}
                className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  jsonDirty && !jsonError
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {tEditor.show}
              </button>
              <button
                onClick={openJson}
                className="px-3 py-1.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {tEditor.hide}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {jsonDirty && !jsonError && (
                <span className="text-xs text-amber-600">
                  {tConfirm.clear.split("？")[0]}...
                </span>
              )}
              {jsonError && (
                <span
                  className="text-xs text-red-500 max-w-[200px] truncate"
                  title={jsonError}
                >
                  {jsonError}
                </span>
              )}
              {!jsonError && jsonText && (
                <span className="text-xs text-green-600">OK</span>
              )}
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder={tEditor.sectionName}
            spellCheck={false}
            className="flex-1 w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          />
        </div>
      )}

      {!showJson && (
        <div className="flex-1 overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={editorSections}
              strategy={verticalListSortingStrategy}
            >
              {editorSections.map((key) => {
                const config = sectionConfig[key];
                return (
                  <SortableSectionItem
                    key={key}
                    sectionKey={key}
                    label={config.label}
                    icon={config.icon}
                    isExpanded={expandedSection === key}
                    onToggle={() =>
                      setExpandedSection(
                        expandedSection === key ? ("" as SectionKey) : key,
                      )
                    }
                  >
                    {renderSectionContent(key)}
                  </SortableSectionItem>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
