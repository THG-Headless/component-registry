import { useState, useRef, useEffect, useId } from "react";
import type {
  DropdownProps,
  DropdownState,
  DropdownHandlers,
  DropdownIds,
} from "./types";
import { filterOptions, generateDropdownIds } from "./utils";
import {
  addFocusStyles,
  removeFocusStyles,
  setInitialFocus,
} from "./focusManagement";
import { handleKeyboardNavigation } from "./keyboardNavigation";

interface UseDropdownReturn {
  state: DropdownState;
  handlers: DropdownHandlers;
  refs: {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
  };
  dropdownIds: DropdownIds;
  filteredOptions: string[];
}

export const useDropdown = (props: DropdownProps): UseDropdownReturn => {
  const {
    options,
    disabled = false,
    enableSearch = true,
    id: externalId,
  } = props;

  // Ensure options is always an array
  const optionsArray = options || [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [activeDescendant, setActiveDescendant] = useState<string | undefined>(
    undefined
  );
  const [wasJustOpened, setWasJustOpened] = useState(false);
  const [openedByKeyboard, setOpenedByKeyboard] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const instanceId = useId();
  const uniqueId = externalId || instanceId;
  const dropdownIds = generateDropdownIds(uniqueId);

  const filteredOptions = filterOptions(optionsArray, searchValue);

  useEffect(() => {
    addFocusStyles();
    return () => {
      removeFocusStyles();
    };
  }, []);

  useEffect(() => {
    setInitialFocus({
      isOpen,
      wasJustOpened,
      openedByKeyboard,
      enableSearch,
      searchInputRef,
      selectedValue,
      filteredOptions,
      dropdownIds,
      setActiveDescendant,
    });

    if (!isOpen) {
      setWasJustOpened(false);
      setActiveDescendant(undefined);
    } else if (isOpen && !wasJustOpened) {
      setWasJustOpened(true);
    }
  }, [
    isOpen,
    wasJustOpened,
    openedByKeyboard,
    filteredOptions,
    selectedValue,
    enableSearch,
    dropdownIds,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Event handlers
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled) {
      setOpenedByKeyboard(false);
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedValue(option);
    setIsOpen(false);
    setSearchValue("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardNavigation(e, {
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
    });
  };

  useEffect(() => {
    const container = dropdownRef.current;
    if (!container) return;

    const handleKeyDownEvent = (e: KeyboardEvent) => {
      handleKeyDown(e as unknown as React.KeyboardEvent);
    };

    container.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      container.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [
    isOpen,
    enableSearch,
    activeDescendant,
    filteredOptions.length,
    dropdownIds.dropdownTriggerId,
  ]);

  const state: DropdownState = {
    isOpen,
    searchValue,
    selectedValue,
    activeDescendant,
    wasJustOpened,
    openedByKeyboard,
  };

  const handlers: DropdownHandlers = {
    toggleDropdown,
    handleOptionClick,
    handleSearchChange,
    handleKeyDown,
  };

  return {
    state,
    handlers,
    refs: {
      dropdownRef,
      searchInputRef,
    },
    dropdownIds,
    filteredOptions,
  };
};
