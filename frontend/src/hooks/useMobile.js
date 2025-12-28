import { useState, useEffect } from "react";


export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

    setIsMobile(mql.matches);

    const handler = (e) => setIsMobile(e.matches);

    mql.addEventListener("change", handler);


    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
};