# TECHFEST 2026 — Enter the Next Dimension

An immersive responsive event landing page with a real Three.js scene.

## Upgrades included
- Three.js WebGL scene with procedural metallic planet, atmosphere, wireframe shell and animated orbital rings
- Bloom post-processing for luminous sci-fi lighting
- Procedurally modeled mini spacecraft and floating robot drone (no downloaded 3D assets)
- 1,800-point colored star field and animated particle ribbons
- Mouse parallax and scroll-driven camera movement
- Tilt-interactive event cards
- Responsive navigation, live countdown and scroll progress indicator
- Custom TECHFEST visual identity and neon HUD overlays

## Run locally
Because this project uses JavaScript modules and CDN imports, run it from a local web server (not by double-clicking the HTML file).

### Python
```bash
python -m http.server 8000
```
Then open http://localhost:8000

### VS Code
Install the Live Server extension, right-click `index.html`, and choose **Open with Live Server**.

Requires an internet connection to load Three.js and Google Fonts from their CDNs.

## Before publishing
1. Replace `techfest@example.com` with the real registration URL or email.
2. Set the actual event date in `main.js` (`targetDate`).
3. Update the venue, event titles, event descriptions, dates and organizer information.
4. Test on mobile and desktop.

## Deploy with GitHub Pages
Push the folder contents to a GitHub repository. In Settings → Pages, select **Deploy from a branch**, choose `main` and `/ (root)`. Since the site uses CDN imports, no bundler is required.

## Demo recording suggestion (45–60 sec)
- Open on the hero and move the mouse to show 3D parallax.
- Scroll slowly to show camera travel and the 3D scene changing position.
- Hover the three event cards to show tilt.
- Show countdown, timeline and registration CTA.
- Resize browser to mobile width and show responsive navigation.
