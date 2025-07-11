/* eslint-disable react/prop-types */
const ThemeToggleButton = ({handleThemeToggle, theme}) => {
  return (
    <button 
      className="w-full flex gap-2 items-center bg-base-100 dark:bg-primary/5 rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-xs lg:text-base font-semibold dark:border-neutral-500 hover:bg-primary/5 dark:hover:bg-primary/15 px-4 py-2 lg:px-10 lg:py-5"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
         handleThemeToggle();
        }
      }}
      aria-label={`${theme} mode`}
      onClick={handleThemeToggle}>
        {/* {theme == "dark" ? <p className="w-fit flex gap-2 items-center"><i className="bi bi-brightness-high lg:text-2xl"></i><span className="hidden lg:flex">Light Mode</span></p> : <p className="w-full flex gap-2 items-center"><i className="bi bi-moon lg:text-2xl"></i><span className="hidden lg:flex"> Dark Mode</span></p>} */}

        <span className={"w-fit flex gap-2 items-center"}><i className={`bi ${theme === "dark" ? "bi-brightness-high" : "bi-moon"} lg:text-2xl`}></i> {theme === "dark" ? "Go Light" : "Go Dark"}</span>
    </button>
  )
}

export default ThemeToggleButton

// w-full flex gap-2 items-center bg-base-100 dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-base font-semibold dark:bg-primary/5 rounded-full/40 hover:bg-primary/5 dark:hover:bg-primary/15 px-10 py-5