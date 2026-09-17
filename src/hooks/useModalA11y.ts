"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Standard dialog keyboard behavior, shared by InquiryModal and SignupPopup:
// - Escape closes.
// - Tab/Shift+Tab cycles within the dialog instead of escaping to the page
//   behind the overlay.
// - The first focusable element gets focus when the dialog opens.
// - Focus returns to whatever triggered the dialog when it closes.
export function useModalA11y(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;

    const container = containerRef.current;
    const focusables = container
      ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      : [];
    // The close button is usually first in DOM order (top-right of the
    // dialog) — autofocusing it means a reflexive Enter/Space dismisses the
    // dialog instead of engaging the first real field. Prefer the first
    // focusable element that isn't the close button; fall back to it only
    // if nothing else is focusable.
    const initialFocus =
      focusables.find((el) => !el.hasAttribute("data-modal-close")) ?? focusables[0];
    initialFocus?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !container) return;
      const items = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open, onClose]);

  return containerRef;
}
