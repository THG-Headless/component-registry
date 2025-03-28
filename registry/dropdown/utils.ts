export const filterOptions = (
  options: string[],
  searchValue: string
): string[] => {
  return options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );
};

export const generateDropdownIds = (uniqueId: string) => {
  return {
    dropdownTriggerId: `dropdown-trigger-${uniqueId}`,
    dropdownLabelId: `dropdown-label-${uniqueId}`,
    dropdownListId: `dropdown-list-${uniqueId}`,
    dropdownSearchId: `dropdown-search-${uniqueId}`,
    dropdownHelperId: `dropdown-helper-${uniqueId}`,
    dropdownErrorId: `dropdown-error-${uniqueId}`,
  };
};

export const getActiveOptionIndex = (
  activeDescendant: string | undefined
): number => {
  if (!activeDescendant) return -1;

  const match = activeDescendant.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10) - 1;
  }

  return -1;
};

export const getOptionId = (dropdownListId: string, index: number): string => {
  return `${dropdownListId}-option-${index + 1}`;
};
