import { useState, useRef } from "react";
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
import type { PersonalInfoFieldType } from "../../store/resumeStore";
import { Trash2, Upload, GripVertical } from "lucide-react";
import { PhotoCropper } from "./PhotoCropper";

interface FieldRowProps {
  field: PersonalInfoFieldType;
  label: string;
  value: string;
  type?: "text" | "email" | "tel" | "url";
  rows?: number;
  placeholder?: string;
  onSave: (field: PersonalInfoFieldType, value: string) => void;
}

function SortableFieldRow({
  field,
  label,
  value,
  type = "text",
  rows = 1,
  placeholder,
  onSave,
}: FieldRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field });
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isTextarea = rows > 1;

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none pt-2.5"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Label */}
      <label className="flex-shrink-0 w-24 text-sm text-slate-600 pt-2.5">
        {label}
      </label>

      {/* Input / Textarea */}
      {isTextarea ? (
        <textarea
          ref={textareaRef}
          value={editing ? draft : value}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => {
            setEditing(true);
            setDraft(value);
          }}
          onBlur={() => {
            setEditing(false);
            onSave(field, draft);
          }}
          rows={rows}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
            editing ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
          }`}
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={editing ? draft : value}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => {
            setEditing(true);
            setDraft(value);
          }}
          onBlur={() => {
            setEditing(false);
            onSave(field, draft);
          }}
          className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            editing ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
          }`}
        />
      )}
    </div>
  );
}

interface Props {
  data: { photo?: string };
  isEditing?: boolean;
}

export function PersonalInfoSection({ data, isEditing = true }: Props) {
  const language = useResumeStore((s) => s.language);
  const {
    personalInfoFieldOrder,
    reorderPersonalInfoFields,
    resumeData,
    updatePersonalInfo,
  } = useResumeStore();
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    data.photo || null,
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const fieldLabels: Record<PersonalInfoFieldType, string> = {
    fullName: t.name,
    title: t.title,
    email: t.email,
    phone: t.phone,
    address: t.address,
    nationality: t.nationality,
    birthDate: t.birthDate,
    workPermit: t.workPermit,
    residenceStatus: t.residenceStatus,
    blueCard: t.blueCard,
    linkedin: t.linkedin,
    github: t.github,
    website: t.website,
  };

  const fieldTypes: Record<
    PersonalInfoFieldType,
    "text" | "email" | "tel" | "url"
  > = {
    fullName: "text",
    title: "text",
    email: "email",
    phone: "tel",
    address: "text",
    nationality: "text",
    birthDate: "text",
    workPermit: "text",
    residenceStatus: "text",
    blueCard: "text",
    linkedin: "url",
    github: "url",
    website: "url",
  };

  const fieldRows: Record<PersonalInfoFieldType, number> = {
    fullName: 1,
    title: 1,
    email: 1,
    phone: 1,
    address: 1,
    nationality: 1,
    birthDate: 1,
    workPermit: 1,
    residenceStatus: 1,
    blueCard: 1,
    linkedin: 1,
    github: 1,
    website: 1,
  };

  const getValue = (field: PersonalInfoFieldType): string => {
    const v =
      resumeData.personalInfo[field as keyof typeof resumeData.personalInfo];
    return typeof v === "string" ? v : "";
  };

  const handleChange = (
    field: keyof typeof resumeData.personalInfo,
    value: string,
  ) => {
    updatePersonalInfo({ [field]: value });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = personalInfoFieldOrder.indexOf(
        active.id as PersonalInfoFieldType,
      );
      const newIndex = personalInfoFieldOrder.indexOf(
        over.id as PersonalInfoFieldType,
      );
      reorderPersonalInfoFields(
        arrayMove(personalInfoFieldOrder, oldIndex, newIndex),
      );
    }
  };

  if (!isEditing) {
    return (
      <div className="text-slate-400 text-center py-8">
        {tEditor.personalInfo}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{tEditor.personalInfo}</h3>
        <button
          onClick={() => {
            if (window.confirm("重置字段顺序？")) {
              useResumeStore.getState().resetPersonalInfoFieldOrder();
            }
          }}
          className="px-2 py-1 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          重置顺序
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={personalInfoFieldOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {personalInfoFieldOrder.map((field) => (
              <SortableFieldRow
                key={field}
                field={field}
                label={fieldLabels[field]}
                value={getValue(field)}
                type={fieldTypes[field]}
                rows={fieldRows[field]}
                placeholder={undefined}
                onSave={(f, v) => handleChange(f, v)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Photo cropper modal */}
      {pendingFile && (
        <PhotoCropper
          file={pendingFile}
          onConfirm={(cropped) => {
            setPhotoPreview(cropped);
            updatePersonalInfo({ photo: cropped });
            setPendingFile(null);
          }}
          onCancel={() => setPendingFile(null)}
        />
      )}

      {/* Photo upload */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-sm text-slate-600 mb-2">{t.avatar}</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt={t.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Upload className="w-7 h-7" />
              </div>
            )}
          </div>
          <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm">
            {t.avatar}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPendingFile(file);
              }}
              className="hidden"
            />
          </label>
          {photoPreview && (
            <button
              onClick={() => {
                setPhotoPreview(null);
                updatePersonalInfo({ photo: undefined });
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
