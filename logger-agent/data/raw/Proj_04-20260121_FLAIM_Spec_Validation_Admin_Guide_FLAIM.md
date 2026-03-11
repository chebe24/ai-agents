# FLAIM File Naming Convention - Validation Specification v1.1

**Version:** 1.1  
**Last Updated:** 2026-01-21  
**Author:** Cary Hebert  
**Status:** ACTIVE

---

## 1. Overview

This document defines the complete validation rules for the FLAIM (French Language Academy International Magnet) file naming system. It serves as the authoritative source for:

- Structural regex pattern
- Routing constraints
- Type-to-extension mappings
- Prefix rules
- Date validation
- Edge case handling

---

## 2. Universal Pattern

All FLAIM files follow this structure:

```
[Prefix][Description]_[RootFolder]_[Type]_[Date][_Tag].[ext]
```

**Example:** `21-M4TBL9-11_Math_LP_2026-01-20.docx`

---

## 3. Structural Regex

### Primary Validation Regex

```regex
^(?:(00-|\d{2}-))?([A-Za-z0-9-]+)_(Math|Sci|SS|Fren|Admin|Data|Comm|Proj|Tmplt)_(LP|Annot|Guide|Pres|Wksht|Assmnt|Doc|Form|News|Corr|Rec|Code|Media|Sheet)_(\d{4}-\d{2}-\d{2})(?:_(rev01|rev02|v01|v02|draft|final))?\.([a-z0-9]+)$
```

### Captured Tokens

| Group | Token | Required | Format | Example |
|-------|-------|----------|--------|---------|
| 1 | `prefix` | Conditional | `00-` or `##-` (01-37) | `21-` |
| 2 | `description` | Yes | `[A-Za-z0-9-]+` | `M4TBL9-11` |
| 3 | `root` | Yes | See RootFolder codes | `Math` |
| 4 | `type` | Yes | See Type codes | `LP` |
| 5 | `date` | Yes | `YYYY-MM-DD` | `2026-01-20` |
| 6 | `tag` | No | Version/status tag | `final` |
| 7 | `ext` | Yes | Lowercase extension | `docx` |

---

## 4. Valid Codes

### 4.1 RootFolder Codes

| Code | Folder | Category |
|------|--------|----------|
| `Math` | 33_Math | Curriculum |
| `Sci` | 34_Sciences | Curriculum |
| `SS` | 35_SocialStudies | Curriculum |
| `Fren` | 36_French | Curriculum |
| `Admin` | 30_Administrative | Non-Curriculum |
| `Data` | 31_Data | Non-Curriculum |
| `Comm` | 32_Communication | Non-Curriculum |
| `Proj` | 02_Projects | Non-Curriculum |
| `Tmplt` | 01_Templates | Non-Curriculum |

### 4.2 Type Codes

| Code | Meaning | Typical Use |
|------|---------|-------------|
| `LP` | Lesson Plan | Daily/weekly lesson plans |
| `Annot` | Annotated | Annotated guides, marked-up docs |
| `Guide` | Guide | How-to docs, overviews, standards |
| `Pres` | Presentation | Slides, slideshows, flipcharts |
| `Wksht` | Worksheet | Student worksheets, practice sheets |
| `Assmnt` | Assessment | Tests, quizzes, rubrics, benchmarks |
| `Doc` | Document | General documents |
| `Form` | Form | Fillable forms |
| `News` | Newsletter | Weekly newsletters |
| `Corr` | Correspondence | Letters, flyers, invitations |
| `Rec` | Record | Certificates, credentials |
| `Code` | Code | Scripts, programs |
| `Media` | Media | Images, videos, audio |
| `Sheet` | Spreadsheet | Data files, trackers |

### 4.3 Tag Codes (Optional)

| Code | Use |
|------|-----|
| `rev01` | Revision 1 |
| `rev02` | Revision 2 |
| `v01` | Version 1 |
| `v02` | Version 2 |
| `draft` | Draft status |
| `final` | Final version |

---

## 5. Prefix Rules

### 5.1 Core Rule

| Type | Prefix Requirement |
|------|-------------------|
| `LP` (Lesson Plan) | **REQUIRED:** Week number `01-37` |
| `Annot` (Annotated) | **REQUIRED:** Week number `01-37` |
| All other types | **OPTIONAL:** `00-`, `01-37`, or none |

### 5.2 Prefix Validation Logic

```
IF type IN ("LP", "Annot"):
    prefix MUST exist
    prefix MUST be 01-37 (not 00-)
ELSE:
    prefix CAN be:
      - 00- (planning/reference)
      - 01-37 (week number)
      - missing (no prefix)
    ALL are valid
```

### 5.3 Valid Prefix Examples

| Filename | Valid? | Reason |
|----------|--------|--------|
| `21-M4TBL9_Math_LP_2026-01-20.docx` | ✅ | LP with required week prefix |
| `M4TBL9_Math_LP_2026-01-20.docx` | ❌ | LP missing required week prefix |
| `00-M4TBL9_Math_LP_2026-01-20.docx` | ❌ | LP cannot use 00- prefix |
| `21-M4TBL9_Math_Annot_2026-01-20.pdf` | ✅ | Annot with required week prefix |
| `M4TBL9_Math_Annot_2026-01-20.pdf` | ❌ | Annot missing required week prefix |
| `00-M4Overview_Math_Guide_2025-08-01.pdf` | ✅ | Guide with optional 00- prefix |
| `M4Overview_Math_Guide_2025-08-01.pdf` | ✅ | Guide with no prefix (valid) |
| `21-M4Overview_Math_Guide_2026-01-20.pdf` | ✅ | Guide with week prefix (valid) |
| `00-M4BenchmarkRubric_Math_Assmnt_2025-08-01.pdf` | ✅ | Assmnt with optional 00- |
| `21-M4Quiz_Math_Assmnt_2026-01-20.pdf` | ✅ | Assmnt with week prefix |
| `BullyingCert_Admin_Rec_2025-12-01.pdf` | ✅ | Rec with no prefix (valid) |
| `21-Thanksgiving_Fren_Pres_2026-01-20.pptx` | ✅ | Pres with optional week prefix |
| `Thanksgiving_Fren_Pres_2026-01-20.pptx` | ✅ | Pres with no prefix (valid) |

### 5.4 Week Number Range

- Valid range: `01` through `37`
- `00` is NOT a week number; `00-` indicates planning/reference
- Week numbers correspond to the 2025-2026 school year calendar

---

## 6. Routing Constraints (Hard Rules)

Certain Type codes are locked to specific RootFolder codes:

| Type | Required RootFolder | Error Message |
|------|---------------------|---------------|
| `Sheet` | `Data` | "Type Sheet must use RootFolder Data" |
| `News` | `Comm` | "Type News must use RootFolder Comm" |
| `Corr` | `Comm` | "Type Corr must use RootFolder Comm" |
| `Rec` | `Admin` | "Type Rec must use RootFolder Admin" |

### 6.1 Routing Validation Examples

| Filename | Valid? | Reason |
|----------|--------|--------|
| `ZearnExport_Data_Sheet_2026-01-15.xlsx` | ✅ | Sheet with Data |
| `ZearnExport_Math_Sheet_2026-01-15.xlsx` | ❌ | Sheet must use Data |
| `WeeklyNewsletter_Comm_News_2026-01-20.docx` | ✅ | News with Comm |
| `WeeklyNewsletter_Admin_News_2026-01-20.docx` | ❌ | News must use Comm |
| `BullyingCert_Admin_Rec_2025-12-01.pdf` | ✅ | Rec with Admin |
| `BullyingCert_Data_Rec_2025-12-01.pdf` | ❌ | Rec must use Admin |

---

## 7. Type-to-Extension Constraints

Each Type code has allowed file extensions:

| Type | Allowed Extensions |
|------|-------------------|
| `LP` | `docx`, `gdoc` |
| `Annot` | `pdf` |
| `Guide` | `pdf`, `docx`, `gdoc`, `md` |
| `Pres` | `pptx`, `ppt`, `gslides`, `key` |
| `Wksht` | `pdf`, `docx`, `gdoc` |
| `Assmnt` | `pdf`, `docx`, `gdoc`, `gform` |
| `Doc` | `pdf`, `docx`, `gdoc`, `txt`, `md` |
| `Form` | `pdf`, `docx`, `gdoc`, `gform` |
| `News` | `pdf`, `docx`, `gdoc`, `pub` |
| `Corr` | `pdf`, `docx`, `gdoc`, `pub` |
| `Rec` | `pdf`, `jpg`, `jpeg`, `png` |
| `Code` | `js`, `py`, `gs`, `html`, `css`, `json`, `sh` |
| `Media` | `jpg`, `jpeg`, `png`, `gif`, `webp`, `tif`, `tiff`, `heic`, `mp4`, `mov`, `m4v`, `avi`, `wmv`, `mp3`, `wav`, `m4a`, `aac`, `flac`, `aif`, `aiff`, `svg` |
| `Sheet` | `xlsx`, `xls`, `gsheet`, `csv`, `tsv` |

### 7.1 Extension Validation Examples

| Filename | Valid? | Reason |
|----------|--------|--------|
| `21-M4TBL9_Math_LP_2026-01-20.docx` | ✅ | LP with docx |
| `21-M4TBL9_Math_LP_2026-01-20.pdf` | ❌ | LP must be docx or gdoc |
| `21-M4TBL9_Math_Annot_2026-01-20.pdf` | ✅ | Annot with pdf |
| `21-M4TBL9_Math_Annot_2026-01-20.docx` | ❌ | Annot must be pdf |
| `ZearnExport_Data_Sheet_2026-01-15.xlsx` | ✅ | Sheet with xlsx |
| `ZearnExport_Data_Sheet_2026-01-15.pdf` | ❌ | Sheet must be xlsx/xls/gsheet/csv/tsv |

---

## 8. Date Validation

### 8.1 Format Rule

- Format: `YYYY-MM-DD`
- Must be a real calendar date

### 8.2 Invalid Date Examples

| Date | Valid? | Reason |
|------|--------|--------|
| `2026-01-21` | ✅ | Valid date |
| `2026-02-30` | ❌ | February 30 doesn't exist |
| `2026-13-01` | ❌ | Month 13 doesn't exist |
| `2026-1-21` | ❌ | Must be zero-padded (01) |
| `01-21-2026` | ❌ | Wrong format (MM-DD-YYYY) |

---

## 9. Week Calendar (2025-2026 School Year)

### 9.1 Week Number Reference

| Week | Start Date | End Date | Notes |
|------|------------|----------|-------|
| 00 | 2025-08-04 | 2025-08-08 | Professional Development |
| 01 | 2025-08-11 | 2025-08-15 | First week of school |
| 02 | 2025-08-18 | 2025-08-22 | |
| 03 | 2025-08-25 | 2025-08-29 | |
| 04 | 2025-09-01 | 2025-09-05 | Labor Day (Sep 1) |
| 05 | 2025-09-08 | 2025-09-12 | |
| 06 | 2025-09-15 | 2025-09-19 | |
| 07 | 2025-09-22 | 2025-09-26 | |
| 08 | 2025-09-29 | 2025-10-03 | |
| 09 | 2025-10-06 | 2025-10-10 | End Q1 (Oct 9) |
| 10 | 2025-10-13 | 2025-10-17 | Fall Break (Oct 20-21) |
| 11 | 2025-10-20 | 2025-10-24 | |
| 12 | 2025-10-27 | 2025-10-31 | |
| 13 | 2025-11-03 | 2025-11-07 | |
| 14 | 2025-11-10 | 2025-11-14 | |
| 15 | 2025-11-17 | 2025-11-21 | |
| -- | 2025-11-24 | 2025-11-28 | Thanksgiving Holiday |
| 16 | 2025-12-01 | 2025-12-05 | |
| 17 | 2025-12-08 | 2025-12-12 | |
| 18 | 2025-12-15 | 2025-12-19 | End Q2 (Dec 18) |
| -- | 2025-12-20 | 2026-01-04 | Winter Holiday |
| 19 | 2026-01-05 | 2026-01-09 | PD (Jan 5-6), S2 starts |
| 20 | 2026-01-12 | 2026-01-16 | |
| 21 | 2026-01-19 | 2026-01-23 | MLK Day (Jan 19) |
| 22 | 2026-01-26 | 2026-01-30 | |
| 23 | 2026-02-02 | 2026-02-06 | |
| 24 | 2026-02-09 | 2026-02-13 | |
| 25 | 2026-02-16 | 2026-02-20 | Mardi Gras (Feb 16-17) |
| 26 | 2026-02-23 | 2026-02-27 | |
| 27 | 2026-03-02 | 2026-03-06 | |
| 28 | 2026-03-09 | 2026-03-13 | End Q3 (Mar 13) |
| 29 | 2026-03-16 | 2026-03-20 | PD (Mar 16) |
| 30 | 2026-03-23 | 2026-03-27 | |
| 31 | 2026-03-30 | 2026-04-03 | Spring Break starts |
| -- | 2026-04-03 | 2026-04-10 | Spring Break Holiday |
| 32 | 2026-04-13 | 2026-04-17 | |
| 33 | 2026-04-20 | 2026-04-24 | |
| 34 | 2026-04-27 | 2026-05-01 | |
| 35 | 2026-05-04 | 2026-05-08 | |
| 36 | 2026-05-11 | 2026-05-15 | |
| 37 | 2026-05-18 | 2026-05-22 | Last day (May 20) |

### 9.2 Holiday Week Handling

Files created during holiday breaks should use the **next instructional week** as their prefix.

| Holiday Period | File Created | Use Week |
|----------------|--------------|----------|
| Thanksgiving (Nov 24-28) | 2025-11-25 | `16-` |
| Winter Break (Dec 20 - Jan 4) | 2025-12-28 | `19-` |
| Spring Break (Apr 3-10) | 2026-04-07 | `32-` |

---

## 10. Edge Cases

### 10.1 Multiple Files Same Day

Use optional `tag` suffix to differentiate versions:

| Scenario | Filename |
|----------|----------|
| First version | `21-M4TBL9_Math_LP_2026-01-20.docx` |
| Revision 1 | `21-M4TBL9_Math_LP_2026-01-20_rev01.docx` |
| Final version | `21-M4TBL9_Math_LP_2026-01-20_final.docx` |

### 10.2 Cross-Module Content

When content spans multiple modules, use the **primary** module in description:

| Scenario | Filename |
|----------|----------|
| M4 review including M3 content | `21-M4Review_Math_LP_2026-01-20.docx` |
| M3-M4 transition lesson | `21-M3M4Transition_Math_LP_2026-01-20.docx` |

### 10.3 Cross-Curricular Content

Use the **primary instructional focus** as RootFolder:

| Scenario | RootFolder | Filename |
|----------|------------|----------|
| French animal vocabulary (French focus) | `Fren` | `21-AnimauxScience_Fren_LP_2026-01-20.docx` |
| Science lesson in French (Science focus) | `Sci` | `21-U2C3Animals_Sci_LP_2026-01-20.docx` |

### 10.4 French Accented Characters

Remove accents in filenames:

| Original | In Filename |
|----------|-------------|
| Pâques | `Paques` |
| Noël | `Noel` |
| Français | `Francais` |
| Ça va | `Cava` |
| L'heure | `Lheure` |
| Cœur | `Coeur` |

### 10.5 Hyphens in Description

Hyphens are **allowed** in the description field for:
- Lesson ranges: `L9-11`
- Module-Topic-Lesson codes: `M4TBL9-11`

Hyphens are **not** general-purpose separators. Use CamelCase instead:

| Wrong | Correct |
|-------|---------|
| `End-of-Year` | `EndOfYear` |
| `Back-to-School` | `BackToSchool` |

---

## 11. Reserved Names & Special Characters

### 11.1 Prohibited Characters

| Character | Status |
|-----------|--------|
| Space | ❌ Prohibited |
| Underscore in description | ❌ Prohibited (reserved as separator) |
| `< > : " / \ | ? *` | ❌ Prohibited (filesystem) |
| Accented characters | ❌ Prohibited (remove accents) |

### 11.2 Windows Reserved Names

Reject these as standalone tokens (rare but guards against edge failures):

```
CON, PRN, AUX, NUL, COM1-COM9, LPT1-LPT9
```

### 11.3 Trailing Character Rules

| Rule | Example |
|------|---------|
| No trailing period | `file._Math_LP_2026-01-20.docx` ❌ |
| No trailing space | `file _Math_LP_2026-01-20.docx` ❌ |

---

## 12. Validator Function Specification

### 12.1 Input

```
filename: string (e.g., "21-M4TBL9_Math_LP_2026-01-20.docx")
```

### 12.2 Output

```javascript
{
  isValid: boolean,
  tokens: {
    prefix: string | null,    // "21-" or "00-" or null
    description: string,      // "M4TBL9"
    root: string,             // "Math"
    type: string,             // "LP"
    date: string,             // "2026-01-20"
    tag: string | null,       // "final" or null
    ext: string               // "docx"
  },
  errors: [
    {
      code: string,           // "MISSING_PREFIX"
      message: string,        // "Type LP requires week prefix (01-37)"
      suggestedFix: string    // "Add prefix: 21-M4TBL9_Math_LP_2026-01-20.docx"
    }
  ]
}
```

### 12.3 Error Codes

| Code | Condition |
|------|-----------|
| `INVALID_STRUCTURE` | Doesn't match base regex |
| `MISSING_PREFIX` | LP/Annot without prefix |
| `INVALID_PREFIX_FOR_TYPE` | LP/Annot with 00- prefix |
| `INVALID_WEEK_NUMBER` | Prefix outside 00-37 |
| `INVALID_ROOT` | Unknown RootFolder code |
| `INVALID_TYPE` | Unknown Type code |
| `ROUTING_VIOLATION` | Sheet/News/Corr/Rec in wrong folder |
| `INVALID_EXTENSION` | Extension not allowed for Type |
| `INVALID_DATE` | Date doesn't exist |
| `RESERVED_NAME` | Uses Windows reserved name |
| `INVALID_CHARACTERS` | Contains prohibited characters |

---

## 13. Auto-Suggest Rename Logic

When validation fails, generate corrected filename:

### 13.1 Routing Fixes

| Error | Auto-Fix |
|-------|----------|
| `Sheet` not in `Data` | Change root to `Data` |
| `News` not in `Comm` | Change root to `Comm` |
| `Corr` not in `Comm` | Change root to `Comm` |
| `Rec` not in `Admin` | Change root to `Admin` |

### 13.2 Extension Fixes

| Error | Auto-Fix |
|-------|----------|
| `LP` with `.pdf` | Suggest `.docx` |
| `Annot` with `.docx` | Suggest `.pdf` |
| `Sheet` with `.pdf` | Suggest `.xlsx` |

### 13.3 Prefix Fixes

| Error | Auto-Fix |
|-------|----------|
| `LP` missing prefix | Add week number based on date |
| `Annot` missing prefix | Add week number based on date |
| `LP` with `00-` | Change to week number based on date |

---

## 14. Test Cases

### 14.1 Valid Filenames (Should Pass)

```
21-M4TBL9-11_Math_LP_2026-01-20.docx
21-M4TBL9_Math_Annot_2026-01-20.pdf
00-M4Overview_Math_Guide_2025-08-01.pdf
M4Overview_Math_Guide_2025-08-01.pdf
21-M4Overview_Math_Guide_2026-01-20.pdf
00-M4BenchmarkRubric_Math_Assmnt_2025-08-01.pdf
21-M4Quiz_Math_Assmnt_2026-01-20.pdf
21-U2C3L5_Sci_LP_2026-01-20.docx
21-U1C7Culture_SS_LP_2026-01-19.docx
21-Thanksgiving_Fren_Pres_2026-01-20.pptx
Thanksgiving_Fren_Pres_2026-01-20.pptx
21-WeeklyNewsletter_Comm_News_2026-01-20.docx
WeeklyNewsletter_Comm_News_2026-01-20.docx
BullyingCert_Admin_Rec_2025-12-01.pdf
ZearnExport_Data_Sheet_2026-01-15.xlsx
EdAssistPRD_Proj_Doc_2026-01-15.docx
WeeklyLP_Tmplt_Doc_2025-08-01.docx
21-M4TBL9_Math_LP_2026-01-20_final.docx
21-M4TBL9_Math_LP_2026-01-20_rev01.docx
```

### 14.2 Invalid Filenames (Should Fail)

| Filename | Error Code |
|----------|------------|
| `M4TBL9_Math_LP_2026-01-20.docx` | `MISSING_PREFIX` |
| `00-M4TBL9_Math_LP_2026-01-20.docx` | `INVALID_PREFIX_FOR_TYPE` |
| `M4TBL9_Math_Annot_2026-01-20.pdf` | `MISSING_PREFIX` |
| `00-M4TBL9_Math_Annot_2026-01-20.pdf` | `INVALID_PREFIX_FOR_TYPE` |
| `21-M4TBL9_Math_LP_2026-01-20.pdf` | `INVALID_EXTENSION` |
| `21-M4TBL9_Math_Annot_2026-01-20.docx` | `INVALID_EXTENSION` |
| `ZearnExport_Math_Sheet_2026-01-15.xlsx` | `ROUTING_VIOLATION` |
| `WeeklyNewsletter_Admin_News_2026-01-20.docx` | `ROUTING_VIOLATION` |
| `BullyingCert_Data_Rec_2025-12-01.pdf` | `ROUTING_VIOLATION` |
| `21-M4TBL9_Math_LP_2026-02-30.docx` | `INVALID_DATE` |
| `40-M4TBL9_Math_LP_2026-01-20.docx` | `INVALID_WEEK_NUMBER` |
| `21-M4TBL9_Mathx_LP_2026-01-20.docx` | `INVALID_ROOT` |
| `21-M4TBL9_Math_LPx_2026-01-20.docx` | `INVALID_TYPE` |

---

## 15. Implementation Checklist

- [ ] **Step 1:** Freeze this spec as authoritative reference
- [ ] **Step 2:** Build rules map dictionary (typeToAllowedExt, typeToForcedRoot)
- [ ] **Step 3:** Implement validator function with error messages
- [ ] **Step 4:** Build week calendar resolver (dateToWeekNumber)
- [ ] **Step 5:** Add auto-suggest rename feature
- [ ] **Step 6:** Create test suite (~25 test cases)
- [ ] **Step 7:** Operationalize (GAS, Hazel, or Python)

---

## 16. Quick Reference Card

### Pattern
```
[Prefix][Description]_[RootFolder]_[Type]_[Date][_Tag].[ext]
```

### Prefix Rules
- `LP` and `Annot` → **REQUIRE** week prefix (`01-37`)
- All other types → prefix **OPTIONAL** (`00-`, `01-37`, or none)

### Routing Rules
- `Sheet` → must use `Data`
- `News` / `Corr` → must use `Comm`
- `Rec` → must use `Admin`

### RootFolder Codes
`Math` | `Sci` | `SS` | `Fren` | `Admin` | `Data` | `Comm` | `Proj` | `Tmplt`

### Type Codes
`LP` | `Annot` | `Guide` | `Pres` | `Wksht` | `Assmnt` | `Doc` | `Form` | `News` | `Corr` | `Rec` | `Code` | `Media` | `Sheet`

---

*Document generated: 2026-01-21*
*Next review: As needed when rules change*
