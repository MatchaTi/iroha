export function DisplayDesignMD() {
  return (
    <section>
      <section className="overflow-hidden rounded-2xl border">
        <div className="border-b bg-sidebar px-4 py-2">
          <p className="font-mono text-xs text-muted-foreground">DESIGN.md</p>
        </div>
        <pre className="max-h-[85vh] overflow-auto p-4">
          <code className="font-mono text-xs leading-relaxed">{markdown}</code>
        </pre>
      </section>
    </section>
  )
}

const markdown = `---
name: Aimyon
colors:
  primary: "#386641"
  secondary: "#69974e"
  accent: "#a6c856"
  background: "#f5f7f2"
  foreground: "#1a2e14"
  muted: "#e6e9dc"
  error: "#bd4749"
  success: "#3a7e44"
  warning: "#cb8b2a"
typography:
  display-large:
    fontFamily: Google Sans Flex Variable
    fontSize: 57px
    fontWeight: Regular
  display-medium:
    fontFamily: Google Sans Flex Variable
    fontSize: 45px
    fontWeight: Regular
  display-small:
    fontFamily: Google Sans Flex Variable
    fontSize: 36px
    fontWeight: Regular
  headline-large:
    fontFamily: Google Sans Flex Variable
    fontSize: 32px
    fontWeight: Regular
  headline-medium:
    fontFamily: Google Sans Flex Variable
    fontSize: 28px
    fontWeight: Regular
  headline-small:
    fontFamily: Google Sans Flex Variable
    fontSize: 24px
    fontWeight: Regular
  title-large:
    fontFamily: Google Sans Flex Variable
    fontSize: 22px
    fontWeight: Regular
  title-medium:
    fontFamily: Google Sans Flex Variable
    fontSize: 16px
    fontWeight: Medium
  title-small:
    fontFamily: Google Sans Flex Variable
    fontSize: 14px
    fontWeight: Medium
  label-large:
    fontFamily: Google Sans Flex Variable
    fontSize: 14px
    fontWeight: Medium
  label-medium:
    fontFamily: Google Sans Flex Variable
    fontSize: 12px
    fontWeight: Medium
  label-small:
    fontFamily: Google Sans Flex Variable
    fontSize: 11px
    fontWeight: Medium
  body-large:
    fontFamily: Google Sans Flex Variable
    fontSize: 16px
    fontWeight: Regular
  body-medium:
    fontFamily: Google Sans Flex Variable
    fontSize: 14px
    fontWeight: Regular
  body-small:
    fontFamily: Google Sans Flex Variable
    fontSize: 12px
    fontWeight: Regular
rounded:
  none: 0px
  extra-small: 2px
  small: 4px
  medium: 8px
  large: 12px
  extra-large: 16px
  full: 99px
shadow:
  shadow-small: 0px 1px 3px 0px #0000001f
  shadow-medium: 0px 4px 12px 0px #00000029
  shadow-large: 0px 8px 24px 0px #00000033
---

# Design System

## Overview
Hello

## Colors
- **Primary** (#386641): primary
- **Secondary** (#69974e): secondary
- **Accent** (#a6c856): accent
- **Background** (#f5f7f2): background
- **Foreground** (#1a2e14): foreground
- **Muted** (#e6e9dc): muted
- **Error** (#bd4749): error
- **Success** (#3a7e44): success
- **Warning** (#cb8b2a): warning

## Typography
- **Display Large** (display/large): Google Sans Flex Variable, 57px, Regular, 64px line-height, -0.25px letter-spacing
- **Display Medium** (display/medium): Google Sans Flex Variable, 45px, Regular, 52px line-height, 0px letter-spacing
- **Display Small** (display/small): Google Sans Flex Variable, 36px, Regular, 44px line-height, 0px letter-spacing
- **Headline Large** (headline/large): Google Sans Flex Variable, 32px, Regular, 40px line-height, 0px letter-spacing
- **Headline Medium** (headline/medium): Google Sans Flex Variable, 28px, Regular, 36px line-height, 0px letter-spacing
- **Headline Small** (headline/small): Google Sans Flex Variable, 24px, Regular, 32px line-height, 0px letter-spacing
- **Title Large** (title/large): Google Sans Flex Variable, 22px, Regular, 28px line-height, 0px letter-spacing
- **Title Medium** (title/medium): Google Sans Flex Variable, 16px, Medium, 24px line-height, 0.15px letter-spacing
- **Title Small** (title/small): Google Sans Flex Variable, 14px, Medium, 20px line-height, 0.1px letter-spacing
- **Label Large** (label/large): Google Sans Flex Variable, 14px, Medium, 20px line-height, 0.1px letter-spacing
- **Label Medium** (label/medium): Google Sans Flex Variable, 12px, Medium, 16px line-height, 0.5px letter-spacing
- **Label Small** (label/small): Google Sans Flex Variable, 11px, Medium, 16px line-height, 0.5px letter-spacing
- **Body Large** (body/large): Google Sans Flex Variable, 16px, Regular, 24px line-height, 0.5px letter-spacing
- **Body Medium** (body/medium): Google Sans Flex Variable, 14px, Regular, 20px line-height, 0.25px letter-spacing
- **Body Small** (body/small): Google Sans Flex Variable, 12px, Regular, 16px line-height, 0.4px letter-spacing

## Corner Radius
- **None**: 0px
- **Extra Small**: 2px
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **Extra Large**: 16px
- **Full**: 99px

## Shadow
- **Shadow Small**: 0px 1px 3px 0px #0000001f
- **Shadow Medium**: 0px 4px 12px 0px #00000029
- **Shadow Large**: 0px 8px 24px 0px #00000033

## Components

### Button
- **Shared**: radius 9999px, typography Label Large, shadow none
- **default**: bg #386641, fg #bac9bd, border transparent
- **outline**: bg transparent, fg #386641, border #609a6c
- **secondary**: bg #a4bca9, fg #09110a, border transparent
- **ghost**: bg transparent, fg #386641, border transparent
- **destructive**: bg #eadcdc, fg #bd4749, border transparent
- **link**: bg transparent, fg #386641, border transparent
- **error**: bg #bd4749, fg #f7f3f3, border transparent
- **warning**: bg #cb8b2a, fg #f2eee9, border transparent
- **success**: bg #3a7e44, fg #c7d6c9, border transparent
- **xs**: 10×4px
- **sm**: 12×6px
- **default**: 10×8px
- **lg**: 16×10px

### Input
- **Shared**: radius 8px, typography Body Medium, shadow none, 12×8px padding
- **default**: bg #f8f8f7, fg #0a1208, border #f8f9f6, placeholder #e6e9dc, label #0a1208, helper #e6e9dc
- **focus**: bg #f8f8f7, fg #0a1208, border #386641, placeholder #e6e9dc, label #0a1208, helper #e6e9dc
- **error**: bg #f8f8f7, fg #0a1208, border #bd4749, placeholder #e6e9dc, label #0a1208, helper #bd4749
- **disabled**: bg #f8f8f6, fg #f8f9f6, border #f8f8f6, placeholder #f8f9f6, label #f8f9f6, helper #f8f9f6

### Badge
- **Shared**: radius 9999px, typography Label Medium, shadow none, 8×2px padding
- **default**: bg #386641, fg #bac9bd, border transparent
- **secondary**: bg #a4bca9, fg #09110a, border transparent
- **destructive**: bg #eadcdc, fg #bd4749, border transparent
- **error**: bg #bd4749, fg #f7f3f3, border transparent
- **warning**: bg #cb8b2a, fg #f2eee9, border transparent
- **success**: bg #3a7e44, fg #c7d6c9, border transparent
- **outline**: bg transparent, fg #0a1208, border #f8f9f6

### Checkbox
- **Shared**: radius 4px, shadow none, 16px size
- **default**: bg #f8f8f6, fg transparent, border transparent
- **checked**: bg #386641, fg #bac9bd, border #386641
- **indeterminate**: bg #386641, fg #bac9bd, border #386641
- **disabled**: bg #f8f8f6, fg #f8f9f6, border #f8f8f6

### Switch
- **Shared**: radius 9999px, shadow none, 24px height
- **default**: track #f8f9f6, thumb #8ba583, border #b6c9ac
- **checked**: track #386641, thumb #bac9bd, border transparent
- **disabled**: track #f8f8f6, thumb #f8f9f6, border transparent

### Radio
- **Shared**: radius 9999px, shadow none, 16px size
- **default**: bg #f8f8f6, dot transparent, border transparent
- **checked**: bg #386641, dot #bac9bd, border #386641
- **disabled**: bg #f8f8f6, dot #f8f9f6, border #f8f8f6

### Slider
- **Track**: bg #f8f8f6, radius 16px, 4px height
- **Range Fill**: bg #386641
- **Thumb**: bg #f8f8f7, shadow none, 0px size

## Do's and Don'ts
- Do use the primary color sparingly, only for the most important action
- Don't mix rounded and sharp corners in the same view
- Do maintain 4:1 contrast ratio for all text
- Don't use more than 2 font families in a single component
`
