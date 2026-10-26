"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const stack: symbol[] = [];
let originalOverflow = "";

export function useModalA11y(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const token = Symbol("dialog");
    const trigger = document.activeElement;
    const container = containerRef.current;
    const items = () => container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden") : [];
    if (!stack.length) { originalOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; }
    stack.push(token);
    const first = items().find(el => !el.hasAttribute("data-modal-close")) ?? items()[0];
    if (!first && container) container.tabIndex = -1;
    (first ?? container)?.focus();
    const isTop = () => stack[stack.length - 1] === token;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTop()) return;
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== "Tab") return;
      const controls = items(), first = controls[0], last = controls[controls.length - 1];
      if (!controls.length) { event.preventDefault(); container?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !container?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !container?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    const keepFocus = (event: FocusEvent) => {
      if (isTop() && event.target instanceof Node && !container?.contains(event.target)) (items()[0] ?? container)?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", keepFocus);
    return () => {
      const index = stack.indexOf(token);
      if (index !== -1) stack.splice(index, 1);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", keepFocus);
      if (!stack.length) document.body.style.overflow = originalOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  return containerRef;
}
