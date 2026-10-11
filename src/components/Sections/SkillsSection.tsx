import type { Skill } from '../../types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

/**
 * Skills editor: one row per group (draggable).
 * [ Grip | Category input | Skills input (comma-separated) | Delete ]
 * Group order stored via each skill's `order` field.
 */
export function SkillsSection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const uncategorizedLabel = t.uncategorized || 'Other';

  const buildGroups = () => {
    let maxOrder = -1;
    data.forEach((sk) => {
      if (sk.order !== undefined && sk.order > maxOrder) maxOrder = sk.order;
    });

    const groups: { id: string; cat: string; names: string[]; order: number }[] = [];
    const catMap: Record<string, number> = {};

    data.forEach((sk) => {
      const cat = sk.category?.trim() || uncategorizedLabel;
      if (catMap[cat] === undefined) {
        const order = sk.order ?? (maxOrder + 1 + groups.length);
        catMap[cat] = groups.length;
        groups.push({ id: sk.id, cat, names: [], order });
      }
      if (sk.name.trim()) groups[catMap[cat]].names.push(sk.name.trim());
    });

    groups.sort((a, b) => a.order - b.order);
    return groups;
  };

  const groups = buildGroups();
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragSrcIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragSrcIdx === null || dragSrcIdx === targetIdx) {
      setDragSrcIdx(null);
      setDragOverIdx(null);
      return;
    }

    const srcGroup = groups[dragSrcIdx];
    const tgtGroup = groups[targetIdx];
    const reordered = data.map((sk) => {
      const category = sk.category?.trim() || uncategorizedLabel;
      if (category === srcGroup.cat) return { ...sk, order: tgtGroup.order };
      if (category === tgtGroup.cat) return { ...sk, order: srcGroup.order };
      return sk;
    });

    onChange(reordered);
    setDragSrcIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragSrcIdx(null);
    setDragOverIdx(null);
  };

  const updateCategory = (_groupId: string, oldCat: string, newCat: string) => {
    const safeNewCat = newCat.trim() || uncategorizedLabel;
    if (safeNewCat === oldCat) return;
    onChange(data.map((sk) => {
      const category = sk.category?.trim() || uncategorizedLabel;
      return category === oldCat ? { ...sk, category: safeNewCat } : sk;
    }));
  };

  const updateSkills = (groupId: string, oldCat: string, text: string) => {
    const safeOldCat = oldCat.trim() || uncategorizedLabel;
    const names = text.split(',').map((name) => name.trim()).filter(Boolean);
    const groupOrder = groups.find((group) => group.id === groupId)?.order ?? 0;
    const outside = data.filter((sk) => {
      const category = sk.category?.trim() || uncategorizedLabel;
      return category !== safeOldCat;
    });
    const rebuilt: Skill[] = names.map((name, i) => ({
      id: `skill_${Date.now()}_${groupId}_${i}`,
      name,
      level: 'intermediate',
      category: safeOldCat === uncategorizedLabel ? '' : safeOldCat,
      order: groupOrder,
    }));
    onChange([...outside, ...rebuilt]);
  };

  const deleteGroup = (groupId: string) => {
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    onChange(data.filter((sk) => {
      const category = sk.category?.trim() || uncategorizedLabel;
      return category !== group.cat;
    }));
  };

  const addGroup = () => {
    const maxOrder = Math.max(...groups.map((group) => group.order), -1);
    onChange([...data, {
      id: `skill_${Date.now()}`,
      name: '',
      level: 'intermediate',
      category: uncategorizedLabel,
      order: maxOrder + 1,
    }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{tEditor.skills}</h3>
        <button
          onClick={addGroup}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          {(t as any).addGroup || 'Add Group'}
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <p>{tEditor.add}</p>
          <button onClick={addGroup} className="mt-2 text-indigo-600 hover:text-indigo-700">
            + {(t as any).addGroup || 'Add Group'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group, idx) => {
            const isDragging = dragSrcIdx === idx;
            const isOver = dragOverIdx === idx && dragSrcIdx !== idx;
            return (
              <div
                key={group.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`grid grid-cols-[1rem_10rem_minmax(0,1fr)_2rem] items-center gap-2 bg-white border rounded-lg px-2 py-1.5 select-none ${
                  isDragging ? 'opacity-40' : ''
                } ${isOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}
              >
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <input
                  type="text"
                  defaultValue={group.cat === uncategorizedLabel ? '' : group.cat}
                  onBlur={(e) => updateCategory(group.id, group.cat, e.target.value)}
                  placeholder={tEditor.skills || 'Category'}
                  className="w-full min-w-0 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                />
                <input
                  type="text"
                  defaultValue={group.names.join(', ')}
                  onBlur={(e) => updateSkills(group.id, group.cat, e.target.value)}
                  placeholder="e.g. JavaScript, TypeScript, React"
                  className="w-full min-w-0 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="justify-self-center p-2 text-red-400 hover:text-red-600"
                  title="Delete group"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
