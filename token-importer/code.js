// ---------- helpers ----------
function hexToRgb(hex) {
  var n = parseInt(hex.replace("#", ""), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
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
  t.fontName = { family: family || "Google Sans Flex", style: style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solid(hex);
  if (name) t.name = name;
  return t;
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

  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Regular" });
  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Medium" });
  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Bold" });
  await figma.loadFontAsync({ family: "Source Code Pro", style: "Regular" });
  await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" });

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
  var frameHeader = makeFrame("Design System · " + (t.name || "Untitled"), "VERTICAL", 12, 48);
  frameHeader.cornerRadius = 24;
  frameHeader.fills = solid("#F0EDE6");
  frameHeader.appendChild(makeText("Design System", 13, "Regular", "#7A7A7A", "Label"));
  if (t.name) frameHeader.appendChild(makeText(t.name, 32, "Bold", "#1A1A1A", "Project Name"));
  if (t.description) frameHeader.appendChild(makeText(t.description, 14, "Regular", "#7A7A7A", "Description"));
  figma.currentPage.appendChild(frameHeader);

  // -- Frame 2: Typography --
  if (typeItems.length) {
    var frameTypo = makeFrame("Typography", "VERTICAL", 32, 48);
    frameTypo.cornerRadius = 24;
    frameTypo.fills = solid("#F0EDE6");
    frameTypo.appendChild(makeText("Typography", 20, "Bold", "#1A1A1A", "Title"));
    frameTypo.appendChild(await typeFn(typeItems));
    figma.currentPage.appendChild(frameTypo);
  }

  // -- Frame 3: Color Palette --
  if (palettesForTemplate.length) {
    var frameColors = makeFrame("Color Palette", "VERTICAL", 32, 48);
    frameColors.cornerRadius = 24;
    frameColors.fills = solid("#F0EDE6");
    frameColors.appendChild(makeText("Color Palette", 20, "Bold", "#1A1A1A", "Title"));
    frameColors.appendChild(await colorFn(palettesForTemplate));
    figma.currentPage.appendChild(frameColors);
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.slice(-3));
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
