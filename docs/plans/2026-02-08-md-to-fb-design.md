# MD → FB Formatting Tool — Design Document

## Overview

A client-side tool that converts Markdown text into Facebook-optimized plain text with Unicode formatting, smart line spacing, and optional Pangu spacing for CJK content.

**URL**: `/text/md-to-fb`
**Tech**: Next.js 14 App Router + TypeScript + Tailwind + `marked`
**Cost**: Zero (pure frontend, no backend)

---

## Architecture

```
User input (textarea)
       |
       v  (debounce 150ms)
   marked.parse() with custom renderer
       |  receives symbolConfig based on active style
       |
       v
   Post-processing pipeline:
       |  1. ZWSP blank line preservation (always on)
       |  2. Pangu CJK spacing (toggle)
       |
       v
   Preview pane (plain text)
       |
       v  user clicks "Copy All"
   Clipboard API
```

---

## Module Structure

```
src/
├── app/
│   └── text/
│       └── md-to-fb/
│           └── page.tsx              # Page entry + SEO meta
│
├── components/
│   └── md-to-fb/
│       ├── Editor.tsx                # Two-column layout + state
│       ├── MarkdownInput.tsx         # Left: textarea
│       ├── FbPreview.tsx             # Right: preview + copy button
│       └── StyleSelector.tsx         # Style chips + Pangu toggle
│
├── lib/
│   ├── unicode-fonts.ts              # Unicode offset table + exceptions (shared with font-generator)
│   ├── fb-renderer.ts               # marked custom renderer (core conversion)
│   ├── symbol-configs.ts            # Three style symbol tables
│   ├── post-process.ts              # ZWSP + Pangu pipeline
│   └── clipboard.ts                 # Clipboard API wrapper
```

---

## Conversion Logic (fb-renderer.ts)

Uses `marked` with a custom renderer. Each Markdown token maps to plain text + Unicode output.

### Token Mapping

| Token | Output |
|-------|--------|
| `heading` (h1) | Style-dependent (see Style System below) |
| `heading` (h2) | Style-dependent |
| `heading` (h3) | Style-dependent |
| `list` (unordered) | Style-dependent bullet + text |
| `list` (ordered) | `1. 2. 3.` (all styles) |
| `blockquote` | Style-dependent prefix |
| `hr` | Style-dependent separator |
| `code` (fenced) | Each character → Monospace Unicode (U+1D670 range) |
| `codespan` (inline) | Each character → Monospace Unicode |
| `strong` | English → Sans-Serif Bold Unicode (U+1D5D4 range), CJK passthrough |
| `em` | English → Sans-Serif Italic Unicode (U+1D608 range), CJK passthrough |
| `strong + em` | English → Sans-Serif Bold Italic Unicode (U+1D63C range), CJK passthrough |
| `link` | `text (url)` plain text expansion |
| `image` | `[image: alt]` |
| `table` | Each row → key:value list (see Table Conversion) |
| `paragraph` | Direct text output + line break |

### Unicode Conversion

English letters (A-Z, a-z) and digits (0-9) are converted via offset calculation:

```
output = startCodePoint + (charCode - baseCharCode)
```

CJK characters (U+4E00-U+9FFF, U+3400-U+4DBF) always pass through unchanged.

Exception characters (e.g. Italic `h` → U+210E) are handled via a lookup map.

---

## Style System (symbol-configs.ts)

Three styles, **Structured** is the default.

### SymbolConfig Type

```typescript
type SymbolConfig = {
  h1: (text: string) => string
  h2: (text: string) => string
  h3: (text: string) => string
  listItem: (text: string) => string
  orderedItem: (n: number, text: string) => string
  blockquote: (text: string) => string
  hr: string
}
```

### Style Comparison

| Element | Minimal | **Structured (default)** | Social |
|---------|---------|--------------------------|--------|
| h1 | Unicode Bold + blank lines | 【title】 | ✸ title |
| h2 | Plain text + blank line | ▍title | ▸ title |
| h3 | Plain text | Plain text | Plain text |
| list (unordered) | • | - | → |
| list (ordered) | 1. 2. 3. | 1. 2. 3. | 1. 2. 3. |
| blockquote | 「text」 | ┃text | 💬 text |
| hr | ——— | ━━━━━━ | · · · |

---

## Table Conversion

Facebook has no table rendering. Tables convert to key:value format per row.

### Input

```markdown
| Name   | Price | Stock |
|--------|-------|-------|
| Apple  | $30   | 50    |
| Banana | $15   | 120   |
```

### Output (Structured style)

```
- Apple
  Name: Apple
  Price: $30
  Stock: 50

- Banana
  Name: Banana
  Price: $15
  Stock: 120
```

The first column value is used as the row label. Each subsequent column becomes a key:value pair with full-width space indentation.

Single-column tables degrade to a plain list.

---

## Post-Processing Pipeline (post-process.ts)

Runs after the renderer, in fixed order.

### 1. ZWSP Blank Line Preservation (always on)

Facebook compresses consecutive line breaks. Insert U+200B (Zero-Width Space) in blank lines to preserve spacing.

```
Input:  \n\n\n
Output: \n\u200B\n\u200B\n
```

### 2. Pangu CJK Spacing (toggle, off by default)

Insert half-width space between CJK characters and ASCII alphanumeric/symbols.

```
Input:  "I use Mac to write code"  → no change
Input:  "我用Mac寫code"            → "我用 Mac 寫 code"
```

Regex patterns:
```
/([\u4e00-\u9fff\u3400-\u4dbf])([\w])/g → "$1 $2"
/([\w])([\u4e00-\u9fff\u3400-\u4dbf])/g → "$1 $2"
```

---

## UI Components

### StyleSelector.tsx

Single row containing:
- Three style chips: 極簡 / **結構**（active default） / 社群
- Active chip: gold fill (#CA8A04) + white text
- Inactive chip: border + ink-600 text
- Pangu toggle button on the right side of the same row
- Toggle states: off (outlined) / on (gold fill)

### Editor.tsx (state management)

```typescript
State:
- markdownInput: string
- activeStyle: 'minimal' | 'structured' | 'social'
- panguEnabled: boolean
- copyFeedback: boolean (for "Copied!" flash)

Derived:
- fbOutput: computed from markdownInput + activeStyle + panguEnabled
```

### MarkdownInput.tsx

- Left column, textarea with monospace font (JetBrains Mono)
- Header bar: "Markdown Input" + hint text
- Max 5000 characters

### FbPreview.tsx

- Right column, rendered preview in Inter font
- Header bar: "FB Preview" + gold "Copy All" button
- Copy button shows "Copied!" for 1.5s after click
- Desktop: side-by-side with MarkdownInput
- Mobile: stacked below MarkdownInput

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty input | Preview shows placeholder hint text |
| Pure CJK bold `**Chinese**` | Remove `**` markers, CJK text unchanged |
| Input > 5000 chars | Truncate + show warning "Consider splitting into multiple posts" |
| Clipboard API unsupported | Fallback to `document.execCommand('copy')` |
| Single-column table | Degrade to plain list |
| Nested blockquote `>> text` | Process one level only, ignore nesting |
| Fenced code block (```) | Convert all characters to Monospace Unicode |

---

## Performance Requirements

- Real-time conversion < 16ms (60fps)
- Max input: 5000 characters
- Copy feedback < 100ms
- First contentful paint < 1s (static page)
- Debounce: 150ms on input change

---

## SEO Plan

**Meta Tags**:
```
Title: Markdown to FB Post Formatting — Convert Markdown to Facebook Text | FreeTools
Description: Free online Markdown to Facebook formatting tool. Supports bold, headings, lists, dividers. Paste Markdown, preview Facebook format, one-click copy.
H1: Markdown → FB Formatting Tool
```

**Schema Markup**: WebApplication + FAQPage + HowTo

**FAQ Topics**:
1. Can you bold text in FB posts?
2. Why doesn't Chinese bold text change?
3. What Markdown syntax is supported?

---

## Dependencies

| Package | Purpose | Size (gzipped) |
|---------|---------|----------------|
| `marked` | Markdown parser | ~12KB |
| (none others) | All conversion is custom code | — |

---

**Created**: 2026-02-08
**Status**: Approved (brainstorming complete)
**Next Step**: Implementation via superpowers:writing-plans
