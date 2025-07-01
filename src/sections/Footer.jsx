import { Link } from "react-router-dom"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useNotifications from "../hooks/useNotifications"
// import { logOut } from "../features/appSlice"
import { getMessages } from "../features/messageSlice"
// import supabase from "../config/supabaseClient.config"

/* eslint-disable react/prop-types */
const Footer = ({uid, page, paramsId, toggleSearchBar}) => {
  // const [triggerLogout, setTriggerLogout] = useState(false)

  const {loggedUser, notifications} = useSelector((state) => state.app)
  const { messages } = useSelector((state) => state.message)
  const {mutate} = useNotifications()
  const dispatch = useDispatch()

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
  
  // get all messages not viewed belonging to loggedUser 
  const filteredMessages = useMemo(() => {
    if(loggedUser?.u_id != null) {
      const allPending = messages?.filter(message => (message.receiver_id == loggedUser?.u_id) && (message.viewed === false))
      // console.log(allPending)
      return allPending
    }
  }, [loggedUser?.u_id, notifications])

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
    notificationCount = <span className="absolute -top-1 -right-2 bg-red-500 flex justify-center items-center text-white w-3 h-3 p-2 text-xs border-2 border-base-100 rounded-full">{filteredNotifs?.length}</span>
  }

  if(filteredMessages?.length > 0) {
    // group messages from same sender 
    const groupMessages = () => {
      const grouped = Object.groupBy(filteredMessages, ({ sender_id }) => sender_id)
      let newMessages = [];
      
      Object.keys(grouped).forEach(key => {
        newMessages = [...newMessages, grouped[key][0]]
      });
      return newMessages
    }
    messageCount = <span className="absolute -top-1 -right-2 bg-red-500 flex text-white w-3 h-3 p-2 text-xs justify-center items-center border-2 border-base-100 rounded-full">{groupMessages().length}</span>
  }

  // const handleLogout = () => {
  //   dispatch(logOut())
  // }

  return (
    <>{uid && <div className='lg:hidden w-full h-20 flex fixed justify-center bottom-0 bg-base-100 dark:bg-black px-4 md:px-20 z-40 border-t-[1px] border-primary/20 text-lg md:text-2xl dark:text-[#CBC9C9]'>
        <ul className='w-full h-full lg:max-w-[90%] grid grid-cols-5'>
            <Link to={'/'} className=" text-neutral dark:text-[#CBC9C9]">
                <li className={page === 'home' ? "text-primary backdrop-blur-none border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer" : "hover:text-primary hover hover:border-b-2 hover:border-primary h-full flex flex-col justify-center items-center cursor-pointer"}><i className={page === 'home' ? "bi-house-door-fill" : "bi-house-door"}></i></li>
            </Link>
            <Link to={`/${uid}`} className=" text-neutral dark:text-[#CBC9C9]">
                <li className={page === 'profile' && paramsId === uid ?  "text-primary border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer" : "hover:text-primary hover hover:border-b-2 hover:border-primary h-full flex flex-col justify-center items-center cursor-pointer"}><i className={page === 'profile' && paramsId === uid ? "bi bi-person-fill" : "bi bi-person"}></i></li>
            </Link>
            <Link to={`/messages/conversations`} className=" text-neutral dark:text-[#CBC9C9]">
                {page === 'messages' ? <li className="relative text-primary border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer"><i className="bi bi-envelope-fill"></i></li> : 
                <li className="relative hover:text-primary hover:border-b-2 hover:border-primary h-full flex justify-center items-center cursor-pointer"><i className="bi bi-envelope relative not-italic">{messageCount}</i> </li>}
            </Link>
            <Link to={`/notifications`} className=" text-neutral dark:text-[#CBC9C9]">
                {page === 'notification' ? <li className="text-primary border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer"><i className="bi bi-bell-fill"></i></li> : 
                <li className="relative hover:text-primary hover:border-b-2 hover:border-primary h-full flex justify-center items-center cursor-pointer"><i className="bi bi-bell relative not-italic">{notificationCount}</i></li>}
            </Link>
            <li className={page === 'search' ?  "text-primary border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer" : "hover:text-primary hover hover:border-b-2 hover:border-primary h-full flex flex-col justify-center items-center cursor-pointer"} onClick={toggleSearchBar}><i className={page === 'search' ? "bi bi-binoculars-fill" : "bi bi-binoculars"}></i></li>
        </ul>
    </div>}
      {/* {
          triggerLogout && uid && 
          <div className="fixed w-full h-full flex justify-center px-10 bg-white/20 dark:bg-neutral/20 backdrop-blur-sm items-center top-0 left-0 cursor-default z-[60]">
                <div className="w-[85%] md:w-[50%] shadow-lg bg-white p-5 rounded-[1rem] flex flex-col gap-2">
                  <h1 className="text-2xl lg:text-3xl font-semibold">Logout?</h1>
                  <p>Accepting will log you out of your account. Do you want to proceed?</p>
                  {
                      !exiting ? 
                          <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                              <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={handleLogout}>Yes, Logout</button>
                              <button className="w-fit px-4 py-2 rounded-full bg-black text-white lg:hover:shadow-md" onClick={() => setTriggerLogout(false)}>Cancel</button>
                          </div> : 
                          <div className="w-full flex gap-2 mt-10 font-bold justify-center items-center">
                              <span className="loading loading-spinner"></span>
                          </div> 
                  }
              </div>
          </div>
      } */}
    </>
  )
}

export default Footer