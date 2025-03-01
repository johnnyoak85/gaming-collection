import { cards } from "./hardware.js";
import { appState } from "./state.js";

export function initializeCards() {
  appState.setState({ cards });
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
  if (a.company !== b.company) {
    return a.company.localeCompare(b.company);
  }

  if (a.family !== b.family) {
    return a.family.localeCompare(b.family);
  }

  if (a.format !== b.format) {
    if (a.format === "Controller") {
      return 1;
    }

    if (b.format === "Controller") {
      return -1;
    }

    return a.format.localeCompare(b.format);
  }

  return a.name.localeCompare(b.name);
}
