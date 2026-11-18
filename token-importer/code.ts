/// <reference path="./node_modules/@figma/plugin-typings/index.d.ts" />

// ─────────────────────────────────────────────────────────────────────────────
// Iroha Token Importer — adapted to the current iroha web design model.
//
// Payload (from "Export to Figma" in the web app):
// {
//   format: "iroha-design-system",
//   version: 2,
//   name: string,
//   description: string,
//   tokens: Record<string, { light: string, dark?: string }>,  // 32 shadcn (dark ignored)
//   tokens, hex (#RRGGBB / #RRGGBBAA), keys in kebab-case
//   typography: { sans: string | null, serif: string | null, mono: string | null },
//   radius: number | null,        // rem
//   shadow: { color, opacity, x, y, blur, spread } | null,
// }
//
// Generates:
//   · "Design Tokens" variables collection with a single Light mode (32 colors)
//   · One paint style per token, bound to its variable
//   · Text styles (Heading / Body / Serif / Mono) from the design typography
//   · A radius variable + corner preview tiers
//   · Effect styles for the shadow tiers (sm/md/lg/xl) + previews
//   · Tailwind primitives: the full v4 color palette and spacing scale as variables
//   · Button & Badge component sets bound to the color variables
//   · The rest of the shadcn/ui component library as Figma component sets
// ─────────────────────────────────────────────────────────────────────────────

// ---------- Tailwind v4 primitives ----------
// Palette values are converted from Tailwind v4's oklch() definitions to sRGB.
var TAILWIND_SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

var TAILWIND_COLORS: Array<{ name: string; shades: string[] }> = [
  { name: "slate", shades: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cad5e2", "#90a1b9", "#62748e", "#45556c", "#314158", "#1d293d", "#0f172b", "#020618"] },
  { name: "gray", shades: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5dc", "#99a1af", "#6a7282", "#4a5565", "#364153", "#1e2939", "#101828", "#030712"] },
  { name: "zinc", shades: ["#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#9f9fa9", "#71717b", "#52525c", "#3f3f46", "#27272a", "#18181b", "#09090b"] },
  { name: "neutral", shades: ["#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a1a1a1", "#737373", "#525252", "#404040", "#262626", "#171717", "#0a0a0a"] },
  { name: "stone", shades: ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a6a09b", "#79716b", "#57534d", "#44403b", "#292524", "#1c1917", "#0c0a09"] },
  { name: "mauve", shades: ["#fafafa", "#f3f1f3", "#e7e4e7", "#d7d0d7", "#a89ea9", "#79697b", "#594c5b", "#463947", "#2a212c", "#1d161e", "#0c090c"] },
  { name: "olive", shades: ["#fbfbf9", "#f4f4f0", "#e8e8e3", "#d8d8d0", "#abab9c", "#7c7c67", "#5b5b4b", "#474739", "#2b2b22", "#1d1d16", "#0c0c09"] },
  { name: "mist", shades: ["#f9fbfb", "#f1f3f3", "#e3e7e8", "#d0d6d8", "#9ca8ab", "#67787c", "#4b585b", "#394447", "#22292b", "#161b1d", "#090b0c"] },
  { name: "taupe", shades: ["#fbfaf9", "#f3f1f1", "#e8e4e3", "#d8d2d0", "#aba09c", "#7c6d67", "#5b4f4b", "#473c39", "#2b2422", "#1d1816", "#0c0a09"] },
  { name: "red", shades: ["#fef2f2", "#ffe2e2", "#ffc9c9", "#ffa2a2", "#ff6467", "#fb2c36", "#e7000b", "#c10007", "#9f0712", "#82181a", "#460809"] },
  { name: "orange", shades: ["#fff7ed", "#ffedd4", "#ffd6a7", "#ffb86a", "#ff8904", "#ff6900", "#f54900", "#ca3500", "#9f2d00", "#7e2a0c", "#441306"] },
  { name: "amber", shades: ["#fffbeb", "#fef3c6", "#fee685", "#ffd230", "#ffb900", "#fe9a00", "#e17100", "#bb4d00", "#973c00", "#7b3306", "#461901"] },
  { name: "yellow", shades: ["#fefce8", "#fef9c2", "#fff085", "#ffdf20", "#fdc700", "#f0b100", "#d08700", "#a65f00", "#894b00", "#733e0a", "#432004"] },
  { name: "lime", shades: ["#f7fee7", "#ecfcca", "#d8f999", "#bbf451", "#9ae600", "#7ccf00", "#5ea500", "#497d00", "#3c6300", "#35530e", "#192e03"] },
  { name: "green", shades: ["#f0fdf4", "#dcfce7", "#b9f8cf", "#7bf1a8", "#05df72", "#00c950", "#00a63e", "#008236", "#016630", "#0d542b", "#032e15"] },
  { name: "emerald", shades: ["#ecfdf5", "#d0fae5", "#a4f4cf", "#5ee9b5", "#00d492", "#00bc7d", "#009966", "#007a55", "#006045", "#004f3b", "#002c22"] },
  { name: "teal", shades: ["#f0fdfa", "#cbfbf1", "#96f7e4", "#46ecd5", "#00d5be", "#00bba7", "#009689", "#00786f", "#005f5a", "#0b4f4a", "#022f2e"] },
  { name: "cyan", shades: ["#ecfeff", "#cefafe", "#a2f4fd", "#53eafd", "#00d3f2", "#00b8db", "#0092b8", "#007595", "#005f78", "#104e64", "#053345"] },
  { name: "sky", shades: ["#f0f9ff", "#dff2fe", "#b8e6fe", "#74d4ff", "#00bcff", "#00a6f4", "#0084d1", "#0069a8", "#00598a", "#024a70", "#052f4a"] },
  { name: "blue", shades: ["#eff6ff", "#dbeafe", "#bedbff", "#8ec5ff", "#51a2ff", "#2b7fff", "#155dfc", "#1447e6", "#193cb8", "#1c398e", "#162456"] },
  { name: "indigo", shades: ["#eef2ff", "#e0e7ff", "#c6d2ff", "#a3b3ff", "#7c86ff", "#615fff", "#4f39f6", "#432dd7", "#372aac", "#312c85", "#1e1a4d"] },
  { name: "violet", shades: ["#f5f3ff", "#ede9fe", "#ddd6ff", "#c4b4ff", "#a684ff", "#8e51ff", "#7f22fe", "#7008e7", "#5d0ec0", "#4d179a", "#2f0d68"] },
  { name: "purple", shades: ["#faf5ff", "#f3e8ff", "#e9d4ff", "#dab2ff", "#c27aff", "#ad46ff", "#9810fa", "#8200db", "#6e11b0", "#59168b", "#3c0366"] },
  { name: "fuchsia", shades: ["#fdf4ff", "#fae8ff", "#f6cfff", "#f4a8ff", "#ed6aff", "#e12afb", "#c800de", "#a800b7", "#8a0194", "#721378", "#4b004f"] },
  { name: "pink", shades: ["#fdf2f8", "#fce7f3", "#fccee8", "#fda5d5", "#fb64b6", "#f6339a", "#e60076", "#c6005c", "#a3004c", "#861043", "#510424"] },
  { name: "rose", shades: ["#fff1f2", "#ffe4e6", "#ffccd3", "#ffa1ad", "#ff637e", "#ff2056", "#ec003f", "#c70036", "#a50036", "#8b0836", "#4d0218"] },
];

var TAILWIND_SPACING: Array<{ name: string; px: number }> = [
  { name: "0", px: 0 },
  { name: "px", px: 1 },
  { name: "0.5", px: 2 },
  { name: "1", px: 4 },
  { name: "1.5", px: 6 },
  { name: "2", px: 8 },
  { name: "2.5", px: 10 },
  { name: "3", px: 12 },
  { name: "3.5", px: 14 },
  { name: "4", px: 16 },
  { name: "5", px: 20 },
  { name: "6", px: 24 },
  { name: "7", px: 28 },
  { name: "8", px: 32 },
  { name: "9", px: 36 },
  { name: "10", px: 40 },
  { name: "11", px: 44 },
  { name: "12", px: 48 },
  { name: "14", px: 56 },
  { name: "16", px: 64 },
  { name: "20", px: 80 },
  { name: "24", px: 96 },
  { name: "28", px: 112 },
  { name: "32", px: 128 },
  { name: "36", px: 144 },
  { name: "40", px: 160 },
  { name: "44", px: 176 },
  { name: "48", px: 192 },
  { name: "52", px: 208 },
  { name: "56", px: 224 },
  { name: "60", px: 240 },
  { name: "64", px: 256 },
  { name: "72", px: 288 },
  { name: "80", px: 320 },
  { name: "96", px: 384 },
];

function tailwindVariableName(name: string) {
  return (name || "unnamed")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------- color helpers ----------
function hexToRgb(hex: string) {
  var n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

/** Parse #RRGGBB / #RRGGBBAA into Figma RGBA (0–1). */
function parseColor(hex: string) {
  var h = (hex || "#000000").replace("#", "");
  var rgb = hexToRgb("#" + h.slice(0, 6));
  var a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r: rgb.r, g: rgb.g, b: rgb.b, a: a };
}

function readableOn(hex: string) {
  var n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  var lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150 ? "#1A1A1A" : "#FFFFFF";
}

function solid(hex: string): SolidPaint[] {
  return [{ type: "SOLID", color: hexToRgb(hex) }];
}

/** Solid paint bound to a token variable (falls back to raw hex). */
function tokenPaint(token: string, varMap: Record<string, Variable>, fallback?: string): SolidPaint[] {
  var v = varMap[token];
  var hex = currentLightHex[token] || fallback || "#000000";
  if (v) {
    try {
      return [
        figma.variables.setBoundVariableForPaint(
          { type: "SOLID", color: hexToRgb(hex) },
          "color",
          v
        ),
      ] as SolidPaint[];
    } catch (e) { /* fall through */ }
  }
  return solid(hex);
}

function tokenHex(token: string, fallback: string) {
  return currentLightHex[token] || fallback;
}

/** Apply a uniform opacity to paints without losing variable bindings. */
function fade(paints: Paint[], opacity: number): Paint[] {
  var out: Paint[] = [];
  for (var i = 0; i < paints.length; i++) {
    var p = paints[i];
    if (p.type === "SOLID") {
      var copy = { ...(p as SolidPaint), opacity: opacity } as SolidPaint;
      out.push(copy);
    } else {
      out.push(p);
    }
  }
  return out;
}

function makeTokenText(
  chars: string,
  size: number,
  style: string,
  token: string,
  varMap: Record<string, Variable>,
  name?: string,
  family?: string,
  fallback?: string
): TextNode {
  var t = figma.createText();
  t.fontName = { family: family || "Inter", style: style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = tokenPaint(token, varMap, fallback);
  if (name) t.name = name;
  return t;
}

function cap(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

// ---------- font helpers ----------
function toFigmaStyle(weight: string) {
  var map: Record<string, string> = {
    "100": "Thin", "200": "ExtraLight", "300": "Light",
    "400": "Regular", "500": "Medium", "600": "SemiBold",
    "700": "Bold", "800": "ExtraBold", "900": "Black",
  };
  return map[(weight || "400").toString()] || "Regular";
}

// Web families may carry a " Variable" suffix; Figma usually registers the
// plain family name. Try the original name, then common aliases.
function figmaFontCandidates(family: string) {
  var list: string[] = [];
  if (!family) return ["Inter"];
  list.push(family);
  var stripped = family.replace(/\s+Variable$/i, "").trim();
  if (stripped && list.indexOf(stripped) < 0) list.push(stripped);
  var lower = family.toLowerCase();
  if (lower.indexOf("inter") >= 0 && list.indexOf("Inter") < 0) list.push("Inter");
  if (list.indexOf("Inter") < 0) list.push("Inter");
  return list;
}

async function loadFigmaFont(family: string, style: string) {
  var families = figmaFontCandidates(family);
  var styles = [style || "Regular"];
  if (styles.indexOf("Regular") < 0) styles.push("Regular");
  for (var f = 0; f < families.length; f++) {
    for (var s = 0; s < styles.length; s++) {
      try {
        await figma.loadFontAsync({ family: families[f], style: styles[s] });
        return { family: families[f], style: styles[s] };
      } catch (e) { /* try next */ }
    }
  }
  return null;
}

// ---------- layout helpers ----------
function makeFrame(name: string, mode: "HORIZONTAL" | "VERTICAL" | "NONE", gap?: number, pad?: number): FrameNode {
  var f = figma.createFrame();
  f.name = name;
  f.layoutMode = mode;
  if (mode !== "NONE") {
    f.itemSpacing = gap || 0;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
  }
  f.fills = [];
  if (pad) f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = pad;
  return f;
}

function makeText(chars: string, size: number, style: string, hex: string, name?: string, family?: string): TextNode {
  var t = figma.createText();
  t.fontName = { family: family || "Inter", style: style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solid(hex);
  if (name) t.name = name;
  return t;
}

function makeSectionFrame(name: string, title: string, description: string) {
  var f = makeFrame(name, "VERTICAL", 0, 48);
  f.cornerRadius = 24;
  f.fills = solid("#F1F5F9");

  var header = makeFrame("Header", "VERTICAL", 6);
  header.fills = [];
  header.appendChild(makeText(title, 20, "Bold", "#0F172A", "Title"));
  header.appendChild(makeText(description, 13, "Regular", "#64748B", "Description"));
  f.appendChild(header);

  var sep = figma.createRectangle();
  sep.name = "Separator";
  sep.fills = solid("#E2E8F0");
  sep.resize(100, 1);
  sep.layoutAlign = "STRETCH";
  f.appendChild(sep);

  f.itemSpacing = 16;
  return f;
}

// ---------- shape / component helpers ----------
function makeGlyph(name: string, data: string, hex: string, size?: number): VectorNode {
  var v = figma.createVector();
  v.name = name;
  v.vectorPaths = [{ windingRule: "NONZERO", data: data }];
  v.fills = solid(hex);
  v.strokes = [];
  v.resize(size || 16, size || 16);
  return v;
}

/**
 * Lucide icon geometry, rewritten as absolute M/L commands on the 24×24 grid.
 * Source: https://lucide.dev — stroke-width 2, round caps and joins.
 */
var LUCIDE_ICONS: Record<string, string> = {
  "chevron-down": "M 6 9 L 12 15 L 18 9",
  "chevron-up": "M 18 15 L 12 9 L 6 15",
  "chevron-right": "M 9 18 L 15 12 L 9 6",
  "chevron-left": "M 15 18 L 9 12 L 15 6",
  "check": "M 20 6 L 9 17 L 4 12",
  "x": "M 18 6 L 6 18 M 6 6 L 18 18",
  "minus": "M 5 12 L 19 12",
  "ellipsis": "M 13 12 A 1 1 0 1 1 11 12 A 1 1 0 1 1 13 12 " +
    "M 20 12 A 1 1 0 1 1 18 12 A 1 1 0 1 1 20 12 " +
    "M 6 12 A 1 1 0 1 1 4 12 A 1 1 0 1 1 6 12",
};

/** Scale Lucide path coordinates from the 24px grid to the requested icon size. */
function scaleIconPath(data: string, factor: number): string {
  var parts = data.split(" ");
  var out: string[] = [];
  var cmd = "";
  var arg = 0;
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    if (p === "M" || p === "L" || p === "A" || p === "Z") {
      cmd = p;
      arg = 0;
      out.push(p);
      continue;
    }
    var n = parseFloat(p);
    // Arc params are rx ry rotation large-arc sweep x y: scale only geometry.
    var scale = cmd !== "A" || arg === 0 || arg === 1 || arg === 5 || arg === 6;
    out.push(scale ? String(Math.round(n * factor * 100) / 100) : p);
    arg++;
  }
  return out.join(" ");
}

/** CSS color string for the SVG importer, preserving token alpha. */
function svgColor(hex: string): string {
  var c = parseColor(hex);
  var r = Math.round(c.r * 255);
  var g = Math.round(c.g * 255);
  var b = Math.round(c.b * 255);
  if (c.a >= 1) return "rgb(" + r + "," + g + "," + b + ")";
  return "rgba(" + r + "," + g + "," + b + "," + Math.round(c.a * 100) / 100 + ")";
}

function makeIcon(name: string, hex: string, size?: number): FrameNode {
  var s = size || 16;
  var data = LUCIDE_ICONS[name] || LUCIDE_ICONS["x"];
  var weight = Math.max(1, Math.round((s * 2 / 24) * 100) / 100);
  // Author the SVG in pixels (no viewBox scaling) so geometry and stroke weight
  // arrive in Figma exactly as the Lucide spec draws them at this size.
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s +
    '" viewBox="0 0 ' + s + ' ' + s + '" fill="none" stroke="' + svgColor(hex) +
    '" stroke-width="' + weight + '" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="' + scaleIconPath(data, s / 24) + '"/></svg>';
  var node = figma.createNodeFromSvg(svg);
  node.name = name;
  node.fills = [];
  node.strokes = [];
  node.clipsContent = false;
  return node;
}

function makeBox(
  name: string,
  width: number,
  height: number,
  paints: Paint[],
  radius?: number,
  strokes?: Paint[]
): RectangleNode {
  var r = figma.createRectangle();
  r.name = name;
  r.resize(Math.max(width, 0.01), Math.max(height, 0.01));
  r.cornerRadius = radius || 0;
  r.fills = paints;
  if (strokes && strokes.length) {
    r.strokes = strokes;
    r.strokeWeight = 1;
    r.strokeAlign = "INSIDE";
  } else {
    r.strokes = [];
  }
  return r;
}

function makeCircle(name: string, size: number, paints: Paint[], strokes?: Paint[]): EllipseNode {
  var e = figma.createEllipse();
  e.name = name;
  e.resize(size, size);
  e.fills = paints;
  if (strokes && strokes.length) {
    e.strokes = strokes;
    e.strokeWeight = 1;
    e.strokeAlign = "INSIDE";
  } else {
    e.strokes = [];
  }
  return e;
}

function makeComponent(
  name: string,
  mode: "HORIZONTAL" | "VERTICAL" | "NONE",
  gap?: number,
  padX?: number,
  padY?: number
): ComponentNode {
  var c = figma.createComponent();
  c.name = name;
  c.layoutMode = mode;
  if (mode !== "NONE") {
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "AUTO";
    c.primaryAxisAlignItems = "MIN";
    c.counterAxisAlignItems = "CENTER";
    c.itemSpacing = gap || 0;
  }
  c.paddingLeft = c.paddingRight = padX || 0;
  c.paddingTop = c.paddingBottom = padY || 0;
  c.fills = [];
  c.strokes = [];
  return c;
}

function layoutComponentSet(
  set: ComponentSetNode,
  columns?: number,
  pad?: number,
  gapX?: number,
  gapY?: number
) {
  var p = pad == null ? 32 : pad;
  var gx = gapX == null ? 20 : gapX;
  var gy = gapY == null ? 20 : gapY;
  var cols = columns || set.children.length || 1;
  var x = p;
  var y = p;
  var rowH = 0;
  var maxRight = 0;
  for (var i = 0; i < set.children.length; i++) {
    var child = set.children[i] as FrameNode;
    if (i > 0 && i % cols === 0) {
      x = p;
      y += rowH + gy;
      rowH = 0;
    }
    child.x = x;
    child.y = y;
    x += child.width + gx;
    if (child.height > rowH) rowH = child.height;
    if (x - gx > maxRight) maxRight = x - gx;
  }
  set.resize(Math.max(maxRight + p, p * 2), y + rowH + p);
}

function makeComponentSet(
  name: string,
  variants: Array<{ name: string; build: () => ComponentNode }>,
  columns?: number
): ComponentSetNode {
  var comps: ComponentNode[] = [];
  for (var i = 0; i < variants.length; i++) {
    var comp = variants[i].build();
    comp.name = variants[i].name;
    comps.push(comp);
  }
  var set = figma.combineAsVariants(comps, figma.currentPage);
  set.name = name;
  set.fills = [];
  set.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
  set.strokeWeight = 2;
  set.dashPattern = [8, 4];
  set.strokeAlign = "INSIDE";
  layoutComponentSet(set, columns);
  return set;
}

/**
 * Expose a field's label and helper text as editable component properties:
 * text properties plus "Show label" / "Show helper" visibility toggles.
 */
function bindFieldProperties(
  set: ComponentSetNode,
  labelDefault: string,
  helperDefault: string
) {
  var labelKey = set.addComponentProperty("Label", "TEXT", labelDefault);
  var showLabelKey = set.addComponentProperty("Show label", "BOOLEAN", true);
  var helperKey = set.addComponentProperty("Helper text", "TEXT", helperDefault);
  var showHelperKey = set.addComponentProperty("Show helper", "BOOLEAN", true);

  function bind(variant: ComponentNode, layerName: string, charactersKey: string, visibleKey: string) {
    var matches = variant.findAll(function (node) { return node.name === layerName; });
    for (var i = 0; i < matches.length; i++) {
      matches[i].componentPropertyReferences = { characters: charactersKey, visible: visibleKey };
    }
  }

  for (var i = 0; i < set.children.length; i++) {
    var variant = set.children[i] as ComponentNode;
    bind(variant, "Label", labelKey, showLabelKey);
    bind(variant, "Helper", helperKey, showHelperKey);
  }
}

function makeShadows(config: any, factor: number): DropShadowEffect[] {
  if (!config) return [];
  var color = parseColor(config.color || "#000000");
  color.a = typeof config.opacity === "number" ? config.opacity : 0.1;
  var base = {
    x: typeof config.x === "number" ? config.x : 0,
    y: typeof config.y === "number" ? config.y : 4,
    blur: typeof config.blur === "number" ? config.blur : 6,
    spread: typeof config.spread === "number" ? config.spread : -1,
  };
  return [{
    type: "DROP_SHADOW",
    color: color,
    offset: {
      x: Math.round(base.x * factor),
      y: Math.round(base.y * factor),
    },
    radius: Math.max(Math.round(base.blur * factor), 0),
    spread: Math.round(base.spread * factor),
    visible: true,
    blendMode: "NORMAL",
  }];
}

/** Source-of-light hex per token, used as fallback paint base. */
var currentLightHex: Record<string, string> = {};

// ---------- main ----------
async function importTokens(t: any) {
  var tokens = t.tokens || {};
  var tokenNames = Object.keys(tokens);
  if (!tokenNames.length) {
    throw new Error("No tokens found in the manifest.");
  }

  var typography = t.typography || { sans: null, serif: null, mono: null };
  var radiusRem = typeof t.radius === "number" ? t.radius : 0.625;
  var radiusPx = Math.max(0, radiusRem * 16);
  var shadow = t.shadow || null;

  // -- Fonts: labels/meta use Inter + Source Code Pro; previews use the design families.
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  try { await figma.loadFontAsync({ family: "Source Code Pro", style: "Regular" }); } catch (e) {}
  try { await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" }); } catch (e) {}

  var sansFont = await loadFigmaFont(typography.sans || "Inter", "Regular");
  var sansFamily = sansFont ? sansFont.family : "Inter";
  var sansLoaded = await loadFigmaFont(typography.sans || "Inter", "SemiBold");
  var sansSemiboldFamily = sansLoaded ? sansLoaded.family : sansFamily;
  var sansSemiboldStyle = sansLoaded ? sansLoaded.style : "Regular";
  var serifFont = typography.serif ? await loadFigmaFont(typography.serif, "Regular") : null;
  var monoFont = typography.mono ? await loadFigmaFont(typography.mono, "Regular") : null;

  // ── Root frame: stack every section so nothing overlaps on the canvas ──
  var root = makeFrame("Iroha Design System", "VERTICAL", 48);
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 48;
  root.fills = solid("#F8FAFC");
  root.cornerRadius = 32;
  root.x = 0;
  root.y = 0;
  figma.currentPage.appendChild(root);

  // ── Variables: one collection, single mode (Light) ──
  var varMap: Record<string, Variable> = {};
  var collection = figma.variables.createVariableCollection("Design Tokens");
  var lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light");

  for (var name of tokenNames) {
    var entry = tokens[name];
    var v = figma.variables.createVariable(name, collection, "COLOR");
    v.setValueForMode(lightModeId, parseColor(entry.light));
    varMap[name] = v;
    currentLightHex[name] = entry.light;
  }

  // ── Paint styles: one per token, bound to its variable ──
  for (var name2 of tokenNames) {
    try {
      var ps = figma.createPaintStyle();
      ps.name = name2;
      var base = hexToRgb(currentLightHex[name2]);
      ps.paints = [
        figma.variables.setBoundVariableForPaint(
          { type: "SOLID", color: base }, "color", varMap[name2]
        ),
      ] as Paint[];
    } catch (e) { /* keep going without this style */ }
  }

  // ── Section: Colors ──
  var frameColors = makeSectionFrame(
    "Colors",
    "Colors",
    "Shadcn color tokens · bound to the Design Tokens variables"
  );
  var colorGrid = makeFrame("Tokens", "VERTICAL", 12);
  var PER_ROW = 3;
  for (var i = 0; i < tokenNames.length; i += PER_ROW) {
    var row = makeFrame("Row", "HORIZONTAL", 12);
    for (var j = i; j < Math.min(i + PER_ROW, tokenNames.length); j++) {
      var name3 = tokenNames[j];
      var entry3 = tokens[name3];
      var card = makeFrame("Token · " + name3, "VERTICAL", 8);
      card.resize(180, 116);
      card.primaryAxisSizingMode = "FIXED";
      card.counterAxisSizingMode = "FIXED";

      var box = figma.createRectangle();
      box.name = "Color";
      box.resize(180, 56);
      box.cornerRadius = 10;
      box.fills = tokenPaint(name3, varMap);
      card.appendChild(box);

      var labels = makeFrame("Labels", "VERTICAL", 2);
      labels.fills = [];
      labels.appendChild(makeText(name3, 11, "Medium", "#1A1A1A", "Name", "Source Code Pro"));
      labels.appendChild(makeText(
        entry3.light.toUpperCase(),
        9, "Regular", "#7A7A7A", "Values", "Source Code Pro"
      ));
      card.appendChild(labels);
      row.appendChild(card);
    }
    colorGrid.appendChild(row);
  }
  frameColors.appendChild(colorGrid);
  root.appendChild(frameColors);

  // ── Typography: text styles + preview section ──
  var typeStyleMap: Record<string, string> = {};
  var frameTypo: FrameNode | null = null;
  {
    var styles = [
      { key: "heading", label: "Heading", family: sansSemiboldFamily, style: sansSemiboldStyle, size: 24, lh: 32 },
      { key: "body", label: "Body", family: sansFamily, style: "Regular", size: 14, lh: 20 },
    ];
    if (serifFont) {
      styles.push({ key: "serif", label: "Serif", family: serifFont.family, style: serifFont.style, size: 16, lh: 24 });
    }
    if (monoFont) {
      styles.push({ key: "mono", label: "Mono", family: monoFont.family, style: monoFont.style, size: 13, lh: 20 });
    }

    frameTypo = makeSectionFrame(
      "Typography",
      "Typography",
      "Text styles generated from the design's font families"
    );
    var typoList = makeFrame("Styles", "VERTICAL", 24);

    for (var st of styles) {
      var ts = figma.createTextStyle();
      ts.name = st.label;
      ts.fontName = { family: st.family, style: st.style };
      ts.fontSize = st.size;
      ts.lineHeight = { unit: "PIXELS", value: st.lh };
      typeStyleMap[st.key] = ts.id;

      var tRow = makeFrame("Type · " + st.label, "VERTICAL", 6);
      tRow.fills = [];
      var preview = figma.createText();
      preview.name = "Preview";
      preview.fontName = { family: st.family, style: st.style };
      preview.fontSize = st.size;
      preview.characters = "The quick brown fox jumps over the lazy dog";
      preview.fills = solid("#1A1A1A");
      try { await preview.setTextStyleIdAsync(ts.id); } catch (e) { /* manual font stays */ }
      tRow.appendChild(preview);
      tRow.appendChild(makeText(
        st.label + "  ·  " + st.family + " " + st.style + "  ·  " + st.size + "/" + st.lh,
        11, "Regular", "#7A7A7A", "Meta", "Source Code Pro"
      ));
      typoList.appendChild(tRow);
    }
    frameTypo.appendChild(typoList);
    root.appendChild(frameTypo);
  }

  // ── Corner: radius variable + preview tiers ──
  var frameCorner = makeSectionFrame(
    "Corner",
    "Corner",
    "Base radius of the design — rounded utilities derive from this value"
  );
  try {
    var rVar = figma.variables.createVariable("radius", collection, "FLOAT");
    rVar.setValueForMode(lightModeId, radiusPx);
  } catch (e) { /* continue without the variable */ }

  var cornerRow = makeFrame("Corners", "HORIZONTAL", 24);
  cornerRow.counterAxisAlignItems = "MIN";
  var CORNER_TIERS = [
    { name: "sm", factor: 0.5 }, { name: "md", factor: 1 },
    { name: "lg", factor: 1.5 }, { name: "xl", factor: 2 },
  ];
  for (var tier of CORNER_TIERS) {
    var r = Math.round(radiusPx * tier.factor);
    var crGroup = makeFrame("Corner · " + tier.name, "VERTICAL", 10);
    crGroup.fills = [];
    var crBox = figma.createRectangle();
    crBox.name = "Preview";
    crBox.resize(80, 80);
    crBox.fills = tokenPaint("primary", varMap);
    crBox.cornerRadius = r;
    crGroup.appendChild(crBox);
    var crLabel = makeFrame("Label", "VERTICAL", 2);
    crLabel.fills = [];
    crLabel.appendChild(makeText(tier.name, 12, "Medium", "#1A1A1A", "Name"));
    crLabel.appendChild(makeText(r + "px", 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"));
    crGroup.appendChild(crLabel);
    cornerRow.appendChild(crGroup);
  }
  frameCorner.appendChild(cornerRow);
  root.appendChild(frameCorner);

  // ── Shadow: effect styles for the Tailwind tiers + previews ──
  if (shadow) {
    var SHADOW_TIERS = [
      { name: "sm", factor: 0.5 }, { name: "md", factor: 1 },
      { name: "lg", factor: 1.5 }, { name: "xl", factor: 2 },
    ];

    for (var tier2 of SHADOW_TIERS) {
      try {
        var es = figma.createEffectStyle();
        es.name = "Shadow/" + tier2.name;
        es.effects = makeShadows(shadow, tier2.factor);
      } catch (e) { /* continue */ }
    }

    var frameShadow = makeSectionFrame(
      "Shadow",
      "Shadow",
      "Elevation tiers derived from the design's shadow config"
    );
    var shadowRow = makeFrame("Shadows", "HORIZONTAL", 32);
    for (var tier3 of SHADOW_TIERS) {
      var shGroup = makeFrame("Shadow · " + tier3.name, "VERTICAL", 12);
      var shBox = figma.createRectangle();
      shBox.name = "Preview";
      shBox.resize(80, 80);
      shBox.cornerRadius = 12;
      shBox.fills = solid("#FFFFFF");
      shBox.effects = makeShadows(shadow, tier3.factor);
      shGroup.appendChild(shBox);
      var shLabel = makeFrame("Label", "VERTICAL", 2);
      shLabel.fills = [];
      shLabel.appendChild(makeText(tier3.name, 12, "Medium", "#1A1A1A", "Name"));
      shLabel.appendChild(makeText(
        "x" + tier3.factor, 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"
      ));
      shGroup.appendChild(shLabel);
      shadowRow.appendChild(shGroup);
    }
    frameShadow.appendChild(shadowRow);
    root.appendChild(frameShadow);
  }

  // ── Tailwind primitives: color palette + spacing scale ──
  var twColorCollection = figma.variables.createVariableCollection("Tailwind Colors");
  var twColorModeId = twColorCollection.modes[0].modeId;
  twColorCollection.renameMode(twColorModeId, "Light");
  var twColorVars: Record<string, Variable> = {};
  for (var twFamily of TAILWIND_COLORS) {
    for (var twShadeIndex = 0; twShadeIndex < TAILWIND_SHADES.length; twShadeIndex++) {
      var twShadeName = twFamily.name + "/" + TAILWIND_SHADES[twShadeIndex];
      var twVariableName = tailwindVariableName(twFamily.name + "-" + TAILWIND_SHADES[twShadeIndex]);
      var twShadeVar = figma.variables.createVariable(twVariableName, twColorCollection, "COLOR");
      twShadeVar.setValueForMode(twColorModeId, parseColor(twFamily.shades[twShadeIndex]));
      var twShadeStyle = figma.createPaintStyle();
      twShadeStyle.name = "Tailwind/" + twShadeName;
      twShadeStyle.paints = [figma.variables.setBoundVariableForPaint(
        { type: "SOLID", color: hexToRgb(twFamily.shades[twShadeIndex]) },
        "color",
        twShadeVar
      )] as Paint[];
      twColorVars[twShadeName] = twShadeVar;
    }
  }
  var twWhiteVar = figma.variables.createVariable("white", twColorCollection, "COLOR");
  twWhiteVar.setValueForMode(twColorModeId, parseColor("#FFFFFF"));
  var twWhiteStyle = figma.createPaintStyle();
  twWhiteStyle.name = "Tailwind/white";
  twWhiteStyle.paints = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: hexToRgb("#FFFFFF") }, "color", twWhiteVar
  )] as Paint[];
  var twBlackVar = figma.variables.createVariable("black", twColorCollection, "COLOR");
  twBlackVar.setValueForMode(twColorModeId, parseColor("#000000"));
  var twBlackStyle = figma.createPaintStyle();
  twBlackStyle.name = "Tailwind/black";
  twBlackStyle.paints = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: hexToRgb("#000000") }, "color", twBlackVar
  )] as Paint[];

  var frameTailwind = makeSectionFrame(
    "Tailwind Colors",
    "Tailwind Colors",
    "Tailwind v4 primitive palette · " + TAILWIND_COLORS.length + " families × " + TAILWIND_SHADES.length + " shades · bound to the Tailwind Colors variables"
  );
  var twFamilies = makeFrame("Palette", "VERTICAL", 16);
  twFamilies.fills = [];

  function addTailwindSwatch(rowNode: FrameNode, name: string, hex: string, variable: Variable) {
    var swatch = makeFrame(name, "VERTICAL", 4);
    swatch.fills = [];
    swatch.resize(60, 0);
    swatch.primaryAxisSizingMode = "AUTO";
    swatch.counterAxisSizingMode = "FIXED";
    swatch.counterAxisAlignItems = "MIN";

    var chip = figma.createRectangle();
    chip.name = name + " · " + hex.toUpperCase();
    chip.resize(60, 40);
    chip.cornerRadius = 6;
    chip.fills = [figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: hexToRgb(hex) }, "color", variable
    )] as Paint[];
    chip.strokes = tokenPaint("border", varMap);
    chip.strokeWeight = 1;
    chip.strokeAlign = "INSIDE";
    swatch.appendChild(chip);

    var labels = makeFrame("Label", "VERTICAL", 0);
    labels.fills = [];
    labels.appendChild(makeText(name.split("/")[1] || name, 9, "Medium", "#1A1A1A", "Shade", "Source Code Pro"));
    labels.appendChild(makeText(hex.toUpperCase(), 8, "Regular", "#7A7A7A", "Hex", "Source Code Pro"));
    swatch.appendChild(labels);
    rowNode.appendChild(swatch);
  }

  for (var twFam of TAILWIND_COLORS) {
    var twFamilyBlock = makeFrame(twFam.name, "VERTICAL", 6);
    twFamilyBlock.fills = [];
    twFamilyBlock.appendChild(makeText(twFam.name, 12, "Medium", "#1A1A1A", "Family", "Source Code Pro"));
    var twShadeRow = makeFrame("Shades", "HORIZONTAL", 6);
    twShadeRow.fills = [];
    for (var twSi = 0; twSi < TAILWIND_SHADES.length; twSi++) {
      var twKey = twFam.name + "/" + TAILWIND_SHADES[twSi];
      addTailwindSwatch(twShadeRow, twKey, twFam.shades[twSi], twColorVars[twKey]);
    }
    twFamilyBlock.appendChild(twShadeRow);
    twFamilies.appendChild(twFamilyBlock);
  }

  var twBaseBlock = makeFrame("base", "VERTICAL", 6);
  twBaseBlock.fills = [];
  twBaseBlock.appendChild(makeText("base", 12, "Medium", "#1A1A1A", "Family", "Source Code Pro"));
  var twBaseRow = makeFrame("Shades", "HORIZONTAL", 6);
  twBaseRow.fills = [];
  addTailwindSwatch(twBaseRow, "white", "#FFFFFF", twWhiteVar);
  addTailwindSwatch(twBaseRow, "black", "#000000", twBlackVar);
  twBaseBlock.appendChild(twBaseRow);
  twFamilies.appendChild(twBaseBlock);

  frameTailwind.appendChild(twFamilies);
  root.appendChild(frameTailwind);

  // ── Tailwind spacing scale ──
  var twSpacingCollection = figma.variables.createVariableCollection("Tailwind Spacing");
  var twSpacingModeId = twSpacingCollection.modes[0].modeId;
  twSpacingCollection.renameMode(twSpacingModeId, "Light");
  var twSpacingVars: Record<string, Variable> = {};
  for (var twSpace of TAILWIND_SPACING) {
    var twVariableName = tailwindVariableName("spacing-" + twSpace.name);
    var twSpaceVar = figma.variables.createVariable(twVariableName, twSpacingCollection, "FLOAT");
    twSpaceVar.setValueForMode(twSpacingModeId, twSpace.px);
    try { twSpaceVar.scopes = ["WIDTH_HEIGHT", "GAP"]; } catch (e) { /* keep default scopes */ }
    twSpacingVars[twSpace.name] = twSpaceVar;
  }

  var frameSpacing = makeSectionFrame(
    "Tailwind Spacing",
    "Spacing",
    "Tailwind spacing scale · 4px base · bound to the Tailwind Spacing variables"
  );
  var twSpaceList = makeFrame("Scale", "VERTICAL", 8);
  twSpaceList.fills = [];
  for (var twStep of TAILWIND_SPACING) {
    var twStepRow = makeFrame("spacing/" + twStep.name, "HORIZONTAL", 12);
    twStepRow.fills = [];
    twStepRow.counterAxisAlignItems = "CENTER";

    var twStepKey = makeText(twStep.name, 10, "Medium", "#1A1A1A", "Name", "Source Code Pro");
    twStepKey.textAutoResize = "HEIGHT";
    twStepKey.resize(56, 14);
    twStepRow.appendChild(twStepKey);

    var twStepBar = makeBox("Bar", Math.max(twStep.px, 1), 12, tokenPaint("primary", varMap), 3);
    try { twStepBar.setBoundVariable("width", twSpacingVars[twStep.name]); } catch (e) { /* keep fixed preview */ }
    twStepRow.appendChild(twStepBar);

    var twStepValue = makeText(twStep.px + " px", 10, "Regular", "#7A7A7A", "Value", "Source Code Pro");
    twStepValue.textAutoResize = "HEIGHT";
    twStepValue.resize(64, 14);
    twStepRow.appendChild(twStepValue);

    twSpaceList.appendChild(twStepRow);
  }
  frameSpacing.appendChild(twSpaceList);
  root.appendChild(frameSpacing);

  // ── Button component set (variants × sizes, bound to variables) ──
  var BUTTON_SIZES = [
    { name: "Sm", px: 12, py: 6, font: 12 },
    { name: "Default", px: 16, py: 8, font: 14 },
    { name: "Lg", px: 24, py: 8, font: 14 },
  ];
  var BUTTON_VARIANTS = [
    { name: "Default", bg: "primary", fg: "primary-foreground", border: null, underline: false },
    { name: "Secondary", bg: "secondary", fg: "secondary-foreground", border: null, underline: false },
    { name: "Outline", bg: "background", fg: "foreground", border: "border", underline: false },
    { name: "Ghost", bg: null, fg: "foreground", border: null, underline: false },
    { name: "Destructive", bg: "destructive", fg: "destructive-foreground", border: null, underline: false },
    { name: "Link", bg: null, fg: "primary", border: null, underline: true },
  ];

  var btnComps: ComponentNode[] = [];
  var bodyStyleId = typeStyleMap["body"] || null;

  for (var variant of BUTTON_VARIANTS) {
    for (var size of BUTTON_SIZES) {
      var comp = figma.createComponent();
      comp.name = "Variant=" + variant.name + ", Size=" + size.name;
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "AUTO";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.paddingLeft = comp.paddingRight = size.px;
      comp.paddingTop = comp.paddingBottom = size.py;
      comp.cornerRadius = Math.max(Math.round(radiusPx - 2), 0);
      comp.fills = variant.bg ? tokenPaint(variant.bg, varMap) : [];
      comp.strokes = variant.border ? tokenPaint(variant.border, varMap) : [];
      comp.strokeWeight = variant.border ? 1 : 0;
      comp.strokeAlign = "INSIDE";

      var labelProp = comp.addComponentProperty("Label", "TEXT", "Button");
      var txt = figma.createText();
      txt.name = "Label";
      txt.fontName = { family: sansFamily, style: "Regular" };
      txt.fontSize = size.font;
      txt.characters = "Button";
      txt.fills = tokenPaint(variant.fg, varMap);
      if (variant.underline) txt.textDecoration = "UNDERLINE";
      comp.appendChild(txt);
      txt.componentPropertyReferences = { characters: labelProp };
      try {
        if (bodyStyleId) await txt.setTextStyleIdAsync(bodyStyleId);
      } catch (e) { /* keep manual font */ }

      btnComps.push(comp);
    }
  }

  if (btnComps.length) {
    var btnSet = figma.combineAsVariants(btnComps, figma.currentPage);
    btnSet.name = "Button";
    btnSet.fills = [];
    btnSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
    btnSet.strokeWeight = 2;
    btnSet.dashPattern = [8, 4];
    btnSet.strokeAlign = "INSIDE";

    // Layout: one row per variant, sizes left → right.
    var sizeOrder: Record<string, number> = { Sm: 0, Default: 1, Lg: 2 };
    var byVariant: Record<string, FrameNode[]> = {};
    for (var ci = 0; ci < btnSet.children.length; ci++) {
      var ch = btnSet.children[ci] as FrameNode;
      ch.primaryAxisSizingMode = "AUTO";
      ch.counterAxisSizingMode = "AUTO";
      var vk = (ch.name.match(/Variant=([^,]+)/) || [])[1] || "Other";
      if (!byVariant[vk]) byVariant[vk] = [];
      byVariant[vk].push(ch);
    }
    var padH = 32, padV = 32, colGap = 16, rowGap = 20;
    var curY = padV, maxRowWidth = 0;
    for (var variant2 of BUTTON_VARIANTS) {
      var rowNodes = (byVariant[variant2.name] || []).sort(function (a, b) {
        var sa = (a.name.match(/Size=(\w+)/) || [])[1] || "Default";
        var sb = (b.name.match(/Size=(\w+)/) || [])[1] || "Default";
        return (sizeOrder[sa] || 1) - (sizeOrder[sb] || 1);
      });
      var curX = padH, maxH = 0;
      for (var node of rowNodes) {
        node.x = curX;
        node.y = curY;
        curX += node.width + colGap;
        if (node.height > maxH) maxH = node.height;
      }
      var rowWidth = curX - colGap + padH;
      if (rowWidth > maxRowWidth) maxRowWidth = rowWidth;
      curY += maxH + rowGap;
    }
    btnSet.resize(maxRowWidth, curY - rowGap + padV);

    var frameBtn = makeSectionFrame(
      "Button",
      "Button",
      "Default shadcn variants bound to the design tokens"
    );
    frameBtn.appendChild(btnSet);
    root.appendChild(frameBtn);
  }

  // ── Badge component set ──
  var BADGE_VARIANTS = [
    { name: "Default", bg: "primary", fg: "primary-foreground", border: null },
    { name: "Secondary", bg: "secondary", fg: "secondary-foreground", border: null },
    { name: "Destructive", bg: "destructive", fg: "destructive-foreground", border: null },
    { name: "Outline", bg: null, fg: "foreground", border: "border" },
  ];
  var badgeComps: ComponentNode[] = [];
  for (var bv of BADGE_VARIANTS) {
    var bComp = figma.createComponent();
    bComp.name = "Variant=" + bv.name;
    bComp.layoutMode = "HORIZONTAL";
    bComp.primaryAxisSizingMode = "AUTO";
    bComp.counterAxisSizingMode = "AUTO";
    bComp.primaryAxisAlignItems = "CENTER";
    bComp.counterAxisAlignItems = "CENTER";
    bComp.paddingLeft = bComp.paddingRight = 10;
    bComp.paddingTop = bComp.paddingBottom = 3;
    bComp.cornerRadius = 999;
    bComp.fills = bv.bg ? tokenPaint(bv.bg, varMap) : [];
    bComp.strokes = bv.border ? tokenPaint(bv.border, varMap) : [];
    bComp.strokeWeight = bv.border ? 1 : 0;
    bComp.strokeAlign = "INSIDE";

    var bLabelProp = bComp.addComponentProperty("Label", "TEXT", "Badge");
    var bTxt = figma.createText();
    bTxt.name = "Label";
    bTxt.fontName = { family: sansSemiboldFamily, style: sansSemiboldStyle };
    bTxt.fontSize = 12;
    bTxt.characters = "Badge";
    bTxt.fills = tokenPaint(bv.fg, varMap);
    bComp.appendChild(bTxt);
    bTxt.componentPropertyReferences = { characters: bLabelProp };
    badgeComps.push(bComp);
  }

  if (badgeComps.length) {
    var badgeSet = figma.combineAsVariants(badgeComps, figma.currentPage);
    badgeSet.name = "Badge";
    badgeSet.fills = [];
    badgeSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
    badgeSet.strokeWeight = 2;
    badgeSet.dashPattern = [8, 4];
    badgeSet.strokeAlign = "INSIDE";

    var bPad = 32, bGap = 16, bX = bPad, bMaxH = 0;
    for (var ci2 = 0; ci2 < badgeSet.children.length; ci2++) {
      var ch2 = badgeSet.children[ci2] as FrameNode;
      ch2.primaryAxisSizingMode = "AUTO";
      ch2.counterAxisSizingMode = "AUTO";
      ch2.x = bX;
      ch2.y = bPad;
      bX += ch2.width + bGap;
      if (ch2.height > bMaxH) bMaxH = ch2.height;
    }
    badgeSet.resize(bX - bGap + bPad, bMaxH + bPad * 2);

    var frameBadge = makeSectionFrame(
      "Badge",
      "Badge",
      "Default shadcn variants bound to the design tokens"
    );
    frameBadge.appendChild(badgeSet);
    root.appendChild(frameBadge);
  }

  // ── Extra shadcn/ui components ──
  var uiMediumFamily = sansFamily === "Inter" ? "Inter" : sansSemiboldFamily;
  var uiMediumStyle = sansFamily === "Inter" ? "Medium" : sansSemiboldStyle;

  function rad(factor: number) {
    return Math.max(0, Math.round(radiusPx * factor));
  }

  function addSetBlock(parent: FrameNode, title: string, set: ComponentSetNode) {
    var block = makeFrame("Block · " + title, "VERTICAL", 10);
    block.fills = [];
    block.appendChild(makeText(title, 14, "Medium", "#334155", "Label"));
    block.appendChild(set);
    parent.appendChild(block);
  }

  function miniButton(label: string, variant: "default" | "outline" | "destructive") {
    var b = makeFrame("Button", "HORIZONTAL", 0);
    b.paddingLeft = b.paddingRight = 12;
    b.paddingTop = b.paddingBottom = 6;
    b.cornerRadius = rad(0.8);
    b.primaryAxisAlignItems = "CENTER";
    b.counterAxisAlignItems = "CENTER";
    if (variant === "default") {
      b.fills = tokenPaint("primary", varMap);
    } else if (variant === "destructive") {
      b.fills = tokenPaint("destructive", varMap);
    } else {
      b.fills = [];
      b.strokes = tokenPaint("border", varMap);
      b.strokeWeight = 1;
      b.strokeAlign = "INSIDE";
    }
    var fg = variant === "default"
      ? "primary-foreground"
      : variant === "destructive"
        ? "destructive-foreground"
        : "foreground";
    b.appendChild(makeTokenText(label, 12, uiMediumStyle, fg, varMap, "Label", uiMediumFamily));
    return b;
  }

  function avatarCircle(px: number, initials: string, fontSize: number) {
    var f = makeFrame("Avatar", "HORIZONTAL", 0);
    f.resize(px, px);
    f.primaryAxisSizingMode = "FIXED";
    f.counterAxisSizingMode = "FIXED";
    f.primaryAxisAlignItems = "CENTER";
    f.counterAxisAlignItems = "CENTER";
    f.cornerRadius = px / 2;
    f.fills = tokenPaint("muted", varMap);
    f.strokes = tokenPaint("border", varMap);
    f.strokeWeight = 1;
    f.strokeAlign = "INSIDE";
    f.appendChild(makeTokenText(initials, fontSize, uiMediumStyle, "muted-foreground", varMap, "Fallback", uiMediumFamily));
    return f;
  }

  // Forms
  function buildInputComponent(state: string): ComponentNode {
    var c = makeComponent("Input", "VERTICAL", 6);
    c.resize(240, 0);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";

    var label = makeTokenText(
      "Email",
      13,
      uiMediumStyle,
      state === "Disabled" ? "muted-foreground" : "foreground",
      varMap,
      "Label",
      uiMediumFamily
    );
    label.textAutoResize = "HEIGHT";
    label.resize(240, 18);
    c.appendChild(label);

    var field = makeFrame("Field", "HORIZONTAL", 0, 12);
    field.resize(240, 36);
    field.primaryAxisSizingMode = "FIXED";
    field.counterAxisSizingMode = "FIXED";
    field.primaryAxisAlignItems = "MIN";
    field.counterAxisAlignItems = "CENTER";
    field.cornerRadius = rad(2.2);
    field.fills = fade(tokenPaint("input", varMap, "#E5E5E5"), 0.5);
    if (state === "Focus") {
      field.strokes = tokenPaint("ring", varMap, "#A3A3A3");
      field.strokeWeight = 2;
      field.strokeAlign = "INSIDE";
    } else if (state === "Invalid") {
      field.strokes = tokenPaint("destructive", varMap, "#DC2626");
      field.strokeWeight = 1;
      field.strokeAlign = "INSIDE";
    } else if (state === "Disabled") {
      field.opacity = 0.5;
    }
    var inputToken = state === "Default" || state === "Disabled" ? "muted-foreground" : "foreground";
    var inputText = state === "Default" || state === "Disabled" ? "Placeholder" : "Input value";
    field.appendChild(makeTokenText(inputText, 14, "Regular", inputToken, varMap, "Value", sansFamily));
    c.appendChild(field);

    var helper = makeTokenText(
      "We'll never share your email.",
      12,
      "Regular",
      state === "Invalid" ? "destructive" : "muted-foreground",
      varMap,
      "Helper",
      sansFamily
    );
    helper.textAutoResize = "HEIGHT";
    helper.resize(240, 16);
    c.appendChild(helper);
    return c;
  }

  function buildTextareaComponent(state: string): ComponentNode {
    var c = makeComponent("Textarea", "VERTICAL", 6);
    c.resize(260, 0);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";

    var label = makeTokenText(
      "Message",
      13,
      uiMediumStyle,
      state === "Disabled" ? "muted-foreground" : "foreground",
      varMap,
      "Label",
      uiMediumFamily
    );
    label.textAutoResize = "HEIGHT";
    label.resize(260, 18);
    c.appendChild(label);

    var field = makeFrame("Field", "VERTICAL", 0, 12);
    field.resize(260, 96);
    field.primaryAxisSizingMode = "FIXED";
    field.counterAxisSizingMode = "FIXED";
    field.primaryAxisAlignItems = "MIN";
    field.counterAxisAlignItems = "MIN";
    field.cornerRadius = rad(1.8);
    field.fills = fade(tokenPaint("input", varMap, "#E5E5E5"), 0.5);
    if (state === "Focus") {
      field.strokes = tokenPaint("ring", varMap, "#A3A3A3");
      field.strokeWeight = 2;
      field.strokeAlign = "INSIDE";
    } else if (state === "Invalid") {
      field.strokes = tokenPaint("destructive", varMap, "#DC2626");
      field.strokeWeight = 1;
      field.strokeAlign = "INSIDE";
    } else if (state === "Disabled") {
      field.opacity = 0.5;
    }
    var taToken = state === "Default" || state === "Disabled" ? "muted-foreground" : "foreground";
    var taText = state === "Default" || state === "Disabled" ? "Write something..." : "Textarea value";
    var ta = makeTokenText(taText, 14, "Regular", taToken, varMap, "Value", sansFamily);
    ta.textAutoResize = "HEIGHT";
    ta.resize(236, 24);
    field.appendChild(ta);
    c.appendChild(field);

    var helper = makeTokenText(
      "You can write up to 500 characters.",
      12,
      "Regular",
      state === "Invalid" ? "destructive" : "muted-foreground",
      varMap,
      "Helper",
      sansFamily
    );
    helper.textAutoResize = "HEIGHT";
    helper.resize(260, 16);
    c.appendChild(helper);
    return c;
  }

  function buildLabelComponent(state: string): ComponentNode {
    var c = makeComponent("Label", "HORIZONTAL", 0);
    c.fills = [];
    c.appendChild(makeTokenText("Label", 14, uiMediumStyle, state === "Disabled" ? "muted-foreground" : "foreground", varMap, "Label", uiMediumFamily));
    if (state === "Disabled") c.opacity = 0.5;
    return c;
  }

  function buildCheckboxComponent(state: string): ComponentNode {
    var c = makeComponent("Checkbox", "HORIZONTAL", 0);
    c.resize(16, 16);
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
    c.cornerRadius = 5;
    var checked = state === "Checked" || state === "Indeterminate";
    c.fills = checked
      ? tokenPaint("primary", varMap)
      : fade(tokenPaint("input", varMap, "#E5E5E5"), 0.9);
    if (state === "Checked") {
      c.appendChild(makeIcon("check", tokenHex("primary-foreground", "#FFFFFF"), 14));
    } else if (state === "Indeterminate") {
      c.appendChild(makeIcon("minus", tokenHex("primary-foreground", "#FFFFFF"), 14));
    }
    if (state === "Disabled") c.opacity = 0.5;
    return c;
  }

  function buildRadioComponent(state: string): ComponentNode {
    var c = makeComponent("Radio Group", "HORIZONTAL", 10);
    c.fills = [];
    c.counterAxisAlignItems = "CENTER";
    var selected = state === "Selected";
    var control = makeFrame("Control", "NONE");
    control.resize(16, 16);
    control.clipsContent = false;
    var circle = makeCircle(
      "Circle",
      16,
      selected ? tokenPaint("primary", varMap) : fade(tokenPaint("input", varMap, "#E5E5E5"), 0.9)
    );
    circle.x = 0;
    circle.y = 0;
    control.appendChild(circle);
    if (selected) {
      var dot = makeCircle("Indicator", 8, solid(tokenHex("primary-foreground", "#FFFFFF")));
      dot.x = 4;
      dot.y = 4;
      control.appendChild(dot);
    }
    c.appendChild(control);
    c.appendChild(makeTokenText("Option", 14, "Regular", "foreground", varMap, "Label", sansFamily));
    if (state === "Disabled") c.opacity = 0.5;
    return c;
  }

  function buildSwitchComponent(state: string): ComponentNode {
    var on = state === "On";
    var c = makeComponent("Switch", "HORIZONTAL", 0, 2, 0);
    c.resize(44, 20);
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = on ? "MAX" : "MIN";
    c.counterAxisAlignItems = "CENTER";
    c.cornerRadius = 999;
    c.fills = on
      ? tokenPaint("primary", varMap)
      : fade(tokenPaint("input", varMap, "#E5E5E5"), 0.9);
    if (state === "Disabled") c.opacity = 0.5;
    c.appendChild(makeBox("Thumb", 24, 16, solid(tokenHex("background", "#FFFFFF")), 999));
    return c;
  }

  function buildSelectComponent(state: string): ComponentNode {
    var c = makeComponent("Select", "VERTICAL", 6);
    c.resize(220, 0);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";

    var label = makeTokenText(
      "Country",
      13,
      uiMediumStyle,
      state === "Disabled" ? "muted-foreground" : "foreground",
      varMap,
      "Label",
      uiMediumFamily
    );
    label.textAutoResize = "HEIGHT";
    label.resize(220, 18);
    c.appendChild(label);

    var field = makeFrame("Field", "HORIZONTAL", 8, 12);
    field.resize(220, 36);
    field.primaryAxisSizingMode = "FIXED";
    field.counterAxisSizingMode = "FIXED";
    field.primaryAxisAlignItems = "MIN";
    field.counterAxisAlignItems = "CENTER";
    field.cornerRadius = rad(2.2);
    field.fills = fade(tokenPaint("input", varMap, "#E5E5E5"), 0.5);
    if (state === "Focus") {
      field.strokes = tokenPaint("ring", varMap, "#A3A3A3");
      field.strokeWeight = 2;
      field.strokeAlign = "INSIDE";
    } else if (state === "Invalid") {
      field.strokes = tokenPaint("destructive", varMap, "#DC2626");
      field.strokeWeight = 1;
      field.strokeAlign = "INSIDE";
    } else if (state === "Disabled") {
      field.opacity = 0.5;
    }
    var value = makeTokenText("Select an option", 14, "Regular", "muted-foreground", varMap, "Value", sansFamily);
    value.layoutGrow = 1;
    field.appendChild(value);
    field.appendChild(makeIcon("chevron-down", tokenHex("muted-foreground", "#737373"), 16));
    c.appendChild(field);

    var helper = makeTokenText(
      "Select the country for shipping.",
      12,
      "Regular",
      state === "Invalid" ? "destructive" : "muted-foreground",
      varMap,
      "Helper",
      sansFamily
    );
    helper.textAutoResize = "HEIGHT";
    helper.resize(220, 16);
    c.appendChild(helper);
    return c;
  }

  // Display
  function buildCardComponent(size: string): ComponentNode {
    var small = size === "Sm";
    var pad = small ? 16 : 24;
    var c = makeComponent("Card", "VERTICAL", 12, pad, pad);
    c.resize(320, 200);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(2.6);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.effects = makeShadows(shadow, 0.8);

    var header = makeFrame("Header", "VERTICAL", 4);
    header.fills = [];
    header.appendChild(makeTokenText("Card Title", small ? 14 : 16, uiMediumStyle, "card-foreground", varMap, "Title", uiMediumFamily));
    header.appendChild(makeTokenText("Card description goes here.", 13, "Regular", "muted-foreground", varMap, "Description", sansFamily));
    c.appendChild(header);

    var content = makeFrame("Content", "VERTICAL", 0);
    content.fills = [];
    content.appendChild(makeTokenText("Card content with supporting text.", 13, "Regular", "card-foreground", varMap, "Body", sansFamily));
    c.appendChild(content);

    var footer = makeFrame("Footer", "HORIZONTAL", 8);
    footer.resize(320 - pad * 2, 0);
    footer.primaryAxisSizingMode = "FIXED";
    footer.counterAxisSizingMode = "AUTO";
    footer.fills = [];
    footer.primaryAxisAlignItems = "MAX";
    footer.counterAxisAlignItems = "CENTER";
    footer.appendChild(miniButton("Cancel", "outline"));
    footer.appendChild(miniButton("Continue", "default"));
    c.appendChild(footer);
    return c;
  }

  function buildAlertComponent(variant: string): ComponentNode {
    var destructive = variant === "Destructive";
    var c = makeComponent("Alert", "VERTICAL", 4, 16, 14);
    c.resize(320, 80);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(1.8);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint(destructive ? "destructive" : "border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.appendChild(makeTokenText("Alert Title", 14, uiMediumStyle, destructive ? "destructive" : "card-foreground", varMap, "Title", uiMediumFamily));
    c.appendChild(makeTokenText("This is an alert description.", 13, "Regular", destructive ? "destructive" : "muted-foreground", varMap, "Description", sansFamily));
    return c;
  }

  function buildAvatarComponent(sizeName: string, px: number, fontSize: number): ComponentNode {
    var c = makeComponent("Avatar", "HORIZONTAL", 0);
    c.resize(px, px);
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
    c.cornerRadius = px / 2;
    c.fills = tokenPaint("muted", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.appendChild(makeTokenText("IR", fontSize, uiMediumStyle, "muted-foreground", varMap, "Fallback", uiMediumFamily));
    return c;
  }

  function buildTableComponent(striped: boolean): ComponentNode {
    function cell(text: string, width: number, header: boolean, colorToken: string) {
      var cellFrame = makeFrame("Cell", "HORIZONTAL", 0);
      cellFrame.resize(width, 24);
      cellFrame.primaryAxisSizingMode = "FIXED";
      cellFrame.counterAxisSizingMode = "FIXED";
      cellFrame.primaryAxisAlignItems = "MIN";
      cellFrame.counterAxisAlignItems = "CENTER";
      cellFrame.appendChild(makeTokenText(
        text,
        13,
        header ? uiMediumStyle : "Regular",
        colorToken,
        varMap,
        "Text",
        header ? uiMediumFamily : sansFamily
      ));
      return cellFrame;
    }

    function tableRow(cells: string[], header: boolean, bg: Paint[] | null) {
      var row = makeFrame("Row", "HORIZONTAL", 0);
      row.paddingLeft = row.paddingRight = 16;
      row.paddingTop = row.paddingBottom = 12;
      row.resize(480, 44);
      row.primaryAxisSizingMode = "FIXED";
      row.counterAxisSizingMode = "AUTO";
      row.counterAxisAlignItems = "CENTER";
      if (bg && bg.length) row.fills = bg;
      row.strokes = tokenPaint("border", varMap);
      row.strokeWeight = 1;
      row.strokeAlign = "INSIDE";
      row.strokeTopWeight = 0;
      row.strokeLeftWeight = 0;
      row.strokeRightWeight = 0;
      row.strokeBottomWeight = 1;
      row.appendChild(cell(cells[0], 180, header, header ? "card-foreground" : "foreground"));
      row.appendChild(cell(cells[1], 140, header, header ? "card-foreground" : "muted-foreground"));
      row.appendChild(cell(cells[2], 128, header, header ? "card-foreground" : "muted-foreground"));
      return row;
    }

    var c = makeComponent("Table", "VERTICAL", 0);
    c.resize(480, 200);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(1.2);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.clipsContent = true;

    c.appendChild(tableRow(["Name", "Status", "Role"], true, tokenPaint("muted", varMap)));
    var rows = [
      ["Alice Johnson", "Active", "Admin"],
      ["Bob Smith", "Pending", "Editor"],
      ["Carol Lee", "Active", "Viewer"],
    ];
    for (var ri = 0; ri < rows.length; ri++) {
      var rowBg = striped && ri % 2 === 1 ? fade(tokenPaint("muted", varMap), 0.5) : null;
      c.appendChild(tableRow(rows[ri], false, rowBg));
    }
    return c;
  }

  function buildProgressComponent(value: number): ComponentNode {
    var c = makeComponent("Progress", "HORIZONTAL", 0);
    c.resize(240, 12);
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.cornerRadius = 999;
    c.clipsContent = true;
    c.fills = tokenPaint("muted", varMap);
    var width = Math.max(1, Math.round(240 * value / 100));
    c.appendChild(makeBox("Indicator", width, 12, tokenPaint("primary", varMap), 999));
    return c;
  }

  function buildSkeletonComponent(type: string): ComponentNode {
    var c = makeComponent("Skeleton", "HORIZONTAL", 0);
    c.fills = tokenPaint("muted", varMap);
    if (type === "Text") {
      c.resize(240, 12);
      c.cornerRadius = rad(1.8);
    } else if (type === "Circle") {
      c.resize(40, 40);
      c.cornerRadius = 20;
    } else {
      c.resize(280, 160);
      c.cornerRadius = rad(2.6);
    }
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    return c;
  }

  function buildSeparatorComponent(orientation: string): ComponentNode {
    var c = makeComponent("Separator", "HORIZONTAL", 0);
    c.fills = tokenPaint("border", varMap);
    if (orientation === "Vertical") {
      c.resize(1, 80);
    } else {
      c.resize(240, 1);
    }
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    return c;
  }

  // Navigation
  function buildBreadcrumbComponent(collapsed: boolean): ComponentNode {
    var c = makeComponent("Breadcrumb", "HORIZONTAL", 8);
    c.fills = [];
    c.counterAxisAlignItems = "CENTER";
    c.appendChild(makeTokenText("Home", 13, "Regular", "muted-foreground", varMap, "Link", sansFamily));
    c.appendChild(makeIcon("chevron-right", tokenHex("muted-foreground", "#737373"), 14));
    if (collapsed) {
      c.appendChild(makeIcon("ellipsis", tokenHex("muted-foreground", "#737373"), 16));
    } else {
      c.appendChild(makeTokenText("Library", 13, "Regular", "muted-foreground", varMap, "Link", sansFamily));
    }
    c.appendChild(makeIcon("chevron-right", tokenHex("muted-foreground", "#737373"), 14));
    c.appendChild(makeTokenText("Data", 13, uiMediumStyle, "foreground", varMap, "Page", uiMediumFamily));
    return c;
  }

  function buildPaginationComponent(compact: boolean): ComponentNode {
    function pageButton(label: string, active: boolean, icon?: string, iconAfter?: boolean) {
      var b = makeFrame("Page", "HORIZONTAL", icon ? 6 : 0);
      b.paddingLeft = b.paddingRight = 10;
      b.paddingTop = b.paddingBottom = 6;
      b.primaryAxisAlignItems = "CENTER";
      b.counterAxisAlignItems = "CENTER";
      b.cornerRadius = rad(0.8);
      if (active) {
        b.strokes = tokenPaint("border", varMap);
        b.strokeWeight = 1;
        b.strokeAlign = "INSIDE";
      }
      var iconColor = tokenHex(active ? "foreground" : "muted-foreground", "#737373");
      if (icon && !iconAfter) b.appendChild(makeIcon(icon, iconColor, 16));
      if (label) b.appendChild(makeTokenText(label, 13, active ? uiMediumStyle : "Regular", active ? "foreground" : "muted-foreground", varMap, "Label", active ? uiMediumFamily : sansFamily));
      if (icon && iconAfter) b.appendChild(makeIcon(icon, iconColor, 16));
      return b;
    }

    var c = makeComponent("Pagination", "HORIZONTAL", 4);
    c.fills = [];
    c.counterAxisAlignItems = "CENTER";
    c.appendChild(pageButton("Previous", false, "chevron-left"));
    c.appendChild(pageButton("1", false));
    c.appendChild(pageButton("2", true));
    c.appendChild(pageButton("3", false));
    if (!compact) c.appendChild(pageButton("", false, "ellipsis"));
    c.appendChild(pageButton("Next", false, "chevron-right", true));
    return c;
  }

  function buildTabsComponent(variant: string): ComponentNode {
    var line = variant === "Line";
    var c = makeComponent("Tabs", "VERTICAL", 12);
    c.fills = [];
    c.counterAxisAlignItems = "MIN";

    var list = makeFrame("Tabs List", "HORIZONTAL", line ? 4 : 0);
    list.paddingLeft = list.paddingRight = line ? 0 : 4;
    list.paddingTop = list.paddingBottom = line ? 0 : 4;
    list.cornerRadius = line ? 0 : 999;
    list.fills = line ? [] : tokenPaint("muted", varMap);
    var labels = ["Account", "Password", "Settings"];
    for (var ti = 0; ti < labels.length; ti++) {
      var trigger = makeFrame("Trigger", "HORIZONTAL", 0);
      trigger.paddingLeft = trigger.paddingRight = 14;
      trigger.paddingTop = trigger.paddingBottom = 6;
      trigger.cornerRadius = 999;
      if (!line && ti === 0) {
        trigger.fills = tokenPaint("background", varMap);
        trigger.strokes = tokenPaint("border", varMap);
        trigger.strokeWeight = 1;
        trigger.strokeAlign = "INSIDE";
      } else if (line && ti === 0) {
        trigger.strokes = tokenPaint("foreground", varMap);
        trigger.strokeWeight = 1;
        trigger.strokeAlign = "INSIDE";
        trigger.strokeTopWeight = 0;
        trigger.strokeLeftWeight = 0;
        trigger.strokeRightWeight = 0;
        trigger.strokeBottomWeight = 2;
      }
      trigger.appendChild(makeTokenText(
        labels[ti],
        13,
        ti === 0 ? uiMediumStyle : "Regular",
        ti === 0 ? "foreground" : "muted-foreground",
        varMap,
        "Label",
        ti === 0 ? uiMediumFamily : sansFamily
      ));
      list.appendChild(trigger);
    }
    c.appendChild(list);

    var content = makeFrame("Tabs Content", "VERTICAL", 0);
    content.fills = [];
    content.paddingTop = 4;
    content.appendChild(makeTokenText("Tab content goes here.", 13, "Regular", "foreground", varMap, "Body", sansFamily));
    c.appendChild(content);
    return c;
  }

  function buildAccordionComponent(open: boolean): ComponentNode {
    var c = makeComponent("Accordion", "VERTICAL", 0);
    c.resize(320, open ? 140 : 52);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(1.8);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.clipsContent = true;

    var trigger = makeFrame("Trigger", "HORIZONTAL", 8);
    trigger.paddingLeft = trigger.paddingRight = 16;
    trigger.paddingTop = trigger.paddingBottom = 14;
    trigger.resize(320, 48);
    trigger.primaryAxisSizingMode = "FIXED";
    trigger.counterAxisSizingMode = "AUTO";
    trigger.counterAxisAlignItems = "CENTER";
    var title = makeTokenText("Is it accessible?", 14, uiMediumStyle, "foreground", varMap, "Title", uiMediumFamily);
    title.layoutGrow = 1;
    trigger.appendChild(title);
    trigger.appendChild(makeIcon(
      open ? "chevron-up" : "chevron-down",
      tokenHex("muted-foreground", "#737373"),
      16
    ));
    c.appendChild(trigger);

    if (open) {
      var divider = makeBox("Divider", 320, 1, tokenPaint("border", varMap));
      divider.layoutAlign = "STRETCH";
      c.appendChild(divider);
      var content = makeFrame("Content", "VERTICAL", 0);
      content.paddingLeft = content.paddingRight = 16;
      content.paddingTop = 12;
      content.paddingBottom = 16;
      content.resize(320, 0);
      content.primaryAxisSizingMode = "AUTO";
      content.counterAxisSizingMode = "FIXED";
      var body = makeTokenText("Yes. It adheres to the WAI-ARIA design pattern.", 13, "Regular", "muted-foreground", varMap, "Body", sansFamily);
      body.textAutoResize = "HEIGHT";
      body.resize(288, 20);
      content.appendChild(body);
      c.appendChild(content);
    }
    return c;
  }

  // Overlays
  function buildDialogComponent(variant: string): ComponentNode {
    var destructive = variant === "Destructive";
    var c = makeComponent("Dialog", "VERTICAL", 16, 24, 24);
    c.resize(400, 200);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(2.6);
    c.fills = tokenPaint("popover", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.effects = makeShadows(shadow, 1.4);

    var topRow = makeFrame("Top", "HORIZONTAL", 0);
    topRow.resize(352, 24);
    topRow.primaryAxisSizingMode = "FIXED";
    topRow.counterAxisSizingMode = "AUTO";
    topRow.counterAxisAlignItems = "CENTER";
    var title = makeTokenText("Dialog Title", 18, uiMediumStyle, destructive ? "destructive" : "popover-foreground", varMap, "Title", uiMediumFamily);
    title.layoutGrow = 1;
    topRow.appendChild(title);
    topRow.appendChild(makeIcon("x", tokenHex("muted-foreground", "#737373"), 16));
    c.appendChild(topRow);
    c.appendChild(makeTokenText("This is a dialog description.", 13, "Regular", "muted-foreground", varMap, "Description", sansFamily));
    c.appendChild(makeTokenText("Dialog content with supporting text.", 13, "Regular", "popover-foreground", varMap, "Body", sansFamily));

    var footer = makeFrame("Footer", "HORIZONTAL", 8);
    footer.resize(352, 0);
    footer.primaryAxisSizingMode = "FIXED";
    footer.counterAxisSizingMode = "AUTO";
    footer.fills = [];
    footer.primaryAxisAlignItems = "MAX";
    footer.counterAxisAlignItems = "CENTER";
    footer.appendChild(miniButton("Cancel", "outline"));
    footer.appendChild(miniButton("Continue", destructive ? "destructive" : "default"));
    c.appendChild(footer);
    return c;
  }

  function buildDropdownComponent(open: boolean): ComponentNode {
    function menuItem(label: string, destructive: boolean) {
      var row = makeFrame("Item", "HORIZONTAL", 0);
      row.paddingLeft = row.paddingRight = 10;
      row.paddingTop = row.paddingBottom = 8;
      row.resize(208, 0);
      row.primaryAxisSizingMode = "FIXED";
      row.counterAxisSizingMode = "AUTO";
      row.cornerRadius = rad(1.4);
      row.appendChild(makeTokenText(
        label,
        13,
        uiMediumStyle,
        destructive ? "destructive" : "popover-foreground",
        varMap,
        "Label",
        uiMediumFamily
      ));
      return row;
    }

    var c = makeComponent("Dropdown Menu", "VERTICAL", 8);
    c.fills = [];
    c.counterAxisAlignItems = "MIN";
    c.appendChild(miniButton("Options", "outline"));
    if (open) {
      var menu = makeFrame("Menu", "VERTICAL", 2);
      menu.paddingLeft = menu.paddingRight = 6;
      menu.paddingTop = menu.paddingBottom = 6;
      menu.resize(220, 0);
      menu.primaryAxisSizingMode = "AUTO";
      menu.counterAxisSizingMode = "FIXED";
      menu.counterAxisAlignItems = "MIN";
      menu.cornerRadius = rad(2.2);
      menu.fills = tokenPaint("popover", varMap);
      menu.strokes = tokenPaint("border", varMap);
      menu.strokeWeight = 1;
      menu.strokeAlign = "INSIDE";
      menu.effects = makeShadows(shadow, 1);
      menu.appendChild(makeTokenText("My Account", 11, "Regular", "muted-foreground", varMap, "Group Label", sansFamily));
      menu.appendChild(menuItem("Profile", false));
      menu.appendChild(menuItem("Settings", false));
      var divider = makeBox("Divider", 196, 1, tokenPaint("border", varMap));
      divider.layoutAlign = "STRETCH";
      menu.appendChild(divider);
      menu.appendChild(menuItem("Delete", true));
      c.appendChild(menu);
    }
    return c;
  }

  function buildTooltipComponent(withShortcut: boolean): ComponentNode {
    var c = makeComponent("Tooltip", "VERTICAL", 4);
    c.fills = [];
    c.counterAxisAlignItems = "CENTER";
    var bubble = makeFrame("Bubble", "HORIZONTAL", 8);
    bubble.paddingLeft = bubble.paddingRight = 12;
    bubble.paddingTop = bubble.paddingBottom = 6;
    bubble.cornerRadius = rad(1.4);
    bubble.fills = tokenPaint("foreground", varMap);
    bubble.counterAxisAlignItems = "CENTER";
    bubble.appendChild(makeTokenText("Tooltip", 12, uiMediumStyle, "background", varMap, "Label", uiMediumFamily));
    if (withShortcut) {
      var kbd = makeFrame("Kbd", "HORIZONTAL", 0);
      kbd.paddingLeft = kbd.paddingRight = 5;
      kbd.paddingTop = kbd.paddingBottom = 1;
      kbd.cornerRadius = rad(0.6);
      kbd.fills = fade(tokenPaint("background", varMap), 0.15);
      kbd.appendChild(makeTokenText("Cmd K", 10, "Regular", "background", varMap, "Shortcut", sansFamily));
      bubble.appendChild(kbd);
    }
    c.appendChild(bubble);
    c.appendChild(makeGlyph("Arrow", "M 0 0 L 10 0 L 5 5 Z", tokenHex("foreground", "#000000"), 10));
    return c;
  }

  function buildPopoverComponent(withForm: boolean): ComponentNode {
    var c = makeComponent("Popover", "VERTICAL", 12, 16, 16);
    c.resize(288, 140);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(2.2);
    c.fills = tokenPaint("popover", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.effects = makeShadows(shadow, 1);
    c.appendChild(makeTokenText("Dimensions", 14, uiMediumStyle, "popover-foreground", varMap, "Title", uiMediumFamily));
    c.appendChild(makeTokenText("Set the dimensions for the layer.", 12, "Regular", "muted-foreground", varMap, "Description", sansFamily));
    if (withForm) {
      var row = makeFrame("Row", "HORIZONTAL", 8);
      row.fills = [];
      row.counterAxisAlignItems = "CENTER";
      var input = makeFrame("Input", "HORIZONTAL", 0, 10);
      input.resize(180, 32);
      input.primaryAxisSizingMode = "FIXED";
      input.counterAxisSizingMode = "FIXED";
      input.paddingTop = input.paddingBottom = 0;
      input.counterAxisAlignItems = "CENTER";
      input.cornerRadius = rad(2.2);
      input.fills = fade(tokenPaint("input", varMap), 0.5);
      input.appendChild(makeTokenText("100%", 12, "Regular", "foreground", varMap, "Value", sansFamily));
      row.appendChild(input);
      row.appendChild(miniButton("Set", "default"));
      c.appendChild(row);
    }
    return c;
  }

  function buildHoverCardComponent(compact: boolean): ComponentNode {
    var c = makeComponent("Hover Card", "VERTICAL", 10, 16, 16);
    c.resize(288, 140);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.cornerRadius = rad(2.2);
    c.fills = tokenPaint("popover", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.effects = makeShadows(shadow, 1);

    var header = makeFrame("Header", "HORIZONTAL", 10);
    header.fills = [];
    header.counterAxisAlignItems = "CENTER";
    header.appendChild(avatarCircle(40, "IR", 14));
    var names = makeFrame("Names", "VERTICAL", 2);
    names.fills = [];
    names.appendChild(makeTokenText("Iroha Studio", 14, uiMediumStyle, "popover-foreground", varMap, "Name", uiMediumFamily));
    names.appendChild(makeTokenText("@iroha", 12, "Regular", "muted-foreground", varMap, "Handle", sansFamily));
    header.appendChild(names);
    c.appendChild(header);
    if (!compact) {
      c.appendChild(makeTokenText("Design tokens, components, and themes for modern product teams.", 12, "Regular", "muted-foreground", varMap, "Description", sansFamily));
    }
    return c;
  }

  function buildSheetComponent(side: string): ComponentNode {
    var c = makeComponent("Sheet", "VERTICAL", 16, 24, 24);
    c.resize(320, 400);
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "MIN";
    c.fills = tokenPaint("popover", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.strokeTopWeight = 0;
    c.strokeBottomWeight = 0;
    c.strokeLeftWeight = side === "Right" ? 1 : 0;
    c.strokeRightWeight = side === "Left" ? 1 : 0;
    c.clipsContent = true;

    var topRow = makeFrame("Top", "HORIZONTAL", 0);
    topRow.resize(272, 24);
    topRow.primaryAxisSizingMode = "FIXED";
    topRow.counterAxisSizingMode = "AUTO";
    topRow.counterAxisAlignItems = "CENTER";
    var title = makeTokenText("Sheet Title", 16, uiMediumStyle, "popover-foreground", varMap, "Title", uiMediumFamily);
    title.layoutGrow = 1;
    topRow.appendChild(title);
    topRow.appendChild(makeIcon("x", tokenHex("muted-foreground", "#737373"), 16));
    c.appendChild(topRow);
    c.appendChild(makeTokenText("This is a sheet description.", 13, "Regular", "muted-foreground", varMap, "Description", sansFamily));
    var divider = makeBox("Divider", 272, 1, tokenPaint("border", varMap));
    divider.layoutAlign = "STRETCH";
    c.appendChild(divider);
    c.appendChild(makeTokenText("Sheet content with supporting text and actions.", 13, "Regular", "popover-foreground", varMap, "Body", sansFamily));
    c.appendChild(miniButton("Continue", "default"));
    return c;
  }

  // Interactive
  function buildToggleComponent(variant: string, state: string): ComponentNode {
    var outline = variant === "Outline";
    var on = state === "On";
    var c = makeComponent("Toggle", "HORIZONTAL", 6, 14, 0);
    c.resize(90, 36);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
    c.cornerRadius = rad(3.0);
    if (on) {
      c.fills = tokenPaint("muted", varMap);
    } else {
      c.fills = [];
    }
    if (outline) {
      c.strokes = tokenPaint("input", varMap);
      c.strokeWeight = 1;
      c.strokeAlign = "INSIDE";
    }
    c.appendChild(makeTokenText("Toggle", 13, uiMediumStyle, on ? "foreground" : "muted-foreground", varMap, "Label", uiMediumFamily));
    return c;
  }

  function buildSliderComponent(value: number): ComponentNode {
    var c = makeComponent("Slider", "NONE");
    c.resize(240, 24);
    c.fills = [];
    var track = makeBox("Track", 240, 8, fade(tokenPaint("input", varMap, "#E5E5E5"), 0.9), 999);
    track.x = 0;
    track.y = 8;
    c.appendChild(track);
    var rangeW = Math.round(240 * value / 100);
    if (rangeW > 0) {
      var range = makeBox("Range", rangeW, 8, tokenPaint("primary", varMap), 999);
      range.x = 0;
      range.y = 8;
      c.appendChild(range);
    }
    var thumb = makeBox(
      "Thumb",
      24,
      16,
      solid(tokenHex("background", "#FFFFFF")),
      999,
      tokenPaint("border", varMap)
    );
    thumb.x = Math.max(0, Math.min(216, Math.round((240 - 24) * value / 100)));
    thumb.y = 4;
    c.appendChild(thumb);
    return c;
  }

  function buildScrollAreaComponent(vertical: boolean): ComponentNode {
    var c = makeComponent("Scroll Area", "NONE");
    c.resize(240, 120);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.cornerRadius = rad(1.4);
    c.clipsContent = true;
    for (var li = 0; li < 5; li++) {
      var line = makeBox("Line", 180, 8, tokenPaint("muted", varMap), 4);
      line.x = 12;
      line.y = 12 + li * 20;
      c.appendChild(line);
    }
    if (vertical) {
      var vbar = makeBox("Scrollbar", 8, 100, fade(tokenPaint("muted", varMap), 0.8), 4);
      vbar.x = 224;
      vbar.y = 10;
      c.appendChild(vbar);
      var vthumb = makeBox("Thumb", 8, 44, tokenPaint("border", varMap), 4);
      vthumb.x = 224;
      vthumb.y = 10;
      c.appendChild(vthumb);
    } else {
      var hbar = makeBox("Scrollbar", 220, 8, fade(tokenPaint("muted", varMap), 0.8), 4);
      hbar.x = 10;
      hbar.y = 104;
      c.appendChild(hbar);
      var hthumb = makeBox("Thumb", 96, 8, tokenPaint("border", varMap), 4);
      hthumb.x = 10;
      hthumb.y = 104;
      c.appendChild(hthumb);
    }
    return c;
  }

  function buildCalendarComponent(selectedDay: number | null): ComponentNode {
    var c = makeComponent("Calendar", "VERTICAL", 12, 16, 16);
    c.resize(280, 300);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.counterAxisAlignItems = "CENTER";
    c.cornerRadius = rad(2.2);
    c.fills = tokenPaint("card", varMap);
    c.strokes = tokenPaint("border", varMap);
    c.strokeWeight = 1;
    c.strokeAlign = "INSIDE";
    c.effects = makeShadows(shadow, 0.8);

    var header = makeFrame("Header", "HORIZONTAL", 8);
    header.resize(248, 24);
    header.primaryAxisSizingMode = "FIXED";
    header.counterAxisSizingMode = "AUTO";
    header.counterAxisAlignItems = "CENTER";
    header.appendChild(makeIcon("chevron-left", tokenHex("muted-foreground", "#737373"), 16));
    var month = makeTokenText("November 2026", 14, uiMediumStyle, "foreground", varMap, "Month", uiMediumFamily);
    month.layoutGrow = 1;
    month.textAlignHorizontal = "CENTER";
    header.appendChild(month);
    header.appendChild(makeIcon("chevron-right", tokenHex("muted-foreground", "#737373"), 16));
    c.appendChild(header);

    var weekdays = makeFrame("Weekdays", "HORIZONTAL", 0);
    weekdays.fills = [];
    var dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    for (var wi = 0; wi < dayNames.length; wi++) {
      var wd = makeFrame("Weekday", "HORIZONTAL", 0);
      wd.resize(32, 20);
      wd.primaryAxisSizingMode = "FIXED";
      wd.counterAxisSizingMode = "FIXED";
      wd.primaryAxisAlignItems = "CENTER";
      wd.counterAxisAlignItems = "CENTER";
      wd.appendChild(makeTokenText(dayNames[wi], 10, "Regular", "muted-foreground", varMap, "Label", sansFamily));
      weekdays.appendChild(wd);
    }
    c.appendChild(weekdays);

    var day = 1;
    for (var dr = 0; dr < 5; dr++) {
      var week = makeFrame("Week", "HORIZONTAL", 0);
      week.fills = [];
      for (var dc = 0; dc < 7; dc++) {
        var cellDay = makeFrame("Day", "HORIZONTAL", 0);
        cellDay.resize(32, 32);
        cellDay.primaryAxisSizingMode = "FIXED";
        cellDay.counterAxisSizingMode = "FIXED";
        cellDay.primaryAxisAlignItems = "CENTER";
        cellDay.counterAxisAlignItems = "CENTER";
        cellDay.cornerRadius = 16;
        if (day <= 30) {
          var selected = selectedDay !== null && day === selectedDay;
          if (selected) cellDay.fills = tokenPaint("primary", varMap);
          cellDay.appendChild(makeTokenText(
            String(day),
            12,
            selected ? uiMediumStyle : "Regular",
            selected ? "primary-foreground" : "foreground",
            varMap,
            "Date",
            selected ? uiMediumFamily : sansFamily
          ));
          day++;
        }
        week.appendChild(cellDay);
      }
      c.appendChild(week);
    }
    return c;
  }

  // ── Section: Form controls ──
  var secForms = makeSectionFrame(
    "Components · Forms",
    "Form Controls",
    "Inputs, labels, selection controls, and select menus"
  );
  var formWrap = makeFrame("Components", "VERTICAL", 32);
  formWrap.fills = [];
  var inputSet = makeComponentSet("Input", [
    { name: "State=Default", build: function () { return buildInputComponent("Default"); } },
    { name: "State=Focus", build: function () { return buildInputComponent("Focus"); } },
    { name: "State=Invalid", build: function () { return buildInputComponent("Invalid"); } },
    { name: "State=Disabled", build: function () { return buildInputComponent("Disabled"); } },
  ], 2);
  bindFieldProperties(inputSet, "Email", "We'll never share your email.");
  addSetBlock(formWrap, "Input", inputSet);
  var textareaSet = makeComponentSet("Textarea", [
    { name: "State=Default", build: function () { return buildTextareaComponent("Default"); } },
    { name: "State=Focus", build: function () { return buildTextareaComponent("Focus"); } },
    { name: "State=Invalid", build: function () { return buildTextareaComponent("Invalid"); } },
    { name: "State=Disabled", build: function () { return buildTextareaComponent("Disabled"); } },
  ], 2);
  bindFieldProperties(textareaSet, "Message", "You can write up to 500 characters.");
  addSetBlock(formWrap, "Textarea", textareaSet);
  addSetBlock(formWrap, "Label", makeComponentSet("Label", [
    { name: "State=Default", build: function () { return buildLabelComponent("Default"); } },
    { name: "State=Disabled", build: function () { return buildLabelComponent("Disabled"); } },
  ], 2));
  addSetBlock(formWrap, "Checkbox", makeComponentSet("Checkbox", [
    { name: "State=Unchecked", build: function () { return buildCheckboxComponent("Unchecked"); } },
    { name: "State=Checked", build: function () { return buildCheckboxComponent("Checked"); } },
    { name: "State=Indeterminate", build: function () { return buildCheckboxComponent("Indeterminate"); } },
    { name: "State=Disabled", build: function () { return buildCheckboxComponent("Disabled"); } },
  ], 4));
  addSetBlock(formWrap, "Radio Group", makeComponentSet("Radio Group", [
    { name: "State=Unselected", build: function () { return buildRadioComponent("Unselected"); } },
    { name: "State=Selected", build: function () { return buildRadioComponent("Selected"); } },
    { name: "State=Disabled", build: function () { return buildRadioComponent("Disabled"); } },
  ], 3));
  addSetBlock(formWrap, "Switch", makeComponentSet("Switch", [
    { name: "State=Off", build: function () { return buildSwitchComponent("Off"); } },
    { name: "State=On", build: function () { return buildSwitchComponent("On"); } },
    { name: "State=Disabled", build: function () { return buildSwitchComponent("Disabled"); } },
  ], 3));
  var selectSet = makeComponentSet("Select", [
    { name: "State=Default", build: function () { return buildSelectComponent("Default"); } },
    { name: "State=Focus", build: function () { return buildSelectComponent("Focus"); } },
    { name: "State=Invalid", build: function () { return buildSelectComponent("Invalid"); } },
    { name: "State=Disabled", build: function () { return buildSelectComponent("Disabled"); } },
  ], 2);
  bindFieldProperties(selectSet, "Country", "Select the country for shipping.");
  addSetBlock(formWrap, "Select", selectSet);
  secForms.appendChild(formWrap);
  root.appendChild(secForms);

  // ── Section: Data display ──
  var secDisplay = makeSectionFrame(
    "Components · Display",
    "Data Display",
    "Cards, alerts, avatars, tables, progress, and placeholders"
  );
  var displayWrap = makeFrame("Components", "VERTICAL", 32);
  displayWrap.fills = [];
  addSetBlock(displayWrap, "Card", makeComponentSet("Card", [
    { name: "Size=Default", build: function () { return buildCardComponent("Default"); } },
    { name: "Size=Sm", build: function () { return buildCardComponent("Sm"); } },
  ], 2));
  addSetBlock(displayWrap, "Alert", makeComponentSet("Alert", [
    { name: "Variant=Default", build: function () { return buildAlertComponent("Default"); } },
    { name: "Variant=Destructive", build: function () { return buildAlertComponent("Destructive"); } },
  ], 2));
  addSetBlock(displayWrap, "Avatar", makeComponentSet("Avatar", [
    { name: "Size=Sm", build: function () { return buildAvatarComponent("Sm", 24, 10); } },
    { name: "Size=Default", build: function () { return buildAvatarComponent("Default", 32, 12); } },
    { name: "Size=Lg", build: function () { return buildAvatarComponent("Lg", 40, 14); } },
  ], 3));
  addSetBlock(displayWrap, "Table", makeComponentSet("Table", [
    { name: "Variant=Default", build: function () { return buildTableComponent(false); } },
    { name: "Variant=Striped", build: function () { return buildTableComponent(true); } },
  ], 2));
  addSetBlock(displayWrap, "Progress", makeComponentSet("Progress", [
    { name: "Value=0", build: function () { return buildProgressComponent(0); } },
    { name: "Value=25", build: function () { return buildProgressComponent(25); } },
    { name: "Value=50", build: function () { return buildProgressComponent(50); } },
    { name: "Value=75", build: function () { return buildProgressComponent(75); } },
    { name: "Value=100", build: function () { return buildProgressComponent(100); } },
  ], 3));
  addSetBlock(displayWrap, "Skeleton", makeComponentSet("Skeleton", [
    { name: "Type=Text", build: function () { return buildSkeletonComponent("Text"); } },
    { name: "Type=Circle", build: function () { return buildSkeletonComponent("Circle"); } },
    { name: "Type=Card", build: function () { return buildSkeletonComponent("Card"); } },
  ], 3));
  addSetBlock(displayWrap, "Separator", makeComponentSet("Separator", [
    { name: "Orientation=Horizontal", build: function () { return buildSeparatorComponent("Horizontal"); } },
    { name: "Orientation=Vertical", build: function () { return buildSeparatorComponent("Vertical"); } },
  ], 2));
  secDisplay.appendChild(displayWrap);
  root.appendChild(secDisplay);

  // ── Section: Navigation ──
  var secNav = makeSectionFrame(
    "Components · Navigation",
    "Navigation & Disclosure",
    "Breadcrumbs, pagination, tabs, and accordions"
  );
  var navWrap = makeFrame("Components", "VERTICAL", 32);
  navWrap.fills = [];
  addSetBlock(navWrap, "Breadcrumb", makeComponentSet("Breadcrumb", [
    { name: "State=Default", build: function () { return buildBreadcrumbComponent(false); } },
    { name: "State=Collapsed", build: function () { return buildBreadcrumbComponent(true); } },
  ], 2));
  addSetBlock(navWrap, "Pagination", makeComponentSet("Pagination", [
    { name: "State=Default", build: function () { return buildPaginationComponent(false); } },
    { name: "State=Compact", build: function () { return buildPaginationComponent(true); } },
  ], 2));
  addSetBlock(navWrap, "Tabs", makeComponentSet("Tabs", [
    { name: "Variant=Default", build: function () { return buildTabsComponent("Default"); } },
    { name: "Variant=Line", build: function () { return buildTabsComponent("Line"); } },
  ], 2));
  addSetBlock(navWrap, "Accordion", makeComponentSet("Accordion", [
    { name: "State=Closed", build: function () { return buildAccordionComponent(false); } },
    { name: "State=Open", build: function () { return buildAccordionComponent(true); } },
  ], 2));
  secNav.appendChild(navWrap);
  root.appendChild(secNav);

  // ── Section: Overlays ──
  var secOverlay = makeSectionFrame(
    "Components · Overlays",
    "Overlays",
    "Dialogs, sheets, menus, popovers, hover cards, and tooltips"
  );
  var overlayWrap = makeFrame("Components", "VERTICAL", 32);
  overlayWrap.fills = [];
  addSetBlock(overlayWrap, "Dialog", makeComponentSet("Dialog", [
    { name: "Variant=Default", build: function () { return buildDialogComponent("Default"); } },
    { name: "Variant=Destructive", build: function () { return buildDialogComponent("Destructive"); } },
  ], 2));
  addSetBlock(overlayWrap, "Sheet", makeComponentSet("Sheet", [
    { name: "Side=Right", build: function () { return buildSheetComponent("Right"); } },
    { name: "Side=Left", build: function () { return buildSheetComponent("Left"); } },
  ], 2));
  addSetBlock(overlayWrap, "Dropdown Menu", makeComponentSet("Dropdown Menu", [
    { name: "State=Closed", build: function () { return buildDropdownComponent(false); } },
    { name: "State=Open", build: function () { return buildDropdownComponent(true); } },
  ], 2));
  addSetBlock(overlayWrap, "Popover", makeComponentSet("Popover", [
    { name: "Variant=Default", build: function () { return buildPopoverComponent(false); } },
    { name: "Variant=Form", build: function () { return buildPopoverComponent(true); } },
  ], 2));
  addSetBlock(overlayWrap, "Hover Card", makeComponentSet("Hover Card", [
    { name: "State=Default", build: function () { return buildHoverCardComponent(false); } },
    { name: "State=Compact", build: function () { return buildHoverCardComponent(true); } },
  ], 2));
  addSetBlock(overlayWrap, "Tooltip", makeComponentSet("Tooltip", [
    { name: "Variant=Default", build: function () { return buildTooltipComponent(false); } },
    { name: "Variant=Shortcut", build: function () { return buildTooltipComponent(true); } },
  ], 2));
  secOverlay.appendChild(overlayWrap);
  root.appendChild(secOverlay);

  // ── Section: Interactive ──
  var secInteractive = makeSectionFrame(
    "Components · Interactive",
    "Interactive Controls",
    "Toggles, sliders, scroll areas, and calendars"
  );
  var interactiveWrap = makeFrame("Components", "VERTICAL", 32);
  interactiveWrap.fills = [];
  addSetBlock(interactiveWrap, "Toggle", makeComponentSet("Toggle", [
    { name: "Variant=Default, State=Off", build: function () { return buildToggleComponent("Default", "Off"); } },
    { name: "Variant=Default, State=On", build: function () { return buildToggleComponent("Default", "On"); } },
    { name: "Variant=Outline, State=Off", build: function () { return buildToggleComponent("Outline", "Off"); } },
    { name: "Variant=Outline, State=On", build: function () { return buildToggleComponent("Outline", "On"); } },
  ], 2));
  addSetBlock(interactiveWrap, "Slider", makeComponentSet("Slider", [
    { name: "Value=0", build: function () { return buildSliderComponent(0); } },
    { name: "Value=50", build: function () { return buildSliderComponent(50); } },
    { name: "Value=100", build: function () { return buildSliderComponent(100); } },
  ], 3));
  addSetBlock(interactiveWrap, "Scroll Area", makeComponentSet("Scroll Area", [
    { name: "Orientation=Vertical", build: function () { return buildScrollAreaComponent(true); } },
    { name: "Orientation=Horizontal", build: function () { return buildScrollAreaComponent(false); } },
  ], 2));
  addSetBlock(interactiveWrap, "Calendar", makeComponentSet("Calendar", [
    { name: "State=Default", build: function () { return buildCalendarComponent(18); } },
    { name: "State=Unselected", build: function () { return buildCalendarComponent(null); } },
  ], 2));
  secInteractive.appendChild(interactiveWrap);
  root.appendChild(secInteractive);

  // ── Canvas: paint the page background with the design's background token ──
  try {
    figma.currentPage.backgrounds = [{ type: "SOLID", color: hexToRgb(tokens.background ? tokens.background.light : "#FFFFFF") }];
  } catch (e) { /* keep default background */ }

  figma.viewport.scrollAndZoomIntoView([root]);
}

figma.showUI(__html__, { width: 380, height: 300 });

figma.ui.onmessage = async function (t) {
  try {
    await importTokens(t);
    figma.notify("Design system imported ✓");
    figma.closePlugin();
  } catch (e: any) {
    figma.notify("Gagal: " + (e && e.message ? e.message : e), { error: true });
  }
};
