# Oleksandr Plotnikov — Front-end Developer Portfolio

Personal portfolio website of Oleksandr Plotnikov, a self-taught front-end developer. It is a single-page site built with plain HTML, CSS and JavaScript, with no frameworks and no build step. The site is bilingual (English / Русский) and supports light and dark themes.

**Live demo:** https://<username>.github.io/<repo>/

## Features

- **Single-page layout** with smooth navigation between sections: About, Stack, Projects, Results, Process, FAQ and Contact.
- **Two languages**: switch between EN and RU in the header. Translations are stored in a dictionary in `script.js`, and the choice is saved in `localStorage`.
- **Light and dark themes**: the default follows the visitor's system setting on the first visit, and the choice is saved in the browser.
- **WebGL animated background**: a fragment shader draws a slowly moving liquid chrome surface. If WebGL is unavailable, a CSS gradient is used instead.
- **Accessibility**: a "Skip to content" link, visible focus styles, ARIA attributes, and support for `prefers-reduced-motion`, which disables the animations.
- **SEO and markup**: meta tags, Open Graph, Twitter Card, JSON-LD (`schema.org/Person`) and robots directives.
- **Hash-based routing** for inner pages: `#/privacy`, `#/cookies` and `#/case`.
- **Privacy Policy and Cookie Policy** in both languages. The site uses no cookies, analytics or advertising.

## Project Structure

```
.
├── index.html   # markup for all sections and pages
├── style.css    # styles, themes and responsive layout
└── script.js    # configuration, WebGL background, translations, routing, contacts, projects
```

The HTML also references two files that may need to be added to the repository:

- `favicon.svg`: the site icon.
- `og.png` (1200×630): the preview image used when the site is shared on social media.

## Configuration

Personal details are set in the `CONFIG` object at the top of `script.js`:

```js
var CONFIG = {
  formUrl: "",          // Google Form link ending in /viewform
  email: "you@example.com",
  github: "username",   // username only, without @ or the URL
  telegram: "username", // username only, without @
  cv: "",               // URL of the PDF CV; enables the "Download CV" button
  repo: "",             // URL of this repository; adds a link in the footer
  youtubeId: ""         // YouTube video ID; adds a play button
};
```

An empty value hides the element that uses it, so any field can be left blank.

### Projects

The `PROJECTS` array in `script.js` generates the cards in the Projects section:

```js
var PROJECTS = [{
  name: "Task List",
  description: "Short project description.",
  repo: "https://github.com/.../task-list",
  demo: "https://.../task-list/",
  tags: ["JavaScript", "localStorage", "GitHub Pages"],
  caseStudy: true   // adds a link to the #/case page
}];
```

The Projects section stays hidden while the array is empty.

### Testimonials

The `TESTIMONIALS` array adds review cards to the Results section:

```js
var TESTIMONIALS = [{
  quote: "Testimonial text",
  name: "Name",
  role: "Title, company",
  metric: "Result"
}];
```

### Application Form

If `formUrl` contains a Google Form link, the form is embedded in the Contact section through an iframe. Any other link is shown as a button that opens the form in a new tab.

### Translations

Russian versions of the English text are stored in the `RU` object in `script.js`. Each key is the original English string and each value is its translation. When you add new translatable text, add a matching entry to `RU`. Blocks marked `data-l="ru"` in the HTML switch together with the language.

## Running Locally

The site needs no build step or dependencies. Open `index.html` in a browser, or serve the folder with any static server:

```bash
# for example, with Python
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages

1. Push the files to a repository.
2. Go to **Settings → Pages**.
3. Under **Source**, select a branch (for example `main`) and the `/ (root)` folder.
4. Save. The site will be available at `https://<username>.github.io/<repo>/`.

Replace the placeholder URLs in the `og:image` and `twitter:image` meta tags in `index.html` with your real site address (full `https://...` URL).

## Browser Support

Modern browsers with support for ES5, `IntersectionObserver` and WebGL. Without WebGL the site still works fully; only the background animation is replaced by a gradient.

## License

The code is released under the MIT License. Text, photos and personal information are not covered by the license and should not be copied or reused as they are.

## Contact

- Email: plotnikovsana60@gmail.com
- GitHub: [@coilwer](https://github.com/coilwer)
- Telegram: [@coilwer](https://t.me/coilwer)
