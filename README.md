# Your Portfolio Website

A single-page cinematographer/videographer portfolio: fullscreen hero video → about
section → video grid → footer. No build tools, no frameworks. Just edit the files
and upload.

## Files
- `index.html` — the page content (edit your text, videos, contact here)
- `style.css` — colours, fonts, layout
- `script.js` — the click-to-play video lightbox
- `images/` — your thumbnails and hero poster
- `videos/` — (only if you use a self-hosted hero clip)

---

## 1. Edit your text
Open `index.html` and replace:
- `YOUR NAME` everywhere with your name
- the about `lead` line and paragraphs with your intro
- footer email, phone, Instagram/Vimeo/YouTube links

## 2. Add your video thumbnails
Put a JPG for each project in `images/` (e.g. `thumb-01.jpg`). Best size ~1280×720.
Use a strong still frame from each video.

## 3. Point each tile to its video
This is the key part. Each grid tile has a `data-video="..."` attribute that must be
an EMBED url, not the normal page url.

**Vimeo** (recommended for filmmakers):
- Normal link: `https://vimeo.com/76979871`
- Use this instead: `https://player.vimeo.com/video/76979871?autoplay=1`
(just the number changes)

**YouTube:**
- Normal link: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Use this instead: `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`
(the part after `v=` is the ID)

To add more videos, copy a whole `<button class="tile">...</button>` block and change
the `data-video`, the `<img src>`, and the label.

## 4. The hero video — two ways (pick one)
**A) Self-hosted background clip (default):** drop a short muted `.mp4` (15–40s, under
~15 MB) at `videos/hero.mp4` and a still at `images/hero-poster.jpg`. Good for a
looping showreel teaser.

**B) Embed a full reel from Vimeo/YouTube:** in `index.html`, delete the default hero
`<section>` and uncomment the `hero--embed` block below it. Replace `VIDEO_ID`.

> Tip: for your main project reels, always host on Vimeo/YouTube and embed. Only use a
> direct-uploaded file for the short muted hero loop.

---

## 5. Put it online for free with GitHub Pages
1. Create a free account at github.com.
2. Create a new **public** repository. Name it `yourusername.github.io` to get a clean
   URL, or any name (you'll get `yourusername.github.io/reponame`).
3. Upload all these files (drag-and-drop works: "Add file" → "Upload files").
4. Go to the repo's **Settings → Pages**.
5. Under "Build and deployment", set Source = **Deploy from a branch**, Branch =
   **main**, folder = **/ (root)**. Save.
6. Wait ~1 minute, refresh — your live URL appears at the top of that Pages screen.

To update later: edit files locally and re-upload, or edit directly on GitHub.

### Optional: your own domain
Buy a domain (~AUD $15/year) and add it under Settings → Pages → Custom domain.
GitHub Pages hosting stays free.

---

## Quick checklist before going live
- [ ] Replaced all `YOUR NAME`
- [ ] About text written
- [ ] Each tile has a real thumbnail + working embed url
- [ ] Footer email / phone / socials correct
- [ ] Hero video added (file or embed)
- [ ] Tested on your phone (open the GitHub Pages URL on mobile)
