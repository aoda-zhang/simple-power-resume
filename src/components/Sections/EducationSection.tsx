import { useState } from 'react';
import type { Education } from '../../types/resume';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationSection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: Education = {
      id: `edu_${Date.now()}`,
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    onChange([...data, newItem]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Education, value: any) => {
    onChange(data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    onChange(data.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = data.findIndex(item => item.id === id);
    if (direction === 'up' && index > 0) {
      const newData = [...data];
      [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
      onChange(newData);
    } else if (direction === 'down' && index < data.length - 1) {
      const newData = [...data];
      [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
      onChange(newData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{tEditor.education}</h3>
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
          <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">
                  {item.school || item.degree || tEditor.add}
                </span>
                <span className="text-xs text-slate-400">
                  {item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'up'); }} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'down'); }} disabled={index === data.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {expandedId === item.id && (
              <div className="p-4 space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{t.school}</label>
                    <input type="text" value={item.school} onChange={(e) => updateItem(item.id, 'school', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.school} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{t.degree}</label>
                    <input type="text" value={item.degree} onChange={(e) => updateItem(item.id, 'degree', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.degree} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{t.major}</label>
                    <input type="text" value={item.field} onChange={(e) => updateItem(item.id, 'field', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.major} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{t.startDate}</label>
                    <input type="text" value={item.startDate} onChange={(e) => updateItem(item.id, 'startDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.startDate} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{t.endDate}</label>
                    <input type="text" value={item.endDate} onChange={(e) => updateItem(item.id, 'endDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.endDate} />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 mt-6">
                      <input type="checkbox" checked={item.current} onChange={(e) => updateItem(item.id, 'current', e.target.checked)} className="rounded" />
                      {t.current}
                    </label>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">{t.address}</label>
                    <input type="text" value={item.address || ''} onChange={(e) => updateItem(item.id, 'address', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.address} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p>{tEditor.add}</p>
            <button onClick={addItem} className="mt-2 text-indigo-600 hover:text-indigo-700">+ {tEditor.add}</button>
          </div>
        )}
      </div>
    </div>
  );
}
