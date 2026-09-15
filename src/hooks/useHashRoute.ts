import { useEffect, useState } from "react";

function current() {
  return location.hash.replace(/^#/, "") || "/";
}

export function useHashRoute() {
  const [route, setRoute] = useState(current);

  useEffect(() => {
    const onChange = () => setRoute(current());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(path: string) {
  location.hash = path;
}
