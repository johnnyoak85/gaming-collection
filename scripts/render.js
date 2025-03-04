import { getFilteredCardsByType } from "./cards.js";
import { appState } from "./state.js";
import { createElement } from "./utils.js";

const TIMEOUT = 300;

/**
 * Renders cards for the given tab.
 * @param {string} tabId - The active tab id (e.g., "hardware", "amiibos", "games")
 */
export function renderCards(tabId) {
  const panel = document.getElementById(tabId);

  if (!panel) {
    return;
  }

  // Get the current sort option from state (default to "default" if not set)
  const { sortOption } = appState.getState();

  // Find or create a card container within the active panel
  let cardContainer = panel.querySelector("#card-container");

  if (!cardContainer) {
    cardContainer = createCardContainer();
    panel.appendChild(cardContainer);
  } else {
    // For smooth transition: remove visible class, update content after timeout
    cardContainer.classList.remove("visible");

    setTimeout(() => {
      populateCardContainer(cardContainer, tabId, sortOption);
    }, TIMEOUT);
  }

  // If the container is empty (just created), populate it immediately.
  if (!cardContainer.hasChildNodes()) {
    populateCardContainer(cardContainer, tabId, sortOption);
  }

  // Trigger fade-in transition (assumes CSS handles .visible appropriately)
  requestAnimationFrame(() => {
    cardContainer.classList.add("visible");
  });
}

function createCardContainer() {
  return createElement("div", {
    id: "card-container",
    class: "fade-out",
  });
}

function populateCardContainer(cardContainer, tabId, sortOption) {
  cardContainer.innerHTML = "";

  const filteredCards = getFilteredCardsByType(tabId, sortOption);

  filteredCards.forEach((card) => {
    const cardElement = createCard(card);

    cardContainer.appendChild(cardElement);
  });
}

function createCard({ name, image }) {
  const card = createElement("div", { class: "card" });
  card.innerHTML = `
    <img class="cover" src="./assets/images/${image}.png" alt="${name} cover" />
    <h4>${name}</h4>
  `;
  return card;
}
