import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useNotifications from "../hooks/useNotifications"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'
import { logOut } from "../features/appSlice"
import { getMessages } from "../features/messageSlice"
import ThemeToggleButton from "./ThemeToggleButton"
// import supabase from "../config/supabaseClient.config"

/* eslint-disable react/prop-types */
const SideBar = ({uid, page, paramsId, toggleSearchBar}) => {
  const body = document.body
  const [triggerLogout, setTriggerLogout] = useState(false)
  const [showSubMenu, setShowSubMenu] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? localStorage.getItem("theme") : "light")
  const [systemThemeIsDark, setSystemThemeIsDark] = useState(false)

  const {loggedUser, notifications, exiting} = useSelector((state) => state.app)
  const { messages } = useSelector((state) => state.message)
  const {mutate} = useNotifications()
  const dispatch = useDispatch()

  // handle theme
  const htmlClassList = document.querySelector('html').classList
  const checkForDark = window.matchMedia(`(prefers-color-scheme: dark)`)

  useEffect(() => {
    if(('theme' in localStorage)) {
      setTheme(theme)
      htmlClassList.add(theme)
    }
    setSystemThemeIsDark(checkForDark.matches)

    if(systemThemeIsDark == true) {
      setTheme("dark")
      localStorage.setItem("theme", "dark")
      htmlClassList.add("dark")

      if(htmlClassList.contains("light")) {
          htmlClassList.remove("light")
      }
    }

    checkForDark.addEventListener('change', ({ matches }) => {
      if(matches == true){
        setTheme("dark")
        localStorage.setItem("theme", "dark")
        htmlClassList.add("dark")

        if(htmlClassList.contains("light")) {
            htmlClassList.remove("light")
        }
      }
    })
    
  }, [theme, htmlClassList, systemThemeIsDark, checkForDark])

  const handleThemeToggle = () => {
    if(systemThemeIsDark == false) {
      if(theme == "light") {
        localStorage.setItem("theme", "dark")
        setTheme("dark")
        htmlClassList.add("dark")
        if(htmlClassList.contains("light")) {
          htmlClassList.remove("light")
        }
      } else {
        localStorage.setItem("theme", "light")
        setTheme("light")
        htmlClassList.add("light")
        if(htmlClassList.contains("dark")) {
          htmlClassList.remove("dark")
        }
      }
    }
  }
  
  useEffect(() => {
    if(triggerLogout) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [triggerLogout])

  const getNotifications = (uid) => {
        if(loggedUser?.u_id !== null && uid !== undefined) {
          mutate({uid})
        }
      }
  
  const filteredNotifs = useMemo(() => {
    if(loggedUser?.u_id != null) {
      const allPending = notifications?.filter(notifs => (notifs.creator_id !== loggedUser?.u_id) && (notifs.viewed === false))
      // console.log(allPending)
      return allPending
    }
  }, [loggedUser?.u_id, notifications])
  
  const filteredMessages = useMemo(() => {
    if(loggedUser?.u_id != null) {
      const allPending = messages?.filter(message => (message.receiver_id == loggedUser?.u_id) && (message.viewed === false))
      // console.log(allPending)
      return allPending
    }
  }, [loggedUser?.u_id, messages])

  useEffect(() => {
    getNotifications(loggedUser?.u_id)
    dispatch(getMessages(loggedUser?.u_id))

      // subscribe to changes 
      // supabase
      // .channel('schema-db-changes')
      // .on(
      //     'postgres_changes',
      //     {
      //     event: '*',
      //     schema: 'public',
      //     },
      //     () => {
      //         // console.log(payload)
      //       getNotifications(loggedUser?.u_id)
      //       dispatch(getMessages(loggedUser?.u_id))
      //     }
      // )
      // .subscribe()
  }, [loggedUser])

  let notificationCount;
  let messageCount;

  if(filteredNotifs?.length > 0) {
    notificationCount = <span className="absolute -top-1 -right-2 bg-red-500 flex text-white w-3 h-3 p-2 text-sm justify-center items-center border-2 border-base-100 rounded-full">{filteredNotifs?.length}</span>
  }

  if(filteredMessages?.length > 0) {
    const groupMessages = () => {
      const grouped = Object.groupBy(filteredMessages, ({ sender_id }) => sender_id)
      let newMessages = [];
      Object.keys(grouped).forEach(key => {
        newMessages = [...newMessages, grouped[key][0]]
      });
      return newMessages
    }
    messageCount = <span className="absolute -top-1 -right-2 bg-red-500 flex text-white w-3 h-3 p-2 text-sm justify-center items-center border-2 border-base-100 rounded-full">{groupMessages().length}</span>
  }

  const handleLogout = () => {
    dispatch(logOut())
    setTriggerLogout(false)
    setShowSubMenu(false)
  }

  return (
    // <div className={`hidden h-fit lg:flex col-span-2 sticky left-0 top-0 text-lg md:text-xl rounded-md`}>
      <>
        { uid ?
          <div className="w-full hidden h-screen sticky top-0 lg:flex col-span-2 text-lg md:text-xl rounded-md flex-col justify-between py-4 z-50 font-base">
            <div className="h-fit">
              <div className="flex py-4 mb-4 px-10">
                <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-32 md:w-36 lg:w-44"/>  </Link>
                <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-32 md:w-36 lg:w-44"/> </Link>
              </div>

              <Link to={'/'} className="w-full text-black dark:text-[#CBC9C9] rounded-full">
                  <p className={page === 'home' ? "text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 dark:hover:bg-primary/15 rounded-full flex gap-4 px-10 py-5  cursor-pointer"}><i className={page === 'home' ? "bi bi-house-door-fill" : "bi bi-house-door"}></i> Home</p>
              </Link>
              <Link to={`/${uid}`} className="w-full text-black dark:text-[#CBC9C9] rounded-full">
                  <p className={page === 'profile' && paramsId === uid ? "text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer dark:text-[#CBC9C9] rounded-full"}><i className={page === 'profile' && paramsId === uid ? "bi bi-person-fill" : "bi bi-person"}></i> Profile</p>
              </Link>
              <Link to={`/messages/conversations`} className="w-full text-black dark:text-[#CBC9C9] rounded-full">
                  {page === 'messages' ? <p className="text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic"><i className="bi bi-envelope-fill"></i> Messages</p> : 
                  <p className="hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic dark:text-[#CBC9C9] rounded-full">
                      <span className="flex relative"><i className="bi bi-envelope"></i> {messageCount} </span>
                      Messages</p>}
              </Link>
              <Link to={`/notifications`} className="w-full text-black dark:text-[#CBC9C9] rounded-full">
                  {page === 'notification' ? <p className="text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic"><i className="bi bi-bell-fill"></i> Notifications</p> : 
                  <p className="hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic dark:text-[#CBC9C9] rounded-full">
                      <span className="flex relative"><i className="bi bi-bell"></i> {notificationCount} </span>
                      Notifications</p>}
              </Link>
              <p className={page === 'search' ?  "text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic" : "hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic dark:text-[#CBC9C9] rounded-full"} onClick={toggleSearchBar}><i className={page === 'search' ? "bi bi-binoculars-fill" : "bi bi-binoculars"}></i> Search</p>
            </div>

            <div className="relative flex flex-col px-6 py-4 gap-5 justify-center text-base text-black dark:text-[#CBC9C9] rounded-full hover:bg-primary/5 cursor-pointer z-50" onClick={()=> setShowSubMenu(!showSubMenu)}>

              {showSubMenu && <div className="fixed left-0 top-0 w-full h-full cursor-default" onClick={()=> setShowSubMenu(false)}></div>}

              <div className={showSubMenu ? "absolute opacity-100 w-full flex flex-col gap-2 items-center -top-[12rem] left-0 text-base font-semibold py-5 px-3 transition-all duration-200" : "absolute w-full flex flex-col gap-2 items-center opacity -top-[12rem] -left-[100vw]  px-3 py-5 transition-all duration-200"}>
                <p className="w-full flex gap-2 items-center bg-base-100 dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-base font-semibold dark:bg-primary/5  dark:border-neutral-500 rounded-full/40 hover:bg-primary/5 dark:hover:bg-primary/15 px-10 py-5" onClick={() => setTriggerLogout(true)}>Logout</p>
                <ThemeToggleButton handleThemeToggle={handleThemeToggle} theme={theme} systemTheme={systemThemeIsDark}/>
              </div>

              <div className="flex gap-2 items-center justify-between" >
                <div className="flex items-center gap-2">
                  <img src={loggedUser.u_img} alt="profile_pic" className="w-6 h-6 md:w-10 md:h-10 border-[1px] border-black/30 rounded-full"/>
                  <li className="hidden md:flex tracking-tight">{loggedUser.name}</li>
                </div>
                <i className="bi bi-three-dots"></i>
              </div>
            </div>

          </div> :
          <div className="w-full hidden h-fit sticky top-0 lg:flex col-span-2 text-lg md:text-xl rounded-md flex-col justify-between pt-4 z-50 font-light"></div>
        }
        {
            triggerLogout && uid && 
          <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/80 dark:bg-black/80 items-center top-0 left-0 cursor-default z-[1000]">
                <div className="w-[85%] md:w-[50%] bg-base-100 dark:bg-black dark:text-[#cbc9c9] p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
                    <h1 className="text-2xl lg:text-3xl font-semibold">Logout?</h1>
                    <p>Accepting will log you out of your account. Do you want to proceed?</p>
                    {
                        !exiting ? 
                            <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                                <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={handleLogout}>Yes, Logout</button>
                                <button className="w-fit px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black lg:hover:shadow-md" onClick={() => setTriggerLogout(false)}>Cancel</button>
                            </div> : 
                          <div className="w-full flex gap-2 mt-10 font-bold justify-center items-center">
                              <span className="loading loading-spinner"></span>
                          </div> 
                    }
                </div>
            </div>
        }
      </>
    // </div>
  )
}

export default SideBar