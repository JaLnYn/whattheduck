import React, { useState, useRef, useEffect } from 'react';

function AutoGrowingTextarea({ value, onChange, placeholder }) {
  const [numRows, setNumRows] = useState(1);
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const computedStyle = window.getComputedStyle(textareaRef.current);
      const lineHeight = parseInt(computedStyle.lineHeight);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingBottom = parseInt(computedStyle.paddingBottom);
      const contentHeight = textareaRef.current.scrollHeight - paddingTop - paddingBottom;
      const newNumRows = Math.ceil(contentHeight / lineHeight);
      setNumRows(newNumRows > 1 ? newNumRows : 1);
      // Ensure minimum height of 20px
      textareaRef.current.style.height = `${Math.max(contentHeight, 20)}px`;
    }
  };

  const handleChange = (event) => {
    onChange(event);
    adjustTextareaHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={numRows}
      style={{ resize: 'none', overflowY: 'hidden', height: '20px' }} // Set initial height to 20px
    />
  );
}

export default AutoGrowingTextarea;
