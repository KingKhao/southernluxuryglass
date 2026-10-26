"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Progressive enhancement: content is visible before JS and stays visible if motion is disabled.
export default function StorefrontMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const animation = entry.target.animate([
          { opacity: .65, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 450, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll("[data-storefront-reveal]").forEach(element => observer.observe(element));
    const cancel = () => { if (preference.matches) {observer.disconnect(); animations.forEach(animation => animation.cancel());} };
    preference.addEventListener("change", cancel);
    return () => {observer.disconnect();animations.forEach(animation=>animation.cancel());preference.removeEventListener("change",cancel);};
  }, [pathname]);
  return null;
}
