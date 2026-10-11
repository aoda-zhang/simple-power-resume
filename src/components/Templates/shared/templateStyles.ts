/**
 * Shared style constants for templates.
 * Unified: 16px base font, single color, bold titles.
 */

export const fontSize = "16px";
export const fontColor = "text-slate-900";
export const singleColumnStyles = {
  name: { fontSize: "30px", fontWeight: "bold" as const },
  title: { fontSize: "24px", fontWeight: "bold" as const },
  sectionTitle: { fontSize: "20px", fontWeight: "bold" as const },
  body: { fontSize, fontWeight: "normal" as const },
  label: "font-bold text-slate-900 border-b border-slate-900 pb-1 block mb-3",
  padding: "24px 36px",
};
