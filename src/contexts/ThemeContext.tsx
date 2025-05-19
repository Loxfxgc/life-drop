import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the ThemeContext for direct use
export { ThemeContext }; 