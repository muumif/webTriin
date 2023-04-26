import { toastStore, type ToastSettings } from "@skeletonlabs/skeleton";

export function showToast(message: string = "Default toast", background: string = "variant-filled-primary") {
      const t: ToastSettings = {
            message: message,
            background: background,
            timeout: 2500
      };
      
      toastStore.trigger(t);
}