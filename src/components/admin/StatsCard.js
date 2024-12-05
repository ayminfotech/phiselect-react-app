import React from "react";
import "./StatsCard.css";

const StatsCard = ({ title, count }) => {
  return (
    <div className="stats-card">
      <p className="stats-title">{title}</p>
      <h2 className="stats-count">{count}</h2>
    </div>
  );
};

export default StatsCard;