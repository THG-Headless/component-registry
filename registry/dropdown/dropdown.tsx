import React, { useEffect } from "react";
import type { DropdownProps } from "./types";
import { useDropdown } from "./useDropdown";
import FieldProvider from "../form/FieldProvider";
import ErrorBoundary from "../utils/ErrorBoundary";

const Dropdown: React.FC<DropdownProps> = (props) => {
  const {
    label = "Label",
    options = [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
      "Option 6",
      "Option 7",
      "Option 8",
      "Option 9",
      "Option 10",
    ],
    placeholder = "Placeholder Text",
    error = false,
    errorMessage = "Error Message",
    disabled = false,
    enableSearch = true,
    required = true,
    requiredText = "(Required)",
    optionalText = "(Optional)",
    noOptionsMessage = "No options available",
    searchPlaceholder = "Search...",
    helperText = "Helper text",
    name,
    className = "",
    value,
    onChange,
    validator,
  } = props;

  return (
    <ErrorBoundary
      fallback={
        <div className="dropdown-error-fallback" role="alert">
          <p>There was an error rendering this dropdown component.</p>
        </div>
      }
    >
      <FieldProvider name={name} initialValue={value} validator={validator}>
        {(field) => {
          // If validator.isRequired() returns true, override the required prop
          const isRequired = field.isRequired || required;

          const propsWithDefaults = {
            ...props,
            options: props.options || options,
            initialValue: value || field.value,
          };

          const {
            state,
            handlers,
            refs,
            dropdownIds,
            filteredOptions,
            setSelectedValue,
          } = useDropdown(propsWithDefaults);

          const { isOpen, selectedValue, activeDescendant } = state;

          const {
            toggleDropdown,
            handleOptionClick,
            handleSearchChange,
            setOnClickOutside,
          } = handlers;

          const { dropdownRef, searchInputRef } = refs;

          const {
            dropdownTriggerId,
            dropdownLabelId,
            dropdownListId,
            dropdownSearchId,
            dropdownHelperId,
            dropdownErrorId,
          } = dropdownIds;

          // Only update from external props, not during user selection
          useEffect(() => {
            if (value !== undefined) {
              setSelectedValue(value);
            }
          }, [value, setSelectedValue]);

          // Only update from field value on initial mount or when field value changes
          useEffect(() => {
            if (field.value && field.value !== value) {
              setSelectedValue(field.value);
            }
          }, [field.value, value, setSelectedValue]);

          useEffect(() => {
            if (selectedValue) {
              field.setValue(selectedValue);
            }
          }, [field, selectedValue]);
          const handleToggleDropdown = (e: React.MouseEvent) => {
            const isClosing = toggleDropdown(e);

            if (isClosing) {
              field.setTouched(true);
            }
          };

          useEffect(() => {
            setOnClickOutside((wasOpen) => {
              if (wasOpen) {
                field.setTouched(true);
              }
            });
          }, [field, setOnClickOutside]);

          const handleOptionSelection = (
            option: string,
            e: React.MouseEvent
          ) => {
            handleOptionClick(option, e);

            field.setValue(option);

            if (onChange) {
              onChange(option);
            }
          };

          const fieldIsInvalid = error || !!field.error;
          const showError =
            fieldIsInvalid && (error || field.touched || field.isSubmitting);
          const displayErrorMessage = field.error || errorMessage;

          return (
            <div
              ref={dropdownRef}
              className={`skin-form dropdown-wrapper group wrapper ${
                isOpen ? "dropdown-open" : ""
              } ${showError ? "dropdown-error" : ""} ${className}`}
            >
              <label
                htmlFor={enableSearch ? dropdownSearchId : dropdownTriggerId}
                id={dropdownLabelId}
                className="dropdown-label text-body font-semi-bold"
              >
                {label}
                <span
                  className="input-status text-sm font-light soft ml-2"
                  aria-hidden="true"
                >
                  {isRequired ? requiredText : optionalText}
                </span>
              </label>
              <div className="dropdown">
                {enableSearch ? (
                  <div
                    className="wrapper"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-owns={dropdownListId}
                    aria-controls={dropdownListId}
                    aria-labelledby={dropdownLabelId}
                  >
                    <button
                      id={dropdownTriggerId}
                      className="dropdown-summary interactive"
                      aria-haspopup="listbox"
                      aria-expanded={isOpen}
                      aria-controls={dropdownListId}
                      aria-labelledby={`${dropdownLabelId} selected-value-${dropdownTriggerId}`}
                      aria-activedescendant={activeDescendant}
                      onClick={handleToggleDropdown}
                      type="button"
                      disabled={disabled}
                      aria-describedby={
                        showError ? dropdownErrorId : dropdownHelperId
                      }
                      aria-required={isRequired}
                      aria-invalid={showError}
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
                  <div
                    className="wrapper"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-owns={dropdownListId}
                    aria-controls={dropdownListId}
                    aria-labelledby={dropdownLabelId}
                  >
                    <button
                      id={dropdownTriggerId}
                      className="dropdown-summary interactive"
                      aria-haspopup="listbox"
                      aria-expanded={isOpen}
                      aria-controls={dropdownListId}
                      aria-labelledby={dropdownLabelId}
                      aria-autocomplete="none"
                      aria-activedescendant={activeDescendant}
                      aria-describedby={
                        showError ? dropdownErrorId : dropdownHelperId
                      }
                      onClick={handleToggleDropdown}
                      type="button"
                      disabled={disabled}
                      aria-required={isRequired}
                      aria-invalid={showError}
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
                    aria-multiselectable="false"
                  >
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                        <li
                          key={index}
                          role="option"
                          id={`${dropdownListId}-option-${index + 1}`}
                          className={`text-body interactive ${
                            activeDescendant ===
                            `${dropdownListId}-option-${index + 1}`
                              ? "option-focused"
                              : ""
                          }`}
                          aria-selected={selectedValue === option}
                          onClick={(e) => handleOptionSelection(option, e)}
                          tabIndex={-1} // Make focusable but not in tab order
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleOptionSelection(
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
                        role="option"
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
                <p
                  className="dropdown-helper text-sm soft"
                  id={dropdownHelperId}
                >
                  {helperText}
                </p>
                {showError && (
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
                      aria-live="assertive"
                    >
                      {displayErrorMessage}
                    </p>
                  </div>
                )}
              </div>

              {name && (
                <input
                  type="hidden"
                  name={name}
                  value={selectedValue || ""}
                  required={isRequired}
                />
              )}
            </div>
          );
        }}
      </FieldProvider>
    </ErrorBoundary>
  );
};

export default Dropdown;
