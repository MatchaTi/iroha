# Token Generator

> Create Design Systems Variables and Styles Quickly

Token Generator is a Figma plugin that turns a structured design-system JSON export into a ready-to-use Figma foundation: color variables, paint styles, typography styles, corner variables, shadow styles, and token-driven component sets.

It is built for the Iroha design-system workflow: define the system once in the web editor, export the project JSON, then generate the matching Figma library in one import.

---

## Figma Community listing

Copy-paste values for the Figma Community publish form.

### Name

```text
Token Generator
```

### Tagline

```text
Create Design Systems Variables and Styles Quickly
```

### Category

Suggested: **Design systems**

Alternative: **Developer tools**

### Tags

```text
design system, design tokens, variables, styles, components, automation, json, figma library
```

### Description — plain text

```text
Token Generator turns a design-system JSON export into a complete Figma foundation in one import. Instead of creating variables, styles, and components by hand, paste your project JSON and the plugin builds a structured, token-driven design system on the current Figma page.

WHAT YOU GET
- Color variables and paint styles for every palette and shade
- Typography text styles with live previews
- Corner radius variables and shadow effect styles
- Button, Input, Textarea, Badge, Checkbox, Radio, Switch, and Slider component sets
- Auto layout components with token colors, radius, padding, and shadows
- Text layers bound to typography styles, so token changes flow through the system
- Label text exposed as component properties where supported

HOW IT WORKS
1. Create or open a design-system project in Iroha.
2. Export the project JSON, or copy it to the clipboard.
3. Run Token Generator in Figma and paste the JSON.
4. Click Import. The plugin builds the design system on the current page and closes.

WHO IT IS FOR
Design system designers, product designers, and design engineers who want a consistent Figma library generated from a single source of truth.

GOOD TO KNOW
- The plugin works offline and does not send your data anywhere.
- It writes to the current page and does not delete existing content.
- Missing fonts fall back to Inter so the import can continue.
- Components are generated only when the matching design configuration exists in the JSON.

Build once. Keep your tokens and components in sync.
```

### Description — Markdown version

```markdown
Token Generator turns a design-system JSON export into a complete Figma foundation in one import. Instead of creating variables, styles, and components by hand, paste your project JSON and the plugin builds a structured, token-driven design system on the current Figma page.

## What you get

- Color variables and paint styles for every palette and shade
- Typography text styles with live previews
- Corner radius variables and shadow effect styles
- Button, Input, Textarea, Badge, Checkbox, Radio, Switch, and Slider component sets
- Auto layout components with token colors, radius, padding, and shadows
- Text layers bound to typography styles, so token changes flow through the system
- Label text exposed as component properties where supported

## How it works

1. Create or open a design-system project in Iroha.
2. Export the project JSON, or copy it to the clipboard.
3. Run Token Generator in Figma and paste the JSON.
4. Click Import. The plugin builds the design system on the current page and closes.

## Who it is for

Design system designers, product designers, and design engineers who want a consistent Figma library generated from a single source of truth.

## Good to know

- The plugin works offline and does not send your data anywhere.
- It writes to the current page and does not delete existing content.
- Missing fonts fall back to Inter so the import can continue.
- Components are generated only when the matching design configuration exists in the JSON.

Build once. Keep your tokens and components in sync.
```

---

## Features

- **One-import setup** — generate tokens and components from a single JSON payload.
- **Variables and styles** — creates real Figma variables, paint styles, text styles, and effect styles.
- **Token-driven components** — colors, radius, padding, borders, and shadows come from the imported tokens.
- **Typography binding** — component text layers use the generated Figma text styles.
- **Component properties** — editable label text is exposed as component properties where supported.
- **Structured canvas** — every part of the system is placed in its own labeled section frame.
- **Offline by design** — the manifest declares no network access.

## What gets generated

| Section | Output |
| --- | --- |
| Header | Project name and description |
| Typography | Text styles plus a typography specimen frame |
| Color Palette | `Colors` variable collection, paint styles, and palette showcase |
| Corner | `Corner` float variable collection and radius showcase |
| Shadow | Effect styles and shadow showcase |
| Button | Component set for every variant × size combination |
| Input | Component set for every input state |
| Textarea | Component set for every textarea state |
| Badge | Component set for every badge variant |
| Checkbox | Component set for every checkbox state |
| Radio | Component set for every radio state |
| Switch | Component set for every switch state |
| Slider | Component set for track fill values |

Component sets are generated only when the corresponding design configuration exists in the JSON.

### Component details

- **Button** — variant and size combinations, label component property, link underline support.
- **Input** — label, placeholder, and helper text; label/helper use typography fallbacks.
- **Textarea** — multi-line field with a token-driven minimum height, plus label and helper text.
- **Badge** — per-variant colors, radius, padding, typography, and shadow.
- **Checkbox** — default, checked, indeterminate, and disabled states.
- **Radio** — default, checked, and disabled states.
- **Switch** — default, checked, and disabled states.
- **Slider** — track background, range fill, and thumb rendered at 0/25/50/75/100%.

## Quick start

1. Open your project in Iroha.
2. Open the project details page and use **Copy design tokens** or **Export design tokens**.
3. In Figma, run **Token Generator** from the plugins menu.
4. Paste the JSON into the plugin window.
5. Click **Import**.

The plugin creates the design system on the current page and closes automatically.

> Tip: run the plugin in a new Figma file or on a dedicated design-system page. It adds content to the current page and does not remove existing layers.

## JSON input

The plugin expects the project JSON exported by the Iroha web app.

### Top-level schema

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Project name, used in the header section |
| `description` | `string` | No | Project description, shown in the header |
| `templateColorPalette` | `"one" \| "two"` | No | Color showcase layout |
| `templateTypography` | `"one" \| "two"` | No | Typography showcase layout |
| `colorPalette` | `ColorPalette[]` | No | Color palettes and shades |
| `typography` | `Typography[]` | No | Typography tokens |
| `corner` | `Corner[]` | No | Corner radius tokens |
| `shadow` | `Shadow[]` | No | Shadow tokens |
| `designButton` | `object` | No | Button variants, sizes, and shared tokens |
| `designInput` | `DesignInput[]` | No | Input states |
| `designTextarea` | `DesignTextarea[]` | No | Textarea states |
| `designBadge` | `DesignBadge[]` | No | Badge variants |
| `designCheckbox` | `DesignCheckbox[]` | No | Checkbox states |
| `designRadio` | `DesignRadio[]` | No | Radio states |
| `designSwitch` | `DesignSwitch[]` | No | Switch states |
| `designSlider` | `DesignSlider` | No | Slider geometry and colors |

### Token reference format

Color values use one of these forms:

```text
primary::500     // palette purpose + shade level
transparent      // no fill
#2563EB          // raw hex, used as-is
```

Other design values reference tokens by ID:

```text
cornerId       → id from corner[]
shadowId       → id from shadow[] or "none"
typographyId   → id from typography[]
```

### Minimal example

This example generates the foundation sections. Add the `design*` fields to generate component sets too.

```json
{
  "name": "Acme Design System",
  "description": "Core tokens and components for Acme products.",
  "templateColorPalette": "one",
  "templateTypography": "one",
  "colorPalette": [
    {
      "id": "palette-primary",
      "name": "Primary",
      "purpose": "primary",
      "colors": [
        { "level": "50", "hex": "#EFF6FF", "rgb": "rgb(239, 246, 255)" },
        { "level": "500", "hex": "#3B82F6", "rgb": "rgb(59, 130, 246)" },
        { "level": "900", "hex": "#1E3A8A", "rgb": "rgb(30, 58, 138)" }
      ]
    }
  ],
  "typography": [
    {
      "id": "type-label-large",
      "name": "Label Large",
      "purpose": "label",
      "level": "large",
      "fontFamily": "Inter Variable",
      "fontSize": 14,
      "fontWeight": "Medium",
      "lineHeight": 20,
      "letterSpacing": 0.1
    }
  ],
  "corner": [
    { "id": "corner-md", "name": "Medium", "radius": 8 }
  ],
  "shadow": [
    {
      "id": "shadow-sm",
      "name": "Small",
      "x": 0,
      "y": 1,
      "blur": 2,
      "spread": 0,
      "color": "rgba(0, 0, 0, 0.08)"
    }
  ]
}
```

## How tokens are applied

- **Colors** — each shade gets a paint style. When variables are available, the paint style and component fills are bound to a `Colors` variable.
- **Typography** — each typography token becomes a text style named `Purpose/Level · Name`, and component text layers are bound to it.
- **Labels without a typography token** — Checkbox, Radio, and Switch use the first available style from `Label Large → Label Medium → Body Medium`.
- **Input label and helper** — prefer `Label Large` and `Body Small`, falling back to the input typography token.
- **Corner** — creates float variables plus a visual reference; component radius uses the resolved token value.
- **Shadow** — creates effect styles and a visual reference; components apply the resolved shadow values.

## Fonts

Typography tokens may use variable-font family names such as `Inter Variable`, `Google Sans Flex Variable`, or `Source Code Pro Variable`.

The plugin tries the original family, then common Figma family names without the `Variable` suffix. If no match is available, it falls back to **Inter Regular** so the import can continue.

For the best result, install the fonts used by your design system in Figma before importing.

## Privacy

- The plugin declares `networkAccess.allowedDomains: ["none"]`.
- Your JSON is processed locally inside Figma.
- No project data is uploaded or shared.

## Development

```bash
cd token-importer
npm install
npm run build
```

Or with Bun:

```bash
cd token-importer
bun install
bun x tsc -p tsconfig.json
```

The Figma manifest loads `code.js`, so rebuild after editing `code.ts`.

### Project structure

```text
token-importer/
├── code.ts        # Plugin logic: tokens, styles, variables, components
├── code.js        # Compiled plugin entry point used by manifest.json
├── ui.html        # Paste-JSON interface
├── manifest.json  # Figma plugin manifest
└── tsconfig.json  # TypeScript configuration
```

### Adding it to Figma

1. Open **Figma → Plugins → Development → Import plugin from manifest…**
2. Select `token-importer/manifest.json`.
3. Run **Token Generator** from the development plugins menu.

## Troubleshooting

| Problem | Solution |
| --- | --- |
| “Invalid JSON” in the plugin window | Validate the JSON and make sure the full project export was pasted |
| No components were created | The JSON must include the matching `designButton`, `designInput`, `designBadge`, etc. |
| A component label uses a different font | The token font was unavailable; install it in Figma or rely on the Inter fallback |
| Nothing appears on the canvas | Check that the plugin is running on the intended page; content is added to the current page |
| “Gagal: …” notification | Read the message, fix the referenced token or font, and run the plugin again |

## License

No license is currently declared in `package.json`. Add one before distributing the plugin publicly.
