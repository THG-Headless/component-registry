/**
 * Sets up tab navigation functionality including tab switching and smooth scrolling
 * to sections when clicking on section links
 */

// Using explicit export statement to ensure file is treated as a module
export const TAB_ACTIVE_ATTR = "data-active";

export function setupTabNavigation() {
  // Tab switching functionality with section links handling
  const tabButtons = document.querySelectorAll("[data-tab]");

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update active state for tabs
      tabButtons.forEach((t) => {
        t.setAttribute(TAB_ACTIVE_ATTR, "false");
      });
      tab.setAttribute(TAB_ACTIVE_ATTR, "true");

      // Update visibility of section links
      const tabId = tab.getAttribute("data-tab");
      document.querySelectorAll("[data-section-links]").forEach((links) => {
        links.setAttribute("data-visible", "false");
      });
      const sectionLinks = document.querySelector(
        `[data-section-links="${tabId}"]`
      );
      if (sectionLinks) {
        sectionLinks.setAttribute("data-visible", "true");
      }

      // Show the selected tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.add("hidden");
      });
      const tabContent = document.querySelector(
        `[data-tab-content="${tabId}"]`
      );
      if (tabContent) {
        tabContent.classList.remove("hidden");
      }
    });
  });

  // Section link click handling for smooth scrolling
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  sectionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (!href) return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to the section
        const contentArea = document.getElementById("content-area");
        if (contentArea) {
          // Add a short delay to ensure the scroll happens after any layout changes
          setTimeout(() => {
            contentArea.scrollTo({
              top: targetElement.offsetTop - 40,
              behavior: "smooth",
            });
          }, 10);
        }
      }
    });
  });
}
