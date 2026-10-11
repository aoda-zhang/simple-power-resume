import { useResumeStore } from '../../store/resumeStore';
import { SingleColumnTemplate } from '../Templates/SingleColumnTemplate';
import { SectionEditor } from './SectionEditor';
import { FileImage, FileText, Globe, Layout } from 'lucide-react';
import { exportToPDF } from '../../utils/exportPdf';
import { exportToImage } from '../../utils/exportImage';
import { translations, type Language, type I18n } from '../../i18n';
import { useState } from 'react';

type TemplateId = 'single' | 'two';

const templates: { id: TemplateId; nameKey: string }[] = [
  { id: 'single', nameKey: 'singleColumn' }
];

const languages: { code: Language; name: string }[] = [
  { code: 'zh', name: 'Chinese' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

export function ResumeWorkspace() {
  const {
    language,
    setLanguage,
    fillSampleData,
    clearData,
    resumeData,
  } = useResumeStore();

  const [template, setTemplate] = useState<TemplateId>('single');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = translations[language] as I18n;

  /**
   * Build PDF filename from name and title.
   * Preserves original casing: "Aoda Zhang" + "Full-Stack Developer" → "Aoda-Zhang-Full-Stack-Developer.pdf"
   */
  const buildPdfFileName = (): string => {
    const name = (resumeData.personalInfo.fullName || '').trim();
    const title = (resumeData.personalInfo.title || '').trim();
    const toSlug = (s: string) =>
      s.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const parts = [toSlug(name), toSlug(title)].filter(Boolean);
    return parts.length > 0 ? parts.join('-') : 'resume';
  };

  const handleExportPDF = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToPDF(buildPdfFileName());
    }
  };

  const handleExportImage = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToImage(element as HTMLElement, `${buildPdfFileName()}.png`);
    }
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="h-screen flex bg-slate-100 gap-10">
      
      {/* Left editor panel — hidden when printing */}
      <div className="w-105 shrink-0 h-full flex flex-col bg-white border-r border-slate-200" data-no-print>
        
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-end">
            
            <div className="flex gap-2">
              <button
                onClick={fillSampleData}
                className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                {t.header.fillSample}
              </button>
              <button
                onClick={clearData}
                className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.header.clear}
              </button>
            </div>
          </div>
        </div>

        
        <SectionEditor />

        
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t.header.exportPdf}
            </button>
            <button
              onClick={handleExportImage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              {t.header.exportImage}
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex-1 h-full flex flex-col">
        
        <div className="px-6 py-3 bg-white border-b border-slate-200" data-no-print>
          <div className="flex items-center gap-6">
            {/* Template switcher */}
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-slate-500" />
              <div className="flex gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      template === tpl.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.template[tpl.nameKey as keyof I18n['template']] as string}
                  </button>
                ))}
              </div>
            </div>

            {/* Language switcher */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang?.name}</span>
              </button>
              {showLangDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 ${
                        language === lang.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="flex-1 overflow-auto bg-slate-200" data-print-wrapper>
          <div
            className="mx-auto bg-white shadow-lg"
            style={{
              width: '210mm',
              maxWidth: '210mm',
              boxSizing: 'border-box',
            }}
            data-resume-preview
          >
            {template === 'single' && <SingleColumnTemplate />}
          </div>
        </div>
      </div>
    </div>
  );
}
