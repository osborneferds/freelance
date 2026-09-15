export type ToastKind = "success" | "error" | "info";
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn([...toasts]));
}

export const toast = {
  show(kind: ToastKind, message: string) {
    const id = nextId++;
    toasts = [...toasts, { id, kind, message }];
    emit();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  success(message: string) {
    toast.show("success", message);
  },
  error(message: string) {
    toast.show("error", message);
  },
  info(message: string) {
    toast.show("info", message);
  },
  dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn([...toasts]);
    return () => listeners.delete(fn);
  },
};
