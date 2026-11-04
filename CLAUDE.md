# augnustin.github.io — online resume

Augustin Riedinger's resume, served by GitHub Pages from `master`. GitHub Pages builds it with Jekyll on push, so
the result is plain static HTML + CSS (plus one small optional script for zoom), with no build step to run or
commit by hand.

## Where things live

Content, translations, markup and style are kept apart:

```
_data/profile.yml           facts that don't depend on the language: name, contacts, links, stack, and the
                            ordered lists of skills / jobs / missions / schools / spoken languages (by id)
_data/i18n/fr.yml           every French string, keyed by section and by the ids above
_data/i18n/en.yml           every English string, same keys as fr.yml
_layouts/resume.html        the markup (Liquid template), no text and no styling
_includes/icons/*.svg       inline SVG icons used by the layout
_includes/duration.html     "6 months" / "1 month" / "5 years" in the page's language
_includes/mission.html      one mission of the current job (used on both pages)
css/resume.css              all styling; design tokens on :root
js/zoom.js                  the toolbar's zoom − / + (the only script)
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
- **Add a job / mission / school / skill / spoken language**: add an entry with a new `id` to the list in
  `profile.yml`, then the matching key in both i18n files. Order in `profile.yml` is display order.
- **Missions** (main clients, listed under the `current` job, most recent end date first): `profile.yml` holds
  `org`, optional `url`, `duration` (`{ months: N }` or `{ years: N }`) and `tags` (the stack); each i18n file
  holds `missions.<id>.context` (after the org name), `points` (bullets) and optionally `org` / `tags` to
  replace the name or translate the stack. A mission has two columns: client and tasks on the left; on the right,
  the duration level with the client and the stack level with the tasks (stacked on mobile).
  Unit words are under `durations` in the i18n files.
- **Jobs** other than the current one: `profile.yml` holds `years` (`[start, end]` or `[year]`), `org`, `url` and
  optional `tags`; each i18n file holds `jobs.<id>.title`, optional `context` (after the org name), and a
  `description` and/or `points` (same bullets as the missions).
- **Add a language version**: add `_data/i18n/<code>.yml` (copy `en.yml`), a stub `<code>/index.html` with
  `lang: <code>`, and an entry in `languages` in `_config.yml`.
- Optional per-language overrides: `jobs.<id>.end` (e.g. "Now" / "Auj." for the current job) and
  `schools.<id>.name` (e.g. "Université du Queensland") take precedence over `profile.yml`.
- **Training**: every school sits on the jobs' columns (years | name and degree); `main: true` makes it large.
  `years` is `[start, end]` or `[year]`; the optional `schools.<id>.place` in the i18n files follows the name, in small.

## Rules

- **Static only.** Nothing but what GitHub Pages' built-in Jekyll can build: no plugins, no CDN except Google
  Fonts. Use `relative_url` for local assets.
- **JavaScript is optional enhancement only.** The resume must be complete without it. The one script,
  `js/zoom.js`, only drives the zoom control, which ships `hidden` and is revealed by the script.
- **Form vs style vs content.** No text in the layout, no `style="…"` in the markup, no content in CSS. Colors,
  fonts, type sizes (`--text-xs` to `--text-xl`), spacing (`--space-section`, `--space-title`) and honeycomb size
  (`--cell-w`) are tokens on `:root`. Use the type scale on desktop: only the name, the role and the featured cell
  sit outside it.
- **Two A4 pages, split the same on screen and on paper.** `<main class="document">` holds one `.sheet` per page,
  each a fixed `210mm × 297mm` box with `overflow: hidden`, so content that does not fit is silently clipped.
  Page 1 ends inside the missions list; `page_break` in `profile.yml` names the mission page 2 starts with (page 2
  continues the list as `.job--continued`, with no dates or title). In print each sheet is a page
  (`break-before: page`). The sheet's padding mirrors the `@page` margins (`--page-top` 10mm on every page but
  the first, where the navy masthead bleeds to the edge; `--page-bottom` 8mm on all), so a page holds exactly as
  much on screen as on paper; keep the two in sync (custom properties don't work inside `@page`). Printed paper
  is white. After any content or spacing change run `bin/print-pdf`, and move `page_break` if a page overflows.
- **Web UI stays off the document.** The toolbar (FR/EN switch, zoom − / +, PDF download) is a `<nav>` before
  `<main class="document">`, centered above the sheets on the desk background, and hidden in print. Nothing interactive that
  isn't part of the resume itself goes inside `.sheet`.
- **Responsive on mobile.** Under `screen and (max-width: 820px)` the sheets become one fluid page (they join seamlessly): toolbar as a slim
  bar on top, then portrait, identity, contacts. Scoped to `screen` because an A4 page (~794px) would otherwise trigger it
  when printing.
- **Zoom.** Pages can't trigger the browser's own zoom, so `js/zoom.js` sets `--zoom` on `<html>` and the sheet
  uses the CSS `zoom` property (re-lays out like browser zoom; the toolbar stays put). Levels mirror the browser's
  (50%–200%), clicking the percentage resets to 100%, and the choice is kept in `localStorage`. The control is
  hidden and zoom forced to 1 on mobile (pinch-zoom instead) and in print.
- **Print = one A4 page per `.sheet`.** The toolbar (`.no-print`) is hidden.

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
- Helpers: `.hex` (hexagon `clip-path`), `.eyebrow` (mono uppercase label), `.section-title`.
- The base reset zeroes margins on `h1`–`h5`, `p`, `ul`, `ol`: add any other element you introduce.
- Honeycomb: rows come from `skills` in `profile.yml` (currently 2-3-2); each row is centered, so rows of
  different lengths interlock. Geometry derives from `--cell-w` / `--cell-gap`, label size from `--cell-font`;
  tune those, not individual cells. On desktop the comb bleeds (negative `margin-block` on `.comb`) into the gap
  under the masthead and beside the next section's left-aligned title, so it can be larger than the text next
  to it without making the page taller. `featured: true` gives a big label that scales with the cell, `icon: <name>`
  adds `_includes/icons/<name>.svg` above it. The longest label ("Infra / Ops") must fit on one line.
- Formatting: Prettier (`.prettierrc.json`, width 120) for CSS and YAML:
  `npx prettier --write css _data _config.yml`. Liquid templates are excluded (`.prettierignore`).

## Checking

```sh
gem install --user-install jekyll:'~>3.10' webrick   # once; GitHub Pages runs Jekyll 3.10
~/.gem/ruby/3.0.0/bin/jekyll serve                    # http://localhost:4000 and /en/
```

- Desktop: two A4 sheets per language, nothing cut at the bottom of either.
- Mobile: devtools at 390px and 360px; no horizontal scroll.
- Print: each language must print one A4 page per sheet, split at the same place as on screen.

## PDFs

`bin/print-pdf` (or the `/print-pdf` skill in `.claude/skills/print-pdf/`) builds the site into a temp folder (so
it works while `jekyll serve` is running) and regenerates
`CV-Augustin-Riedinger-French.pdf` and `CV-Augustin-Riedinger-English.pdf` with headless Chrome, failing if a PDF
doesn't have one page per `.sheet` or if content overflows a sheet (it prints the space left on the fullest one). Run it after any content or style change so the downloads match the site.
