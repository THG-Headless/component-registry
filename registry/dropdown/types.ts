export interface DropdownProps {
  label?: string;
  options?: string[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  enableSearch?: boolean;
  id?: string;
  required?: boolean;
  noOptionsMessage?: string;
  searchPlaceholder?: string;
  helperText?: string;
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
  toggleDropdown: (e: React.MouseEvent) => void;
  handleOptionClick: (option: string, e: React.MouseEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export interface DropdownIds {
  dropdownTriggerId: string;
  dropdownLabelId: string;
  dropdownListId: string;
  dropdownSearchId: string;
  dropdownHelperId: string;
  dropdownErrorId: string;
}
