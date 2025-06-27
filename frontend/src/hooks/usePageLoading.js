import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loading screen when route changes
    setIsLoading(true);

    // Hide loading screen after a minimum time (to prevent flickering)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Minimum loading time of 500ms

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return isLoading;
};

export default usePageLoading; 