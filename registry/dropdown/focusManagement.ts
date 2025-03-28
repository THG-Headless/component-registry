import type { DropdownIds } from "./types";

export const clearFocusIndicators = (): void => {
  document.querySelectorAll(".option-focused").forEach((el) => {
    el.classList.remove("option-focused");
  });
};

export const focusElementById = (
  id: string,
  addFocusClass: boolean = false
): boolean => {
  const element = document.getElementById(id);
  if (element) {
    if (addFocusClass) {
      element.classList.add("option-focused");
    }
    element.setAttribute("tabindex", "0");
    element.focus();
    return true;
  }
  return false;
};

export const focusSearchInput = (
  searchInputRef: React.RefObject<HTMLInputElement | null>
): boolean => {
  if (searchInputRef.current) {
    searchInputRef.current.focus();
    return true;
  }
  return false;
};

export const setInitialFocus = ({
  isOpen,
  wasJustOpened,
  openedByKeyboard,
  enableSearch,
  searchInputRef,
  selectedValue,
  filteredOptions,
  dropdownIds,
  setActiveDescendant,
}: {
  isOpen: boolean;
  wasJustOpened: boolean;
  openedByKeyboard: boolean;
  enableSearch: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  selectedValue: string | null;
  filteredOptions: string[];
  dropdownIds: DropdownIds;
  setActiveDescendant: (activeDescendant: string | undefined) => void;
}): void => {
  if (!isOpen || wasJustOpened) return;

  clearFocusIndicators();

  let targetOptionId: string | null = null;

  if (filteredOptions.length > 0) {
    if (selectedValue) {
      const selectedIndex = filteredOptions.findIndex(
        (option) => option === selectedValue
      );
      if (selectedIndex >= 0) {
        targetOptionId = `${dropdownIds.dropdownListId}-option-${
          selectedIndex + 1
        }`;
      }
    }

    if (!targetOptionId) {
      targetOptionId = `${dropdownIds.dropdownListId}-option-1`;
    }

    setActiveDescendant(targetOptionId);
  } else {
    setActiveDescendant(undefined);
  }

  if (openedByKeyboard && enableSearch && searchInputRef.current) {
    setTimeout(() => {
      focusSearchInput(searchInputRef);
    }, 0);
  } else if (filteredOptions.length > 0 && targetOptionId) {
    setTimeout(() => {
      if (!(openedByKeyboard && enableSearch)) {
        focusElementById(targetOptionId, true);
      }
    }, 0);
  } else {
    setTimeout(() => {
      focusElementById(dropdownIds.dropdownTriggerId);
    }, 0);
  }
};

export const scrollOptionIntoView = (optionId: string): void => {
  const option = document.getElementById(optionId);
  if (option) {
    option.scrollIntoView({ block: "nearest" });
  }
};

export const addFocusStyles = (): void => {
  if (!document.getElementById("dropdown-focus-styles")) {
    const style = document.createElement("style");
    style.id = "dropdown-focus-styles";
    style.innerHTML = `
      .option-focused {
        outline-offset: -2px;
        border-radius: var(--radius-site);
      }
    `;
    document.head.appendChild(style);
  }
};

export const removeFocusStyles = (): void => {
  const styleElement = document.getElementById("dropdown-focus-styles");
  if (styleElement) {
    styleElement.remove();
  }
};
