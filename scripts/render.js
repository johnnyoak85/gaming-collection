import { getFilteredCards, initializeCards, toggleShowOwned } from "./cards.js";
import { appState } from "./state.js";
import { createElement } from "./utils.js";

const BUTTON_TEXT = {
  SHOW_OWNED: "Show Owned",
  SHOW_WISHLIST: "Show Wishlist",
};

export function renderCards() {
  let cardContainer = document.getElementById("card-container");

  if (!cardContainer) {
    const app = createElement("div", { id: "app" });

    const button = createFilterButton();
    app.appendChild(button);

    cardContainer = createCardContainer();
    app.appendChild(cardContainer);

    document.body.appendChild(app);
  } else {
    cardContainer.replaceWith(createCardContainer());
  }
}

function createCardContainer() {
  const cardContainer = createElement("div", {
    id: "card-container",
    class: "fade-out",
  });

  setTimeout(() => {
    populateCardContainer(cardContainer);
  }, 300);

  return cardContainer;
}

function populateCardContainer(cardContainer) {
  cardContainer.innerHTML = "";

  const filteredCards = getFilteredCards();

  filteredCards.forEach((card) => {
    const cardElement = createCardWrapper(card);

    cardContainer.appendChild(cardElement);
  });

  requestAnimationFrame(() => {
    cardContainer.classList.add("visible");
  });
}

function createCardWrapper(cardData) {
  const cardWrapper = createElement("div", { class: "card-wrapper" });
  const card = createCard(cardData);

  cardWrapper.appendChild(card);

  return cardWrapper;
}

function createCard({ name, cover }) {
  const card = createElement("div", { class: "card fade-in" });
  const cardFront = createElement("div", { class: "card-front" });

  cardFront.innerHTML = `
    <img class="cover" src="./assets/images/${cover}" alt="${name} cover" />
    <h4>${name}</h4>
  `;

  card.appendChild(cardFront);

  return card;
}

function createFilterButton() {
  const button = createElement("button", { id: "filter-button" });

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

appState.subscribe(() => renderCards());

document.addEventListener("DOMContentLoaded", () => {
  initializeCards();
  renderCards();
});
