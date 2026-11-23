/* ==============================================
   ⚡ script.js: the "shopkeeper"
   ----------------------------------------------
   JavaScript makes the page DO things.
   It waits for you to click, then changes the page.
   ============================================== */


// 1. Find the parts of the page we want to control.
//    (These match the id="..." names in index.html)
const site = document.getElementById("site");
const themeButton = document.getElementById("theme-button");
const clearButton = document.getElementById("clear-button");
const boxSummary = document.getElementById("box-summary");
const boxList = document.getElementById("box-list");
const addButtons = document.querySelectorAll(".add-button");


// 2. A list to remember what's in the box.
let box = [];


// 3. What happens when you click "Add to box"
function addToBox(event) {
  const button = event.target;
  const name = button.dataset.name;              // e.g. "Birthday cake"
  const price = Number(button.dataset.price);    // e.g. 80000

  box.push({ name: name, price: price });        // put it in the box
  showBox();

  button.textContent = "Added! ✓";               // change the button's words
  setTimeout(function () {                       // ...then change them back after 1 second
    button.textContent = "Add to box";
  }, 1000);
}


// 4. Write the box onto the page
function showBox() {
  boxList.innerHTML = "";                        // clear the old list

  let total = 0;
  for (const item of box) {
    const li = document.createElement("li");     // make a new <li> tag
    li.textContent = item.name + " · UGX " + item.price.toLocaleString();
    boxList.appendChild(li);                     // add it to the page
    total = total + item.price;
  }

  if (box.length === 0) {
    boxSummary.textContent = "Your box is empty.";
  } else {
    boxSummary.textContent = box.length + " item(s) · Total: UGX " + total.toLocaleString();
  }

  // a little "pop" animation (the .pop style is in style.css)
  boxSummary.classList.remove("pop");
  void boxSummary.offsetWidth;                   // trick to restart the animation
  boxSummary.classList.add("pop");
}


// 5. Empty the box
function emptyBox() {
  box = [];
  showBox();
}


// 6. Swap between the pink and the mint colours
function changeColours() {
  site.classList.toggle("mint");                 // add "mint" if it's missing, remove it if it's there
}


// 7. Tell the buttons which job to do when they're clicked.
//    "addEventListener" means: "when THIS happens, run THAT".
function turnOn() {
  themeButton.addEventListener("click", changeColours);
  clearButton.addEventListener("click", emptyBox);
  for (const button of addButtons) {
    button.addEventListener("click", addToBox);
  }
}

turnOn();   // start the shopkeeper as soon as the page loads


/* ----------------------------------------------
   For the control panel only: this lets the
   "JavaScript" switch send the shopkeeper home.
   You don't need to change this part.
   ---------------------------------------------- */
function turnOff() {
  themeButton.removeEventListener("click", changeColours);
  clearButton.removeEventListener("click", emptyBox);
  for (const button of addButtons) {
    button.removeEventListener("click", addToBox);
  }
  // put the page back to how the HTML wrote it
  box = [];
  boxList.innerHTML = "";
  boxSummary.textContent = "Your box is empty.";
  boxSummary.classList.remove("pop");
  site.classList.remove("mint");
}

window.shopkeeper = { turnOn: turnOn, turnOff: turnOff };
