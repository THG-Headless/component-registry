import React from "react";
import type { DropdownProps } from "./types";
import { useDropdown } from "./useDropdown";

const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    label,
    options,
    placeholder,
    error,
    errorMessage,
    disabled,
    enableSearch,
    required,
    noOptionsMessage,
    searchPlaceholder,
    helperText,
    className,
    onChange,
    value,
    name,
    id,
    form,
    autoFocus,
    size,
    multiple,
    ...restProps
  } = props;

  const propsWithDefaults = {
    ...props,
    options: props.options || options,
    initialValue: value as string,
  };

  const {
    state,
    handlers,
    refs,
    dropdownIds,
    filteredOptions,
    setSelectedValue,
  } = useDropdown(propsWithDefaults);

  React.useEffect(() => {
    if (onChange && state.selectedValue) {
      const syntheticEvent = {
        target: {
          name,
          value: state.selectedValue,
        },
      };
      // @ts-ignore - We're creating a simplified version of the event
      onChange(syntheticEvent);
    }
  }, [state.selectedValue, onChange, name]);

  React.useEffect(() => {
    if (autoFocus) {
      const button = document.getElementById(dropdownIds.dropdownTriggerId);
      if (button) {
        button.focus();
      }
    }
  }, [autoFocus, dropdownIds.dropdownTriggerId]);

  const { isOpen, selectedValue, activeDescendant } = state;

  const { toggleDropdown, handleOptionClick, handleSearchChange } = handlers;

  const { dropdownRef, searchInputRef } = refs;

  const {
    dropdownTriggerId,
    dropdownLabelId,
    dropdownListId,
    dropdownSearchId,
    dropdownHelperId,
    dropdownErrorId,
  } = dropdownIds;
  return (
    <div
      ref={dropdownRef}
      className={`skin-form dropdown-wrapper group wrapper ${
        isOpen ? "dropdown-open" : ""
      } ${error ? "dropdown-error" : ""} ${className}`}
      data-form={form}
      data-size={size}
      data-multiple={multiple}
      {...(restProps as any)}
    >
      {/* Hidden input to store the value for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedValue || ""}
        required={required}
      />
      <div className="input-label-wrapper">
        <label
          htmlFor={enableSearch ? dropdownSearchId : dropdownTriggerId}
          id={dropdownLabelId}
          className="dropdown-label text-body font-semi-bold"
        >
          {label}
          {required && (
            <span
              className="input-status text-sm font-light soft pl-2"
              aria-hidden="true"
            >
              Required
            </span>
          )}
        </label>
      </div>
      <div className="dropdown">
        {enableSearch ? (
          <div
            className="wrapper"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-owns={dropdownListId}
            aria-controls={dropdownListId}
          >
            <button
              id={dropdownTriggerId}
              className="dropdown-summary interactive"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={dropdownListId}
              aria-labelledby={`${dropdownLabelId} selected-value-${dropdownTriggerId}`}
              onClick={toggleDropdown}
              type="button"
              disabled={disabled}
              aria-describedby={error ? dropdownErrorId : dropdownHelperId}
            >
              <div className="dropdown-summary-content">
                <svg
                  className="dropdown-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  id={`selected-value-${dropdownTriggerId}`}
                  className="text-body"
                >
                  {selectedValue || placeholder}
                </span>
                <svg
                  className="dropdown-icon chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        ) : (
          // When search is disabled, the button becomes the combobox
          <div
            className="wrapper"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-owns={dropdownListId}
            aria-controls={dropdownListId}
          >
            <button
              id={dropdownTriggerId}
              className="dropdown-summary interactive"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-controls={dropdownListId}
              aria-labelledby={dropdownLabelId}
              aria-autocomplete="none"
              aria-describedby={error ? dropdownErrorId : dropdownHelperId}
              onClick={toggleDropdown}
              type="button"
              disabled={disabled}
              aria-required={required}
              aria-invalid={error}
            >
              <div className="dropdown-summary-content">
                <svg
                  className="dropdown-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  id={`selected-value-${dropdownTriggerId}`}
                  className="text-body"
                >
                  {selectedValue || placeholder}
                </span>
                <svg
                  className="dropdown-icon chevron"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        )}
        <div
          className="dropdown-content-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          {enableSearch && (
            <div className="dropdown-search-wrapper wrapper">
              <div className="search-input-wrapper">
                <svg
                  className="dropdown-search-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  id={dropdownSearchId}
                  className="dropdown-search-input text-body placeholder:soft"
                  placeholder={searchPlaceholder}
                  type="search"
                  aria-activedescendant={activeDescendant}
                  autoComplete="off"
                  value={state.searchValue}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <ul
            id={dropdownListId}
            className="dropdown-list"
            role="listbox"
            aria-labelledby={dropdownLabelId}
            tabIndex={-1}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  role="option"
                  id={`${dropdownListId}-option-${index + 1}`}
                  className={`text-body interactive ${
                    activeDescendant === `${dropdownListId}-option-${index + 1}`
                      ? "option-focused"
                      : ""
                  }`}
                  aria-selected={selectedValue === option}
                  onClick={(e) => handleOptionClick(option, e)}
                  tabIndex={-1} // Make focusable but not in tab order
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOptionClick(
                        option,
                        e as unknown as React.MouseEvent
                      );
                    }
                  }}
                >
                  {option}
                </li>
              ))
            ) : (
              <li
                className="text-body no-results px-4 py-2"
                aria-disabled="true"
              >
                <div role="status" aria-live="polite">
                  {noOptionsMessage}
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="dropdown-helper-wrapper">
        <p className="dropdown-helper text-sm soft pl-2" id={dropdownHelperId}>
          {helperText}
        </p>
        {error && (
          <div className="skin-error dropdown-error-content">
            <svg
              className="dropdown-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p
              className="text-sm font-medium"
              id={dropdownErrorId}
              role="alert"
            >
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
