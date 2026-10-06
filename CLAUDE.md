# augnustin.github.io — online resume

Augustin Riedinger's resume, served by GitHub Pages from `master`. GitHub Pages builds it with Jekyll on push, so
the result is plain static HTML + CSS: no JavaScript, no build step to run or commit by hand.

## Where things live

Content, translations, markup and style are kept apart:

```
_data/profile.yml           facts that don't depend on the language: name, contacts, links, stack,
                            clients, and the ordered lists of skills / jobs / schools / spoken languages (by id)
_data/i18n/fr.yml           every French string, keyed by section and by the ids above
_data/i18n/en.yml           every English string, same keys as fr.yml
_layouts/resume.html        the markup (Liquid template), no text and no styling
_includes/icons/*.svg       inline SVG icons used by the layout
css/resume.css              all styling; design tokens on :root
index.html, en/index.html   front-matter stubs: `layout: resume` + `lang: fr|en` → / and /en/
bin/print-pdf               regenerates the two PDFs (see PDFs)
_config.yml                 site url, language switcher entries (code, label, path), excluded files
img/                        portrait and favicon (see Portrait)
CV-Augustin-Riedinger-*.pdf PDFs linked from the toolbar
```

## Common edits

- **Change wording**: edit the string in `_data/i18n/fr.yml` and its twin in `en.yml`.
- **Force a line break in a section title**: write it as a YAML literal block (`title: |-`) with the break on
  its own line; `.section-title` uses `white-space: pre-line`. (`>-` would fold the newline into a space.)
- **Change a fact** (email, link, client, year, employer): `_data/profile.yml` only.
- **Add a job / school / skill / spoken language**: add an entry with a new `id` to the list in `profile.yml`,
  then the matching key in both i18n files. Order in `profile.yml` is display order.
- **Add a language version**: add `_data/i18n/<code>.yml` (copy `en.yml`), a stub `<code>/index.html` with
  `lang: <code>`, and an entry in `languages` in `_config.yml`.
- Optional per-language overrides: `jobs.<id>.year` (e.g. "Now" / "Auj." for the current job) and
  `schools.<id>.name` (e.g. "Université du Queensland") take precedence over `profile.yml`.

## Rules

- **Static only.** Nothing but what GitHub Pages' built-in Jekyll can build: no plugins, no JS, no CDN except Google
  Fonts. Use `relative_url` for local assets.
- **Form vs style vs content.** No text in the layout, no `style="…"` in the markup, no content in CSS. Colors,
  fonts, spacing (`--space-section`, `--space-title`) and honeycomb size (`--cell-w`) are tokens on `:root`.
- **One A4 sheet on desktop.** `.sheet` is fixed at `210mm × 297mm` with `overflow: hidden`, so content that does
  not fit is silently clipped. French is the longer version; after any content or spacing change, check it still
  fits with a bottom margin (see Checking). There is little slack (~35px in French).
- **Web UI stays off the document.** The toolbar (FR/EN switch + PDF download) is a `<nav>` before `<main
class="sheet">`, centered above the sheet on the desk background, and hidden in print. Nothing interactive that
  isn't part of the resume itself goes inside `.sheet`.
- **Responsive on mobile.** Under `screen and (max-width: 820px)` the sheet becomes a fluid page: toolbar as a slim
  bar on top, then portrait, identity, contacts. Scoped to `screen` because an A4 page (~794px) would otherwise trigger it
  when printing.
- **Print = one A4 page.** `@page { size: A4; margin: 0 }`; the toolbar (`.no-print`) is hidden.

## Portrait

`img/portrait.png` (1710×1710, square so the hexagon can show a wide view) is the source; it stays in the repo
but is excluded from the built site. The page uses `img/portrait.jpg`, generated from it:

```sh
convert img/portrait.png -auto-orient -resize 640x640 -strip -quality 82 -sampling-factor 4:2:0 img/portrait.jpg
```

The hexagon frame is taller than wide, so `object-fit: cover` keeps the full height and trims the sides.

## Masthead layout

Two grid columns: identity + contacts | portrait + location. The portrait sits level with
the name; the location pill has the same height as a contact pill and sits at the bottom, level with the links
row. Contacts: email + phone on the first row, web links on the second.

## CSS conventions

- BEM-ish names: block (`.job`), element (`.job__title`), modifier (`.job--current`, `.cell--strong`).
- Helpers: `.hex` (hexagon `clip-path`), `.eyebrow` (mono uppercase label), `.section-title`, `.chip`.
- Honeycomb geometry derives from `--cell-w` / `--cell-gap`; tune those, not individual cells. Long labels
  ("Management", "Hébergement") must stay inside their cell.
- Formatting: Prettier (`.prettierrc.json`, width 120) for CSS and YAML:
  `npx prettier --write css _data _config.yml`. Liquid templates are excluded (`.prettierignore`).

## Checking

```sh
gem install --user-install jekyll:'~>3.10' webrick   # once; GitHub Pages runs Jekyll 3.10
~/.gem/ruby/3.0.0/bin/jekyll serve                    # http://localhost:4000 and /en/
```

- Desktop: one A4 sheet per language, nothing cut at the bottom.
- Mobile: devtools at 390px and 360px; no horizontal scroll.
- Print: each language must print to exactly 1 A4 page.

## PDFs

`bin/print-pdf` (or the `/print-pdf` skill in `.claude/skills/print-pdf/`) rebuilds the site and regenerates
`CV-Augustin-Riedinger-French.pdf` and `CV-Augustin-Riedinger-English.pdf` with headless Chrome, failing if either
is more than one page. Run it after any content or style change so the downloads match the site.
