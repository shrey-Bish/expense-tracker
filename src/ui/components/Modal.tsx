// src/ui/components/Modal.tsx
import React, { useEffect, useRef } from "react";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">{title}</div>
            <div className="modal-subtitle">Fill details and save. Validation is applied automatically.</div>
          </div>

          <button ref={closeBtnRef} className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>

      <button className="modal-click-catcher" onClick={onClose} aria-label="Close modal overlay" />
    </div>
  );
}