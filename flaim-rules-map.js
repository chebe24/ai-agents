/**
 * flaim-rules-map.js
 * FLAIM V6 Naming Convention — Runtime Rules Map
 *
 * SOURCE OF TRUTH: pattern-registry.yaml
 * This file must be kept in sync with pattern-registry.yaml manually.
 * When pattern-registry.yaml changes, update this file to match.
 *
 * Version: 6.0
 * Last Updated: 2026-03-10
 * Maintainer: chebe24
 * Repository: nexus-command
 */

// ============================================================
// SUBJECT CODES
// Canonical subject codes used in filenames and routing logic.
// ============================================================
const SUBJECT_CODES = {
  Math:  { label: "Mathematics",              curriculum: "Eureka Math²" },
  Sci:   { label: "Science",                  curriculum: "Amplify Science" },
  SS:    { label: "Social Studies",           curriculum: "Gallopade" },
  Fren:  { label: "French Immersion",         curriculum: null },
  Comm:  { label: "Communications / Newsletter", curriculum: null },
};

// ============================================================
// FILE TYPES
// ============================================================
const FILE_TYPES = {
  LP:    { label: "Lesson Plan" },
  Annot: { label: "Annotated Document" },
  News:  { label: "Newsletter" },
  PDF:   { label: "Generic PDF" },
};

// ============================================================
// DATE PREFIX
// Format: ##-####-##-##  (e.g. 01-2026-08-15)
// No W or Wk prefix allowed.
// ============================================================
const DATE_PREFIX_REGEX = /^\d{2}-\d{4}-\d{2}-\d{2}$/;

// ============================================================
// PATTERN REGISTRY
// Each entry maps to a pattern in pattern-registry.yaml.
// full_regex tests the complete filename including extension.
// ============================================================
const PATTERNS = {

  // --- GENERAL ---
  general: {
    label:       "General Files (non-LP)",
    subject:     "Any",
    filetype:    "Any (except LP, Annot, News)",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_[A-Za-z0-9]+_[A-Za-z0-9]+_[A-Za-z0-9]+\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Sci_PDF_ProjectNotes.pdf",
  },

  general_lp: {
    label:       "General Lesson Plan (non-subject-specific)",
    subject:     "Any",
    filetype:    "LP",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_[A-Za-z0-9]+_LP_[A-Za-z0-9]+L\d{2}-\d{2}\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_ELA_LP_ReadingL03-02.pdf",
  },

  // --- MATH ---
  math_lp: {
    label:       "Math Lesson Plan",
    subject:     "Math",
    filetype:    "LP",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_Math_LP_M\dT(LA|[A-F])L\d{2}-\d{2}\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Math_LP_M2TAL03-02.pdf",
    notes:       "M=Module, T=Topic marker, Letter=A-F or LA, L##-##=Lesson range",
  },

  math_annot: {
    label:       "Math Annotated Lesson",
    subject:     "Math",
    filetype:    "Annot",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_Math_Annot_M\dT(LA|[A-F])L\d{2}\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Math_Annot_M2TAL03.pdf",
    notes:       "Same as math_lp but ends with single L## (no dash-range)",
  },

  // --- SCIENCE ---
  sci_lp: {
    label:       "Science Lesson Plan",
    subject:     "Sci",
    filetype:    "LP",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_Sci_LP_U\dC\dL\d{2}-\d{2}\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Sci_LP_U2C3L04-01.pdf",
    notes:       "U=Unit, C=Chapter, L##-##=Lesson range",
  },

  // --- SOCIAL STUDIES ---
  ss_lp: {
    label:       "Social Studies Lesson Plan",
    subject:     "SS",
    filetype:    "LP",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_SS_LP_U\dC\dL\d{2}-\d{2}\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_SS_LP_U1C2L03-01.pdf",
    notes:       "Identical structure to sci_lp",
  },

  // --- FRENCH ---
  fren_lp: {
    label:       "French Immersion Lesson Plan",
    subject:     "Fren",
    filetype:    "LP",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_Fren_LP_[A-Za-z0-9]+\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Fren_LP_MardiGras2.pdf",
    notes:       "Free alphanumeric topic name — cultural/thematic (e.g. Noel1, Nombres0A10)",
  },

  // --- COMMUNICATIONS ---
  comm_news: {
    label:       "Weekly Newsletter",
    subject:     "Comm",
    filetype:    "News",
    full_regex:  /^\d{2}-\d{4}-\d{2}-\d{2}_Comm_News_HebertA113\.[a-z]{2,4}$/,
    example:     "01-2026-08-15_Comm_News_HebertA113.pdf",
    notes:       "Fixed description. Only the date prefix changes per issue.",
  },

};

// ============================================================
// DEPRECATION TRIGGERS
// Filenames matching any of these conditions should be
// flagged and moved to 03_History archive.
// ============================================================
const DEPRECATION_TRIGGERS = [
  "Missing date prefix",
  "Uses W## or Wk##-YYMMDD format (v5)",
  "Contains spaces in filename",
  "Contains accents or special characters in description",
  "Uses dashes or underscores inside description field",
  "Missing SubjectCode field",
];

// ============================================================
// EXPORTS (Node.js / GAS compatibility)
// ============================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SUBJECT_CODES, FILE_TYPES, DATE_PREFIX_REGEX, PATTERNS, DEPRECATION_TRIGGERS };
}
