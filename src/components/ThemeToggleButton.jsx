/* eslint-disable react/prop-types */
const ThemeToggleButton = ({handleThemeToggle, theme, systemTheme}) => {
  return (
    <>
      <div className="w-full flex gap-2 items-center bg-base-100 dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-xs lg:text-base font-semibold bg-primary/5 lg:bg-transparent dark:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/15 px-4 py-2 lg:px-10 lg:py-5" onClick={handleThemeToggle}>
          {systemTheme == true ? <p className="w-full flex gap-2 items-center"><i className="bi bi-lock-fill"></i> Theme Locked</p> : systemTheme == false && theme == "dark" ? <p className="w-fit flex gap-2 items-center"><i className="bi bi-brightness-high lg:text-2xl"></i> Light <span className="hidden lg:flex">Mode</span></p> : systemTheme == false && theme == "light" && <p className="w-full flex gap-2 items-center"><i className="bi bi-moon lg:text-2xl"></i> Dark <span className="hidden lg:flex">Mode</span></p>}
      </div>
    </>
  )
}

export default ThemeToggleButton