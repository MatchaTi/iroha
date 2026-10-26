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

// ---------- Color templates ----------
// Menerima colorItems: [{ color: Color, styleId }]
// color = { id, name, purpose, hex, rgb }

var COLOR_TEMPLATES = {
  cards: async function (colorItems) {
    var wrap = makeFrame("Palette · Cards", "HORIZONTAL", 16);
    wrap.counterAxisAlignItems = "MIN";
    for (var it of colorItems) {
      var card = makeFrame("Swatch · " + it.color.name, "VERTICAL", 8);
      var rect = figma.createRectangle();
      rect.name = "Color";
      rect.resize(96, 96);
      rect.cornerRadius = 12;
      if (it.styleId) await rect.setFillStyleIdAsync(it.styleId);
      else rect.fills = solid(it.color.hex);
      card.appendChild(rect);
      card.appendChild(makeText(
        it.color.name + "\n" + it.color.hex,
        12, "Regular", "#1A1A1A", "Label"
      ));
      wrap.appendChild(card);
    }
    return wrap;
  },

  circles: async function (colorItems) {
    var wrap = makeFrame("Palette · Circles", "HORIZONTAL", 20);
    for (var it of colorItems) {
      var col = makeFrame("Swatch · " + it.color.name, "VERTICAL", 8);
      col.counterAxisAlignItems = "CENTER";
      var dot = figma.createEllipse();
      dot.name = "Color";
      dot.resize(72, 72);
      if (it.styleId) await dot.setFillStyleIdAsync(it.styleId);
      else dot.fills = solid(it.color.hex);
      col.appendChild(dot);
      col.appendChild(makeText(it.color.name.split("/").pop(), 12, "Medium", "#1A1A1A", "Label"));
      wrap.appendChild(col);
    }
    return wrap;
  },

  bars: async function (colorItems) {
    var wrap = makeFrame("Palette · Bars", "VERTICAL", 0);
    wrap.cornerRadius = 20;
    wrap.clipsContent = true;
    for (var it of colorItems) {
      var row = figma.createFrame();
      row.name = "Swatch · " + it.color.name;
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "FIXED";
      row.counterAxisSizingMode = "FIXED";
      row.resize(400, 56);
      row.paddingLeft = row.paddingRight = 20;
      row.primaryAxisAlignItems = "SPACE_BETWEEN";
      row.counterAxisAlignItems = "CENTER";
      if (it.styleId) await row.setFillStyleIdAsync(it.styleId);
      else row.fills = solid(it.color.hex);
      var fg = readableOn(it.color.hex);
      row.appendChild(makeText(it.color.name, 14, "Medium", fg, "Name"));
      row.appendChild(makeText(it.color.hex, 14, "Regular", fg, "Hex"));
      wrap.appendChild(row);
    }
    return wrap;
  }
};

// ---------- Typography templates ----------
// Template "1" — specimen sederhana: preview teks + meta inline (purpose/level · fontFamily · size/lh · ls)
// Template "2" — detailed: badge purpose/level + preview + metrics row terpisah

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
//   name: string
//   description: string
//   templateColors: "cards" | "circles" | "bars"
//   templateTypography: "specimen" | "detailed"
//   colors: Color[]   // { id, name, purpose, hex, rgb }
//   typography: Typography[]  // { id, name, purpose, level, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
// }
async function importTokens(t) {
  var colorFn = COLOR_TEMPLATES[t.templateColors] || COLOR_TEMPLATES.cards;
  var typeFn = TYPE_TEMPLATES[t.templateTypography] || TYPE_TEMPLATES["one"];

  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Regular" });
  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Medium" });
  await figma.loadFontAsync({ family: "Google Sans Flex", style: "Bold" });
  await figma.loadFontAsync({ family: "Source Code Pro", style: "Regular" });
  await figma.loadFontAsync({ family: "Source Code Pro", style: "Medium" });

  // -- Colors: paint styles + optional variables --
  var colorItems = [];
  if (t.colors && t.colors.length) {
    var varCollection = null;
    var modeId = null;
    try {
      varCollection = figma.variables.createVariableCollection("Colors");
      modeId = varCollection.modes[0].modeId;
      varCollection.renameMode(modeId, "Default");
    } catch (e) {
      varCollection = null;
    }

    for (var c of t.colors) {
      var paintStyle = figma.createPaintStyle();
      // Group by purpose: "Primary/Blue" dsb
      paintStyle.name = cap(c.purpose) + "/" + c.name;

      if (varCollection && modeId) {
        try {
          var v = figma.variables.createVariable(cap(c.purpose) + "/" + c.name, varCollection, "COLOR");
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

      colorItems.push({ color: c, styleId: paintStyle.id });
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
    // Group by purpose/level: "Display/Large · Heading"
    ts.name = cap(s.purpose) + "/" + cap(s.level) + " · " + s.name;
    ts.fontName = font;
    ts.fontSize = s.fontSize;
    ts.lineHeight = { unit: "PIXELS", value: s.lineHeight };
    if (s.letterSpacing) {
      ts.letterSpacing = { unit: "PIXELS", value: s.letterSpacing };
    }
    typeItems.push({ typo: s, figmaStyle: figmaStyle, styleId: ts.id });
  }

  // -- Board --
  var board = makeFrame("Design System · " + (t.name || "Untitled"), "VERTICAL", 48, 48);
  board.cornerRadius = 24;
  board.fills = solid("#F0EDE6");

  if (t.name || t.description) {
    var header = makeFrame("Header", "VERTICAL", 4);
    if (t.name) header.appendChild(makeText(t.name, 24, "Bold", "#1A1A1A", "Project Name"));
    if (t.description) header.appendChild(makeText(t.description, 14, "Regular", "#7A7A7A", "Description"));
    board.appendChild(header);
  }

  if (colorItems.length) {
    board.appendChild(makeText("Colors", 20, "Bold", "#1A1A1A", "Title · Colors"));
    board.appendChild(await colorFn(colorItems));
  }
  if (typeItems.length) {
    board.appendChild(makeText("Typography", 20, "Bold", "#1A1A1A", "Title · Typography"));
    board.appendChild(await typeFn(typeItems));
  }

  figma.currentPage.appendChild(board);
  figma.viewport.scrollAndZoomIntoView([board]);
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
