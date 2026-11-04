/// <reference path="./node_modules/@figma/plugin-typings/index.d.ts" />
// ---------- helpers ----------
function hexToRgb(hex) {
    var n = parseInt(hex.replace("#", ""), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
// Parse rgba(r,g,b,a) atau hex (#RRGGBB / #RRGGBBAA) ke { r,g,b,a } (0–1)
function parseColor(color) {
    if (!color)
        return { r: 0, g: 0, b: 0, a: 1 };
    var rgba = color.match(/rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/);
    if (rgba) {
        return {
            r: parseFloat(rgba[1]) / 255,
            g: parseFloat(rgba[2]) / 255,
            b: parseFloat(rgba[3]) / 255,
            a: rgba[4] !== undefined ? parseFloat(rgba[4]) : 1,
        };
    }
    // hex #RRGGBB atau #RRGGBBAA
    var h = color.replace("#", "");
    if (h.length === 8) {
        return {
            r: parseInt(h.slice(0, 2), 16) / 255,
            g: parseInt(h.slice(2, 4), 16) / 255,
            b: parseInt(h.slice(4, 6), 16) / 255,
            a: parseInt(h.slice(6, 8), 16) / 255,
        };
    }
    var rgb = hexToRgb(color);
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 };
}
function readableOn(hex) {
    var n = parseInt(hex.replace("#", ""), 16);
    var lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
    return lum > 150 ? "#1A1A1A" : "#FFFFFF";
}
function solid(hex) {
    return [{ type: "SOLID", color: hexToRgb(hex) }];
}
function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}
// Map fontWeight (CSS numeric / name) → Figma font style string
function toFigmaStyle(weight) {
    var map = {
        "100": "Thin", "200": "ExtraLight", "300": "Light",
        "400": "Regular", "500": "Medium", "600": "SemiBold",
        "700": "Bold", "800": "ExtraBold", "900": "Black",
        thin: "Thin", extralight: "ExtraLight", light: "Light",
        regular: "Regular", medium: "Medium", semibold: "SemiBold",
        bold: "Bold", extrabold: "ExtraBold", black: "Black",
    };
    return map[(weight || "").toLowerCase()] || "Regular";
}
// Nama font di web memakai suffix " Variable" (mis. "Inter Variable"),
// sedangkan Figma biasanya mendaftarkan family tanpa suffix tersebut.
// Coba nama asli dulu, lalu alias yang lebih umum di Figma.
function figmaFontCandidates(family) {
    var list = [];
    if (!family)
        return ["Inter"];
    list.push(family);
    var stripped = family.replace(/\s+Variable$/i, "").trim();
    if (stripped && list.indexOf(stripped) < 0)
        list.push(stripped);
    var lower = family.toLowerCase();
    if (lower.indexOf("google sans") >= 0 && list.indexOf("Google Sans Flex") < 0) {
        list.push("Google Sans Flex");
    }
    if (lower.indexOf("source code pro") >= 0 && list.indexOf("Source Code Pro") < 0) {
        list.push("Source Code Pro");
    }
    if (lower.indexOf("inter") >= 0 && list.indexOf("Inter") < 0) {
        list.push("Inter");
    }
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
            catch (e) { }
        }
    }
    return null;
}
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
// Buat section frame dengan bg #f1f5f9, title, description, dan separator
function makeSectionFrame(name, title, description) {
    var f = makeFrame(name, "VERTICAL", 0, 48);
    f.cornerRadius = 24;
    f.fills = solid("#F1F5F9");
    // Header area
    var header = makeFrame("Header", "VERTICAL", 6);
    header.fills = [];
    header.appendChild(makeText(title, 20, "Bold", "#0F172A", "Title"));
    header.appendChild(makeText(description, 13, "Regular", "#64748B", "Description"));
    f.appendChild(header);
    // Separator garis horizontal
    var sep = figma.createRectangle();
    sep.name = "Separator";
    sep.fills = solid("#E2E8F0");
    sep.resize(100, 1);
    sep.layoutAlign = "STRETCH";
    sep.layoutGrow = 0;
    f.appendChild(sep);
    f.itemSpacing = 16;
    return f;
}
// ---------- Color Palette templates ----------
// Menerima palettes: ColorPalette[] = [{ id, name, purpose, colors: [{ level, hex, rgb }] }]
//
// Template "one" — horizontal sliding cards, warna full, level + hex + rgb di dalam card
// Template "two" — square swatches per shade, label Name-Level + hex di bawah
var COLOR_TEMPLATES = {
    one: async function (palettes, varMap) {
        var wrap = makeFrame("Color · Template One", "VERTICAL", 40);
        for (var palette of palettes) {
            var group = makeFrame("Palette · " + palette.name, "VERTICAL", 12);
            group.appendChild(makeText(cap(palette.name) + " - " + cap(palette.purpose), 13, "Regular", "#1A1A1A", "Header"));
            var row = makeFrame("Shades", "HORIZONTAL", 0);
            var sorted = palette.colors.slice().sort(function (a, b) {
                return parseInt(a.level) - parseInt(b.level);
            });
            for (var i = 0; i < sorted.length; i++) {
                var c = sorted[i];
                var isFirst = i === 0;
                var isLast = i === sorted.length - 1;
                var card = figma.createFrame();
                card.name = "Shade · " + c.level;
                card.layoutMode = "VERTICAL";
                card.primaryAxisSizingMode = "FIXED";
                card.counterAxisSizingMode = "FIXED";
                card.resize(96, 128);
                card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 12;
                card.primaryAxisAlignItems = "SPACE_BETWEEN";
                // Bind fill ke variable jika tersedia
                var varKey = palette.purpose + "::" + c.level;
                var colorVar = varMap[varKey];
                if (colorVar) {
                    try {
                        card.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hexToRgb(c.hex) }, "color", colorVar)];
                    }
                    catch (e) {
                        card.fills = solid(c.hex);
                    }
                }
                else {
                    card.fills = solid(c.hex);
                }
                if (isFirst && isLast) {
                    card.cornerRadius = 12;
                }
                else if (isFirst) {
                    card.topLeftRadius = 12;
                    card.bottomLeftRadius = 12;
                }
                else if (isLast) {
                    card.topRightRadius = 12;
                    card.bottomRightRadius = 12;
                }
                var fg = readableOn(c.hex);
                var fgMuted = fg === "#1A1A1A" ? "#6B6B6B" : "#AAAAAA";
                card.appendChild(makeText(c.level, 11, "Medium", fg, "Level", "Google Sans Flex"));
                var bottom = makeFrame("Bottom", "VERTICAL", 2);
                bottom.fills = [];
                bottom.appendChild(makeText(c.hex.toUpperCase(), 9, "Regular", fg, "Hex", "Source Code Pro"));
                bottom.appendChild(makeText(c.rgb, 9, "Regular", fgMuted, "RGB", "Source Code Pro"));
                card.appendChild(bottom);
                row.appendChild(card);
            }
            group.appendChild(row);
            wrap.appendChild(group);
        }
        return wrap;
    },
    two: async function (palettes, varMap) {
        var wrap = makeFrame("Color · Template Two", "VERTICAL", 40);
        for (var palette of palettes) {
            var group = makeFrame("Palette · " + palette.name, "VERTICAL", 12);
            group.appendChild(makeText(cap(palette.name) + " - " + cap(palette.purpose), 13, "Regular", "#1A1A1A", "Header"));
            // Row square swatches
            var row = makeFrame("Shades", "HORIZONTAL", 8);
            var sorted = palette.colors.slice().sort(function (a, b) {
                return parseInt(a.level) - parseInt(b.level);
            });
            for (var c of sorted) {
                var swatch = makeFrame("Swatch · " + c.level, "VERTICAL", 6);
                // Square color box — bind ke variable
                var box = figma.createRectangle();
                box.name = "Color";
                box.resize(88, 88);
                box.cornerRadius = 10;
                var vk2 = palette.purpose + "::" + c.level;
                var cv2 = varMap[vk2];
                if (cv2) {
                    try {
                        box.fills = [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hexToRgb(c.hex) }, "color", cv2)];
                    }
                    catch (e) {
                        box.fills = solid(c.hex);
                    }
                }
                else {
                    box.fills = solid(c.hex);
                }
                swatch.appendChild(box);
                // Label bawah
                var labels = makeFrame("Labels", "VERTICAL", 2);
                labels.fills = [];
                labels.appendChild(makeText(cap(palette.name) + "-" + c.level, 11, "Regular", "#1A1A1A", "Name", "Source Code Pro"));
                labels.appendChild(makeText(c.hex.toUpperCase(), 11, "Regular", "#7A7A7A", "Hex", "Source Code Pro"));
                swatch.appendChild(labels);
                row.appendChild(swatch);
            }
            group.appendChild(row);
            wrap.appendChild(group);
        }
        return wrap;
    }
};
// ---------- Typography templates ----------
var TYPE_TEMPLATES = {
    "one": async function (typeItems) {
        var wrap = makeFrame("Type · Template One", "VERTICAL", 32);
        for (var it of typeItems) {
            var row = makeFrame("Type · " + it.typo.name, "VERTICAL", 8);
            // Nama style besar — pakai font aslinya
            var preview = figma.createText();
            preview.name = "Preview";
            preview.fontName = { family: it.figmaFamily || it.typo.fontFamily, style: it.figmaStyle };
            preview.fontSize = it.typo.fontSize;
            preview.characters = cap(it.typo.purpose) + " " + cap(it.typo.level);
            if (it.styleId)
                await preview.setTextStyleIdAsync(it.styleId);
            preview.fills = solid("#1A1A1A");
            row.appendChild(preview);
            // Meta satu baris: Display / Large  •  Architects Daughter  57px / 64px  -0.25px
            var meta = cap(it.typo.purpose) + " / " + cap(it.typo.level)
                + "  •  " + it.typo.fontFamily
                + "  " + it.typo.fontSize + "px / " + it.typo.lineHeight + "px"
                + "  " + it.typo.letterSpacing + "px";
            row.appendChild(makeText(meta, 11, "Regular", "#7A7A7A", "Meta", "Source Code Pro"));
            wrap.appendChild(row);
        }
        return wrap;
    },
    "two": async function (typeItems) {
        var wrap = makeFrame("Type · Template Two", "VERTICAL", 40);
        for (var it of typeItems) {
            var row = makeFrame("Type · " + it.typo.name, "VERTICAL", 8);
            // Baris 1: pill badge hitam "DISPLAY" + teks kecil abu "LARGE"
            var badgeRow = makeFrame("Badge Row", "HORIZONTAL", 8);
            badgeRow.counterAxisAlignItems = "CENTER";
            // Pill hitam — pakai frame dengan padding
            var pill = makeFrame("Pill", "HORIZONTAL", 0, 0);
            pill.paddingLeft = pill.paddingRight = 10;
            pill.paddingTop = pill.paddingBottom = 4;
            pill.cornerRadius = 999;
            pill.fills = solid("#1A1A1A");
            pill.counterAxisAlignItems = "CENTER";
            pill.primaryAxisAlignItems = "CENTER";
            pill.appendChild(makeText(it.typo.purpose.toUpperCase(), 10, "Medium", "#FFFFFF", "Purpose", "Source Code Pro"));
            badgeRow.appendChild(pill);
            // Teks level abu-abu
            badgeRow.appendChild(makeText(it.typo.level.toUpperCase(), 10, "Regular", "#AAAAAA", "Level", "Source Code Pro"));
            row.appendChild(badgeRow);
            // Baris 2: preview teks besar dengan font aslinya
            var preview = figma.createText();
            preview.name = "Preview";
            preview.fontName = { family: it.figmaFamily || it.typo.fontFamily, style: it.figmaStyle };
            preview.fontSize = it.typo.fontSize;
            preview.characters = cap(it.typo.purpose) + " " + cap(it.typo.level);
            if (it.styleId)
                await preview.setTextStyleIdAsync(it.styleId);
            preview.fills = solid("#1A1A1A");
            row.appendChild(preview);
            // Baris 3: metrics — fontFamily (medium) + label+nilai abu (size, weight, lh, ls)
            var metricsRow = makeFrame("Metrics Row", "HORIZONTAL", 16);
            metricsRow.counterAxisAlignItems = "CENTER";
            // Font family — medium/bold
            metricsRow.appendChild(makeText(it.typo.fontFamily, 11, "Medium", "#1A1A1A", "Family", "Source Code Pro"));
            // Helper buat pasangan label+nilai
            var pairs = [
                ["size", it.typo.fontSize + "px"],
                ["weight", it.figmaStyle],
                ["lh", it.typo.lineHeight + "px"],
                ["ls", it.typo.letterSpacing + "px"],
            ];
            for (var p of pairs) {
                var pair = makeFrame("Pair · " + p[0], "HORIZONTAL", 4);
                pair.counterAxisAlignItems = "CENTER";
                pair.appendChild(makeText(p[0], 11, "Regular", "#AAAAAA", "Label", "Source Code Pro"));
                pair.appendChild(makeText(p[1], 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"));
                metricsRow.appendChild(pair);
            }
            row.appendChild(metricsRow);
            wrap.appendChild(row);
        }
        return wrap;
    }
};
// ---------- main ----------
// Payload shape sesuai type Project dari store:
// {
// ---------- main ----------
// Payload shape sesuai type Project dari store:
// {
//   name: string
//   description: string
//   templateColorPalette: "one" | "two"
//   templateTypography: "one" | "two"
//   colorPalette: ColorPalette[]  // { id, name, purpose, colors: [{ level, hex, rgb }] }
//   typography: Typography[]      // { id, name, purpose, level, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
// }
async function importTokens(t) {
    var colorFn = COLOR_TEMPLATES[t.templateColorPalette] || COLOR_TEMPLATES.one;
    var typeFn = TYPE_TEMPLATES[t.templateTypography] || TYPE_TEMPLATES["one"];
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Google Sans Flex", style: "Regular" });
    await figma.loadFontAsync({ family: "Google Sans Flex", style: "Medium" });
    await figma.loadFontAsync({ family: "Google Sans Flex", style: "Bold" });
    await figma.loadFontAsync({ family: "Source Code Pro", style: "Regular" });
    await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" });
    // -- Canvas background: primary/100 --
    var canvasBg = "#F8FAFC"; // fallback slate-50
    if (t.colorPalette && t.colorPalette.length) {
        for (var pal of t.colorPalette) {
            if (pal.purpose === "primary") {
                for (var clr of pal.colors) {
                    if (clr.level === "50") {
                        canvasBg = clr.hex;
                        break;
                    }
                }
                break;
            }
        }
    }
    figma.currentPage.backgrounds = [{ type: "SOLID", color: hexToRgb(canvasBg) }];
    // -- Color Palettes: paint styles + optional variables per shade --
    var palettesForTemplate = [];
    // Map "PaletteName/Level" → Variable untuk binding komponen
    var colorVarMap = {};
    if (t.colorPalette && t.colorPalette.length) {
        var varCollection = null;
        var modeId = null;
        try {
            varCollection = figma.variables.createVariableCollection("Colors");
            modeId = varCollection.modes[0].modeId;
            varCollection.renameMode(modeId, "Default");
        }
        catch (e) {
            varCollection = null;
        }
        for (var palette of t.colorPalette) {
            for (var c of palette.colors) {
                var paintStyle = figma.createPaintStyle();
                paintStyle.name = cap(palette.name) + "/" + c.level;
                if (varCollection && modeId) {
                    try {
                        var v = figma.variables.createVariable(cap(palette.name) + "/" + c.level, varCollection, "COLOR");
                        v.setValueForMode(modeId, hexToRgb(c.hex));
                        var boundPaint = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hexToRgb(c.hex) }, "color", v);
                        paintStyle.paints = [boundPaint];
                        // Simpan ke map dengan key "purpose::level" agar mudah di-lookup
                        colorVarMap[palette.purpose + "::" + c.level] = v;
                    }
                    catch (e) {
                        paintStyle.paints = solid(c.hex);
                    }
                }
                else {
                    paintStyle.paints = solid(c.hex);
                }
            }
            palettesForTemplate.push(palette);
        }
    }
    // -- Typography: text styles --
    var typeItems = [];
    // Map typography id → Figma text style id, untuk binding ke text di komponen
    var typeStyleMap = {};
    for (var s of t.typography || []) {
        var figmaStyle = toFigmaStyle(s.fontWeight);
        var loadedFont = await loadFigmaFont(s.fontFamily, figmaStyle);
        if (!loadedFont) {
            figma.notify("Font tidak ditemukan: " + s.fontFamily + " " + figmaStyle + " (dilewati)", { timeout: 3000 });
            continue;
        }
        var font = { family: loadedFont.family, style: loadedFont.style };
        var ts = figma.createTextStyle();
        ts.name = cap(s.purpose) + "/" + cap(s.level) + " · " + s.name;
        ts.fontName = font;
        ts.fontSize = s.fontSize;
        ts.lineHeight = { unit: "PIXELS", value: s.lineHeight };
        if (s.letterSpacing) {
            ts.letterSpacing = { unit: "PIXELS", value: s.letterSpacing };
        }
        typeItems.push({
            typo: s,
            figmaFamily: loadedFont.family,
            figmaStyle: loadedFont.style,
            styleId: ts.id,
        });
        typeStyleMap[s.id] = ts.id;
    }
    function findTypeStyleId(purpose, level) {
        for (var i = 0; i < typeItems.length; i++) {
            if (typeItems[i].typo.purpose === purpose && typeItems[i].typo.level === level) {
                return typeItems[i].styleId;
            }
        }
        return null;
    }
    // Style default untuk label komponen yang tidak punya typographyId
    // (checkbox, radio, switch). Prioritaskan Label Large → Label Medium →
    // Body Medium → style pertama yang tersedia.
    var defaultLabelStyleId = findTypeStyleId("label", "large")
        || findTypeStyleId("label", "medium")
        || findTypeStyleId("body", "medium")
        || (typeItems.length ? typeItems[0].styleId : null);
    // Style sekunder untuk helper text input.
    var defaultHelperStyleId = findTypeStyleId("body", "small")
        || findTypeStyleId("body", "medium")
        || (typeItems.length ? typeItems[0].styleId : null);
    // -- Frame 1: Header --
    var frameHeader = makeSectionFrame("Design System · " + (t.name || "Untitled"), t.name || "Untitled", t.description || "");
    figma.currentPage.appendChild(frameHeader);
    // -- Frame 2: Typography --
    if (typeItems.length) {
        var frameTypo = makeSectionFrame("Typography", "Typography", "Define type styles for consistent text hierarchy across your design system");
        frameTypo.appendChild(await typeFn(typeItems));
        figma.currentPage.appendChild(frameTypo);
    }
    // -- Frame 3: Color Palette --
    if (palettesForTemplate.length) {
        var frameColors = makeSectionFrame("Color Palette", "Color Palette", "Define color tokens for consistent use of color across your design system");
        frameColors.appendChild(await colorFn(palettesForTemplate, colorVarMap));
        figma.currentPage.appendChild(frameColors);
    }
    // -- Corner: variable FLOAT + frame --
    if (t.corner && t.corner.length) {
        // Cari atau buat collection (reuse yang sudah ada dari warna)
        var cornerCollection = null;
        var cornerModeId = null;
        try {
            // Coba reuse varCollection dari colors, kalau tidak ada buat baru
            if (varCollection && modeId) {
                cornerCollection = varCollection;
                cornerModeId = modeId;
            }
            else {
                cornerCollection = figma.variables.createVariableCollection("Design Tokens");
                cornerModeId = cornerCollection.modes[0].modeId;
                cornerCollection.renameMode(cornerModeId, "Default");
            }
            for (var cr of t.corner) {
                var crVar = figma.variables.createVariable("Corner/" + cr.name, cornerCollection, "FLOAT");
                crVar.setValueForMode(cornerModeId, cr.radius >= 99 ? 9999 : cr.radius);
            }
        }
        catch (e) {
            // Variables tidak tersedia, lanjut tanpa variable
        }
        // Cari warna primary/500 untuk bg shape
        var primaryHex = "#1A1A1A";
        if (t.colorPalette && t.colorPalette.length) {
            for (var pal of t.colorPalette) {
                if (pal.purpose === "primary") {
                    for (var clr of pal.colors) {
                        if (clr.level === "500") {
                            primaryHex = clr.hex;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        var frameCorner = makeSectionFrame("Corner", "Corner", "Define border radius tokens for consistent rounded corners across your design system");
        var cornerRow = makeFrame("Corners", "HORIZONTAL", 24);
        cornerRow.counterAxisAlignItems = "MIN";
        for (var cr of t.corner) {
            var crGroup = makeFrame("Corner · " + cr.name, "VERTICAL", 10);
            crGroup.fills = [];
            var crBox = figma.createRectangle();
            crBox.name = "Preview";
            crBox.resize(80, 80);
            crBox.fills = solid(primaryHex);
            crBox.cornerRadius = cr.radius >= 99 ? 40 : cr.radius;
            crGroup.appendChild(crBox);
            var crLabel = makeFrame("Label", "VERTICAL", 2);
            crLabel.fills = [];
            crLabel.appendChild(makeText(cr.name, 12, "Medium", "#1A1A1A", "Name"));
            crLabel.appendChild(makeText(cr.radius >= 99 ? "Full" : cr.radius + "px", 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"));
            crGroup.appendChild(crLabel);
            cornerRow.appendChild(crGroup);
        }
        frameCorner.appendChild(cornerRow);
        figma.currentPage.appendChild(frameCorner);
    }
    // -- Shadow: effect styles + frame --
    if (t.shadow && t.shadow.length) {
        for (var sh of t.shadow) {
            var shStyle = figma.createEffectStyle();
            shStyle.name = "Shadow/" + sh.name;
            var col = parseColor(sh.color);
            shStyle.effects = [{
                    type: "DROP_SHADOW",
                    color: { r: col.r, g: col.g, b: col.b, a: col.a },
                    offset: { x: sh.x, y: sh.y },
                    radius: sh.blur,
                    spread: sh.spread,
                    visible: true,
                    blendMode: "NORMAL",
                }];
        }
        var frameShadow = makeSectionFrame("Shadow", "Shadow", "Define elevation and depth with consistent shadow tokens across your design system");
        var shadowRow = makeFrame("Shadows", "HORIZONTAL", 32);
        shadowRow.counterAxisAlignItems = "MIN";
        for (var sh of t.shadow) {
            var shGroup = makeFrame("Shadow · " + sh.name, "VERTICAL", 12);
            var col = parseColor(sh.color);
            var shBox = figma.createRectangle();
            shBox.name = "Preview";
            shBox.resize(80, 80);
            shBox.cornerRadius = 12;
            shBox.fills = solid("#FFFFFF");
            shBox.effects = [{
                    type: "DROP_SHADOW",
                    color: { r: col.r, g: col.g, b: col.b, a: col.a },
                    offset: { x: sh.x, y: sh.y },
                    radius: sh.blur,
                    spread: sh.spread,
                    visible: true,
                    blendMode: "NORMAL",
                }];
            shGroup.appendChild(shBox);
            var shLabel = makeFrame("Label", "VERTICAL", 2);
            shLabel.fills = [];
            shLabel.appendChild(makeText(sh.name, 12, "Medium", "#1A1A1A", "Name"));
            shLabel.appendChild(makeText(sh.x + " " + sh.y + " " + sh.blur + " " + sh.spread, 11, "Regular", "#7A7A7A", "Value", "Source Code Pro"));
            shGroup.appendChild(shLabel);
            shadowRow.appendChild(shGroup);
        }
        frameShadow.appendChild(shadowRow);
        figma.currentPage.appendChild(frameShadow);
    }
    // ── Shared token resolvers (dipakai button, input, badge, dll) ──
    // Resolve color ref ke hex string (untuk kalkulasi)
    function resolveColorRef(ref) {
        if (!ref || ref === "transparent")
            return null;
        if (!ref.includes("::"))
            return ref;
        var parts = ref.split("::");
        var purpose = parts[0], level = parts[1];
        for (var pal of (t.colorPalette || [])) {
            if (pal.purpose === purpose) {
                for (var clr of pal.colors) {
                    if (clr.level === level)
                        return clr.hex;
                }
            }
        }
        return "#000000";
    }
    // Resolve color ref ke SolidPaint[] — bind ke variable jika tersedia
    function resolveColorPaint(ref) {
        if (!ref || ref === "transparent")
            return [];
        // Raw hex tanpa "::" — pakai solid langsung tanpa binding
        if (!ref.includes("::"))
            return ref ? solid(ref) : [];
        var hex = resolveColorRef(ref);
        if (!hex)
            return [];
        var variable = colorVarMap[ref];
        if (variable) {
            try {
                return [figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hexToRgb(hex) }, "color", variable)];
            }
            catch (e) { }
        }
        return solid(hex);
    }
    function resolveCornerRef(id) {
        for (var cr of (t.corner || [])) {
            if (cr.id === id)
                return cr.radius >= 99 ? 9999 : cr.radius;
        }
        return 0;
    }
    function resolveShadowRef(id) {
        if (id === "none" || !id)
            return [];
        for (var sh of (t.shadow || [])) {
            if (sh.id === id) {
                var col = parseColor(sh.color);
                return [{
                        type: "DROP_SHADOW",
                        color: { r: col.r, g: col.g, b: col.b, a: col.a },
                        offset: { x: sh.x, y: sh.y },
                        radius: sh.blur,
                        spread: sh.spread,
                        visible: true,
                        blendMode: "NORMAL",
                    }];
            }
        }
        return [];
    }
    function resolveTypoRef(id) {
        for (var ty of (t.typography || [])) {
            if (ty.id === id)
                return ty;
        }
        return null;
    }
    function resolveTypeStyleId(id) {
        if (!id)
            return null;
        return typeStyleMap[id] || null;
    }
    // Ambil style yang sudah dibuat. Kalau karena suatu hal style-nya belum ada
    // (mis. font asli tidak tersedia), buat text style baru dengan font fallback
    // supaya komponen tetap bisa di-bind ke typography.
    async function ensureTypeStyleId(id) {
        if (!id)
            return null;
        if (typeStyleMap[id])
            return typeStyleMap[id];
        var typo = resolveTypoRef(id);
        if (!typo)
            return null;
        var style = toFigmaStyle(typo.fontWeight);
        var loaded = await loadFigmaFont(typo.fontFamily, style);
        if (!loaded)
            return null;
        var ts = figma.createTextStyle();
        ts.name = cap(typo.purpose) + "/" + cap(typo.level) + " · " + typo.name;
        ts.fontName = { family: loaded.family, style: loaded.style };
        ts.fontSize = typo.fontSize;
        ts.lineHeight = { unit: "PIXELS", value: typo.lineHeight };
        if (typo.letterSpacing) {
            ts.letterSpacing = { unit: "PIXELS", value: typo.letterSpacing };
        }
        typeStyleMap[id] = ts.id;
        return ts.id;
    }
    // Terapkan text style ke sebuah text node. Kalau style tidak tersedia,
    // biarkan text node memakai font manual sebagai fallback.
    async function bindTextStyle(node, styleId) {
        if (!styleId)
            return false;
        try {
            await node.setTextStyleIdAsync(styleId);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    // -- Frame 5: Button Components --
    // designButton pada store terbaru berbentuk object:
    // { cornerId, typographyId, shadowId, variants: [...], sizes: [...] }
    // Versi lama masih berupa array config. Keduanya didukung di sini.
    var buttonDefs = [];
    if (Array.isArray(t.designButton)) {
        buttonDefs = t.designButton;
    }
    else if (t.designButton && Array.isArray(t.designButton.variants)) {
        var buttonSizes = (Array.isArray(t.designButton.sizes) && t.designButton.sizes.length)
            ? t.designButton.sizes
            : [{ size: "default", paddingX: 12, paddingY: 8 }];
        for (var variantCfg of t.designButton.variants) {
            for (var sizeCfg of buttonSizes) {
                buttonDefs.push({
                    variant: variantCfg.variant,
                    size: sizeCfg.size,
                    background: variantCfg.background,
                    foreground: variantCfg.foreground,
                    border: variantCfg.border,
                    paddingX: sizeCfg.paddingX,
                    paddingY: sizeCfg.paddingY,
                    cornerId: t.designButton.cornerId,
                    typographyId: t.designButton.typographyId,
                    shadowId: t.designButton.shadowId,
                });
            }
        }
    }
    if (buttonDefs.length) {
        var components = [];
        for (var btn of buttonDefs) {
            var btnSize = btn.size || "default";
            var btnPadX = typeof btn.paddingX === "number" ? btn.paddingX : 12;
            var btnPadY = typeof btn.paddingY === "number" ? btn.paddingY : 8;
            var bgHex = resolveColorRef(btn.background);
            var fgHex = resolveColorRef(btn.foreground);
            var borderHex = resolveColorRef(btn.border);
            var radius = resolveCornerRef(btn.cornerId);
            var effects = resolveShadowRef(btn.shadowId);
            var typo = resolveTypoRef(btn.typographyId);
            var figmaFontStyle = toFigmaStyle(typo ? typo.fontWeight : "400");
            var fontFamily = typo ? typo.fontFamily : "Inter";
            var fontSize = typo ? typo.fontSize : 14;
            // Load font — fallback ke alias Figma / Inter Regular
            var loadedBtnFont = await loadFigmaFont(fontFamily, figmaFontStyle);
            if (loadedBtnFont) {
                fontFamily = loadedBtnFont.family;
                figmaFontStyle = loadedBtnFont.style;
            }
            else {
                fontFamily = "Inter";
                figmaFontStyle = "Regular";
            }
            // Buat component
            var comp = figma.createComponent();
            comp.name = "Variant=" + cap(btn.variant) + ", Size=" + btnSize;
            comp.layoutMode = "HORIZONTAL";
            comp.primaryAxisSizingMode = "AUTO";
            comp.counterAxisSizingMode = "AUTO";
            comp.primaryAxisAlignItems = "CENTER";
            comp.counterAxisAlignItems = "CENTER";
            comp.paddingLeft = comp.paddingRight = Math.max(btnPadX, 8);
            comp.paddingTop = comp.paddingBottom = Math.max(btnPadY, 4);
            comp.cornerRadius = radius > 9000 ? 9999 : radius;
            comp.fills = resolveColorPaint(btn.background);
            comp.strokes = borderHex && borderHex !== "transparent"
                ? resolveColorPaint(btn.border)
                : [];
            comp.strokeWeight = 1;
            comp.strokeAlign = "INSIDE";
            comp.effects = effects;
            // Text label dengan component property — bind ke text style typography
            var labelPropKey = comp.addComponentProperty("Label", "TEXT", "Button");
            var txt = figma.createText();
            txt.fontName = { family: fontFamily, style: figmaFontStyle };
            txt.fontSize = fontSize;
            txt.characters = "Button";
            var fgPaints = resolveColorPaint(btn.foreground);
            txt.fills = fgPaints.length > 0 ? fgPaints : solid("#ffffff");
            if (btn.variant === "link") {
                txt.textDecoration = "UNDERLINE";
            }
            comp.appendChild(txt);
            txt.componentPropertyReferences = { characters: labelPropKey };
            // Bind setelah text node masuk ke component supaya textStyleId tersimpan.
            // Kalau typographyId tidak valid, pakai style label default.
            var btnStyleId = await ensureTypeStyleId(btn.typographyId) || defaultLabelStyleId;
            await bindTextStyle(txt, btnStyleId);
            components.push(comp);
        }
        // Gabungkan jadi ComponentSet
        if (components.length > 0) {
            var compSet;
            try {
                compSet = figma.combineAsVariants(components, figma.currentPage);
            }
            catch (e) {
                figma.notify("Button: " + e.message, { error: true, timeout: 4000 });
                // Jangan return — lanjutkan ke komponen lain
                for (var ci2 = 0; ci2 < components.length; ci2++) {
                    try {
                        components[ci2].remove();
                    }
                    catch (_) { }
                }
                compSet = null;
            }
            if (!compSet) {
                // skip frame button
            }
            else {
                compSet.name = "Button";
                compSet.fills = [];
                compSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
                compSet.strokeWeight = 2;
                compSet.dashPattern = [8, 4];
                compSet.strokeAlign = "INSIDE";
                // Susun manual: tiap variant = satu baris, size xs→lg kiri ke kanan
                var sizeOrder = { xs: 0, sm: 1, "default": 2, lg: 3 };
                var variantOrder = ["Default", "Outline", "Secondary", "Ghost", "Destructive", "Error", "Warning", "Success", "Link"];
                var colGap = 16, rowGap = 24;
                var padH = 32, padV = 32;
                // Kelompokkan children per variant
                var byVariant = {};
                for (var ci = 0; ci < compSet.children.length; ci++) {
                    var ch = compSet.children[ci];
                    ch.primaryAxisSizingMode = "AUTO";
                    ch.counterAxisSizingMode = "AUTO";
                    var vm = ch.name.match(/Variant=([^,]+)/);
                    var sm2 = ch.name.match(/Size=(\w+)/);
                    var vk = vm ? vm[1] : "Other";
                    var sk = sm2 ? sm2[1] : "default";
                    if (!byVariant[vk])
                        byVariant[vk] = [];
                    byVariant[vk].push({ node: ch, sizeKey: sk });
                }
                // Posisikan tiap node
                var curY = padV;
                var maxRowWidth = 0;
                for (var ri = 0; ri < variantOrder.length; ri++) {
                    var vk = variantOrder[ri];
                    if (!byVariant[vk])
                        continue;
                    var row = byVariant[vk].sort(function (a, b) {
                        return (sizeOrder[a.sizeKey] || 0) - (sizeOrder[b.sizeKey] || 0);
                    });
                    var curX = padH;
                    var maxH = 0;
                    for (var si = 0; si < row.length; si++) {
                        var node = row[si].node;
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
                // Resize compSet agar pas dengan konten
                compSet.resize(maxRowWidth, curY - rowGap + padV);
                // Buat frame wrapper
                var frameBtn = makeSectionFrame("Button", "Button", "Customize button styles for each variant and size in your design system");
                frameBtn.appendChild(compSet);
                figma.currentPage.appendChild(frameBtn);
            } // end if compSet
        }
    }
    // -- Frame 6: Input Components --
    if (t.designInput && t.designInput.length) {
        var inputComponents = [];
        for (var inp of t.designInput) {
            var iBgHex = resolveColorRef(inp.background);
            var iBorderHex = resolveColorRef(inp.border);
            var iPhHex = resolveColorRef(inp.placeholder);
            var iLabelHex = resolveColorRef(inp.label);
            var iHelperHex = resolveColorRef(inp.helper);
            var iRadius = resolveCornerRef(inp.cornerId);
            var iEffects = resolveShadowRef(inp.shadowId);
            var iTypo = resolveTypoRef(inp.typographyId);
            var iFontStyle = toFigmaStyle(iTypo ? iTypo.fontWeight : "400");
            var iFontFamily = iTypo ? iTypo.fontFamily : "Inter";
            var iFontSize = iTypo ? iTypo.fontSize : 14;
            var iStyleId = await ensureTypeStyleId(inp.typographyId);
            var iLabelStyleId = findTypeStyleId("label", "large") || iStyleId || defaultLabelStyleId;
            var iHelperStyleId = findTypeStyleId("body", "small") || iStyleId || defaultHelperStyleId;
            // Load font dengan fallback
            var loadedInputFont = await loadFigmaFont(iFontFamily, iFontStyle);
            if (loadedInputFont) {
                iFontFamily = loadedInputFont.family;
                iFontStyle = loadedInputFont.style;
            }
            else {
                iFontFamily = "Inter";
                iFontStyle = "Regular";
            }
            var iComp = figma.createComponent();
            iComp.name = "State=" + cap(inp.state);
            iComp.layoutMode = "VERTICAL";
            iComp.primaryAxisSizingMode = "AUTO";
            iComp.counterAxisSizingMode = "AUTO";
            iComp.itemSpacing = 4;
            iComp.fills = [];
            // Daftarkan semua properties — hanya untuk direct children
            var showLabelProp = iComp.addComponentProperty("Show Label", "BOOLEAN", true);
            var labelTextProp = iComp.addComponentProperty("Label", "TEXT", "Label");
            var showHelperProp = iComp.addComponentProperty("Show Helper", "BOOLEAN", true);
            var helperTextProp = iComp.addComponentProperty("Helper", "TEXT", "Helper text");
            // 1. Label — direct child, bisa bind visible + characters
            var labelTxt = figma.createText();
            labelTxt.name = "Label";
            labelTxt.fontName = { family: iFontFamily, style: iFontStyle };
            labelTxt.fontSize = iFontSize > 12 ? iFontSize - 2 : iFontSize;
            labelTxt.characters = "Label";
            labelTxt.fills = resolveColorPaint(inp.label);
            iComp.appendChild(labelTxt);
            labelTxt.componentPropertyReferences = {
                characters: labelTextProp,
                visible: showLabelProp,
            };
            await bindTextStyle(labelTxt, iLabelStyleId);
            // 2. Input field — frame dengan placeholder di dalamnya
            //    Tidak bisa bind componentPropertyReferences pada nested node,
            //    jadi placeholder dibiarkan sebagai teks statis di dalam field
            var iField = makeFrame("Field", "HORIZONTAL", 0);
            iField.primaryAxisSizingMode = "FIXED";
            iField.counterAxisSizingMode = "AUTO";
            iField.resize(240, inp.paddingY * 2 + iFontSize);
            iField.paddingLeft = iField.paddingRight = inp.paddingX;
            iField.paddingTop = iField.paddingBottom = inp.paddingY;
            iField.counterAxisAlignItems = "CENTER";
            iField.cornerRadius = iRadius > 9000 ? 9999 : iRadius;
            iField.fills = resolveColorPaint(inp.background);
            iField.strokes = iBorderHex && iBorderHex !== "transparent"
                ? resolveColorPaint(inp.border) : [];
            iField.strokeWeight = 1;
            iField.strokeAlign = "INSIDE";
            iField.effects = iEffects;
            var iPlaceholder = figma.createText();
            iPlaceholder.name = "Placeholder";
            iPlaceholder.fontName = { family: iFontFamily, style: iFontStyle };
            iPlaceholder.fontSize = iFontSize;
            iPlaceholder.characters = "Placeholder";
            iPlaceholder.fills = resolveColorPaint(inp.placeholder);
            iField.appendChild(iPlaceholder);
            iPlaceholder.layoutGrow = 1;
            await bindTextStyle(iPlaceholder, iStyleId);
            iComp.appendChild(iField);
            // 3. Helper — direct child, bisa bind visible + characters
            var iHelper = figma.createText();
            iHelper.name = "Helper";
            iHelper.fontName = { family: iFontFamily, style: iFontStyle };
            iHelper.fontSize = iFontSize > 10 ? iFontSize - 4 : iFontSize;
            iHelper.characters = "Helper text";
            iHelper.fills = resolveColorPaint(inp.helper);
            iComp.appendChild(iHelper);
            iHelper.componentPropertyReferences = {
                characters: helperTextProp,
                visible: showHelperProp,
            };
            await bindTextStyle(iHelper, iHelperStyleId);
            inputComponents.push(iComp);
        }
        if (inputComponents.length > 0) {
            var inputSet = figma.combineAsVariants(inputComponents, figma.currentPage);
            inputSet.name = "Input";
            inputSet.fills = [];
            inputSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
            inputSet.strokeWeight = 2;
            inputSet.dashPattern = [8, 4];
            inputSet.strokeAlign = "INSIDE";
            // Susun satu baris horizontal
            var iPadH = 32, iPadV = 32, iGap = 32;
            var iCurX = iPadH;
            var iMaxH = 0;
            for (var ci = 0; ci < inputSet.children.length; ci++) {
                var ch = inputSet.children[ci];
                ch.primaryAxisSizingMode = "AUTO";
                ch.counterAxisSizingMode = "AUTO";
                ch.x = iCurX;
                ch.y = iPadV;
                iCurX += ch.width + iGap;
                if (ch.height > iMaxH)
                    iMaxH = ch.height;
            }
            inputSet.resize(iCurX - iGap + iPadH, iMaxH + iPadV * 2);
            var frameInput = makeSectionFrame("Input", "Input", "Customize input styles for each state in your design system");
            frameInput.appendChild(inputSet);
            figma.currentPage.appendChild(frameInput);
        }
    }
    // -- Frame 6b: Textarea Components --
    if (t.designTextarea && t.designTextarea.length) {
        var textareaComponents = [];
        for (var ta of t.designTextarea) {
            var taBorderHex = resolveColorRef(ta.border);
            var taRadius = resolveCornerRef(ta.cornerId);
            var taEffects = resolveShadowRef(ta.shadowId);
            var taTypo = resolveTypoRef(ta.typographyId);
            var taFontStyle = toFigmaStyle(taTypo ? taTypo.fontWeight : "400");
            var taFontFamily = taTypo ? taTypo.fontFamily : "Inter";
            var taFontSize = taTypo ? taTypo.fontSize : 14;
            var taStyleId = await ensureTypeStyleId(ta.typographyId);
            var taLabelStyleId = findTypeStyleId("label", "large") || taStyleId || defaultLabelStyleId;
            var taHelperStyleId = findTypeStyleId("body", "small") || taStyleId || defaultHelperStyleId;
            var taPadX = typeof ta.paddingX === "number" ? ta.paddingX : 12;
            var taPadY = typeof ta.paddingY === "number" ? ta.paddingY : 8;
            var taMinH = (typeof ta.minHeight === "number" && ta.minHeight > 0) ? ta.minHeight : 96;
            // Load font dengan fallback
            var loadedTextareaFont = await loadFigmaFont(taFontFamily, taFontStyle);
            if (loadedTextareaFont) {
                taFontFamily = loadedTextareaFont.family;
                taFontStyle = loadedTextareaFont.style;
            }
            else {
                taFontFamily = "Inter";
                taFontStyle = "Regular";
            }
            var taComp = figma.createComponent();
            taComp.name = "State=" + cap(ta.state);
            taComp.layoutMode = "VERTICAL";
            taComp.primaryAxisSizingMode = "AUTO";
            taComp.counterAxisSizingMode = "AUTO";
            taComp.itemSpacing = 4;
            taComp.fills = [];
            // Daftarkan semua properties — hanya untuk direct children
            var taShowLabelProp = taComp.addComponentProperty("Show Label", "BOOLEAN", true);
            var taLabelTextProp = taComp.addComponentProperty("Label", "TEXT", "Label");
            var taShowHelperProp = taComp.addComponentProperty("Show Helper", "BOOLEAN", true);
            var taHelperTextProp = taComp.addComponentProperty("Helper", "TEXT", "Helper text");
            // 1. Label
            var taLabelTxt = figma.createText();
            taLabelTxt.name = "Label";
            taLabelTxt.fontName = { family: taFontFamily, style: taFontStyle };
            taLabelTxt.fontSize = taFontSize > 12 ? taFontSize - 2 : taFontSize;
            taLabelTxt.characters = "Label";
            taLabelTxt.fills = resolveColorPaint(ta.label);
            taComp.appendChild(taLabelTxt);
            taLabelTxt.componentPropertyReferences = {
                characters: taLabelTextProp,
                visible: taShowLabelProp,
            };
            await bindTextStyle(taLabelTxt, taLabelStyleId);
            // 2. Field — frame vertikal dengan tinggi minimum
            var taField = makeFrame("Field", "VERTICAL", 0);
            taField.primaryAxisSizingMode = "FIXED";
            taField.counterAxisSizingMode = "FIXED";
            taField.resize(240, Math.max(taMinH, taPadY * 2 + taFontSize * 1.5));
            taField.paddingLeft = taField.paddingRight = taPadX;
            taField.paddingTop = taField.paddingBottom = taPadY;
            taField.primaryAxisAlignItems = "MIN";
            taField.counterAxisAlignItems = "MIN";
            taField.cornerRadius = taRadius > 9000 ? 9999 : taRadius;
            taField.fills = resolveColorPaint(ta.background);
            taField.strokes = taBorderHex && taBorderHex !== "transparent"
                ? resolveColorPaint(ta.border) : [];
            taField.strokeWeight = 1;
            taField.strokeAlign = "INSIDE";
            taField.effects = taEffects;
            var taPlaceholder = figma.createText();
            taPlaceholder.name = "Placeholder";
            taPlaceholder.fontName = { family: taFontFamily, style: taFontStyle };
            taPlaceholder.fontSize = taFontSize;
            taPlaceholder.characters = "Placeholder";
            taPlaceholder.fills = resolveColorPaint(ta.placeholder);
            taPlaceholder.textAutoResize = "HEIGHT";
            taField.appendChild(taPlaceholder);
            taPlaceholder.layoutAlign = "STRETCH";
            await bindTextStyle(taPlaceholder, taStyleId);
            taComp.appendChild(taField);
            // 3. Helper — direct child, bisa bind visible + characters
            var taHelper = figma.createText();
            taHelper.name = "Helper";
            taHelper.fontName = { family: taFontFamily, style: taFontStyle };
            taHelper.fontSize = taFontSize > 10 ? taFontSize - 4 : taFontSize;
            taHelper.characters = "Helper text";
            taHelper.fills = resolveColorPaint(ta.helper);
            taComp.appendChild(taHelper);
            taHelper.componentPropertyReferences = {
                characters: taHelperTextProp,
                visible: taShowHelperProp,
            };
            await bindTextStyle(taHelper, taHelperStyleId);
            textareaComponents.push(taComp);
        }
        if (textareaComponents.length > 0) {
            var taSet = figma.combineAsVariants(textareaComponents, figma.currentPage);
            taSet.name = "Textarea";
            taSet.fills = [];
            taSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
            taSet.strokeWeight = 2;
            taSet.dashPattern = [8, 4];
            taSet.strokeAlign = "INSIDE";
            // Susun satu baris horizontal
            var taPadH = 32, taPadV = 32, taGap = 32;
            var taCurX = taPadH;
            var taMaxH = 0;
            for (var ci = 0; ci < taSet.children.length; ci++) {
                var ch = taSet.children[ci];
                ch.primaryAxisSizingMode = "AUTO";
                ch.counterAxisSizingMode = "AUTO";
                ch.x = taCurX;
                ch.y = taPadV;
                taCurX += ch.width + taGap;
                if (ch.height > taMaxH)
                    taMaxH = ch.height;
            }
            taSet.resize(taCurX - taGap + taPadH, taMaxH + taPadV * 2);
            var frameTextarea = makeSectionFrame("Textarea", "Textarea", "Customize textarea styles for each state in your design system");
            frameTextarea.appendChild(taSet);
            figma.currentPage.appendChild(frameTextarea);
        }
    }
    // -- Frame 7: Badge Components --
    if (t.designBadge && t.designBadge.length) {
        var BADGE_VARIANTS_ORDER = [
            "default", "secondary", "destructive", "error", "warning", "success", "outline"
        ];
        var badgeComponents = [];
        for (var badge of t.designBadge) {
            var bBgHex = resolveColorRef(badge.background);
            var bFgHex = resolveColorRef(badge.foreground);
            var bBorderHex = resolveColorRef(badge.border);
            var bRadius = resolveCornerRef(badge.cornerId);
            var bEffects = resolveShadowRef(badge.shadowId);
            var bTypo = resolveTypoRef(badge.typographyId);
            var bFontStyle = toFigmaStyle(bTypo ? bTypo.fontWeight : "400");
            var bFontFamily = bTypo ? bTypo.fontFamily : "Inter";
            var bFontSize = bTypo ? bTypo.fontSize : 12;
            var bStyleId = await ensureTypeStyleId(badge.typographyId);
            // Load font dengan fallback
            var loadedBadgeFont = await loadFigmaFont(bFontFamily, bFontStyle);
            if (loadedBadgeFont) {
                bFontFamily = loadedBadgeFont.family;
                bFontStyle = loadedBadgeFont.style;
            }
            else {
                bFontFamily = "Inter";
                bFontStyle = "Regular";
            }
            var bComp = figma.createComponent();
            bComp.name = "Variant=" + cap(badge.variant);
            bComp.layoutMode = "HORIZONTAL";
            bComp.primaryAxisSizingMode = "AUTO";
            bComp.counterAxisSizingMode = "AUTO";
            bComp.primaryAxisAlignItems = "CENTER";
            bComp.counterAxisAlignItems = "CENTER";
            bComp.paddingLeft = bComp.paddingRight = badge.paddingX;
            bComp.paddingTop = bComp.paddingBottom = badge.paddingY;
            bComp.cornerRadius = bRadius > 9000 ? 9999 : bRadius;
            bComp.fills = resolveColorPaint(badge.background);
            bComp.strokes = bBorderHex && bBorderHex !== "transparent"
                ? resolveColorPaint(badge.border) : [];
            bComp.strokeWeight = 1;
            bComp.strokeAlign = "INSIDE";
            bComp.effects = bEffects;
            // Property: Label text
            var bLabelProp = bComp.addComponentProperty("Label", "TEXT", "Badge");
            var bTxt = figma.createText();
            bTxt.name = "Label";
            bTxt.fontName = { family: bFontFamily, style: bFontStyle };
            bTxt.fontSize = bFontSize;
            bTxt.characters = "Badge";
            bTxt.fills = resolveColorPaint(badge.foreground);
            bComp.appendChild(bTxt);
            bTxt.componentPropertyReferences = { characters: bLabelProp };
            await bindTextStyle(bTxt, bStyleId);
            badgeComponents.push(bComp);
        }
        if (badgeComponents.length > 0) {
            var badgeSet = figma.combineAsVariants(badgeComponents, figma.currentPage);
            badgeSet.name = "Badge";
            badgeSet.fills = [];
            badgeSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
            badgeSet.strokeWeight = 2;
            badgeSet.dashPattern = [8, 4];
            badgeSet.strokeAlign = "INSIDE";
            // Susun satu baris horizontal per variant
            var bPadH = 32, bPadV = 32, bGap = 20;
            var bCurX = bPadH;
            var bMaxH = 0;
            for (var vi = 0; vi < BADGE_VARIANTS_ORDER.length; vi++) {
                var vname = cap(BADGE_VARIANTS_ORDER[vi]);
                for (var ci = 0; ci < badgeSet.children.length; ci++) {
                    var ch = badgeSet.children[ci];
                    if (ch.name === "Variant=" + vname) {
                        ch.primaryAxisSizingMode = "AUTO";
                        ch.counterAxisSizingMode = "AUTO";
                        ch.x = bCurX;
                        ch.y = bPadV;
                        bCurX += ch.width + bGap;
                        if (ch.height > bMaxH)
                            bMaxH = ch.height;
                        break;
                    }
                }
            }
            badgeSet.resize(bCurX - bGap + bPadH, bMaxH + bPadV * 2);
            var frameBadge = makeSectionFrame("Badge", "Badge", "Customize badge styles for each variant in your design system");
            frameBadge.appendChild(badgeSet);
            figma.currentPage.appendChild(frameBadge);
        }
    }
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.slice(-8));
    // ── Helper: cari primary/500 hex ──────────────────────────────────────────
    var activePrimary = (function () {
        if (!t.colorPalette)
            return "#6366F1";
        for (var pal of t.colorPalette) {
            if (pal.purpose === "primary") {
                for (var clr of pal.colors) {
                    if (clr.level === "500")
                        return clr.hex;
                }
            }
        }
        return "#6366F1";
    })();
    var activePrimary100 = (function () {
        if (!t.colorPalette)
            return "#E0E7FF";
        for (var pal of t.colorPalette) {
            if (pal.purpose === "primary") {
                for (var clr of pal.colors) {
                    if (clr.level === "100")
                        return clr.hex;
                }
            }
        }
        return "#E0E7FF";
    })();
    var fg500 = (function () {
        if (!t.colorPalette)
            return "#1A1A1A";
        for (var pal of t.colorPalette) {
            if (pal.purpose === "foreground") {
                for (var clr of pal.colors) {
                    if (clr.level === "500")
                        return clr.hex;
                }
            }
        }
        return "#1A1A1A";
    })();
    // Paint helpers — bound ke variable jika tersedia
    function primaryPaint500() {
        return resolveColorPaint("primary::500");
    }
    function primaryPaint100() {
        return resolveColorPaint("primary::100");
    }
    function fgPaint() {
        return resolveColorPaint("foreground::500");
    }
    var BORDER_COLOR = "#D1D5DB";
    var TRACK_OFF = "#D1D5DB";
    var THUMB_COLOR = "#FFFFFF";
    // ── Frame 8: Checkbox ──────────────────────────────────────────────────────
    if (t.designCheckbox && t.designCheckbox.length) {
        var cbStatesOrder = ["default", "checked", "indeterminate", "disabled"];
        var cbComps = [];
        // Urutkan state agar posisi di component set konsisten
        var cbConfigs = t.designCheckbox.slice().sort(function (a, b) {
            var ai = cbStatesOrder.indexOf(a.state);
            var bi = cbStatesOrder.indexOf(b.state);
            return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
        });
        for (var cb of cbConfigs) {
            var cbState = cb.state || "default";
            var cbSize = (typeof cb.size === "number" && cb.size > 0) ? cb.size : 16;
            var cbRadius = resolveCornerRef(cb.cornerId);
            var cbEffects = resolveShadowRef(cb.shadowId);
            var cbDisabled = cbState === "disabled";
            var cbActive = cbState === "checked" || cbState === "indeterminate";
            var cbComp = figma.createComponent();
            cbComp.name = "State=" + cap(cbState);
            cbComp.layoutMode = "HORIZONTAL";
            cbComp.primaryAxisSizingMode = "AUTO";
            cbComp.counterAxisSizingMode = "AUTO";
            cbComp.counterAxisAlignItems = "CENTER";
            cbComp.itemSpacing = 8;
            cbComp.fills = [];
            // Box — pakai frame agar icon bisa diposisikan di tengah
            var cbBox = makeFrame("Box", "NONE", 0, 0);
            cbBox.resize(cbSize, cbSize);
            cbBox.cornerRadius = cbRadius > 9000 ? 9999 : cbRadius;
            cbBox.fills = resolveColorPaint(cb.background);
            cbBox.strokes = (cb.border && cb.border !== "transparent")
                ? resolveColorPaint(cb.border)
                : [];
            cbBox.strokeWeight = 1;
            cbBox.strokeAlign = "INSIDE";
            cbBox.effects = cbEffects;
            cbBox.opacity = cbDisabled ? 0.5 : 1;
            // Icon centang / minus
            if (cbActive) {
                var cbIconPaints = resolveColorPaint(cb.foreground);
                if (!cbIconPaints || cbIconPaints.length === 0) {
                    cbIconPaints = solid("#FFFFFF");
                }
                if (cbState === "checked") {
                    var checkIcon = figma.createVector();
                    checkIcon.name = "Check";
                    checkIcon.vectorPaths = [
                        { windingRule: "NONZERO", data: "M 0 4 L 4 8 L 12 0" }
                    ];
                    checkIcon.fills = [];
                    checkIcon.resize(cbSize * 0.6, cbSize * 0.4);
                    checkIcon.x = (cbSize - checkIcon.width) / 2;
                    checkIcon.y = (cbSize - checkIcon.height) / 2;
                    checkIcon.strokes = cbIconPaints;
                    checkIcon.strokeWeight = Math.max(1.5, cbSize * 0.1);
                    checkIcon.strokeCap = "ROUND";
                    checkIcon.strokeJoin = "ROUND";
                    cbBox.appendChild(checkIcon);
                }
                else {
                    var dash = figma.createRectangle();
                    dash.name = "Minus";
                    dash.resize(cbSize * 0.6, Math.max(2, cbSize * 0.12));
                    dash.cornerRadius = 999;
                    dash.fills = cbIconPaints;
                    dash.x = (cbSize - dash.width) / 2;
                    dash.y = (cbSize - dash.height) / 2;
                    cbBox.appendChild(dash);
                }
            }
            cbComp.appendChild(cbBox);
            // Label + component property
            var cbLabelProp = cbComp.addComponentProperty("Label", "TEXT", "Checkbox");
            var cbLabel = figma.createText();
            cbLabel.name = "Label";
            cbLabel.fontName = { family: "Inter", style: "Regular" };
            cbLabel.fontSize = 14;
            cbLabel.characters = "Checkbox";
            await bindTextStyle(cbLabel, defaultLabelStyleId);
            cbLabel.fills = cbDisabled
                ? resolveColorPaint("muted::400")
                : fgPaint();
            cbLabel.opacity = cbDisabled ? 0.5 : 1;
            cbComp.appendChild(cbLabel);
            cbLabel.componentPropertyReferences = { characters: cbLabelProp };
            cbComps.push(cbComp);
        }
        if (cbComps.length > 0) {
            var cbSet = figma.combineAsVariants(cbComps, figma.currentPage);
            cbSet.name = "Checkbox";
            cbSet.fills = [];
            cbSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
            cbSet.strokeWeight = 2;
            cbSet.dashPattern = [8, 4];
            cbSet.strokeAlign = "INSIDE";
            var cbPad = 32, cbGap = 24, cbX = cbPad, cbMaxH = 0;
            for (var ci = 0; ci < cbSet.children.length; ci++) {
                var ch = cbSet.children[ci];
                ch.x = cbX;
                ch.y = cbPad;
                cbX += ch.width + cbGap;
                if (ch.height > cbMaxH)
                    cbMaxH = ch.height;
            }
            cbSet.resize(cbX - cbGap + cbPad, cbMaxH + cbPad * 2);
            var frameCheckbox = makeSectionFrame("Checkbox", "Checkbox", "Selection control for binary on/off choices");
            frameCheckbox.appendChild(cbSet);
            figma.currentPage.appendChild(frameCheckbox);
        }
    }
    // ── Frame 9: Radio ────────────────────────────────────────────────────────
    {
        var rdStates = ["Unselected", "Selected", "Disabled"];
        var rdComps = [];
        for (var state of rdStates) {
            var rdComp = figma.createComponent();
            rdComp.name = "State=" + state;
            rdComp.layoutMode = "HORIZONTAL";
            rdComp.primaryAxisSizingMode = "AUTO";
            rdComp.counterAxisSizingMode = "AUTO";
            rdComp.counterAxisAlignItems = "CENTER";
            rdComp.itemSpacing = 8;
            rdComp.fills = [];
            var rdSelected = state === "Selected";
            var rdDisabled = state === "Disabled";
            // Outer circle — pakai Frame bulat penuh agar bisa berisi dot
            var rdOuter = makeFrame("Circle", "NONE", 0, 0);
            rdOuter.resize(18, 18);
            rdOuter.cornerRadius = 999;
            rdOuter.fills = [];
            rdOuter.strokes = [{ type: "SOLID",
                    color: hexToRgb(rdSelected ? activePrimary : rdDisabled ? TRACK_OFF : BORDER_COLOR) }];
            rdOuter.strokeWeight = 1.5;
            rdOuter.opacity = rdDisabled ? 0.4 : 1;
            // Inner dot di tengah outer
            if (rdSelected) {
                var rdDot = makeFrame("Dot", "NONE", 0, 0);
                rdDot.resize(8, 8);
                rdDot.cornerRadius = 999;
                rdDot.fills = primaryPaint500();
                rdDot.x = 5;
                rdDot.y = 5;
                rdOuter.appendChild(rdDot);
            }
            rdComp.appendChild(rdOuter);
            // Label
            var rdLabelProp = rdComp.addComponentProperty("Label", "TEXT", "Radio");
            var rdLabel = figma.createText();
            rdLabel.name = "Label";
            rdLabel.fontName = { family: "Inter", style: "Regular" };
            rdLabel.fontSize = 14;
            rdLabel.characters = "Radio";
            await bindTextStyle(rdLabel, defaultLabelStyleId);
            rdLabel.fills = rdDisabled ? solid(TRACK_OFF) : fgPaint();
            rdComp.appendChild(rdLabel);
            rdLabel.componentPropertyReferences = { characters: rdLabelProp };
            rdComps.push(rdComp);
        }
        var rdSet = figma.combineAsVariants(rdComps, figma.currentPage);
        rdSet.name = "Radio";
        rdSet.fills = [];
        rdSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
        rdSet.strokeWeight = 2;
        rdSet.dashPattern = [8, 4];
        rdSet.strokeAlign = "INSIDE";
        var rdPad = 32, rdGap = 24, rdX = rdPad, rdMaxH = 0;
        for (var ci = 0; ci < rdSet.children.length; ci++) {
            var ch = rdSet.children[ci];
            ch.x = rdX;
            ch.y = rdPad;
            rdX += ch.width + rdGap;
            if (ch.height > rdMaxH)
                rdMaxH = ch.height;
        }
        rdSet.resize(rdX - rdGap + rdPad, rdMaxH + rdPad * 2);
        var frameRadio = makeSectionFrame("Radio", "Radio", "Single-selection control within a group of options");
        frameRadio.appendChild(rdSet);
        figma.currentPage.appendChild(frameRadio);
    }
    // ── Frame 10: Switch ──────────────────────────────────────────────────────
    {
        var swStates = ["Off", "On", "Disabled Off", "Disabled On"];
        var swComps = [];
        for (var state of swStates) {
            var swComp = figma.createComponent();
            swComp.name = "State=" + state;
            swComp.layoutMode = "HORIZONTAL";
            swComp.primaryAxisSizingMode = "AUTO";
            swComp.counterAxisSizingMode = "AUTO";
            swComp.counterAxisAlignItems = "CENTER";
            swComp.itemSpacing = 10;
            swComp.fills = [];
            var swOn = state === "On" || state === "Disabled On";
            var swDisabled = state === "Disabled Off" || state === "Disabled On";
            var swTrack = makeFrame("Track", "NONE", 0, 0);
            swTrack.resize(44, 24);
            swTrack.cornerRadius = 12;
            swTrack.fills = swOn ? primaryPaint500() : solid(TRACK_OFF);
            swTrack.opacity = swDisabled ? 0.4 : 1;
            swComp.appendChild(swTrack);
            var swThumbFrame = makeFrame("Thumb", "NONE", 0, 0);
            swThumbFrame.resize(18, 18);
            swThumbFrame.fills = solid(THUMB_COLOR);
            swThumbFrame.cornerRadius = 999;
            swThumbFrame.x = swOn ? 23 : 3;
            swThumbFrame.y = 3;
            swTrack.appendChild(swThumbFrame);
            var swLabelProp = swComp.addComponentProperty("Label", "TEXT", "Switch");
            var swLabel = figma.createText();
            swLabel.name = "Label";
            swLabel.fontName = { family: "Inter", style: "Regular" };
            swLabel.fontSize = 14;
            swLabel.characters = "Switch";
            await bindTextStyle(swLabel, defaultLabelStyleId);
            swLabel.fills = swDisabled ? solid(TRACK_OFF) : fgPaint();
            swComp.appendChild(swLabel);
            swLabel.componentPropertyReferences = { characters: swLabelProp };
            swComps.push(swComp);
        }
        var swSet = figma.combineAsVariants(swComps, figma.currentPage);
        swSet.name = "Switch";
        swSet.fills = [];
        swSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
        swSet.strokeWeight = 2;
        swSet.dashPattern = [8, 4];
        swSet.strokeAlign = "INSIDE";
        var swPad = 32, swGap = 24, swX = swPad, swMaxH = 0;
        for (var ci = 0; ci < swSet.children.length; ci++) {
            var ch = swSet.children[ci];
            ch.x = swX;
            ch.y = swPad;
            swX += ch.width + swGap;
            if (ch.height > swMaxH)
                swMaxH = ch.height;
        }
        swSet.resize(swX - swGap + swPad, swMaxH + swPad * 2);
        var frameSwitch = makeSectionFrame("Switch", "Switch", "Toggle control for enabling or disabling a setting");
        frameSwitch.appendChild(swSet);
        figma.currentPage.appendChild(frameSwitch);
    }
    // ── Frame 11: Slider ──────────────────────────────────────────────────────
    {
        var sl = t.designSlider;
        var sliderValues = [0, 25, 50, 75, 100];
        var sliderComps = [];
        var TRACK_W = 200;
        // Baca dari store, fallback jika tidak ada
        var TRACK_H = (sl && sl.height > 0) ? sl.height : 4;
        var THUMB_D = (sl && sl.thumbSize > 0) ? sl.thumbSize : 0; // 0 = tidak ada thumb
        var trackColor = sl ? sl.background : "muted::200";
        var fillColor = sl ? sl.foreground : "primary::500";
        var thumbColor = sl ? sl.thumb : "primary::500";
        var trackRadius = sl ? resolveCornerRef(sl.cornerId) : 2;
        var thumbEffects = sl ? resolveShadowRef(sl.thumbShadowId) : [];
        for (var val of sliderValues) {
            var fillW = Math.round((val / 100) * TRACK_W);
            var compH = Math.max(THUMB_D, TRACK_H) + 4;
            var slComp = figma.createComponent();
            slComp.name = "Value=" + val + "%";
            slComp.layoutMode = "NONE";
            slComp.resize(TRACK_W + THUMB_D, compH);
            slComp.fills = [];
            var thumbOff = THUMB_D / 2;
            var trackY = (compH - TRACK_H) / 2;
            // Track background
            var trackBg = figma.createRectangle();
            trackBg.name = "Track";
            trackBg.resize(TRACK_W, TRACK_H);
            trackBg.cornerRadius = trackRadius > 9000 ? 9999 : trackRadius;
            trackBg.fills = resolveColorPaint(trackColor) || solid(TRACK_OFF);
            trackBg.x = thumbOff;
            trackBg.y = trackY;
            slComp.appendChild(trackBg);
            // Track fill
            if (fillW > 0) {
                var trackFill = figma.createRectangle();
                trackFill.name = "Fill";
                trackFill.resize(fillW, TRACK_H);
                trackFill.cornerRadius = trackRadius > 9000 ? 9999 : trackRadius;
                trackFill.fills = resolveColorPaint(fillColor) || solid(activePrimary);
                trackFill.x = thumbOff;
                trackFill.y = trackY;
                slComp.appendChild(trackFill);
            }
            // Thumb — hanya jika thumbSize > 0
            if (THUMB_D > 0) {
                var slThumb = makeFrame("Thumb", "NONE", 0, 0);
                slThumb.resize(THUMB_D, THUMB_D);
                slThumb.cornerRadius = 999;
                slThumb.fills = resolveColorPaint(thumbColor) || solid(activePrimary);
                if (thumbEffects.length)
                    slThumb.effects = thumbEffects;
                slThumb.x = thumbOff + fillW - THUMB_D / 2;
                slThumb.y = (compH - THUMB_D) / 2;
                slComp.appendChild(slThumb);
            }
            sliderComps.push(slComp);
        }
        var slSet = figma.combineAsVariants(sliderComps, figma.currentPage);
        slSet.name = "Slider";
        slSet.fills = [];
        slSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
        slSet.strokeWeight = 2;
        slSet.dashPattern = [8, 4];
        slSet.strokeAlign = "INSIDE";
        var slPad = 32, slGap = 24, slY2 = slPad, slMaxW = 0;
        for (var ci = 0; ci < slSet.children.length; ci++) {
            var ch = slSet.children[ci];
            ch.x = slPad;
            ch.y = slY2;
            slY2 += ch.height + slGap;
            if (ch.width > slMaxW)
                slMaxW = ch.width;
        }
        slSet.resize(slMaxW + slPad * 2, slY2 - slGap + slPad);
        var frameSlider = makeSectionFrame("Slider", "Slider", "Range input control for selecting a value along a track");
        frameSlider.appendChild(slSet);
        figma.currentPage.appendChild(frameSlider);
    }
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.slice(-12));
}
figma.showUI(__html__, { width: 380, height: 300 });
figma.ui.onmessage = async function (t) {
    try {
        await importTokens(t);
        figma.notify("Design system dibuat ✓");
        figma.closePlugin();
    }
    catch (e) {
        figma.notify("Gagal: " + e.message, { error: true });
    }
};
