"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function CityDialog({
  open,
  onClose,
  label,
  side,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side: "directory" | "dossier";
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = dialog.current!;
    if (open && !element.open) {
      opener.current = document.activeElement as HTMLElement;
      element.showModal();
      element
        .querySelector<HTMLButtonElement>("button")
        ?.focus({ preventScroll: true });
    } else if (!open && element.open) {
      element.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`city-dialog city-${side}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not([disabled]),a[href],input:not([disabled]),[tabindex='0']",
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="city-dialog-header">
        <span>{label}</span>
        <button
          type="button"
          onClick={onClose}
          className="city-icon"
          aria-label={`Close ${label}`}
        >
          <X size={19} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
