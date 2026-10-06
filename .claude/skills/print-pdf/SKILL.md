---
name: print-pdf
description: Regenerate the downloadable resume PDFs (CV-Augustin-Riedinger-French.pdf and CV-Augustin-Riedinger-English.pdf) from the current site. Use when the user asks to print, export, update or regenerate the PDFs, or after content/style changes they want reflected in the downloads.
---

# Print the resume PDFs

Run from the repository root:

```sh
bin/print-pdf
```

It builds the site with Jekyll, serves `_site` locally, prints `/` → `CV-Augustin-Riedinger-French.pdf` and
`/en/` → `CV-Augustin-Riedinger-English.pdf` with headless Chrome, and checks each PDF is exactly one A4 page.

## If it fails

- `✗ … has N pages`: content overflows the A4 sheet. Report which language, and suggest trimming text in
  `_data/i18n/<lang>.yml` or tightening spacing tokens in `css/resume.css`; don't change content without asking.
- `jekyll` not found: `gem install --user-install 'jekyll:~>3.10' webrick`, or pass `JEKYLL=/path/to/jekyll`.
- Chrome not found: pass `CHROME=/path/to/chrome`. Port busy: pass `PORT=<free port>`.

## After it succeeds

Render a quick preview to confirm it looks right (fonts loaded, nothing clipped at the bottom):

```sh
pdftoppm -r 70 -png -singlefile CV-Augustin-Riedinger-French.pdf <scratchpad>/pdf-fr
```

Then tell the user both files were updated. Don't commit unless asked.
