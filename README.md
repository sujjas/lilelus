# Lilelus Mini Bakery: how HTML, CSS & JavaScript work

A tiny bakery website for learning the three languages every website is made of.

**Live site:** https://lilelus-html-css-js-demo.vercel.app

## The three layers

Think of a website like a cake:

| Layer | File | It's like… | It decides… |
|---|---|---|---|
| **HTML** | [`index.html`](index.html) | the cake | **what's there**: headings, words, pictures, buttons |
| **CSS** | [`style.css`](style.css) | the icing | **how it looks**: colours, fonts, sizes, layout |
| **JavaScript** | [`script.js`](script.js) | the shopkeeper | **what happens**: when you click a button, something changes |

## Try it

1. Open the live site. In the dark **Layer switches** panel:
   - Switch **CSS** off. The page goes plain, but every word and button is still there. That's the HTML on its own.
   - Switch **JavaScript** off, then click **Add to box**. Nothing happens, because the shopkeeper went home.
   - Press **X-ray** to see the HTML tags hiding behind everything.
2. Open the **Code playground** and change the code yourself. Always **guess what will happen first**, then press **Run**.

## What's in this folder

```
index.html       ← the bakery page (HTML)
style.css        ← how the bakery looks (CSS)
script.js        ← what the bakery does (JavaScript)
playground.html  ← the code playground page
lab/             ← the control panel and playground tools (you don't need to read these yet)
```

Every time new code is pushed to this GitHub repo, Vercel updates the live site automatically.
