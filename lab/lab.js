// Control panel ("lab") logic: switches the site's CSS and JavaScript on and off,
// and turns on X-ray mode to show the HTML tags. Not part of the bakery site.

(function () {
  const siteCss = document.getElementById("site-css");
  const site = document.getElementById("site");
  const lab = document.getElementById("lab");
  const cssToggle = document.getElementById("css-toggle");
  const jsToggle = document.getElementById("js-toggle");
  const xrayToggle = document.getElementById("xray-toggle");
  const collapse = document.getElementById("lab-collapse");
  const tip = document.getElementById("lab-tip");

  let cssOn = true;
  let jsOn = true;
  let xrayOn = false;

  function say(message) {
    tip.textContent = message;
  }

  function explain(lastChange) {
    if (!cssOn && !jsOn) {
      return say("Only HTML is left: plain words, and buttons that don't do anything. This is what the browser starts with before CSS and JavaScript join in.");
    }
    if (lastChange === "css") {
      say(cssOn
        ? "The icing is back! It's the same HTML as before, but CSS makes it look good."
        : "The icing is gone! The words and buttons are still all there, because they're the HTML. Now try 'Add to box': does it still work?");
    }
    if (lastChange === "js") {
      say(jsOn
        ? "The shopkeeper is back. Click 'Add to box' and watch My box change."
        : "The shopkeeper went home. Try 'Add to box' or 'Change colours'. Nothing happens! The page still looks fine, because looks are CSS's job.");
    }
    if (lastChange === "xray") {
      say(xrayOn
        ? "Each orange label is an HTML tag. <h1> is the big heading, <p> is a paragraph, <button> is a button. Can you find the <nav>?"
        : "X-ray off. The tags are still there, you just can't see them.");
    }
  }

  cssToggle.addEventListener("click", function () {
    cssOn = !cssOn;
    siteCss.disabled = !cssOn;                       // this one line switches style.css on/off
    cssToggle.setAttribute("aria-checked", String(cssOn));
    cssToggle.closest(".lab-row").classList.toggle("off", !cssOn);
    explain("css");
  });

  jsToggle.addEventListener("click", function () {
    jsOn = !jsOn;
    if (jsOn) window.shopkeeper.turnOn();
    else window.shopkeeper.turnOff();
    jsToggle.setAttribute("aria-checked", String(jsOn));
    jsToggle.closest(".lab-row").classList.toggle("off", !jsOn);
    explain("js");
  });

  xrayToggle.addEventListener("click", function () {
    xrayOn = !xrayOn;
    if (xrayOn) {
      site.querySelectorAll("*").forEach(function (el) {
        el.setAttribute("data-x", el.tagName.toLowerCase());
      });
    }
    document.body.classList.toggle("xray", xrayOn);
    xrayToggle.setAttribute("aria-pressed", String(xrayOn));
    explain("xray");
  });

  collapse.addEventListener("click", function () {
    const collapsed = lab.classList.toggle("collapsed");
    collapse.textContent = collapsed ? "+" : "–";
    collapse.setAttribute("aria-expanded", String(!collapsed));
  });
})();
