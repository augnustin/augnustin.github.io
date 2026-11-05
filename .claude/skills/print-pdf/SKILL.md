---
name: print-pdf
description: Regenerate the downloadable resume PDFs (CV-Augustin-Riedinger-French.pdf and CV-Augustin-Riedinger-English.pdf) from the current site. Use when the user asks to print, export, update or regenerate the PDFs, or after content/style changes they want reflected in the downloads.
---

# Print the resume PDFs

Run from the repository root:

```sh
bin/print-pdf
```

It builds the site with Jekyll into a temp folder (so it works while `jekyll serve` runs), serves it locally, prints `/` → `CV-Augustin-Riedinger-French.pdf` and
`/en/` → `CV-Augustin-Riedinger-English.pdf` with headless Chrome. Before printing it checks the content fits
each A4 sheet (a sheet clips overflow, so the page count alone can't tell), and after, that each PDF has one page per sheet.

## If it fails

- `✗ … overflows the A4 sheet by Npx` (or `has N pages`): content doesn't fit. Report which language, and suggest trimming text in
  `_data/i18n/<lang>.yml`, tightening spacing tokens in `css/resume.css`, or moving `page_break` in
  `_data/profile.yml` (the mission page 2 starts with); don't change content without asking.
- `jekyll` not found: `gem install --user-install 'jekyll:~>3.10' webrick`, or pass `JEKYLL=/path/to/jekyll`.
- Chrome not found: pass `CHROME=/path/to/chrome`. Port busy: pass `PORT=<free port>`.

## After it succeeds

Render a quick preview to confirm it looks right (fonts loaded, nothing clipped at the bottom):

```sh
pdftoppm -r 70 -png -singlefile CV-Augustin-Riedinger-French.pdf <scratchpad>/pdf-fr
```

It also regenerates the social sharing images `img/og-fr.jpg` and `img/og-en.jpg`. Then tell the user both PDFs were updated. Don't commit unless asked.
