import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/* eslint-disable react/prop-types */
const ThemeToggleButton = ({currentTheme, icon, variant}) => {
  const { theme, themeHandler } = useContext(ThemeContext);

  return (
    <button 
      className={`flex justify-center items-center ${currentTheme === theme && "bg-primary/5 dark:bg-primary/15 font-semibold"} hover:bg-primary/5 dark:hover:bg-primary/15 px-5 py-2 lg:py-5`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      }}
      aria-label={`${currentTheme} mode`}
      onClick={() => themeHandler(currentTheme)}>
        <i className={`bi ${icon} ${currentTheme === theme && variant}`}></i>
    </button>
  )
}

export default ThemeToggleButton