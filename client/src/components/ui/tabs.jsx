import React from "react";

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <section className="tabs-section">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab ${activeTab === tab.value ? "active" : ""}`}
          onClick={() => onChange?.(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </section>
  );
}