---
name: J Scott Chapman
description: Free Claude skills and solo product work, shown in a Vienna Secession showroom lattice.
colors:
  gallery-white: "#F4F4F1"
  lacquer-black: "#0F0F0F"
  graphite: "#4A4C50"
  palladium: "#8C9096"
  pewter: "#C4C7CB"
  glint: "#D9DCDF"
  smoked-rule: "#45484D"
typography:
  display:
    fontFamily: "'Marcellus SC', 'Times New Roman', serif"
    fontSize: "clamp(46px, 5.8vw, 84px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.07em"
  headline:
    fontFamily: "'Marcellus SC', 'Times New Roman', serif"
    fontSize: "clamp(40px, 5.2vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.07em"
  title:
    fontFamily: "'Marcellus SC', 'Times New Roman', serif"
    fontSize: "clamp(26px, 2.4vw, 34px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.03em"
  tab:
    fontFamily: "'Marcellus SC', 'Times New Roman', serif"
    fontSize: "clamp(17px, 1.5vw, 21px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.16em"
  body:
    fontFamily: "'Jost', 'Futura', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "'Jost', 'Futura', system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Jost', 'Futura', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.22em"
  mono:
    fontFamily: "'Red Hat Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0px"
spacing:
  rule: "1.5px"
  hairline: "1px"
  pad: "clamp(16px, 3.34vw, 48px)"
  section-gap: "112px"
  section-gap-tablet: "88px"
  section-gap-phone: "72px"
  container: "1344px"
  control-height: "50px"
components:
  button-primary:
    backgroundColor: "{colors.lacquer-black}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.lacquer-black}"
  button-secondary:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.lacquer-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "{spacing.control-height}"
  button-secondary-hover:
    backgroundColor: "{colors.lacquer-black}"
    textColor: "{colors.gallery-white}"
  nav-link:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.lacquer-black}"
    typography: "{typography.label}"
    padding: "0 24px"
    width: "124px"
  nav-link-active:
    backgroundColor: "{colors.lacquer-black}"
    textColor: "{colors.gallery-white}"
  input-field:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.lacquer-black}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "54px"
  section-tab:
    backgroundColor: "{colors.lacquer-black}"
    textColor: "{colors.gallery-white}"
    typography: "{typography.tab}"
    padding: "14px 24px 13px"
  lattice-cell:
    backgroundColor: "{colors.gallery-white}"
    textColor: "{colors.lacquer-black}"
    rounded: "{rounded.none}"
  lattice-cell-hover:
    backgroundColor: "{colors.lacquer-black}"
    textColor: "{colors.gallery-white}"
---

# Design System: J Scott Chapman

## Overview

**Creative North Star: "The Gridsmith Showroom"**

The site is a Wiener Werkstätte showroom built as a lattice. Every skill, case study, and note sits in a ruled square cell, and cells share their edges so the page reads as one continuous grid of lacquer-black lines on gallery white. The newest skill gets the largest cell. Nothing floats: a block either sits in a cell, hangs from a black tab, or rides inside a ruled frame.

The palette is achromatic on purpose. Black and white do all the work, palladium and pewter carry hairlines and quiet text, and the only warmth is in the type. Marcellus SC supplies letterspaced inscriptional capitals for names and headings; Jost carries everything a reader actually reads, in sentence case. Ornament comes from one family of square devices: pierced bands of square holes, square corner studs on frames, square bullets, and a four-square glyph. Every control is a square cell that fills solid black when hovered, pressed, or current.

Density is generous between sections and tight inside them. Motion is a single slow silver glint that crosses the pierced bands every eleven seconds; state changes are quick color fills; the only thing that moves on interaction is the FAQ plus mark turning to a minus. The retired cream-and-terracotta field-journal look does not return in any form.

**Key Characteristics:**
- One lattice: 4 square columns on desktop, 2 on tablet, 1 on phone, joined by 1.5px black rules.
- Achromatic palette; black fills mark state, emphasis, and the closing band.
- Letterspaced Marcellus SC capitals for display, Jost sentence case for reading.
- Square devices only: pierced bands, corner studs, square bullets, the four-square glyph.
- Zero radius and zero drop shadow anywhere.
- One ambient motion: the silver glint on pierced bands.

## Colors

A strictly achromatic showroom: gallery white ground, lacquer black structure, and three cool greys that each have exactly one job.

### Primary
- **Lacquer Black** (#0F0F0F): all rules, frames, and cell borders; the fill for active, hovered, and pressed controls; section tabs; the step header bar; code blocks; the closing contact band; the "hot" figure square that carries a case study's headline number. Body text color.

### Neutral
- **Gallery White** (#F4F4F1): the page ground and every cell interior. Also the text color on black fills. Pure white (#FFFFFF) appears only as the brightest point of the moving glint.
- **Graphite** (#4A4C50): secondary text on white: decks, ledes, labels, captions, timestamps, fine print. Also the disabled-button fill.
- **Palladium** (#8C9096): hairlines only. Inner frame lines, divider rules, the facts-row separators, timeline and list dividers, the square bullet before origin notes, and prose link underlines at rest. Never used for text.
- **Pewter** (#C4C7CB): secondary text on black fills (closing band copy, inverse cells, hovered cells, the hot figure caption), and the border of inline code.
- **Glint** (#D9DCDF): the silver shoulder of the moving highlight in pierced bands and hole fields.
- **Smoked Rule** (#45484D): hairline dividers inside black areas, such as the contact list in the closing band and the date rule of a hovered note row.

### Named Rules
**The Black Means State Rule.** A black fill on a control or cell means hovered, pressed, open, or current. The primary button is the one standing exception: it starts black and inverts to white on hover.

**The Hairline Hierarchy Rule.** Structure is drawn in lacquer black at 1.5px; subdivision inside a cell is drawn in palladium at 1px. Palladium never carries text.

## Typography

**Display Font:** Marcellus SC (with Times New Roman, serif)
**Body Font:** Jost (with Futura, system-ui, sans-serif)
**Label/Mono Font:** Red Hat Mono (with ui-monospace, SF Mono, Menlo), for skill source and file names

**Character:** Marcellus SC is a carved, inscriptional small-caps face; letterspaced, it reads as signage on a showroom wall. Jost is a geometric sans in the Futura line, the right period partner, and it keeps long reading calm.

### Hierarchy
- **Display** (400, clamp(46px, 5.8vw, 84px), 0.98, 0.07em, uppercase): the name on the home page only.
- **Headline** (400, clamp(40px, 5.2vw, 76px), 1.02, 0.07em, uppercase): the h1 in the page head of every inner page, centered.
- **Title** (400, clamp(26px, 2.4vw, 34px), 1.15, 0.03em): case-study titles, prose h2 (clamp(24px, 2.2vw, 30px), 0.06em), note titles (26px). Set in sentence case so Marcellus SC renders its small caps.
- **Tab** (400, clamp(17px, 1.5vw, 21px), 1.2, 0.16em, uppercase): the black section tab. Skill names in cells use the same family at clamp(19px, 1.65vw, 23px) with 0.08em.
- **Figure** (400, clamp(38px, 5.6vw, 84px), 1, 0.02em, lining tabular numerals): outcome numbers in case-study squares.
- **Body** (400, 17px, 1.6): all interface copy. 16.5px on phones.
- **Prose** (400, 19px, 1.7, max 65ch): note and skill-intro reading text. 17.5px on phones.
- **Label** (500, 11 to 12.5px, 0.2 to 0.22em, uppercase): navigation, button text, facts-row terms, stamps, footer, share label.
- **Mono** (400, 13.5px, 1.65): skill source panes; 500 at 13px for the file name in the source bar.

### Named Rules
**The Two Cases Rule.** Display capitals are letterspaced (0.03em to 0.24em) and carry a negative right margin equal to their tracking so centered lines stay centered. Jost is always sentence case except in the uppercase label role.

**The Reading Face Rule.** Anything longer than two lines is Jost. Marcellus SC is for names, headings, figures, pull quotes, and single short lines.

## Layout

The page is a centered container of 1344px plus side padding (clamp(16px, 3.34vw, 48px)). Inside it, content is built from lattices: CSS grids whose gap is the 1.5px rule, drawn by giving the grid a black background and its cells a white one, all inside a 1.5px black border. Squares hold their aspect ratio of 1 and never stretch; the grid re-counts instead.

- **Desktop (above 1099px):** 4 columns. The home intro and the featured skill each take a 2 by 2 block; the remaining skills are single squares in the row below. Case studies are 4-column rows where each headline figure owns one square. Reading pages use a 1-column aside and a 3-column body.
- **Tablet (721 to 1099px):** the lattice re-counts to 2 columns; page heads to 3 (heading spans 2). Section gap drops to 88px.
- **Phone (720px and below):** one column. Squares relax to auto height with minimum heights; figure squares become horizontal rows. Section gap drops to 72px.
- **Masthead:** below 960px the nav drops under the brand and its four links split the width equally.

Sections are separated by a 112px gap. Inside cells, padding runs 40 to 56px on desktop and 22 to 26px on phones. Every inner page opens with the same page-head row: a framed heading cell beside a square of pierced holes.

### Named Rules
**The Re-count Rule.** At a narrower width the lattice drops columns; it never stretches a square or shrinks the rule.

**The One Frame Rule.** A section has exactly one outer border. Rows inside it divide with a top rule; they do not box themselves.

## Elevation & Depth

The system is flat. There are no drop shadows. Depth comes from inversion (black cells and the black closing band against white), from inset double frames, and from square corner studs that sit on a frame's corners. The only box-shadow in the build draws 1px palladium hairlines between facts-row entries so wrapped rows never double a line; it is a drawing technique, not elevation.

### Named Rules
**The Flat Lacquer Rule.** Nothing lifts. A surface gains presence by turning black or gaining a frame, never by casting a shadow.

## Shapes

Every corner is square (0px radius), including inputs and buttons. Recurring geometry:

- **The pierced band:** a 12px strip of 8px square holes on a 12px pitch, tiled with `space` so a hole is never cut. It sits under the masthead, above the footer, and at the top edge of the closing band (in a lighter grey on black). Prose horizontal rules use the same band.
- **The hole field:** larger 14px square holes on a 28px pitch filling the square beside every page head and the free-skills cell.
- **The framed cell:** a 1px palladium line inset 14px, with four 9px black corner studs inset 10px. The home intro swaps the inner line for a ring of 5px pierced holes.
- **The panel frame:** a 1.5px black frame with 9px corner studs on three corners; the black tab occupies the fourth.
- **The pierced ring:** a 13px-offset ring of small square holes around the primary button.
- **Square marks:** 7px squares as bullets, tab ends, and origin markers; a 9px square at the center of the divider.
- **The four-square glyph:** four 6px squares in a 16px box. It is the only glyph the site draws and appears only in the leading cell of primary buttons. The masthead mark and favicon are larger arrangements of the same square vocabulary.

## Components

### Buttons
Square cells that fill.
- **Shape:** square corners (0px), 1.5px black border, 50px minimum height.
- **Primary:** lacquer black fill with gallery white label text, a leading 47px glyph cell split off by a rule, and the pierced ring around it. Hover inverts to white.
- **Secondary:** gallery white with black label text and no glyph cell. Hover fills black.
- **Disabled / working:** graphite fill and border with white text, progress cursor.
- **Focus:** 2px black outline offset 3px; inside filled controls the outline inverts and moves inset.
- **Copy button:** a black cell in the source bar, split by a white rule; hover inverts.

### Answer choices
The tutor's lettered answers are buttons with a 44px letter cell in Marcellus SC, split by a rule. Hovering fills only the letter cell; pressing (aria-pressed) fills the whole choice.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** gallery white; inverse cells are lacquer black with pewter secondary text.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** shared 1.5px lattice rules; framed cells add the inset palladium line and corner studs.
- **Internal Padding:** 28 to 56px desktop, 22 to 26px phone.
- **Linked cells:** a skill square, note row, featured skill, or FAQ summary is itself the control and fills black on hover, with secondary text shifting to pewter.

### Inputs / Fields
- **Style:** a 54px field with a 1.5px black border, no radius, white ground, Jost 17px; the submit button is attached inside the same border, divided by a rule. Stacks vertically on phones.
- **Focus:** the whole field takes the 2px black outline offset 3px; the input itself shows no separate outline.
- **Error:** a status line led by a 9px black square.

### Navigation
A ruled masthead: the brand mark and letterspaced name on the left, four equal label-type links on the right, each separated by a vertical strip of small square holes. Hover and the current page fill the link black. On narrow screens the links form an equal-width row under the brand. The footer repeats the links in graphite label type, underlined on hover.

### Section Panel
The signature container. A black tab with white Marcellus SC capitals and a 7px white square at each end sits on the top-left edge of a ruled frame. An optional lede row opens the frame, and a closing actions row ends it.

### Page Head
The first row of every inner page: a framed 3-column cell holding the centered headline, a palladium divider with a black center square, the deck, and actions, beside a square of the hole field. An optional short line sits on a small bordered card centered in that square.

### Case Figure
A square that holds one outcome number in figure type above an uppercase graphite caption. The lead figure is the hot square (black with pewter caption). Below the figures, a facts row of label-type terms and Jost values is divided by palladium hairlines.

### Closing Band
A full-bleed lacquer black band with a pierced band at its top edge, a large capitals heading, pewter body text, and a white-ruled contact list whose rows invert to white on hover.

## Do's and Don'ts

### Do:
- **Do** put every new block in a lattice cell, a section panel, or a framed cell; join cells with the 1.5px black rule.
- **Do** keep squares square and let the grid drop columns (4, 2, 1) as width falls.
- **Do** make the whole cell the control when a cell links somewhere, and fill it black on hover.
- **Do** use the four-square glyph only in the leading cell of primary buttons.
- **Do** draw subdivisions inside a cell in palladium at 1px, and reserve graphite and pewter for secondary text on white and black respectively.
- **Do** set display type in Marcellus SC with letterspacing, and all reading text in Jost sentence case.
- **Do** honor reduced motion: the glint stops and transitions are removed.

### Don't:
- **Don't** round any corner or add a drop shadow.
- **Don't** introduce a hue. The palette is black, white, and the three greys.
- **Don't** add motion beyond the pierced-band glint, quick color fills on state change, and the FAQ marker's turn.
- **Don't** use circles, dots, or ornaments outside the square vocabulary for bullets, markers, or dividers.
- **Don't** box rows inside a section panel; the panel frame is the only outer border.
- **Don't** bring back the field-journal look: no cream paper, terracotta accent, section numbers, or newspaper styling.
- **Don't** use an em dash anywhere, and write the name as "J Scott Chapman".
