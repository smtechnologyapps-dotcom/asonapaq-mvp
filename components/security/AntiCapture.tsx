"use client";

import { useEffect } from "react";

/**
 * OMNEX Security Layer â€” Anti-Captura de Pantalla
 * - Bloquea menÃº contextual, copia, corte y arrastre
 * - Detecta tecla Impr Pant y atajos de captura
 * - Ofusca la vista al perder foco de la ventana
 */
export function AntiCapture() {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const isPrintScreen = e.key === "PrintScreen" || e.keyCode === 44;
      const isMacShot = e.metaKey && e.shiftKey && ["3", "4", "5"].includes(k);
      const isDevtools =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k));
      const isSave = (e.ctrlKey || e.metaKey) && ["s", "u", "p"].includes(k);

      if (isPrintScreen || isMacShot || isDevtools || isSave) {
        e.preventDefault();
        navigator.clipboard?.writeText("").catch(() => {});
        document.body.classList.add("omnex-obscured");
        setTimeout(() => document.body.classList.remove("omnex-obscured"), 1500);
      }
    };

    const onBlur = () => document.body.classList.add("omnex-obscured");
    const onFocus = () => document.body.classList.remove("omnex-obscured");

    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}


