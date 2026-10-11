/**
 * Shared design tokens for the resume templates.
 *
 * Type scale — one size per role, no ad-hoc sizes inside components:
 *   name       28px / 700  slate-900  candidate name
 *   title      17px / 500  accent     job title under the name
 *   section    17px / 700  slate-900  section headings (with underline rule)
 *   subsection 15px / 600  slate-700  sub headings inside a section
 *   position   16px / 700  slate-900  job position
 *   body       16px / 400  slate-900  body copy
 *   meta       14px / 400  slate-500  secondary metadata (website, address …)
 *
 * Vertical rhythm:
 *   section gap 20px · entry gap 14px · line gap 2px · block gap 6px
 *
 * The column widths below are mirrored as CSS custom properties in
 * src/index.css so the @media print rules in App.css stay in sync with the
 * on-screen layout (a mismatch there silently shifts the exported PDF).
 */

/** Left column of every dated entry (Experience / Education). */
export const entryDateColumn = "var(--resume-entry-col, 11rem)";
/** Gap between the date column and the content column. */
export const entryGap = "var(--resume-entry-gap, 1rem)";

export const fontSize = "16px";
export const metaFontSize = "14px";
export const fontColor = "text-slate-900";

export const singleColumnStyles = {
  name: { fontSize: "28px", fontWeight: "bold" as const, lineHeight: "1.2" },
  title: { fontSize: "17px", fontWeight: "500" as const },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    letterSpacing: "0.01em",
  },
  subTitle: { fontSize: "15px", fontWeight: "600" as const },
  body: { fontSize, fontWeight: "normal" as const },
  meta: { fontSize: metaFontSize, fontWeight: "normal" as const },
  /** Section heading rule + colour. Margin is owned by SectionTitle. */
  label: "font-bold text-slate-900 border-b border-slate-900 pb-1",
  /**
   * Horizontal padding is expressed in mm and matches the @page margin in
   * App.css, so the exported PDF breaks lines at exactly the same places as
   * the on-screen preview.
   */
  padding: "24px 10mm",
  /** Experience / Education: fixed date column so every entry lines up. */
  entryColumns: `${entryDateColumn} minmax(0, 1fr)`,
  entryGap,
  /**
   * Skills / contact: one track sized to the widest label, so labels and
   * values line up no matter how long the category names are. Capped at 40%
   * so one very long label can never squeeze the values off the page.
   */
  labelColumns: "fit-content(40%) minmax(0, 1fr)",
};