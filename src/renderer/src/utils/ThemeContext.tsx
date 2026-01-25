import React, { createContext, useState, useContext, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

// 1. Define Props Interface explicitly
interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: "dark",
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// 2. Use the props interface instead of relying on React.FC default
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>("dark");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};