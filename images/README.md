# Cake photos 📸

Put photos of Mum's cakes and cookies in this folder.

**Before you upload:**
- Ask Mum which photos she's happy to share. This website is public.
- Use photos of the cakes only: no faces, names or addresses in the picture.
- Landscape (wide) photos fit the cards best.
- Keep each photo under 1 MB so the site loads fast. A phone's "medium" size is fine.
- Give it a simple name with no spaces, like `birthday-cake.jpg`.

**To show a photo on the site**, open `index.html` (in the main folder) and find the cake card you want. Swap its drawing line, the one that starts with `<svg class="ill"`, for:

```html
<img src="images/birthday-cake.jpg" alt="Pink birthday cake with sprinkles and three candles">
```

The `alt` words describe the photo for people who can't see it, so say what's in the picture.
