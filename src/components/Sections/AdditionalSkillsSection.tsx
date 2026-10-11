import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { Language as LangType } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  languages: LangType[];
  onLanguagesChange: (data: LangType[]) => void;
  interests: string;
  onInterestsChange: (data: string) => void;
}

const levelOptions = [
  { value: 'A1', label: 'A1 Beginner' },
  { value: 'A2', label: 'A2 Basic' },
  { value: 'B1', label: 'B1 Intermediate' },
  { value: 'B2', label: 'B2 Upper-Intermediate' },
  { value: 'B2 - C1', label: 'B2+' },
  { value: 'C1', label: 'C1 Advanced' },
  { value: 'C2', label: 'C2 Expert' },
  { value: 'Mother Tongue', label: 'Mother Tongue' },
];

export function AdditionalSkillsSection({
  languages,
  onLanguagesChange,
  interests,
  onInterestsChange,
}: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;

  const [openSection, setOpenSection] = useState<string | null>('languages');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const addLanguage = () => {
    const newItem: LangType = {
      id: `lang_${Date.now()}`,
      name: '',
      level: 'B2',
    };
    onLanguagesChange([...languages, newItem]);
  };

  const updateLanguage = (id: string, field: keyof LangType, value: any) => {
    onLanguagesChange(languages.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLanguage = (id: string) => {
    onLanguagesChange(languages.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Languages sub-section */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('languages')}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🌐</span>
            <span className="font-medium text-slate-900">{tEditor.languages}</span>
          </div>
          {openSection === 'languages' ? (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {openSection === 'languages' && (
          <div className="p-4 space-y-3">
            {languages.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateLanguage(item.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder={t.language}
                />
                <select
                  value={item.level}
                  onChange={(e) => updateLanguage(item.id, 'level', e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {levelOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeLanguage(item.id)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {languages.length === 0 && (
              <p className="text-center py-4 text-slate-400 text-sm">No languages added</p>
            )}
            <button
              onClick={addLanguage}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm border border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> {tEditor.add}
            </button>
          </div>
        )}
      </div>

      {/* Interests sub-section */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('interests')}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="font-medium text-slate-900">{tEditor.interests}</span>
          </div>
          {openSection === 'interests' ? (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {openSection === 'interests' && (
          <div className="p-4 space-y-3">
            <textarea
              value={interests}
              onChange={(e) => onInterestsChange(e.target.value)}
              placeholder={tEditor.interestsPlaceholder || 'Reading, Photography, Hiking...'}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         resize-y min-h-[80px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
