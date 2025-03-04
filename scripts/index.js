import { initializeCards } from "./cards.js";
import { initTabs } from "./tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  // Populate appState.cards with all card data
  initializeCards();

  // Set up the dynamic tab system – this will create the tab buttons and panels,
  // set the initial active tab (using TABS = ["Hardware", "Amiibos", "Games"]),
  // and wire up click events to call renderCards for the active tab.
  initTabs();
});
