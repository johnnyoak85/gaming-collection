import { getFilteredCards, initializeCards, toggleShowOwned } from "./cards.js";
import { appState } from "./state.js";
import { createElement } from "./utils.js";

const TIMEOUT = 300;
const BUTTON_TEXT = {
  SHOW_OWNED: "Show Owned",
  SHOW_WISHLIST: "Show Wishlist",
};

function renderPage() {
  renderButton();
  renderCards();
}

function renderButton() {
  let button = document.getElementsByTagName("button");

  if (!button.length) {
    button = createFilterButton();
    document.body.appendChild(button);
  }
}

export function renderCards() {
  let cardContainer = document.getElementById("card-container");

  if (!cardContainer) {
    cardContainer = createCardContainer();

    document.body.appendChild(cardContainer);
  } else {
    cardContainer.classList.remove("visible");

    setTimeout(() => {
      populateCardContainer(cardContainer);
    }, TIMEOUT);
  }
}

function createCardContainer() {
  const cardContainer = createElement("div", {
    id: "card-container",
    class: "fade-out",
  });

  setTimeout(() => {
    populateCardContainer(cardContainer);
  }, TIMEOUT);

  return cardContainer;
}

function populateCardContainer(cardContainer) {
  cardContainer.innerHTML = "";

  const filteredCards = getFilteredCards();

  filteredCards.forEach((card) => {
    const cardElement = createCard(card);

    cardContainer.appendChild(cardElement);
  });

  requestAnimationFrame(() => {
    cardContainer.classList.add("visible");
  });
}

function createCard({ name, cover }) {
  const card = createElement("div", { class: "card fade-in" });

  card.innerHTML = `
    <img class="cover" src="./assets/images/${cover}" alt="${name} cover" />
    <h4>${name}</h4>
  `;

  return card;
}

function createFilterButton() {
  const button = createElement("button");

  switchButtonText(button);

  button.addEventListener("click", () => {
    toggleShowOwned();
    switchButtonText(button);
  });

  return button;
}

function switchButtonText(button) {
  const { showOwned } = appState.getState();

  button.textContent = showOwned
    ? BUTTON_TEXT.SHOW_WISHLIST
    : BUTTON_TEXT.SHOW_OWNED;
}

appState.subscribe(() => renderPage());

document.addEventListener("DOMContentLoaded", () => {
  initializeCards();
  renderPage();
});
