import React from "react";

export default function StatCard({ value, label, trend, trendClass = "" }) {
  return (
    <div className="stat-card">
      <h3>{value}</h3>
      <p>{label}</p>
      {trend && <span className={`trend ${trendClass}`}>{trend}</span>}
    </div>
  );
}