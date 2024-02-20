'use client';

import { ThemeContext } from '@/context/ThemeContext';
import { useContext, useEffect, useState } from 'react';

const ThemeProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  //in case we run into trouble with localStorage while using other browsers
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return <div className={theme}>{children}</div>;
  }
};

export default ThemeProvider;
