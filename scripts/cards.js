import { amiibos } from "./lists/amiibo.js";
import { games } from "./lists/games.js";
import { hardware } from "./lists/hardware.js";
import { appState } from "./state.js";

/**
 * Initializes the appState with all cards.
 */
export function initializeCards() {
  // Populate state with all cards from the lists directory.
  appState.setState({ cards: [...amiibos, ...games, ...hardware] });
}

/**
 * Toggles the showOwned flag in the appState.
 */
export function toggleShowOwned() {
  const { showOwned } = appState.getState();

  appState.setState({ showOwned: !showOwned });
}

/**
 * Returns all cards filtered by the owned flag.
 */
export function getFilteredCards() {
  const { showOwned, cards } = appState.getState();

  return cards
    .filter(({ owned }) => (showOwned ? owned : !owned))
    .sort((a, b) => sortCards(a, b));
}

/**
 * Returns cards filtered by type (tabId) and the owned flag,
 * then sorts them based on the provided sort option.
 *
 * @param {string} tabId - The tab identifier (e.g. "hardware", "amiibo", or "game").
 * @param {("default"|"series"|"platform")} [sortOption="default"] - Optional sort option.
 */
export function getFilteredCardsByType(tabId, sortOption = "default") {
  const { showOwned, cards } = appState.getState();

  const filtered = cards.filter(
    (card) =>
      card.type.toLowerCase() === tabId &&
      (showOwned ? card.owned : !card.owned)
  );

  return filtered.sort((a, b) => sortCards(a, b, sortOption));
}

/**
 * Compares two card objects based on the provided sort option.
 *
 * Default sorting: release date (if available) then name.
 * "series" option: sorts by series (if available), then release date then name.
 * "platform" option (for games): compares by the first platform (alphabetically),
 * then series (if available), then release date then name.
 *
 * @param {Object} a - Card object A.
 * @param {Object} b - Card object B.
 * @param {("default"|"series"|"platform")} [sortOption="default"]
 */
function sortCards(a, b, sortOption = "default") {
  // When sorting by platform (for games), compare using the first platform.
  if (
    sortOption === "platform" &&
    a.type.toLowerCase() === "game" &&
    b.type.toLowerCase() === "game"
  ) {
    const platformA =
      a.platform && a.platform.length > 0 ? a.platform[0].toLowerCase() : "";
    const platformB =
      b.platform && b.platform.length > 0 ? b.platform[0].toLowerCase() : "";
    const cmpPlatform = platformA.localeCompare(platformB);

    if (cmpPlatform !== 0) {
      return cmpPlatform;
    }
  }

  // If sorting by series (or platform, which implies series sorting too).
  if (sortOption === "series" || sortOption === "platform") {
    if (a.series && b.series) {
      const cmpSeries = a.series.localeCompare(b.series);

      if (cmpSeries !== 0) {
        return cmpSeries;
      }
    } else if (a.series && !b.series) {
      return -1;
    } else if (!a.series && b.series) {
      return 1;
    }
  }

  // Next, sort by release date if both have one.
  if (a.release && b.release) {
    const cmpRelease = new Date(a.release) - new Date(b.release);

    if (cmpRelease !== 0) {
      return cmpRelease;
    }
  }

  // Finally, sort by name.
  return a.name.localeCompare(b.name);
}
