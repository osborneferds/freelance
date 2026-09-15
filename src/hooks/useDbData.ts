import { useEffect, useRef, useState } from "react";
import { subscribe } from "../db/database";

/**
 * Loads data via `loader` and re-loads whenever the database changes.
 * Pass `deps` for loaders that depend on a changing argument (e.g. an id).
 */
export function useDbData<T>(loader: () => Promise<T>, deps: unknown[] = []): T | null {
  const [data, setData] = useState<T | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let alive = true;
    const run = () =>
      loaderRef.current().then((d) => {
        if (alive) setData(d);
      });
    run();
    const unsub = subscribe(run);
    return () => {
      alive = false;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}
