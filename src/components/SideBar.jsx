import { Link } from "react-router-dom"
import { useContext, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useNotifications from "../hooks/useNotifications"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'
import { getMessages } from "../features/messageSlice"
import ThemeToggleButton from "./ThemeToggleButton"
import { AppContext } from "../context/AppContext"
import LogoutModal from "./LogoutModal"
// import supabase from "../config/supabaseClient.config"

/* eslint-disable react/prop-types */
const SideBar = ({uid, uName, page, paramsId, toggleSearchBar}) => {
  const body = document.body

  const {loggedUser, notifications, exiting} = useSelector((state) => state.app)
  const { triggerLogout, setTriggerLogout, showSubMenu, setShowSubMenu} = useContext(AppContext)
  const { messages } = useSelector((state) => state.message)
  const {mutate} = useNotifications()
  const dispatch = useDispatch()
  
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

  return (
    // <div className={`hidden h-fit lg:flex col-span-2 sticky left-0 top-0 text-lg md:text-xl rounded-md`}>
      <>
        { uid ?
          <div className="w-full hidden h-screen sticky top-0 lg:flex col-span-2 text-lg rounded-md flex-col justify-between py-4 z-[200] font-base">
            <div className="h-fit">
              <div className="flex py-4 mb-4 px-10">
                <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-32 md:w-36 lg:w-44"/>  </Link>
                <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-32 md:w-36 lg:w-44"/> </Link>
              </div>

              <Link to={'/'} className="w-full text-neutral-dark dark:text-dark-accent rounded-full">
                  <p className={page === 'home' ? "text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 dark:hover:bg-primary/15 rounded-full flex gap-4 px-10 py-5  cursor-pointer"}><i className={page === 'home' ? "bi bi-house-door-fill" : "bi bi-house-door"}></i> Home</p>
              </Link>
              <Link to={`/${uName}`} className="w-full text-neutral-dark dark:text-dark-accent rounded-full">
                  <p className={page === 'profile' && paramsId === uid ? "text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer dark:text-dark-accent rounded-full"}><i className={page === 'profile' && paramsId === uid ? "bi bi-person-fill" : "bi bi-person"}></i> Profile</p>
              </Link>
              <Link to={`/messages/conversations`} className="w-full text-neutral-dark dark:text-dark-accent rounded-full">
                  {page === 'messages' ? <p className="text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic"><i className="bi bi-envelope-fill"></i> Messages</p> : 
                  <p className="hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic dark:text-dark-accent rounded-full">
                      <span className="flex relative"><i className="bi bi-envelope"></i> {messageCount} </span>
                      Messages</p>}
              </Link>
              <Link to={`/notifications`} className="w-full text-neutral-dark dark:text-dark-accent rounded-full">
                  {page === 'notification' ? <p className="text-primary flex font-semibold dark:text-white bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic"><i className="bi bi-bell-fill"></i> Notifications</p> : 
                  <p className="hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic dark:text-dark-accent rounded-full">
                      <span className="flex relative"><i className="bi bi-bell"></i> {notificationCount} </span>
                      Notifications</p>}
              </Link>
              <button className={page === 'search' ?  "w-full text-primary flex font-semibold dark:text-dark-accent bg-primary/5 rounded-full gap-4 px-10 py-5 cursor-pointer not-italic" : "w-full hover:bg-primary/5 dark:hover:bg-primary/15 flex gap-4 px-10 py-5 cursor-pointer not-italic text-neutral-dark dark:text-dark-accent rounded-full"} onClick={toggleSearchBar}><i className={page === 'search' ? "bi bi-binoculars-fill" : "bi bi-binoculars"}></i> Search</button>
            </div>
            
            <div 
              role="button"
              tabIndex="0"
              className="relative flex flex-col px-6 py-4 gap-5 justify-center text-base text-neutral-dark dark:text-dark-accent rounded-full hover:bg-primary/5 cursor-pointer z-0"
              onClick={() => setShowSubMenu(!showSubMenu)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowSubMenu(true);
                } else if (e.key === 'Escape' && showSubMenu) {
                  setShowSubMenu(false);
                }
              }}
              aria-haspopup="true"
              aria-expanded={showSubMenu}
              aria-label="User menu"
            >
              {showSubMenu && (
                <div 
                  className="fixed left-0 top-0 w-full h-full cursor-default" 
                  onClick={() => setShowSubMenu(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setShowSubMenu(false)}
                  tabIndex="-1"
                />
              )}

              <div 
                className={showSubMenu ? 
                  "absolute opacity-100 w-full flex flex-col gap-2 items-start -top-[12rem] left-0 text-base py-5 px-3 transition-all duration-200 z-50" : 
                  "absolute w-full flex flex-col gap-2 items-center opacity -top-[12rem] -left-[100vw] px-3 py-5 transition-all duration-200"
                }
                role="menu"
              >
                <div className="w-full grid grid-cols-3 items-center justify-center bg-bg dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-xs lg:text-base dark:border-neutral-500 overflow-hidden"
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
                
                <button 
                  className="w-fit flex gap-2 items-center bg-bg dark:bg-black rounded-full border-[1px] border-neutral-100 shadow-sm dark:shadow-primary/40 text-base dark:border-neutral-500 rounded-full/40 hover:bg-primary/5 dark:hover:bg-primary/15 px-10 py-5"
                  onClick={() => setTriggerLogout(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTriggerLogout(true);
                    } else if (e.key === 'Escape') {
                      setShowSubMenu(false);
                    }
                  }}
                  role="menuitem"
                  tabIndex={showSubMenu ? 0 : -1}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Logout
                </button>
              </div>

              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={loggedUser.u_img} 
                    alt="User profile" 
                    className="w-6 h-6 md:w-10 md:h-10 border-[1px] border-black/30 rounded-full"
                  />
                  <span className="hidden md:flex tracking-tight">{loggedUser.name}</span>
                </div>
                <i className="bi bi-three-dots" aria-hidden="true"></i>
              </div>
            </div>

          </div> :
          <div className="w-full hidden h-fit sticky top-0 lg:flex col-span-2 text-lg md:text-xl rounded-md flex-col justify-between pt-4 z-50 font-light"></div>
        }
        {
            triggerLogout && uid && 
          <LogoutModal exiting={exiting}/>
        }
      </>
    // </div>
  )
}

export default SideBar