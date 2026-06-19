import { useEffect, useRef } from "react";

// Re-runs `refetch` whenever the tab/window regains focus, so data another
// role changed elsewhere shows up without a manual reload. Subscribes once and
// always calls the latest callback (kept in a ref).
export default function useRefetchOnFocus(refetch) {
  const ref = useRef(refetch);
  ref.current = refetch;

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") ref.current?.();
    };
    window.addEventListener("focus", handler);
    document.addEventListener("visibilitychange", handler);
    return () => {
      window.removeEventListener("focus", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);
}
