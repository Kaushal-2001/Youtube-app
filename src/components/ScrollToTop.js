import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls window to top on every route change.
 * Listens to both pathname and search so that navigating
 * between two watch URLs (/watch?v=A → /watch?v=B) also resets.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
