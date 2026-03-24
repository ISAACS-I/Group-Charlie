import React from "react";
import SearchBar from "./searchBar";

export default function FilterBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filters = [],
}) {
  return (
    <section className="search-section">
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />

      <div className="filter-row">
        {filters.map((filter) => (
          <select
            key={filter.name}
            value={filter.value}
            onChange={(e) => filter.onChange?.(e.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </section>
  );
}