let current = 1;
const total = 15;

const startScreen = document.getElementById("startScreen");
const app = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

const pouchWrapper = document.getElementById("pouchWrapper");
const pouch = document.getElementById("pouch");
const card = document.getElementById("card");
const counter = document.getElementById("counter");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let torn = false; // torn/opened visual state
let revealed = false; // card visible

const startCard = document.getElementById("startCard");

startCard.onclick = () => {
  startScreen.classList.add("hidden");
  app.classList.remove("hidden");
  updateCard();
};

function updateCard() {
  card.src = `assets/${current}.png`;
  counter.innerText = `${current} / ${total}`;
  resetState();
}

function resetState() {
  torn = false;
  revealed = false;
  pouchWrapper.classList.remove("opening", "behind", "closing");
  const rip = pouchWrapper.querySelector('.pouchRip');
  if (rip) rip.classList.remove('rip');
  card.classList.remove("show");
  card.classList.add("hidden");
  pouchWrapper.classList.remove("hidden");
}

function openPouch() {
  // prevent retrigger during tearing
  if (pouchWrapper.classList.contains('tearing')) return;
  pouchWrapper.classList.remove('closing');
  // start tearing animation first
  pouchWrapper.classList.add('tearing');
  const rip = pouchWrapper.querySelector('.pouchRip');
  if (rip) {
    rip.classList.add('rip');
    const onRipEnd = () => {
      rip.removeEventListener('animationend', onRipEnd);
      // switch to opening pose and then reveal the card
      pouchWrapper.classList.remove('tearing');
      pouchWrapper.classList.add('opening');
      setTimeout(() => {
        card.classList.remove('hidden');
        card.classList.add('show');
        pouchWrapper.classList.add('behind');
        revealed = true;
        torn = true;
      }, 60);
    };
    rip.addEventListener('animationend', onRipEnd);
  } else {
    // fallback: timed reveal
    pouchWrapper.classList.add('opening');
    setTimeout(() => {
      card.classList.remove('hidden');
      card.classList.add('show');
      pouchWrapper.classList.add('behind');
      revealed = true;
      torn = true;
    }, 380);
  }
}

function closePouch() {
  // return card to pouch
  card.classList.remove('show');
  card.classList.add('hidden');
  // animate pouch closing
  pouchWrapper.classList.remove('behind');
  pouchWrapper.classList.add('closing');
  setTimeout(() => {
    pouchWrapper.classList.remove('opening', 'closing');
    const rip = pouchWrapper.querySelector('.pouchRip');
    if (rip) rip.classList.remove('rip');
    revealed = false;
    torn = false;
  }, 450);
}

// Clicking the pouch toggles open/close behavior in one click each
pouchWrapper.onclick = () => {
  // ignore clicks while tearing animation is running
  if (pouchWrapper.classList.contains('tearing')) return;
  if (!revealed) {
    openPouch();
  } else {
    closePouch();
  }
};

// Allow clicking the card itself (it sits above the pouch) to close the pouch
card.onclick = (e) => {
  if (revealed) {
    closePouch();
    e.stopPropagation();
  }
};

prevBtn.onclick = () => {
  if (current > 1) {
    current--;
    updateCard();
  }
};

nextBtn.onclick = () => {
  if (current < total) {
    current++;
    updateCard();
  }
};
