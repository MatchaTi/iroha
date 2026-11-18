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
//   tokens: Record<string, { light: string, dark?: string }>,  // 32 shadcn
//   tokens, hex (#RRGGBB / #RRGGBBAA), keys in kebab-case
//   typography: { sans: string | null, serif: string | null, mono: string | null },
//   radius: number | null,        // rem
//   shadow: { color, opacity, x, y, blur, spread } | null,
// }
//
// Generates:
//   · "Design Tokens" variables collection with Light/Dark modes (32 colors)
//   · One paint style per token, bound to its variable
//   · Text styles (Heading / Body / Serif / Mono) from the design typography
//   · A radius variable + corner preview tiers
//   · Effect styles for the shadow tiers (sm/md/lg/xl) + previews
//   · Button & Badge component sets bound to the color variables
// ─────────────────────────────────────────────────────────────────────────────
// ---------- color helpers ----------
function hexToRgb(hex) {
    var n = parseInt(hex.replace("#", "").slice(0, 6), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
/** Parse #RRGGBB / #RRGGBBAA into Figma RGBA (0–1). */
function parseColor(hex) {
    var h = (hex || "#000000").replace("#", "");
    var rgb = hexToRgb("#" + h.slice(0, 6));
    var a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: a };
}
function readableOn(hex) {
    var n = parseInt(hex.replace("#", "").slice(0, 6), 16);
    var lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
    return lum > 150 ? "#1A1A1A" : "#FFFFFF";
}
function solid(hex) {
    return [{ type: "SOLID", color: hexToRgb(hex) }];
}
/** Solid paint bound to a token variable (falls back to raw hex). */
function tokenPaint(token, varMap) {
    var v = varMap[token];
    var hex = currentLightHex[token] || "#000000";
    if (v) {
        try {
            return [
                figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hexToRgb(hex) }, "color", v),
            ];
        }
        catch (e) { /* fall through */ }
    }
    return solid(hex);
}
function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}
// ---------- font helpers ----------
function toFigmaStyle(weight) {
    var map = {
        "100": "Thin", "200": "ExtraLight", "300": "Light",
        "400": "Regular", "500": "Medium", "600": "SemiBold",
        "700": "Bold", "800": "ExtraBold", "900": "Black",
    };
    return map[(weight || "400").toString()] || "Regular";
}
// Web families may carry a " Variable" suffix; Figma usually registers the
// plain family name. Try the original name, then common aliases.
function figmaFontCandidates(family) {
    var list = [];
    if (!family)
        return ["Inter"];
    list.push(family);
    var stripped = family.replace(/\s+Variable$/i, "").trim();
    if (stripped && list.indexOf(stripped) < 0)
        list.push(stripped);
    var lower = family.toLowerCase();
    if (lower.indexOf("inter") >= 0 && list.indexOf("Inter") < 0)
        list.push("Inter");
    if (list.indexOf("Inter") < 0)
        list.push("Inter");
    return list;
}
async function loadFigmaFont(family, style) {
    var families = figmaFontCandidates(family);
    var styles = [style || "Regular"];
    if (styles.indexOf("Regular") < 0)
        styles.push("Regular");
    for (var f = 0; f < families.length; f++) {
        for (var s = 0; s < styles.length; s++) {
            try {
                await figma.loadFontAsync({ family: families[f], style: styles[s] });
                return { family: families[f], style: styles[s] };
            }
            catch (e) { /* try next */ }
        }
    }
    return null;
}
// ---------- layout helpers ----------
function makeFrame(name, mode, gap, pad) {
    var f = figma.createFrame();
    f.name = name;
    f.layoutMode = mode;
    f.itemSpacing = gap || 0;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.fills = [];
    if (pad)
        f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = pad;
    return f;
}
function makeText(chars, size, style, hex, name, family) {
    var t = figma.createText();
    t.fontName = { family: family || "Inter", style: style };
    t.fontSize = size;
    t.characters = chars;
    t.fills = solid(hex);
    if (name)
        t.name = name;
    return t;
}
function makeSectionFrame(name, title, description) {
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
/** Source-of-light hex per token, used as fallback paint base. */
var currentLightHex = {};
// ---------- main ----------
async function importTokens(t) {
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
    try {
        await figma.loadFontAsync({ family: "Source Code Pro", style: "Regular" });
    }
    catch (e) { }
    try {
        await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" });
    }
    catch (e) { }
    var sansFont = await loadFigmaFont(typography.sans || "Inter", "Regular");
    var sansFamily = sansFont ? sansFont.family : "Inter";
    var sansLoaded = await loadFigmaFont(typography.sans || "Inter", "SemiBold");
    var sansSemiboldFamily = sansLoaded ? sansLoaded.family : sansFamily;
    var sansSemiboldStyle = sansLoaded ? sansLoaded.style : "Regular";
    var serifFont = typography.serif ? await loadFigmaFont(typography.serif, "Regular") : null;
    var monoFont = typography.mono ? await loadFigmaFont(typography.mono, "Regular") : null;
    // ── Variables: one collection, two modes (Light / Dark) ──
    var varMap = {};
    var collection = figma.variables.createVariableCollection("Design Tokens");
    var lightModeId = collection.modes[0].modeId;
    collection.renameMode(lightModeId, "Light");
    var darkModeId = collection.addMode("Dark");
    for (var name of tokenNames) {
        var entry = tokens[name];
        var v = figma.variables.createVariable(name, collection, "COLOR");
        v.setValueForMode(lightModeId, parseColor(entry.light));
        v.setValueForMode(darkModeId, parseColor(entry.dark || entry.light));
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
                figma.variables.setBoundVariableForPaint({ type: "SOLID", color: base }, "color", varMap[name2]),
            ];
        }
        catch (e) { /* keep going without this style */ }
    }
    // ── Section: Colors ──
    var frameColors = makeSectionFrame("Colors", "Colors", "Shadcn color tokens · bound to the Design Tokens variables (Light/Dark modes)");
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
            labels.appendChild(makeText("L " + entry3.light.toUpperCase() + (entry3.dark ? "   D " + entry3.dark.toUpperCase() : ""), 9, "Regular", "#7A7A7A", "Values", "Source Code Pro"));
            card.appendChild(labels);
            row.appendChild(card);
        }
        colorGrid.appendChild(row);
    }
    frameColors.appendChild(colorGrid);
    figma.currentPage.appendChild(frameColors);
    // ── Typography: text styles + preview section ──
    var typeStyleMap = {};
    var frameTypo = null;
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
        frameTypo = makeSectionFrame("Typography", "Typography", "Text styles generated from the design's font families");
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
            try {
                await preview.setTextStyleIdAsync(ts.id);
            }
            catch (e) { /* manual font stays */ }
            tRow.appendChild(preview);
            tRow.appendChild(makeText(st.label + "  ·  " + st.family + " " + st.style + "  ·  " + st.size + "/" + st.lh, 11, "Regular", "#7A7A7A", "Meta", "Source Code Pro"));
            typoList.appendChild(tRow);
        }
        frameTypo.appendChild(typoList);
        figma.currentPage.appendChild(frameTypo);
    }
    // ── Corner: radius variable + preview tiers ──
    var frameCorner = makeSectionFrame("Corner", "Corner", "Base radius of the design — rounded utilities derive from this value");
    try {
        var rVar = figma.variables.createVariable("radius", collection, "FLOAT");
        rVar.setValueForMode(lightModeId, radiusPx);
        rVar.setValueForMode(darkModeId, radiusPx);
    }
    catch (e) { /* continue without the variable */ }
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
    figma.currentPage.appendChild(frameCorner);
    // ── Shadow: effect styles for the Tailwind tiers + previews ──
    if (shadow) {
        var shadowColor = parseColor(shadow.color || "#000000");
        shadowColor.a = typeof shadow.opacity === "number" ? shadow.opacity : 0.1;
        var shadowBase = {
            x: typeof shadow.x === "number" ? shadow.x : 0,
            y: typeof shadow.y === "number" ? shadow.y : 4,
            blur: typeof shadow.blur === "number" ? shadow.blur : 6,
            spread: typeof shadow.spread === "number" ? shadow.spread : -1,
        };
        var SHADOW_TIERS = [
            { name: "sm", factor: 0.5 }, { name: "md", factor: 1 },
            { name: "lg", factor: 1.5 }, { name: "xl", factor: 2 },
        ];
        var shadowEffects = function (factor) {
            return [{
                    type: "DROP_SHADOW",
                    color: shadowColor,
                    offset: { x: Math.round(shadowBase.x * factor), y: Math.round(shadowBase.y * factor) },
                    radius: Math.max(Math.round(shadowBase.blur * factor), 0),
                    spread: Math.round(shadowBase.spread * factor),
                    visible: true,
                    blendMode: "NORMAL",
                }];
        };
        for (var tier2 of SHADOW_TIERS) {
            try {
                var es = figma.createEffectStyle();
                es.name = "Shadow/" + tier2.name;
                es.effects = shadowEffects(tier2.factor);
            }
            catch (e) { /* continue */ }
        }
        var frameShadow = makeSectionFrame("Shadow", "Shadow", "Elevation tiers derived from the design's shadow config");
        var shadowRow = makeFrame("Shadows", "HORIZONTAL", 32);
        for (var tier3 of SHADOW_TIERS) {
            var shGroup = makeFrame("Shadow · " + tier3.name, "VERTICAL", 12);
            var shBox = figma.createRectangle();
            shBox.name = "Preview";
            shBox.resize(80, 80);
            shBox.cornerRadius = 12;
            shBox.fills = solid("#FFFFFF");
            shBox.effects = shadowEffects(tier3.factor);
            shGroup.appendChild(shBox);
            var shLabel = makeFrame("Label", "VERTICAL", 2);
            shLabel.fills = [];
            shLabel.appendChild(makeText(tier3.name, 12, "Medium", "#1A1A1A", "Name"));
            shLabel.appendChild(makeText("x" + tier3.factor, 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"));
            shGroup.appendChild(shLabel);
            shadowRow.appendChild(shGroup);
        }
        frameShadow.appendChild(shadowRow);
        figma.currentPage.appendChild(frameShadow);
    }
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
    var btnComps = [];
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
            if (variant.underline)
                txt.textDecoration = "UNDERLINE";
            comp.appendChild(txt);
            txt.componentPropertyReferences = { characters: labelProp };
            try {
                if (bodyStyleId)
                    await txt.setTextStyleIdAsync(bodyStyleId);
            }
            catch (e) { /* keep manual font */ }
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
        var sizeOrder = { Sm: 0, Default: 1, Lg: 2 };
        var byVariant = {};
        for (var ci = 0; ci < btnSet.children.length; ci++) {
            var ch = btnSet.children[ci];
            ch.primaryAxisSizingMode = "AUTO";
            ch.counterAxisSizingMode = "AUTO";
            var vk = (ch.name.match(/Variant=([^,]+)/) || [])[1] || "Other";
            if (!byVariant[vk])
                byVariant[vk] = [];
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
                if (node.height > maxH)
                    maxH = node.height;
            }
            var rowWidth = curX - colGap + padH;
            if (rowWidth > maxRowWidth)
                maxRowWidth = rowWidth;
            curY += maxH + rowGap;
        }
        btnSet.resize(maxRowWidth, curY - rowGap + padV);
        var frameBtn = makeSectionFrame("Button", "Button", "Default shadcn variants bound to the design tokens");
        frameBtn.appendChild(btnSet);
        figma.currentPage.appendChild(frameBtn);
    }
    // ── Badge component set ──
    var BADGE_VARIANTS = [
        { name: "Default", bg: "primary", fg: "primary-foreground", border: null },
        { name: "Secondary", bg: "secondary", fg: "secondary-foreground", border: null },
        { name: "Destructive", bg: "destructive", fg: "destructive-foreground", border: null },
        { name: "Outline", bg: null, fg: "foreground", border: "border" },
    ];
    var badgeComps = [];
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
            var ch2 = badgeSet.children[ci2];
            ch2.primaryAxisSizingMode = "AUTO";
            ch2.counterAxisSizingMode = "AUTO";
            ch2.x = bX;
            ch2.y = bPad;
            bX += ch2.width + bGap;
            if (ch2.height > bMaxH)
                bMaxH = ch2.height;
        }
        badgeSet.resize(bX - bGap + bPad, bMaxH + bPad * 2);
        var frameBadge = makeSectionFrame("Badge", "Badge", "Default shadcn variants bound to the design tokens");
        frameBadge.appendChild(badgeSet);
        figma.currentPage.appendChild(frameBadge);
    }
    // ── Canvas: paint the page background with the design's background token ──
    try {
        figma.currentPage.backgrounds = [{ type: "SOLID", color: hexToRgb(tokens.background ? tokens.background.light : "#FFFFFF") }];
    }
    catch (e) { /* keep default background */ }
    var lastCount = figma.currentPage.children.length;
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.slice(Math.max(lastCount - 8, 0)));
}
figma.showUI(__html__, { width: 380, height: 300 });
figma.ui.onmessage = async function (t) {
    try {
        await importTokens(t);
        figma.notify("Design system imported ✓");
        figma.closePlugin();
    }
    catch (e) {
        figma.notify("Gagal: " + (e && e.message ? e.message : e), { error: true });
    }
};
