SJ Developments - Static Website

What this is

A single-page static website for SJ Developments with a full-viewport hero background image, navigation, Services, Projects and Contact sections.

Files


Customize the hero background

Open `styles.css` and update the `--hero-image` variable near the top. Example:
Open `styles.css` and update the `--hero-image` variable near the top. By default the site now expects a local image at `images/hero.jpg`. Steps:

1. Create an `images/` folder next to `index.html` (if it doesn't exist).
2. Put your hero image in that folder and name it `hero.jpg` (recommended). Example path: `images/hero.jpg`.

Example `:root` (already set to local by default):

:root{
  --hero-image: url('images/hero.jpg');
}

If you prefer to use a hosted image, you can set it instead to a URL, e.g. `url('https://example.com/my-hero.jpg')`.

Notes:
- Recommended size: 1920px+ wide and high-quality JPEG/WEBP for best appearance.
- The stylesheet includes a curated Unsplash image as a fallback when the local image is not present, so you will still see a hero image if you don't add one yet.

Windows quick preview (PowerShell):

```powershell
# from the project folder
ii .\index.html
```

Adding a logo

Place your logo at `images/logo.svg` (or `images/logo.png`) and the header will automatically show it.

Recommended sizes:
- SVG: scalable and preferred — place `images/logo.svg`.
- PNG/JPG: roughly 120x120 or similar square aspect for best fit; adjust `.logo-img` width in `styles.css` if needed.

If you add a different filename, update the `<img src="...">` in the header (`index.html`).

This will open `index.html` in your default browser.
}

Replace with a local image (put it into an `images/` folder) or use a hosted image URL. For best results use a large image (1920px+ wide).

Running locally

No build step required. Open `index.html` in a browser. On Windows you can right-click the file and choose "Open with" your browser.

Notes & Next steps

- Replace placeholder project tiles in the Projects section with real images and captions.
- Hook the contact form to your backend or to a service like Formspree or Netlify Forms.
- Update email/phone in the Contact section.

If you'd like, I can add a gallery page, integrate real images, or wire the contact form to a backend.
