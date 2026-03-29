import React, { useState, useRef, useEffect } from "react";

function CustomSelect({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="custom-select" ref={ref}>
      {label && <label className="custom-select-label">{label}</label>}
      <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected?.label || ""}</span>
        <span className={`custom-select-arrow ${isOpen ? "open" : ""}`}>▾</span>
      </div>
      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${value === option.value ? "selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.color && (
                <span
                  className="option-dot"
                  style={{ backgroundColor: option.color }}
                ></span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
