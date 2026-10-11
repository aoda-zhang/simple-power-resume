import { useState } from "react";
import type { Experience } from "../../types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useResumeStore } from "../../store/resumeStore";
import { translations } from "../../i18n";

interface Props {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceSection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: Experience = {
      id: `exp_${Date.now()}`,
      company: "",
      companyWebsite: "",
      companyDescription: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      address: "",
      techStack: "",
      country: "",
      workMode: "",
    };
    onChange([...data, newItem]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const index = data.findIndex((item) => item.id === id);
    if (direction === "up" && index > 0) {
      const newData = [...data];
      [newData[index - 1], newData[index]] = [
        newData[index],
        newData[index - 1],
      ];
      onChange(newData);
    } else if (direction === "down" && index < data.length - 1) {
      const newData = [...data];
      [newData[index], newData[index + 1]] = [
        newData[index + 1],
        newData[index],
      ];
      onChange(newData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{tEditor.experience}</h3>
        <button
          onClick={addItem}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          {tEditor.add}
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">
                  {item.position || item.company || tEditor.add}
                </span>
                <span className="text-xs text-slate-400">
                  {item.startDate && item.endDate
                    ? `${item.startDate} - ${item.endDate}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(item.id, "up");
                  }}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(item.id, "down");
                  }}
                  disabled={index === data.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedId === item.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {expandedId === item.id && (
              <div className="p-4 space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.company}
                    </label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) =>
                        updateItem(item.id, "company", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.company}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.companyWebsite}
                    </label>
                    <input
                      type="text"
                      value={item.companyWebsite || ""}
                      onChange={(e) =>
                        updateItem(item.id, "companyWebsite", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.position}
                    </label>
                    <input
                      type="text"
                      value={item.position}
                      onChange={(e) =>
                        updateItem(item.id, "position", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.position}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.startDate}
                    </label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) =>
                        updateItem(item.id, "startDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.startDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.endDate}
                    </label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) =>
                        updateItem(item.id, "endDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.endDate}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) =>
                          updateItem(item.id, "current", e.target.checked)
                        }
                        className="rounded"
                      />
                      {t.current}
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.address}
                    </label>
                    <input
                      type="text"
                      value={item.address || ""}
                      onChange={(e) =>
                        updateItem(item.id, "address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.address}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={item.country || ""}
                      onChange={(e) =>
                        updateItem(item.id, "country", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Germany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Work Mode
                    </label>
                    <input
                      type="text"
                      value={item.workMode || ""}
                      onChange={(e) =>
                        updateItem(item.id, "workMode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Full-time"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.companyDescription}
                    </label>
                    <input
                      type="text"
                      value={item.companyDescription || ""}
                      onChange={(e) =>
                        updateItem(item.id, "companyDescription", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.companyDescription}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.skills}
                    </label>
                    <input
                      type="text"
                      value={item.techStack || ""}
                      onChange={(e) =>
                        updateItem(item.id, "techStack", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.skills}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">
                      {t.description}
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={t.description}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
