import type { SelectHTMLAttributes } from "react";

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: string[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  enableSearch?: boolean;
  noOptionsMessage?: string;
  searchPlaceholder?: string;
  helperText?: string;
  className?: string;
  initialValue?: string;
}

export interface DropdownState {
  isOpen: boolean;
  searchValue: string;
  selectedValue: string | null;
  activeDescendant: string | undefined;
  wasJustOpened: boolean;
  openedByKeyboard: boolean;
}

export interface DropdownHandlers {
  toggleDropdown: (e: React.MouseEvent) => boolean;
  handleOptionClick: (option: string, e: React.MouseEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setOnClickOutside: (callback: (wasOpen: boolean) => void) => void;
}

export interface DropdownIds {
  dropdownTriggerId: string;
  dropdownLabelId: string;
  dropdownListId: string;
  dropdownSearchId: string;
  dropdownHelperId: string;
  dropdownErrorId: string;
}
