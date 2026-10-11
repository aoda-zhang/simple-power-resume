import { useState, useRef, useEffect } from "react";
import { useResumeStore } from "../../store/resumeStore";

export function EditableText({
  value,
  onChange,
  className = "",
  placeholder = "",
  multiline = false,
  asList = false,
  style,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  /** When true, display multiline text as bullet list; otherwise preserve whitespace */
  asList?: boolean;
  style?: React.CSSProperties;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none resize-none`}
        style={style}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  // Display mode: if multiline, render with whitespace preserved (keep line breaks & spaces)
  // If asList=true, show as bullet list instead
  if (multiline && value) {
    if (asList) {
      const lines = value.split("\n").filter((l) => l.trim());
      return (
        <ul
          onClick={() => setIsEditing(true)}
          className={`${className} cursor-text`}
          style={style}
        >
          {lines.map((line, i) => (
            <li key={i} className="text-slate-900">
              <span
                className="font-bold mr-1 inline-block"
                style={{ fontSize: "20px", lineHeight: 1 }}
              >
                •
              </span>
              {line}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`${className} cursor-text whitespace-pre-wrap`}
        style={style}
      >
        {value}
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text transition-all border-2 border-transparent`}
      style={style}
      title="ClickEdit"
    >
      {value || placeholder}
    </span>
  );
}

export function EditableLabel({
  sectionType,
  defaultLabel,
  className = "",
  style,
}: {
  sectionType: string;
  defaultLabel: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { sectionOrder, updateSectionLabel } = useResumeStore();
  const section = sectionOrder.find((s) => s.type === sectionType);
  const label = section?.label || defaultLabel;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateSectionLabel(sectionType, editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none`}
        style={style}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all`}
      style={style}
      title="ClickEditTitle"
    >
      {label}
    </span>
  );
}

export function useResumeEditing() {
  const store = useResumeStore();
  return {
    ...store,
    visibleSections: store.sectionOrder.filter((s) => s.visible),
    personalInfoFields: store.personalInfoFieldOrder,
  };
}
