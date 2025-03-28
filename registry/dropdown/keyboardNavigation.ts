import type { DropdownIds } from "./types";
import { getActiveOptionIndex, getOptionId } from "./utils";
import { clearFocusIndicators, scrollOptionIntoView } from "./focusManagement";

interface KeyboardNavigationParams {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setOpenedByKeyboard: (openedByKeyboard: boolean) => void;
  activeDescendant: string | undefined;
  setActiveDescendant: (activeDescendant: string | undefined) => void;
  filteredOptions: string[];
  selectedValue: string | null;
  setSelectedValue: (selectedValue: string | null) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  enableSearch: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  dropdownIds: DropdownIds;
}

export const handleKeyboardNavigation = (
  e: React.KeyboardEvent,
  params: KeyboardNavigationParams
): boolean => {
  const {
    isOpen,
    setIsOpen,
    setOpenedByKeyboard,
    activeDescendant,
    setActiveDescendant,
    filteredOptions,
    selectedValue,
    setSelectedValue,
    searchValue,
    setSearchValue,
    enableSearch,
    searchInputRef,
    dropdownIds,
  } = params;

  if (!isOpen) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpenedByKeyboard(true);
      setIsOpen(true);
      return true;
    }
    return false;
  }

  const optionCount = filteredOptions.length;
  if (optionCount === 0) return false;

  // Find the index of the currently active option
  const currentIndex = getActiveOptionIndex(activeDescendant);

  // Check if we're in the search input
  const isInSearchInput =
    enableSearch && document.activeElement === searchInputRef.current;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();

      clearFocusIndicators();

      if (isInSearchInput || currentIndex === -1) {
        const newId = getOptionId(dropdownIds.dropdownListId, 0);
        setActiveDescendant(newId);

        const firstOption = document.getElementById(newId);
        if (firstOption) {
          firstOption.classList.add("option-focused");
          scrollOptionIntoView(newId);
          firstOption.setAttribute("tabindex", "0");
          firstOption.focus();
        }
      } else if (currentIndex < optionCount - 1) {
        const newIndex = currentIndex + 1;
        const newId = getOptionId(dropdownIds.dropdownListId, newIndex);
        setActiveDescendant(newId);

        const nextOption = document.getElementById(newId);
        if (nextOption) {
          nextOption.classList.add("option-focused");
          scrollOptionIntoView(newId);
          nextOption.setAttribute("tabindex", "0");
          nextOption.focus();
        }
      } else if (currentIndex === optionCount - 1) {
        const currentId = getOptionId(dropdownIds.dropdownListId, currentIndex);
        const currentOption = document.getElementById(currentId);
        if (currentOption) {
          currentOption.classList.add("option-focused");
          currentOption.focus();
        }
      }
      return true;

    case "ArrowUp":
      e.preventDefault();

      clearFocusIndicators();

      if (currentIndex === -1) {
        // If no item is currently focused, focus the first option instead of the last
        const newId = getOptionId(dropdownIds.dropdownListId, 0);
        setActiveDescendant(newId);

        const firstOption = document.getElementById(newId);
        if (firstOption) {
          firstOption.classList.add("option-focused");
          scrollOptionIntoView(newId);
          firstOption.setAttribute("tabindex", "0");
          firstOption.focus();
        }
      } else if (currentIndex === 0 && enableSearch) {
        setActiveDescendant(undefined);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (currentIndex === 0 && !enableSearch) {
        // If we're on the first item and search is not enabled, stay on the first item
        // This prevents looping from first to last
        const currentId = getOptionId(dropdownIds.dropdownListId, currentIndex);
        const currentOption = document.getElementById(currentId);
        if (currentOption) {
          currentOption.classList.add("option-focused");
          currentOption.focus();
        }
      } else if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        const newId = getOptionId(dropdownIds.dropdownListId, newIndex);
        setActiveDescendant(newId);

        const prevOption = document.getElementById(newId);
        if (prevOption) {
          prevOption.classList.add("option-focused");
          scrollOptionIntoView(newId);
          prevOption.setAttribute("tabindex", "0");
          prevOption.focus();
        }
      }
      return true;

    case "Home":
      e.preventDefault();

      clearFocusIndicators();

      if (enableSearch) {
        setActiveDescendant(undefined);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else {
        const newId = getOptionId(dropdownIds.dropdownListId, 0);
        setActiveDescendant(newId);

        const firstOption = document.getElementById(newId);
        if (firstOption) {
          firstOption.classList.add("option-focused");
          scrollOptionIntoView(newId);
          firstOption.setAttribute("tabindex", "0");
          firstOption.focus();
        }
      }
      return true;

    case "End":
      e.preventDefault();

      clearFocusIndicators();

      const newId = getOptionId(dropdownIds.dropdownListId, optionCount - 1);
      setActiveDescendant(newId);

      const lastOption = document.getElementById(newId);
      if (lastOption) {
        lastOption.classList.add("option-focused");
        scrollOptionIntoView(newId);
        lastOption.setAttribute("tabindex", "0");
        lastOption.focus();
      }
      return true;

    case "Enter":
    case " ":
      if (isInSearchInput) {
        if (e.key === " ") {
          return false;
        }
        e.preventDefault();
        return true;
      }

      e.preventDefault();

      if (activeDescendant && currentIndex >= 0) {
        setSelectedValue(filteredOptions[currentIndex]);
        setIsOpen(false);
        setSearchValue("");
        const button = document.getElementById(dropdownIds.dropdownTriggerId);
        if (button) {
          setTimeout(() => button.focus(), 0);
        }
      }
      return true;

    case "Escape":
      e.preventDefault();
      setIsOpen(false);
      setSearchValue("");
      const button = document.getElementById(dropdownIds.dropdownTriggerId);
      if (button) {
        setTimeout(() => button.focus(), 0);
      }
      return true;

    case "Tab":
      setIsOpen(false);
      setSearchValue("");
      return false;

    default:
      if (enableSearch && e.key.length === 1 && !isInSearchInput) {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      return false;
  }
};
