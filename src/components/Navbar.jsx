import { Link} from "react-router-dom"
import { useContext, useEffect } from "react"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'
import {  useSelector } from "react-redux"
import useGetUser from "../hooks/useGetUser"
import ThemeToggleButton from "./ThemeToggleButton"
import LogoutModal from "./LogoutModal"
import { AppContext } from "../context/AppContext"

const Navbar = () => {
  const {loggedUser, isLoading, exiting} = useSelector((state) => state.app)
    const { triggerLogout, setTriggerLogout, showSubMenu, setShowSubMenu} = useContext(AppContext)
  const body = document.body
  useGetUser();

  useEffect(() => {
    if(triggerLogout || showSubMenu) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [triggerLogout, showSubMenu])

    // useEffect(() => {
    //       dispatch(getUser())
    //  }, [])

  // if(loggedUser) {
    return (
      <header className='lg:hidden relative top-0 w-full flex justify-between items-center dark:bg-black px-2 md:px-10 lg:px-20 py-2 md:py-3 backdrop-blur-lg z-[120]'>
          <div className="flex h-full justify-center items-center">
            <Link to='/' className="lg:py-5 cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-32 md:w-36 lg:w-44"/>  </Link>
            <Link to='/' className="lg:py-5 cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-32 md:w-36 lg:w-44"/> </Link>
          </div>

          <div className="flex gap-2 md:gap-5">
            <ul className={`flex gap-5 justify-center items-center text-sm font-medium ${!loggedUser?.u_id ? "lg:hidden" : ""}`}>

              {isLoading && loggedUser == null ? <span className="loading loading-spinner loading-sm text-primary"></span> : !isLoading && loggedUser == null ? <>
                    <Link to={'/login'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">Login</li></Link>
                    <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">Register</li></Link>
                </> :
                <div className="relative flex flex-col gap-5 justify-center items-center text-neutral dark:text-bg" onClick={()=> setShowSubMenu(!showSubMenu)}>
                  <div className="w-full flex gap-2 items-center md:px-2 md:py-1 rounded-full bg-primary/5 border-[1px] dark:border-neutral-700 cursor-pointer z-50">
                      <img src={loggedUser.u_img} alt="profile_pic" className="w-8 h-8 border-[1px] border-black/30 rounded-full"/>
                      <li className="hidden md:flex tracking-tight">{loggedUser.name}</li>
                  </div>
                  
                  {showSubMenu && <div className="fixed left-0 top-0 w-screen h-screen cursor-default" onClick={()=> setShowSubMenu(false)}></div>}
                  <div className={showSubMenu ? "absolute opacity-100 w-fit flex flex-col gap-2 top-11 right-0 transition-all duration-200 cursor-pointer" : "absolute w-fit flex flex-col gap-2 items-center opacity-0 -top-64 right-0 transition-all duration-200"}>


                    <div className="w-[150px] grid grid-cols-3 items-center justify-center bg-bg-muted dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-xs font-semibold dark:border-primary/40 bg-primary/5 overflow-hidden"
                      role="menuitem"
                      tabIndex={showSubMenu ? 0 : -1}
                    >
                      <ThemeToggleButton
                        currentTheme={"light"}
                        icon={"bi-brightness-high-fill"}
                        variant={"text-orange-500 dark:text-orange-500"}
                      />
                      <ThemeToggleButton
                        currentTheme={"dark"}
                        icon={"bi-moon-fill"}
                        variant={"text-yellow-200 dark:text-yellow-200"}
                      />
                      <ThemeToggleButton
                        currentTheme={"system"}
                        icon={"bi-cpu-fill"}
                        variant={"text-blue-500 dark:text-blue-500"}
                      />
                    </div>
                    <p className="w-full flex gap-2 items-center justify-center bg-bg-muted dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-xs font-semibold dark:border-primary/40 bg-primary/5 px-4 py-2 cursor-pointer" onClick={() => setTriggerLogout(true)}>
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </p>
                  </div>
              </div>}
            </ul>
          </div>
        {
            triggerLogout && loggedUser?.u_id && 
            <LogoutModal exiting={exiting} />
        }
      </header>
    )
  // }
}

export default Navbar