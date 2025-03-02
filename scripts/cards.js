import { hardware } from "./hardware.js";
import { appState } from "./state.js";

export function initializeCards() {
  appState.setState({ cards: hardware });
}

export let showOwned = true;

export function toggleShowOwned() {
  const currentState = appState.getState();

  appState.setState({ showOwned: !currentState.showOwned });
}

export function getFilteredCards() {
  const { showOwned, cards } = appState.getState();

  return [...cards]
    .sort(sortCards)
    .filter((card) => (showOwned ? card.owned : !card.owned));
}

function sortCards(a, b) {
  if (a.release && b.release) {
    return new Date(a.release) - new Date(b.release);
  }

  return a.name.localeCompare(b.name);
}
