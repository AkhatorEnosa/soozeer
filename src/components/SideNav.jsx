import { Link } from "react-router-dom"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useNotifications from "../hooks/useNotifications"
import { logOut } from "../features/appSlice"
import logo from '../assets/png/logo-no-background.png'

/* eslint-disable react/prop-types */
const SideNav = ({uid, page, toggleSearchBar}) => {
  const {loggedUser, notifications} = useSelector((state) => state.app)
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

  useEffect(() => {
    getNotifications(loggedUser?.u_id)
  }, [loggedUser])

  let notificationCount;

  if(filteredNotifs?.length > 0) {
    notificationCount = <span className="relative -top-2 right-3 bg-red-500 flex text-white w-3 h-3 p-2 text-sm justify-center items-center border-2 border-white rounded-full">{filteredNotifs?.length}</span>
  }

    const handleLogout = async() => {
        await dispatch(logOut())
    }

  return (
    <div className="w-screen h-screen">
        <div className='md:w-[30%] h-full fixed left-0 top-0 bg-white  z-50 text-lg md:text-2xl font-light shadow-md'>
            <div className="w-full flex flex-col z-50">
                <Link to='/' className="w-full px-10 py-8"> <img src={logo} alt="logo" className="w-56"/> </Link>
                <Link to={'/'} className="w-full">
                    <p className={page === 'home' ? " bg-primary/10 h-full flex gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 h-full flex gap-4 px-10 py-5 cursor-pointer"}><i className="bi bi-house"></i> Home</p>
                </Link>
                <Link to={`/${uid}`} className="w-full">
                    <p className={page === 'profile' ? " bg-primary/10 h-full flex gap-4 px-10 py-5 cursor-pointer" : "hover:bg-primary/5 h-full flex gap-4 px-10 py-5 cursor-pointer"}><i className="bi bi-person"></i> Profile</p>
                </Link>
                <Link to={`/notifications`} className="w-full">
                    {page === 'notification' ? <p className=" bg-primary/10 h-full flex gap-4 px-10 py-5 cursor-pointer"><i className="bi bi-bell"></i> Notifications</p> : 
                    <p className="hover:bg-primary/5 h-full flex gap-4 px-10 py-5 cursor-pointer">
                        <span className="flex"><i className="bi bi-bell"></i> {notificationCount} </span>
                        Notifications</p>}
                </Link>
                <p className={page === 'search' ?  "w-full  bg-primary/10 h-full flex gap-4 px-10 py-5 cursor-pointer" : "w-full hover:bg-primary/5 h-full flex gap-4 px-10 py-5 cursor-pointer"} onClick={toggleSearchBar}><i className="bi bi-search"></i> Search</p>
                <p className={page === 'logout' ?  "w-full  bg-primary/10 h-full flex gap-4 px-10 py-5 cursor-pointer" : "w-full hover:bg-primary/5 h-full flex gap-4 px-10 py-5 cursor-pointer"} onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Logout</p>
            </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm w-screen h-screen fixed top-0 z-40"></div>
    </div>
  )
}

export default SideNav