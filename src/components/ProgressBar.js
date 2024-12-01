import React from "react";

function ProgressBar({ progress }) {
  return (
    <div style={{ border: "1px solid black", width: "100%", margin: "10px 0" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "20px",
          background: "green",
        }}
      ></div>
    </div>
  );
}

export default ProgressBar;
