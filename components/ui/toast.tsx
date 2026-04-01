"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastId = 0;

/**
 * Hook to show toast notifications
 * Usage: const { addToast } = useToast()
 *        addToast("Success!", "success")
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type: ToastType = "info",
    duration = 5000,
  ) => {
    const id = `toast-${++toastId}`;
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

/**
 * Toast Container Component
 * Place this in your layout to show toasts globally
 */
export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/**
 * Individual Toast Component
 */
function Toast({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const bgClasses = {
    success: "bg-green-900/90 text-green-100 border border-green-700",
    error: "bg-red-900/90 text-red-100 border border-red-700",
    info: "bg-blue-900/90 text-blue-100 border border-blue-700",
    warning: "bg-amber-900/90 text-amber-100 border border-amber-700",
  };

  const iconClasses = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 ${bgClasses[toast.type]}`}
      role="alert">
      <span className="text-lg font-bold">{iconClasses[toast.type]}</span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto text-lg hover:opacity-70 transition-opacity">
        ✕
      </button>
    </div>
  );
}
