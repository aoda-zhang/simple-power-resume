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
      // Strip any bullet the author already typed so we never render "• •".
      const lines = value
        .split("\n")
        .map((line) => line.replace(/^\s*[•\-*·▪◦‣●○]\s*/, "").trim())
        .filter((line) => line.length > 0);
      return (
        <ul
          onClick={() => setIsEditing(true)}
          className={`${className} cursor-text list-disc space-y-1 pl-[1.15em] marker:text-slate-400`}
          style={style}
        >
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
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
      className={`${className} cursor-text transition-colors`}
      style={style}
      title="Click to edit"
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
  "data-section-title": isSectionTitle,
}: {
  sectionType: string;
  defaultLabel: string;
  className?: string;
  style?: React.CSSProperties;
  /** Marks the node for the print stylesheet (keep headings with content). */
  "data-section-title"?: boolean;
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
      data-section-title={isSectionTitle ? "" : undefined}
      className={`${className} cursor-text hover:bg-indigo-50 transition-colors`}
      style={style}
      title="Click to edit"
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
