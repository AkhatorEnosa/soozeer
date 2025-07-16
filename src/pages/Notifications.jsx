import { useContext, useEffect, useState } from "react"
import { useNavigate} from "react-router-dom"
import Footer from "../sections/Footer"
import OtherUsersCard from "../components/OtherUsersCard"
import NotificationCard from "../components/NotificationCard"
import { followUser, unfollow } from "../features/followSlice"
import { useDispatch, useSelector } from "react-redux"
import useFollows from "../hooks/useFollows"
import useOtherUsers from "../hooks/useOtherUsers"
import useNotifications from "../hooks/useNotifications"
import supabase from "../config/supabaseClient.config"
import SideBar from "../components/SideBar"
// import BackBtn from "../components/BackBtn"
import SearchModal from "../components/SearchModal"
import { AppContext } from "../context/AppContext"
// import Navbar from "../components/Navbar"

const Notifications = () => {
  const [search, setSearch] = useState('')

  const {error, notifications, loggedUser, otherUsers, isLoading, isLoadingOtherUsers} = useSelector((state) => state.app)
  const { renderLoadingState, renderErrorState } = useContext(AppContext)
  const {mutate} = useNotifications()
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { follows, isLoadingFollows } = useSelector((state) => state.follows)
  useFollows()
  const {mutate:others} = useOtherUsers()

  const getNotifications = async(uid) => {
    if(loggedUser?.u_id !== null && uid !== undefined) {
      mutate({uid})

      await supabase
      .from('notifications')
      .update({ viewed: true})
      .eq('viewed', false)
      .eq('receiver_id', uid)
      .neq('creator_id', uid)
    }
  }

  // fetch all other users asides the one logged in or the one whose profile is being view at the moment
  const getOtherusers = (uid) => {
      if(loggedUser !== null) {
        others(uid)
      }
    }


  useEffect(() => {
    getOtherusers({loggedId:loggedUser?.u_id, currentId: loggedUser?.u_id})
    getNotifications(loggedUser?.u_id)
    if(!isLoading && loggedUser == null) {
      navigate('/login')
    }
  }, [loggedUser, loggedUser?.u_id])

    // verify follow status 

  const followed = (id) => {
    if(follows !== null) {
      const findFollowed = follows?.find(follow => (follow.followed_id == id) && (follow.follower_id == loggedUser?.u_id))
      if(findFollowed) {
        return true
      } else {
        return false
      }
    }
  }

    // remove follow

  const removeFollow = (id) => {
      dispatch(unfollow(id))
  }

let content;
  let userList;
    
      // verify id and other users availability 
      if(isLoading || isLoadingOtherUsers) {
          userList = renderLoadingState("h-10")
        }else if((loggedUser?.u_id && otherUsers?.length > 0)) {
          userList = otherUsers?.slice(0,4).map(x => (
          <OtherUsersCard 
              key={x.id}
              userImg={x.u_img}
              name={x.name}
              uName={x.u_name}
              uid={x.u_id === loggedUser?.u_id ? true : false}
              userIdVal = {x.u_id}
              followed={followed(x.u_id)}
              following={isLoadingFollows}
              toggleFollow={() => {
                      const verifyFollow = follows.find(follow => ((follow.followed_id == x.u_id) && (follow.follower_id == loggedUser?.u_id)))
                      // console.log(verifyFollow)
                      if(verifyFollow == undefined) {
                          console.log(follows)
                            dispatch(followUser({
                                    uid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    receiverUid: x.u_id,
                                    receiverName: x.name,
                                    receiverImg: x.u_img
                                  }))

                          // const {data, error} = await supabase
                          // .from('follows')
                          // .insert({
                          // "followed_id": x.u_id,
                          // "follower_id": uid
                          // })
                          // .select()
                          
                          // if(error) {
                          // console.log(error)
                          // }

                          // if(data) {

                          //           const {data:followData, error:followErr} = await supabase
                          //           .from('notifications')
                          //           .insert({
                          //             "for": "follow",
                          //             // "post_id": post.id,
                          //             "receiver_id": x.u_id,
                          //             "creator_name": user.name,
                          //             "creator_id": uid,
                          //             "creator_img": user.u_img
                          //           })
                          //           .select()

                          //           if(followErr) {
                          //             console.log(followErr)
                          //           }

                          //           if(followData) {
                          //             return followData
                          //           }
                          // }
                      } else {
                          removeFollow(verifyFollow.id)
                      }
                  }}
          />
          ))
      } else {
          userList = <h1 className="w-full h-56 flex flex-col gap-4 justify-center items-center z-50 text-9xl"><i className="bi bi-people"></i> <p className="text-base">No body to see, yet!</p></h1>
      }

    if(isLoading) {
        content = renderLoadingState("h-20")
    }else {
        if(loggedUser !== null && notifications !== null && notifications.length > 0){
          const sortNotifications = JSON.parse(JSON.stringify(notifications)).sort((a,b) => b.id - a.id)
            content = sortNotifications.map(x => (
               <NotificationCard 
                key={x.id}
                action={x.for}
                name={x.creator_name}
                postId={x.post_id}
                commentId={x.comment_id}
                img={x.creator_img}
                post={x.post_snippet}
                followerId={x.creator_id}
                viewStatus={x.viewed}
               />
            ))
        } else if(loggedUser !== null && notifications?.length < 1) {
            content = <div className="w-full h-96 flex flex-col gap-5 justify-center items-center z-50 text-9xl">
              <i className="bi bi-bell"></i> <p className="text-base">No Notification yet!</p>
            </div>
        }
    }

  // Toggle Search Bar 
    const handleShowSearch = () => {
        document.getElementById('my_modal_2').showModal()
    }

    // search function 
    const handleSearch = (e) => {
        e.preventDefault()
        if(search.trim() !== '') {
        navigate(`/search/${search}`)
        }
    }

    if(error) {
      return renderErrorState('Something went wrong. Please try again later.');
    } else {
      return (
        <div className="w-full flex flex-col items-center pb-28 lg:pb-0">
            {/* <Navbar/> */}

            <div className="w-full md:grid md:grid-cols-8 px-2 md:px-20 mt-2 md:mt-0 pb-20 md:pb-28 lg:pb-0 gap-2 mb-7 md:mb-14 lg:mb-0">
              <SideBar
              uid={loggedUser !== null ? loggedUser.u_id : null} 
              page={'notification'} 
              toggleSearchBar={handleShowSearch}/>

              {/* main section  */}
              <div className="main w-full flex flex-col md:col-span-5 lg:col-span-4 border-r-[1px] border-l-[1px] border-black/5 dark:border-neutral-300/10">
                <h1 className="p-5 text-xl font-bold text-neutral-dark dark:text-dark-accent dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">Notifications</h1>
                <div className="divide-y-[1px] divide-black/5 dark:divide-neutral-300/10">{content}</div>
                <p className="py-8 flex justify-center text-primary">.</p>
              </div>


              {/* side bar */}
              <div className="side-nav hidden sticky right-0 top-5 md:flex flex-col gap-5 h-fit md:col-span-3 lg:col-span-2 py-3 border-[1px] border-black/5 dark:border-neutral-300/10 rounded-md">

                  <h2 className="font-bold text-xl px-3 text-neutral-dark dark:text-dark-accent">Suggested for you</h2>
                  {!loggedUser && isLoadingOtherUsers ? renderLoadingState("h-10") : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-neutral-300/10">
                    {userList}
                  </div>}
              </div>
            </div>

            {/* search modal  */}
            <SearchModal 
              handleSearch={handleSearch}
              search={search}
              handleChange={(e)=>setSearch(e.target.value)}
            />

            <Footer 
              uid={loggedUser !== null && loggedUser?.u_id} 
              page={'notification'} 
              toggleSearchBar={handleShowSearch}/>
        </div>
      )
    }
}

export default Notifications