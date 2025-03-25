/**
 * Sets up toggle behavior for collapsible sections
 * @param toggleButton The button that triggers the toggle
 * @param getSection A function that returns the section element to toggle based on color name
 */
export function setupToggleSection(
  toggleButton: HTMLElement,
  getSection: (colorName: string) => HTMLElement
) {
  toggleButton.addEventListener("click", () => {
    const colorName = toggleButton.getAttribute(
      toggleButton.hasAttribute("data-toggle-shades")
        ? "data-toggle-shades"
        : "data-toggle-aliases"
    );

    if (!colorName) return;

    const section = getSection(colorName);
    const icon = toggleButton.querySelector("[data-toggle-icon]");
    if (!section || !icon) return;

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      // Collapse
      section.style.maxHeight = "0px";
      toggleButton.setAttribute("aria-expanded", "false");
      icon.setAttribute("data-expanded", "false");
    } else {
      // Expand
      section.style.maxHeight =
        section.scrollHeight +
        (toggleButton.hasAttribute("data-toggle-shades") ? 500 : 0) +
        "px";
      toggleButton.setAttribute("aria-expanded", "true");
      icon.setAttribute("data-expanded", "true");

      // Emit an event when expanded for better state tracking
      document.dispatchEvent(
        new CustomEvent("sectionToggled", {
          detail: {
            section:
              toggleButton.getAttribute("data-toggle-shades") ||
              toggleButton.getAttribute("data-toggle-aliases"),
            expanded: true,
          },
        })
      );
    }
  });

  // Set initial state to collapsed
  toggleButton.setAttribute("aria-expanded", "false");
}
