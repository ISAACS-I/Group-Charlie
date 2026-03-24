import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  buttonText = "Search",
  onSubmit,
}) {
  return (
    <div className="search-box">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button onClick={onSubmit}>{buttonText}</button>
    </div>
  );
}