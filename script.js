/* ===== Settings: edit these ===== */

// Your WhatsApp number in international format, digits only, no "+" or spaces.
// Example for a Ugandan number 0772 123456 -> "256772123456"
const WHATSAPP_NUMBER = "256775297067";

// How many days' notice you need for an order.
const MIN_NOTICE_DAYS = 3;

// Size / quantity options shown for each product.
const SIZE_OPTIONS = {
  "Birthday & celebration cake": {
    label: "Cake size",
    options: ['Small, 6" (8–10 people)', 'Medium, 8" (15–20 people)', 'Large, 10" (25–30 people)', "Two tiers (40+ people)", "Not sure yet"],
  },
  "Wedding cake": {
    label: "Tiers",
    options: ["2 tiers (up to 60 guests)", "3 tiers (up to 120 guests)", "4+ tiers (120+ guests)", "Not sure yet, let's discuss"],
  },
  "Cupcakes": {
    label: "Quantity",
    options: ["6 cupcakes", "12 cupcakes", "24 cupcakes", "36 cupcakes", "50+ cupcakes"],
  },
  "Everyday cake": {
    label: "Cake size",
    options: ["Loaf cake", 'Round, 8"', "Two cakes or more"],
  },
  "Cookies": {
    label: "Quantity",
    options: ["12 cookies", "24 cookies", "50 cookies", "100+ cookies"],
  },
  "Something else": {
    label: "Size or quantity",
    options: ["I'll describe it below"],
  },
};

/* ===== Page behaviour ===== */

document.documentElement.classList.remove("no-js");

const form = document.getElementById("order-form");
const productEl = document.getElementById("product");
const sizeEl = document.getElementById("size");
const sizeLabel = document.getElementById("size-label");
const dateEl = document.getElementById("date");
const addressField = document.getElementById("address-field");
const addressEl = document.getElementById("address");
const statusEl = document.getElementById("form-status");

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Footer WhatsApp link
const footerWa = document.getElementById("footer-whatsapp");
if (WHATSAPP_NUMBER) {
  footerWa.href = `https://wa.me/${WHATSAPP_NUMBER}`;
} else {
  footerWa.href = "#order";
  footerWa.removeAttribute("target");
}

// Header border once scrolled
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal cards as they scroll into view
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

// Earliest allowed date
function isoDate(d) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}
const earliest = new Date();
earliest.setDate(earliest.getDate() + MIN_NOTICE_DAYS);
dateEl.min = isoDate(earliest);

// Fill size options when the product changes
function updateSizes() {
  const config = SIZE_OPTIONS[productEl.value];
  sizeEl.innerHTML = "";
  if (!config) {
    sizeLabel.textContent = "Size";
    sizeEl.disabled = true;
    sizeEl.append(new Option("Choose a product first", ""));
    return;
  }
  sizeLabel.textContent = config.label;
  sizeEl.disabled = false;
  sizeEl.append(new Option("Choose one", ""));
  config.options.forEach((o) => sizeEl.append(new Option(o, o)));
}
productEl.addEventListener("change", updateSizes);

// "Order this" buttons pre-select the product and jump to the form
document.querySelectorAll("[data-product]").forEach((btn) => {
  btn.addEventListener("click", () => {
    productEl.value = btn.dataset.product;
    updateSizes();
    clearError(productEl);
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => sizeEl.focus({ preventScroll: true }), 600);
  });
});

// Show the address field only for delivery
form.querySelectorAll('input[name="fulfilment"]').forEach((r) =>
  r.addEventListener("change", () => {
    const delivery = form.elements.fulfilment.value === "Delivery";
    addressField.hidden = !delivery;
    addressEl.required = delivery;
    if (!delivery) clearError(addressEl);
  })
);

/* ===== Validation ===== */

function setError(el) {
  el.closest(".field").classList.add("invalid");
  el.setAttribute("aria-invalid", "true");
}
function clearError(el) {
  el.closest(".field").classList.remove("invalid");
  el.removeAttribute("aria-invalid");
}

form.querySelectorAll("input, select, textarea").forEach((el) => {
  el.addEventListener("input", () => clearError(el));
  el.addEventListener("change", () => clearError(el));
});

function validate() {
  let firstBad = null;
  const check = (el, ok) => {
    if (ok) return clearError(el);
    setError(el);
    firstBad = firstBad || el;
  };

  check(form.elements.name, form.elements.name.value.trim().length > 1);
  check(form.elements.phone, form.elements.phone.value.replace(/\D/g, "").length >= 7);
  check(productEl, !!productEl.value);
  check(sizeEl, !!sizeEl.value);
  check(dateEl, !!dateEl.value && dateEl.value >= dateEl.min);
  if (form.elements.fulfilment.value === "Delivery") check(addressEl, addressEl.value.trim().length > 2);

  if (firstBad) firstBad.focus();
  return !firstBad;
}

/* ===== Build the WhatsApp message ===== */

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildMessage() {
  const v = (name) => (form.elements[name].value || "").trim();
  const lines = [
    "Hello Lilelus Cakes & More! I'd like to place an order 🎂",
    "",
    `*Name:* ${v("name")}`,
    `*Phone:* ${v("phone")}`,
    `*Product:* ${v("product")}`,
    `*${sizeLabel.textContent}:* ${v("size")}`,
  ];
  if (v("flavour")) lines.push(`*Flavour:* ${v("flavour")}`);
  lines.push(`*Date needed:* ${prettyDate(v("date"))}`);
  lines.push(`*Pickup or delivery:* ${form.elements.fulfilment.value}`);
  if (form.elements.fulfilment.value === "Delivery") lines.push(`*Deliver to:* ${v("address")}`);
  if (v("inscription")) lines.push(`*Message on cake:* "${v("inscription")}"`);
  if (v("notes")) lines.push("", `*Notes:* ${v("notes")}`);
  return lines.join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";

  if (!validate()) return;

  const message = buildMessage();

  if (!WHATSAPP_NUMBER) {
    statusEl.className = "form-status warn";
    statusEl.textContent =
      "The WhatsApp number hasn't been set up yet (see WHATSAPP_NUMBER in script.js). This is the message that would be sent:\n\n" +
      message;
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
  statusEl.className = "form-status ok";
  statusEl.textContent = "WhatsApp should now be open with your order. Just press send and we'll reply soon!";
});
