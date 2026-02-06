# Nexus Knowledge Hub - Design Concepts

**Date:** February 5, 2026
**Status:** Awaiting Review

---

## Current State vs. DeepVibe Brand

| Element | Current App | DeepVibe.com |
|---------|------------|--------------|
| **Background** | Slate-900 (`#0f172a`) - muted navy | True black (`#000000`) - bold, premium |
| **Primary Accent** | Indigo-600 (`#6366f1`) - generic blue | Magenta (`#E80ADE`) - distinctive, electric |
| **Headings Font** | System UI (default) | **Oswald** (200-700) - bold, architectural |
| **Body Font** | System UI (default) | **Lexend** (300-700) - modern, readable |
| **Logo** | Generic Brain icon | No custom mark yet |
| **Visual Motifs** | None | "/" slash dividers, 3D depth, halftone textures |
| **Personality** | Neutral tool | Futuristic, premium, tech-forward |

---

## Concept A: "The Vault"

> *Secure. Authoritative. Structured.*
> A place where knowledge is collected, protected, and precisely organized.

### Visual Identity

```
 ╔══════════════════════════════════════╗
 ║         N E X U S                   ║
 ║      KNOWLEDGE VAULT                ║
 ║  ◇━━━━━━━━━━━━━━━━━━━━━━◇          ║
 ╚══════════════════════════════════════╝
```

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--vault-black` | `#0A0A0A` | Page background — true black, premium feel |
| `--vault-surface` | `#141414` | Cards, panels — barely lifted off black |
| `--vault-surface-elevated` | `#1C1C1C` | Modals, dropdowns, sidebar |
| `--vault-border` | `#2A2A2A` | Subtle borders — structure without noise |
| `--vault-border-active` | `#3A3A3A` | Hover/focus borders |
| `--vault-magenta` | `#E80ADE` | Primary accent — buttons, active nav, links |
| `--vault-magenta-hover` | `#D000CC` | Hover state for primary actions |
| `--vault-magenta-glow` | `rgba(232,10,222,0.15)` | Subtle glow behind active elements |
| `--vault-magenta-subtle` | `rgba(232,10,222,0.08)` | Active nav item background |
| `--vault-text` | `#F5F5F5` | Primary text — crisp white |
| `--vault-text-secondary` | `#A0A0A0` | Secondary text — neutral gray |
| `--vault-text-muted` | `#666666` | Tertiary text — timestamps, counts |
| `--vault-success` | `#10B981` | Success states |
| `--vault-warning` | `#F59E0B` | Warning states |
| `--vault-error` | `#EF4444` | Error states |

### Typography

```css
/* Headlines: Oswald — bold, uppercase feel for structure */
--font-heading: 'Oswald', sans-serif;
/* Body: Lexend — optimized readability, modern */
--font-body: 'Lexend', sans-serif;
/* Code/Data: JetBrains Mono — for citations, metadata */
--font-mono: 'JetBrains Mono', monospace;
```

**Type Scale:**
| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Page title | Oswald | 500 | 28px | 0.02em |
| Section heading | Oswald | 400 | 20px | 0.01em |
| Card title | Lexend | 600 | 16px | normal |
| Body text | Lexend | 400 | 14px | normal |
| Caption/meta | Lexend | 300 | 12px | 0.01em |
| Chat message | Lexend | 400 | 15px | normal |
| Citation ref | JetBrains Mono | 400 | 12px | normal |

### Component Styling

**Sidebar:**
- Background: `--vault-surface` (`#141414`)
- Active item: Magenta left border (3px) + `--vault-magenta-subtle` background
- No rounded active backgrounds — use a sharp left edge accent (vault door aesthetic)
- Section headers in Oswald uppercase, letter-spaced

```
 ┃ ◆ NAVIGATE
 ┃
 ┃ ▌ Chat            ← magenta left border
 ┃   Sources
 ┃   Entities
 ┃   Glossary
 ┃   Insights
 ┃
 ┃ ◆ WORKSPACE
 ┃   Settings
```

**Cards (Source cards, Entity cards):**
- Background: `--vault-surface` with 1px `--vault-border`
- Hover: border transitions to `--vault-magenta` with faint glow
- No rounded corners on top — use `rounded-sm` (2px) for a structured, vault-like precision
- Status indicators as thin colored top-border strips

**Buttons:**
- Primary: Magenta background, white text, no border-radius flair — `rounded` (6px)
- Secondary: Transparent with magenta border, magenta text
- Ghost: No border, magenta text on hover
- All buttons use Lexend 500 weight

**Chat Interface:**
- User messages: Right-aligned, `--vault-surface-elevated` background
- Assistant messages: Left-aligned, `--vault-surface` with thin magenta left border
- Citations: Monospace `[1]` markers in magenta, expandable inline
- Input area: Dark input with magenta focus ring, prominent send button

**Login Page:**
- Centered vault door motif — geometric diamond/hexagon icon
- "NEXUS KNOWLEDGE VAULT" in Oswald 300, letter-spaced
- Thin magenta horizontal rule below title
- Form card with sharp borders, minimal decoration

### Visual Motifs
- **"/" Slash Dividers**: DeepVibe's signature — use between breadcrumb items and as decorative separators
- **Thin Magenta Rules**: Horizontal accent lines to separate sections (like vault compartments)
- **Geometric Precision**: Minimal border-radius, structured grid layouts, no organic shapes
- **Monospace Metadata**: Citation IDs, timestamps, source counts in mono font — feels like a catalog system

### Mood Board Keywords
`Structured` / `Secure` / `Precise` / `Authoritative` / `Premium Black` / `Electric Magenta` / `Catalog` / `Archive`

---

## Concept B: "The Knowledge Nexus"

> *Connected. Luminous. Exploratory.*
> A living network where knowledge flows, connects, and illuminates new discoveries.

### Visual Identity

```
     ·  ✦  ·
   ·  ╱    ╲  ·
  ·  ╱ NEXUS ╲  ·
   · ╲KNOWLEDGE╱ ·
    ·  ╲    ╱  ·
      ·  ✦  ·
```

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--nexus-deep` | `#080810` | Page background — near-black with blue undertone |
| `--nexus-surface` | `#111118` | Cards, panels — cool-tinted dark |
| `--nexus-surface-elevated` | `#1A1A24` | Modals, popovers |
| `--nexus-border` | `#252530` | Subtle borders — cool gray |
| `--nexus-border-active` | `#353545` | Hover/focus borders |
| `--nexus-magenta` | `#E80ADE` | Primary accent — inherited from DeepVibe |
| `--nexus-violet` | `#8B5CF6` | Secondary accent — discovery, entities |
| `--nexus-cyan` | `#06B6D4` | Tertiary accent — sources, data |
| `--nexus-gradient-start` | `#E80ADE` | Gradient origin — magenta |
| `--nexus-gradient-end` | `#8B5CF6` | Gradient terminus — violet |
| `--nexus-glow` | `rgba(232,10,222,0.12)` | Ambient glow effects |
| `--nexus-text` | `#EDEDF0` | Primary text — soft white |
| `--nexus-text-secondary` | `#9898A8` | Secondary text — cool gray |
| `--nexus-text-muted` | `#5A5A6E` | Tertiary text |
| `--nexus-success` | `#10B981` | Success states |
| `--nexus-warning` | `#F59E0B` | Warning states |
| `--nexus-error` | `#EF4444` | Error states |

### Typography

```css
/* Headlines: Oswald — same DeepVibe DNA */
--font-heading: 'Oswald', sans-serif;
/* Body: Lexend — clean and modern */
--font-body: 'Lexend', sans-serif;
/* Code: JetBrains Mono */
--font-mono: 'JetBrains Mono', monospace;
```

**Same type scale as Concept A** — the differentiation is in color and visual treatment, not typography.

### Component Styling

**Sidebar:**
- Background: `--nexus-surface` (`#111118`)
- Active item: Magenta-to-violet gradient left border (3px) + faint gradient background wash
- Icons get a subtle glow when active
- Section dividers use a faint gradient line (magenta→violet)

```
 ┃  ✦ Discover
 ┃
 ┃ ▌▌ Chat           ← gradient left border
 ┃    Sources
 ┃    Entities
 ┃    Glossary
 ┃    Insights
 ┃
 ┃  ✦ Workspace
 ┃    Settings
```

**Cards:**
- Background: `--nexus-surface` with 1px `--nexus-border`
- Hover: border shifts to a gradient (magenta→violet), card gets faint glow
- `rounded-lg` (8px) — softer than Vault, more approachable
- **Category color coding**: Sources = cyan accent, Entities = violet accent, Insights = magenta accent
- Subtle radial gradient in top-right corner of cards on hover (like a light source)

**Buttons:**
- Primary: Magenta-to-violet gradient background, white text
- Secondary: Transparent with gradient border (CSS border-image)
- Ghost: No border, gradient text on hover
- Hover effect: subtle glow expansion (box-shadow transition)

**Chat Interface:**
- User messages: Right-aligned, `--nexus-surface-elevated` with soft rounded corners
- Assistant messages: Left-aligned, with a faint gradient left border (magenta→violet)
- Citations: `[1]` markers use gradient text (magenta→violet), glow on hover
- Suggested follow-ups: Appear as glowing pill buttons below responses
- Input area: Gradient focus ring (magenta→violet), rounded-xl, floating above content with subtle shadow

**Login Page:**
- Centered nexus/constellation mark — interconnected dots with gradient lines
- "Nexus Knowledge" in Oswald 300 with gradient text treatment
- Subtle animated particle/dot background (CSS only, not heavy)
- Form card with gradient border accent on top edge
- "Your knowledge, connected" tagline in Lexend 300

### Visual Motifs
- **Gradient Accents**: Magenta→Violet gradient as the signature treatment on borders, text highlights, active states
- **Glow Effects**: Subtle ambient glows around active/focused elements — like nodes lighting up in a network
- **Connection Lines**: Thin gradient lines as section dividers (suggesting knowledge connections)
- **"/" Slash Dividers**: Preserved from DeepVibe brand, rendered in gradient
- **Color-Coded Domains**: Each content domain gets a subtle color identity:
  - Chat = Magenta (primary interaction)
  - Sources = Cyan (data/information)
  - Entities = Violet (discovery/relationships)
  - Insights = Amber (illumination)

### Mood Board Keywords
`Connected` / `Luminous` / `Discovery` / `Flowing` / `Neural` / `Gradient` / `Exploratory` / `Ambient Glow`

---

## Side-by-Side Comparison

| Aspect | Concept A: The Vault | Concept B: The Knowledge Nexus |
|--------|---------------------|-------------------------------|
| **Personality** | Authoritative, precise, secure | Exploratory, connected, luminous |
| **Background** | True black (`#0A0A0A`) | Deep black with blue tint (`#080810`) |
| **Accent System** | Single magenta accent | Magenta→Violet gradient system |
| **Border Radius** | Minimal (2-6px) — structured | Moderate (8px) — approachable |
| **Active States** | Sharp magenta left border | Gradient border + ambient glow |
| **Cards** | Precise, minimal, top-border status | Glowing hover, gradient accents, color-coded |
| **Buttons** | Flat magenta, clean edges | Gradient fill, glow on hover |
| **Chat** | Magenta left border on AI messages | Gradient left border + glow citations |
| **Login** | Geometric vault icon, stark | Constellation mark, gradient text, particles |
| **Content Domains** | Uniform magenta throughout | Color-coded per domain |
| **Feel** | "Opening a vault of knowledge" | "Exploring a network of ideas" |
| **Best For** | Enterprise/security/compliance focus | Creative agency/collaboration focus |

---

## Shared Elements (Both Concepts)

Regardless of which direction is chosen, both concepts share:

1. **DeepVibe Fonts**: Oswald (headings) + Lexend (body) + JetBrains Mono (data)
2. **DeepVibe Magenta** (`#E80ADE`) as the primary brand color
3. **Deep Black Base**: Moving away from current slate blues to true/near blacks
4. **"/" Slash Motif**: Inherited from deepvibe.com branding
5. **Premium Dark Mode**: No light theme — this is a professional tool with a bold aesthetic
6. **Product Name**: "Nexus Knowledge Hub" or variants per concept
7. **Typography System**: Oswald headings with generous letter-spacing

---

## Implementation Scope

Once a direction is chosen, the reskin touches:

| File/Area | Changes |
|-----------|---------|
| `src/index.css` | CSS variables, font imports, base styles |
| `src/components/common/Button.tsx` | Color classes, gradient support |
| `src/components/common/Card.tsx` | Background, border, hover treatment |
| `src/components/common/Input.tsx` | Focus ring color, background |
| `src/components/common/Modal.tsx` | Overlay, surface colors |
| `src/components/common/Badge.tsx` | Accent colors |
| `src/components/layout/Sidebar.tsx` | Active state, section headers |
| `src/components/layout/Header.tsx` | Background, workspace selector |
| `src/components/chat/FabricChat.tsx` | Message styling |
| `src/components/chat/MessageBubble.tsx` | Bubble colors |
| `src/components/chat/ChatInput.tsx` | Input styling |
| `src/components/chat/CitationPopover.tsx` | Citation accent colors |
| `src/components/sources/SourceCard.tsx` | Card treatment |
| `src/components/entities/EntityCard.tsx` | Card treatment |
| `src/pages/Login.tsx` | Logo, branding, card styling |
| `src/pages/Register.tsx` | Same as Login |
| `src/pages/WorkspaceList.tsx` | Workspace card styling |
| `tailwind.config` / `index.css` | Extended theme colors |

**Estimated effort**: Reskin only (no structural changes), focused on CSS variables + Tailwind class swaps.

---

**Decision Needed:** Which concept direction do you prefer?
