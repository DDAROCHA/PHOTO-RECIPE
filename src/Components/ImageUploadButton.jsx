import React from "react";
import { FaCamera } from "react-icons/fa";
import "./ImageUploadButton.css";

export function ImageUploadButton({ onChange }) {
  return (
    <label className="select-image-btn">
      <FaCamera className="camera-icon" />
      <span>Select Image</span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={onChange}
      />
    </label>
  );
}
