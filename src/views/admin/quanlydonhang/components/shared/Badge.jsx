// components/shared/Badge.jsx
import React from "react";
import { C } from "../../constants";

export default function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      background: C.red,
      color: "#fff",
      fontSize: 10,
      fontWeight: 800,
      padding: "0 4px"
    }}>
      {count > 99 ? "99+" : count}
    </span>
  );
}