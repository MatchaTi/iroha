// ---------- helpers ----------
function hexToRgb(hex) {
  var n = parseInt(hex.replace("#", ""), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
// Parse rgba(r,g,b,a) atau hex (#RRGGBB / #RRGGBBAA) ke { r,g,b,a } (0–1)
function parseColor(color) {
  if (!color) return { r: 0, g: 0, b: 0, a: 1 };
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

function makeFrame(name, mode, gap, pad) {
  var f = figma.createFrame();
  f.name = name;
  f.layoutMode = mode;
  f.itemSpacing = gap || 0;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.fills = [];
  if (pad) f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = pad;
  return f;
}
function makeText(chars, size, style, hex, name, family) {
  var t = figma.createText();
  t.fontName = { family: family || "Inter", style: style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solid(hex);
  if (name) t.name = name;
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
  one: async function (palettes) {
    var wrap = makeFrame("Color · Template One", "VERTICAL", 40);
    for (var palette of palettes) {
      var group = makeFrame("Palette · " + palette.name, "VERTICAL", 12);

      // Header: "Primary - Primary"
      group.appendChild(makeText(
        cap(palette.name) + " - " + cap(palette.purpose),
        13, "Regular", "#1A1A1A", "Header"
      ));

      // Row kartu warna
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
        card.fills = solid(c.hex);

        // Corner radius: rounded hanya di ujung kiri/kanan
        if (isFirst && isLast) {
          card.cornerRadius = 12;
        } else if (isFirst) {
          card.topLeftRadius = 12;
          card.bottomLeftRadius = 12;
        } else if (isLast) {
          card.topRightRadius = 12;
          card.bottomRightRadius = 12;
        }

        var fg = readableOn(c.hex);
        var fgMuted = fg === "#1A1A1A" ? "#6B6B6B" : "#AAAAAA";

        // Level di atas
        card.appendChild(makeText(c.level, 11, "Medium", fg, "Level", "Google Sans Flex"));

        // Hex + RGB di bawah
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

  two: async function (palettes) {
    var wrap = makeFrame("Color · Template Two", "VERTICAL", 40);
    for (var palette of palettes) {
      var group = makeFrame("Palette · " + palette.name, "VERTICAL", 12);

      // Header: "Primary - Primary"
      group.appendChild(makeText(
        cap(palette.name) + " - " + cap(palette.purpose),
        13, "Regular", "#1A1A1A", "Header"
      ));

      // Row square swatches
      var row = makeFrame("Shades", "HORIZONTAL", 8);
      var sorted = palette.colors.slice().sort(function (a, b) {
        return parseInt(a.level) - parseInt(b.level);
      });

      for (var c of sorted) {
        var swatch = makeFrame("Swatch · " + c.level, "VERTICAL", 6);

        // Square color box
        var box = figma.createRectangle();
        box.name = "Color";
        box.resize(88, 88);
        box.cornerRadius = 10;
        box.fills = solid(c.hex);
        swatch.appendChild(box);

        // Label bawah
        var labels = makeFrame("Labels", "VERTICAL", 2);
        labels.fills = [];
        labels.appendChild(makeText(
          cap(palette.name) + "-" + c.level,
          11, "Regular", "#1A1A1A", "Name", "Source Code Pro"
        ));
        labels.appendChild(makeText(
          c.hex.toUpperCase(),
          11, "Regular", "#7A7A7A", "Hex", "Source Code Pro"
        ));
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
      preview.fontName = { family: it.typo.fontFamily, style: it.figmaStyle };
      preview.fontSize = it.typo.fontSize;
      preview.characters = cap(it.typo.purpose) + " " + cap(it.typo.level);
      if (it.styleId) await preview.setTextStyleIdAsync(it.styleId);
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
      preview.fontName = { family: it.typo.fontFamily, style: it.figmaStyle };
      preview.fontSize = it.typo.fontSize;
      preview.characters = cap(it.typo.purpose) + " " + cap(it.typo.level);
      if (it.styleId) await preview.setTextStyleIdAsync(it.styleId);
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
          if (clr.level === "50") { canvasBg = clr.hex; break; }
        }
        break;
      }
    }
  }
  figma.currentPage.backgrounds = [{ type: "SOLID", color: hexToRgb(canvasBg) }];

  // -- Color Palettes: paint styles + optional variables per shade --
  var palettesForTemplate = [];
  if (t.colorPalette && t.colorPalette.length) {
    var varCollection = null;
    var modeId = null;
    try {
      varCollection = figma.variables.createVariableCollection("Colors");
      modeId = varCollection.modes[0].modeId;
      varCollection.renameMode(modeId, "Default");
    } catch (e) {
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
            paintStyle.paints = [
              figma.variables.setBoundVariableForPaint(
                { type: "SOLID", color: hexToRgb(c.hex) },
                "color",
                v
              )
            ];
          } catch (e) {
            paintStyle.paints = solid(c.hex);
          }
        } else {
          paintStyle.paints = solid(c.hex);
        }
      }
      palettesForTemplate.push(palette);
    }
  }

  // -- Typography: text styles --
  var typeItems = [];
  for (var s of t.typography || []) {
    var figmaStyle = toFigmaStyle(s.fontWeight);
    var font = { family: s.fontFamily, style: figmaStyle };
    try {
      await figma.loadFontAsync(font);
    } catch (e) {
      figma.notify("Font tidak ditemukan: " + s.fontFamily + " " + figmaStyle + " (dilewati)", { timeout: 3000 });
      continue;
    }
    var ts = figma.createTextStyle();
    ts.name = cap(s.purpose) + "/" + cap(s.level) + " · " + s.name;
    ts.fontName = font;
    ts.fontSize = s.fontSize;
    ts.lineHeight = { unit: "PIXELS", value: s.lineHeight };
    if (s.letterSpacing) {
      ts.letterSpacing = { unit: "PIXELS", value: s.letterSpacing };
    }
    typeItems.push({ typo: s, figmaStyle: figmaStyle, styleId: ts.id });
  }

  // -- Frame 1: Header --
  var frameHeader = makeSectionFrame(
    "Design System · " + (t.name || "Untitled"),
    t.name || "Untitled",
    t.description || ""
  );
  figma.currentPage.appendChild(frameHeader);

  // -- Frame 2: Typography --
  if (typeItems.length) {
    var frameTypo = makeSectionFrame(
      "Typography",
      "Typography",
      "Define type styles for consistent text hierarchy across your design system"
    );
    frameTypo.appendChild(await typeFn(typeItems));
    figma.currentPage.appendChild(frameTypo);
  }

  // -- Frame 3: Color Palette --
  if (palettesForTemplate.length) {
    var frameColors = makeSectionFrame(
      "Color Palette",
      "Color Palette",
      "Define color tokens for consistent use of color across your design system"
    );
    frameColors.appendChild(await colorFn(palettesForTemplate));
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
      } else {
        cornerCollection = figma.variables.createVariableCollection("Design Tokens");
        cornerModeId = cornerCollection.modes[0].modeId;
        cornerCollection.renameMode(cornerModeId, "Default");
      }
      for (var cr of t.corner) {
        var crVar = figma.variables.createVariable("Corner/" + cr.name, cornerCollection, "FLOAT");
        crVar.setValueForMode(cornerModeId, cr.radius >= 99 ? 9999 : cr.radius);
      }
    } catch (e) {
      // Variables tidak tersedia, lanjut tanpa variable
    }

    // Cari warna primary/500 untuk bg shape
    var primaryHex = "#1A1A1A";
    if (t.colorPalette && t.colorPalette.length) {
      for (var pal of t.colorPalette) {
        if (pal.purpose === "primary") {
          for (var clr of pal.colors) {
            if (clr.level === "500") { primaryHex = clr.hex; break; }
          }
          break;
        }
      }
    }

    var frameCorner = makeSectionFrame(
      "Corner",
      "Corner",
      "Define border radius tokens for consistent rounded corners across your design system"
    );

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

    var frameShadow = makeSectionFrame(
      "Shadow",
      "Shadow",
      "Define elevation and depth with consistent shadow tokens across your design system"
    );

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

  // -- Frame 5: Button Components --
  if (t.designButton && t.designButton.length) {
    // Helper resolve color ref "purpose::level" → hex
    function resolveColorRef(ref) {
      if (!ref || ref === "transparent") return null;
      if (!ref.includes("::")) return ref;
      var parts = ref.split("::");
      var purpose = parts[0], level = parts[1];
      for (var pal of (t.colorPalette || [])) {
        if (pal.purpose === purpose) {
          for (var clr of pal.colors) {
            if (clr.level === level) return clr.hex;
          }
        }
      }
      return "#000000";
    }

    // Helper resolve cornerId → radius
    function resolveCornerRef(id) {
      for (var cr of (t.corner || [])) {
        if (cr.id === id) return cr.radius >= 99 ? 9999 : cr.radius;
      }
      return 0;
    }

    // Helper resolve shadowId → Figma effect array
    function resolveShadowRef(id) {
      if (id === "none" || !id) return [];
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

    // Helper resolve typographyId → { fontFamily, fontSize, fontWeight }
    function resolveTypoRef(id) {
      for (var ty of (t.typography || [])) {
        if (ty.id === id) return ty;
      }
      return null;
    }

    // Map fontWeight → Figma style string
    var SIZES_ORDER = ["xs", "sm", "default", "lg"];
    var VARIANTS_ORDER = [
      "default", "outline", "secondary", "ghost",
      "destructive", "error", "warning", "success", "link"
    ];

    var components = [];

    for (var btn of t.designButton) {
      var bgHex = resolveColorRef(btn.background);
      var fgHex = resolveColorRef(btn.foreground);
      var borderHex = resolveColorRef(btn.border);
      var radius = resolveCornerRef(btn.cornerId);
      var effects = resolveShadowRef(btn.shadowId);
      var typo = resolveTypoRef(btn.typographyId);
      var figmaFontStyle = toFigmaStyle(typo ? typo.fontWeight : "400");
      var fontFamily = typo ? typo.fontFamily : "Inter";
      var fontSize = typo ? typo.fontSize : 14;

      // Load font — fallback ke Inter Regular jika font/style tidak tersedia
      var fontLoaded = false;
      try {
        await figma.loadFontAsync({ family: fontFamily, style: figmaFontStyle });
        fontLoaded = true;
      } catch(e) {}
      if (!fontLoaded) {
        // Coba style Regular dari font yang sama
        try {
          await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
          figmaFontStyle = "Regular";
          fontLoaded = true;
        } catch(e) {}
      }
      if (!fontLoaded) {
        // Fallback total ke Inter Regular
        fontFamily = "Inter";
        figmaFontStyle = "Regular";
      }

      // Buat component
      var comp = figma.createComponent();
      comp.name = "Variant=" + cap(btn.variant) + ", Size=" + btn.size;
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "AUTO";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.paddingLeft = comp.paddingRight = btn.paddingX;
      comp.paddingTop = comp.paddingBottom = btn.paddingY;
      comp.cornerRadius = radius > 9000 ? 9999 : radius;
      comp.fills = bgHex ? solid(bgHex) : [];
      comp.strokes = borderHex && borderHex !== "transparent"
        ? [{ type: "SOLID", color: hexToRgb(borderHex) }]
        : [];
      comp.strokeWeight = 1;
      comp.strokeAlign = "INSIDE";
      comp.effects = effects;

      // Text label dengan component property
      var labelPropKey = comp.addComponentProperty("Label", "TEXT", "Button");
      var txt = figma.createText();
      txt.fontName = { family: fontFamily, style: figmaFontStyle };
      txt.fontSize = fontSize;
      txt.fills = fgHex ? solid(fgHex) : solid("#000000");
      txt.characters = "Button";
      if (btn.variant === "link") {
        txt.textDecoration = "UNDERLINE";
      }
      comp.appendChild(txt);
      txt.componentPropertyReferences = { characters: labelPropKey };

      components.push(comp);
    }

    // Gabungkan jadi ComponentSet
    if (components.length > 0) {
      var compSet = figma.combineAsVariants(components, figma.currentPage);
      compSet.name = "Button";
      compSet.fills = [];
      compSet.strokes = [{ type: "SOLID", color: { r: 0.6, g: 0.4, b: 1 } }];
      compSet.strokeWeight = 2;
      compSet.dashPattern = [8, 4];
      compSet.strokeAlign = "INSIDE";

      // Susun manual: tiap variant = satu baris, size xs→lg kiri ke kanan
      var sizeOrder = { xs: 0, sm: 1, "default": 2, lg: 3 };
      var variantOrder = ["Default","Outline","Secondary","Ghost","Destructive","Error","Warning","Success","Link"];
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
        if (!byVariant[vk]) byVariant[vk] = [];
        byVariant[vk].push({ node: ch, sizeKey: sk });
      }

      // Posisikan tiap node
      var curY = padV;
      var maxRowWidth = 0;
      for (var ri = 0; ri < variantOrder.length; ri++) {
        var vk = variantOrder[ri];
        if (!byVariant[vk]) continue;
        var row = byVariant[vk].sort(function(a, b) {
          return (sizeOrder[a.sizeKey] || 0) - (sizeOrder[b.sizeKey] || 0);
        });
        var curX = padH;
        var maxH = 0;
        for (var si = 0; si < row.length; si++) {
          var node = row[si].node;
          node.x = curX;
          node.y = curY;
          curX += node.width + colGap;
          if (node.height > maxH) maxH = node.height;
        }
        var rowWidth = curX - colGap + padH;
        if (rowWidth > maxRowWidth) maxRowWidth = rowWidth;
        curY += maxH + rowGap;
      }

      // Resize compSet agar pas dengan konten
      compSet.resize(maxRowWidth, curY - rowGap + padV);

      // Buat frame wrapper
      var frameBtn = makeSectionFrame(
        "Button",
        "Button",
        "Customize button styles for each variant and size in your design system"
      );
      frameBtn.appendChild(compSet);
      figma.currentPage.appendChild(frameBtn);
    }
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.slice(-6));
}

figma.showUI(__html__, { width: 360, height: 260 });

figma.ui.onmessage = async function (t) {
  try {
    await importTokens(t);
    figma.notify("Design system dibuat ✓");
    figma.closePlugin();
  } catch (e) {
    figma.notify("Gagal: " + e.message, { error: true });
  }
};
