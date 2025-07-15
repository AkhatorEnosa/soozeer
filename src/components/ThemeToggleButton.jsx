import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Tooltip from '@mui/material/Tooltip';

/* eslint-disable react/prop-types */
const ThemeToggleButton = ({currentTheme, icon, variant}) => {
  const { themeLabel, themeHandler } = useContext(ThemeContext);

  // determine if themeLabel has system in it
  const isSystemTheme = themeLabel?.includes('system') || null;
  const theme = isSystemTheme ? themeLabel.split('-')[0] : themeLabel;

  return (
    <Tooltip title={currentTheme} arrow placement="top">
      <button 
        className={`flex justify-center items-center ${currentTheme === theme && "bg-primary/5 dark:bg-primary/15 font-semibold"} hover:bg-primary/5 dark:hover:bg-primary/15 px-5 py-2 lg:py-5 cursor-pointer`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
        aria-label={`${currentTheme} mode`}
        onClick={() => themeHandler(currentTheme)}>
          <i className={`bi ${icon} ${currentTheme === theme && variant}`}></i>
      </button>
    </Tooltip>
  )
}

export default ThemeToggleButton