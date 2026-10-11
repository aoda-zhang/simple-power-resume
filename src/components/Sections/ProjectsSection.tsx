import { useState } from 'react';
import type { Project } from '../../types/resume';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export function ProjectsSection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: Project = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    onChange([...data, newItem]);
    setExpandedId(newItem.id);
  };

  const updateItem = (id: string, field: keyof Project, value: any) => {
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
        <h3 className="font-semibold text-slate-900">{tEditor.projects}</h3>
        <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />{tEditor.add}
        </button>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <span className="text-sm font-medium text-slate-900">{item.name || tEditor.add}</span>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'up'); }} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); moveItem(item.id, 'down'); }} disabled={index === data.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            {expandedId === item.id && (
              <div className="p-4 space-y-4 bg-white">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t.projectName}</label>
                  <input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.projectName} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t.description}</label>
                  <textarea value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.description} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t.skills}</label>
                  <input type="text" value={item.technologies.join(', ')} onChange={(e) => updateItem(item.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.skills} />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">{t.url}</label>
                  <input type="text" value={item.link || ''} onChange={(e) => updateItem(item.id, 'link', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder={t.url} />
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
