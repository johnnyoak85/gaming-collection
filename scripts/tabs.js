import { toggleShowOwned } from "./cards.js";
import { renderCards } from "./render.js";
import { appState } from "./state.js";
import { createElement } from "./utils.js";

const TABS = ["Games", "Hardware", "Amiibos"];
const SORT_OPTIONS = {
  default: "Release Date",
  series: "Series",
  platform: "Platform",
};

export function initTabs() {
  // Create a control container for the owned toggle and sort dropdown
  const controlContainer = createControlContainer();

  document.body.insertBefore(controlContainer, document.body.firstChild);

  // Create the tabs and panels containers
  const tabsContainer = createTabsContainer();
  const panelsContainer = createPanelsContainer();

  document.body.insertBefore(tabsContainer, controlContainer.nextSibling);
  document.body.insertBefore(panelsContainer, tabsContainer.nextSibling);

  // Build tabs and panels dynamically using TABS
  TABS.forEach((tab, index) => {
    const id = tab.toLowerCase();
    // Create tab button
    const tabButton = createElement("button", { class: "tab", "data-tab": id });

    tabButton.textContent = tab;

    if (index === 0) {
      tabButton.classList.add("active");
      appState.setState({ currentTab: id });
    }

    tabsContainer.appendChild(tabButton);

    // Create corresponding panel
    const panel = createElement("div", { id, class: "tab-panel" });

    if (index === 0) {
      panel.classList.add("active");
    }

    panelsContainer.appendChild(panel);

    // Initial render for each tab (optional: you may choose to render only the active tab)
    renderCards(id);
  });

  // Set up event listeners for tab switching
  const tabButtons = tabsContainer.querySelectorAll(".tab");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update state with the current tab id
      const tabId = button.getAttribute("data-tab");

      appState.setState({ currentTab: tabId });

      // Toggle active panel
      const panels = panelsContainer.querySelectorAll(".tab-panel");

      panels.forEach((panel) => panel.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");

      // Render cards for the selected tab
      renderCards(tabId);
    });
  });
}

/** Creates a container for controls (toggle and sort options) */
function createControlContainer() {
  const container = createElement("div", { id: "controls" });
  // Create toggle button for owned/not owned
  const toggleButton = createElement("button", { id: "toggle-owned" });

  updateToggleButtonText(toggleButton);

  toggleButton.addEventListener("click", () => {
    toggleShowOwned();
    updateToggleButtonText(toggleButton);

    // Re-render current tab after toggling owned state
    const { currentTab } = appState.getState();

    renderCards(currentTab);
  });

  container.appendChild(toggleButton);

  // Create sort options dropdown
  const sortSelect = createElement("select", { id: "sort-options" });

  // Populate dropdown options
  for (const [value, label] of Object.entries(SORT_OPTIONS)) {
    const option = createElement("option");

    option.value = value;
    option.textContent = label;

    sortSelect.appendChild(option);
  }

  // Set default sort option in state if not already set
  if (!appState.getState().sortOption) {
    appState.setState({ sortOption: "default" });
  }

  sortSelect.value = appState.getState().sortOption;

  sortSelect.addEventListener("change", () => {
    appState.setState({ sortOption: sortSelect.value });

    // Re-render current tab when sort option changes
    const { currentTab } = appState.getState();

    renderCards(currentTab);
  });

  container.appendChild(sortSelect);

  return container;
}

function updateToggleButtonText(button) {
  const { showOwned } = appState.getState();

  button.textContent = showOwned ? "Show Wishlist" : "Show Owned";
}

function createTabsContainer() {
  return createElement("div", { id: "tabs" });
}

function createPanelsContainer() {
  return createElement("div", { id: "tab-content" });
}
