import { useEffect, useRef, useState } from "react";

export const useComponentVisible = (initialVisualState: boolean) => {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialVisualState);

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: Event) => {
    if (
      event.target instanceof Node &&
      ref.current &&
      !ref.current.contains(event.target)
    ) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
};
