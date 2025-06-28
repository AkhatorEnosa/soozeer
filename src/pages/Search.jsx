import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
// import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import OtherUsersCard from "../components/OtherUsersCard"
import PostCard from "../components/PostCard"
import BackBtn from "../components/BackBtn"
import { useDispatch, useSelector } from "react-redux"
import useAddPost from "../hooks/useAddPost"
import usePosts from "../hooks/usePosts"
import useDeletePost from "../hooks/useDeletePost"
import useLikes from "../hooks/useLikes"
import useBookmarks from "../hooks/useBookmarks"
import useComments from "../hooks/useComments"
import useFollows from "../hooks/useFollows"
import useOtherUsers from "../hooks/useOtherUsers"
import { bookmarkPost, likePost, unBookmark, unlike } from "../features/postSlice"
import { followUser, unfollow } from "../features/followSlice"
import useSearchQuery from "../hooks/useSearchQuery"
import SideBar from "../components/SideBar"
import JournalCard from "../components/JournalCard"
// import Navbar from "../components/Navbar"

const Search = () => {
  const [search, setSearch] = useState("")
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? localStorage.getItem("theme") : "light")
  const [systemThemeIsDark, setSystemThemeIsDark] = useState(false)

  const params = useParams()
  const navigate = useNavigate();


  const { loggedUser, otherUsers, searchedUsers, isLoading, isLoadingOtherUsers } = useSelector((state) => state.app)
  const { searchedPosts, likes, bookmarks, comments, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts)
  const { follows, isLoadingFollows } = useSelector((state) => state.follows)
  const dispatch = useDispatch()

  usePosts()
  useAddPost()
  const {mutate:del} = useDeletePost()
  useLikes()
  useBookmarks()
  useComments()
  useFollows()
  const {mutate:others} = useOtherUsers()
  const {mutate:searchQuery} = useSearchQuery()


  // handle theme
  const htmlClassList = document.querySelector('html').classList
  const checkForDark = window.matchMedia(`(prefers-color-scheme: dark)`)

   useEffect(() => {
      if(('theme' in localStorage)) {
        setTheme(localStorage.getItem("theme"))
        htmlClassList.remove("dark")
        htmlClassList.remove("light")
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
  }, [theme, htmlClassList, systemThemeIsDark, checkForDark])

  // fetch all other users asides the one logged in or the one whose profile is being view at the moment
  const getOtherusers = (uid) => {
      if(loggedUser !== null) {
        others(uid)
      }
    }

  useEffect(() => {
    getOtherusers({loggedId:loggedUser?.u_id, currentId: loggedUser?.u_id})
    if(!isLoading && loggedUser == null) {
      navigate('/login')
    }
  }, [loggedUser])


  const deletePost = (id) => {
    del({id})
  }

  const removeLike =(id) => {
    dispatch(unlike(id))
  }

  const removeBookmark = (id) => {
      dispatch(unBookmark(id))
  }

  const removeFollow = (id) => {
      dispatch(unfollow(id))
  }

  const countLikes = (id) => {
    if(likes !== null) {
      const filterLikes = likes?.filter(like => like.post_id === id)
      if(filterLikes) {
        return filterLikes.length
      }
    }
  }

  const likedPost = (id) => {
    if(likes !== null) {
      const findLiked = likes.find(like => (like.post_id == id) && (like.u_id == loggedUser.u_id))
      if(findLiked) {
        return true
      } else {
        return false
      }
    }
  }

  const countBookmarks = (id) => {
    if(bookmarks !== null) {
      const filterBookmarks = bookmarks?.filter(bookmark => bookmark.post_id === id)
      if(filterBookmarks) {
        return filterBookmarks.length
      }
    }
  }

  const bookmarkedPost = (id) => {
    if(bookmarks !== null) {
      const findBookmarked = bookmarks.find(bookmark => (bookmark.post_id == id) && (bookmark.u_id == loggedUser.u_id))
      if(findBookmarked) {
        return true
      } else {
        return false
      }
    }
  }

  const countComments = (id) => {
    if(comments !== null) {
      const filterComments = comments?.filter(comment => comment.post_id === id)
      if(filterComments) {
        return filterComments.length
      }
    }
  }

  const followed = (id) => {
    if(follows !== null) {
      const findFollowed = follows.find(follow => (follow.followed_id == id) && (follow.follower_id == loggedUser.u_id))
      if(findFollowed) {
        return true
      } else {
        return false
      }
    }
  }

  useEffect(() => {
      const handleSearch = () => {
        if(params !== null) {
          searchQuery(params)
          // console.log(params.id)
        }
      }

      handleSearch()
  }, [params])

  const handlePostSearch = (e) => {
    e.preventDefault()
    if(search.trim() !== '') {
      navigate(`/search/${search}`)
    } else {
      return 
    }
  }

  

  let content;
  let userList;
  let people;

  if(isLoading || isLoadingOtherUsers) {
    <div className="w-full flex flex-col gap-4">
      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
    </div>
  } else {
    if(otherUsers?.length > 0) {
      userList = otherUsers.slice(0,4).map(x => (
        <OtherUsersCard 
          key={x.id}
          userImg={x.u_img}
          name={x.name}
          uName={x.u_name}
          userIdVal = {x.u_id}
          followed={followed(x.u_id)}
          following={isLoadingFollows}
          toggleFollow={() => {
                  const verifyFollow = follows.find(follow => ((follow.followed_id == x.u_id) && (follow.follower_id == loggedUser.u_id)))
                    // console.log(verifyFollow)
                    if(verifyFollow == undefined) {
                        dispatch(followUser({
                          uid: loggedUser.u_id,
                          creatorName: loggedUser.name,
                          creatorImg: loggedUser.u_img,
                          receiverUid: x.u_id,
                          receiverName: x.name,
                          receiverImg: x.u_img
                        }))
                    } else {
                        removeFollow(verifyFollow.id)
                    }
              }}
        />
      ))
    } else {
      userList = <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-5xl gap-4"><i className="bi bi-people"></i> <p className="text-base">No body to see, yet!</p></h1>
    }
  }
  
  if(isLoading === true){
    content = <div className="w-full h-56 flex flex-col justify-center items-center"><span className="loading loading-dots loading-lg text-primary"></span></div>
  } 

  if(loggedUser && searchedUsers !== null && searchedPosts !== null) {
    if(searchedPosts?.length > 0 || searchedUsers?.length > 0){

      people = searchedUsers.map(x => (
          <OtherUsersCard 
            key={x.id}
            userImg={x.u_img}
            name={x.name}
            uName={x.u_name}
            uid={x.u_id === loggedUser.u_id ? true : false}
            userIdVal = {x.u_id}
            followed={followed(x.u_id)}
            following={isLoadingFollows}
            toggleFollow={() => {
                    const verifyFollow = follows.find(follow => ((follow.followed_id == x.u_id) && (follow.follower_id == loggedUser.u_id)))
                      if(verifyFollow == undefined) {
                          dispatch(followUser({
                            uid: loggedUser.u_id,
                            creatorName: loggedUser.name,
                            creatorImg: loggedUser.u_img,
                            receiverUid: x.u_id,
                            receiverName: x.name,
                            receiverImg: x.u_img
                          }))
                      } else {
                          removeFollow(verifyFollow.id)
                      }
                }}
          />
      ))
      
      content = searchedPosts.map(post => (
        (post.type == 'post' || post.type == 'comment' || post.type == 'reply') ? (
                    <PostCard 
                      key={post.id}
                      userId={loggedUser.u_id}
                      postUserId={post.u_id === loggedUser.u_id ? true : false}
                      postUserIdVal = {post.u_id}
                      uImg={post.u_img} 
                      openComment={() => {
                        navigate(`/post/${post.id}`)
                      }}
                      uName={post.u_name} 
                      postContent={post.body}
                      datetime={post.created_at}
                      postId={post.id}
                      liking={isLiking}
                      bookmarking={isBookmarking}
                      deleting={isDeletingPost}
                      following={isLoadingFollows}
                      toggleFollow={() => {
                              const verifyFollow = follows.find(x => ((x.followed_id == post.u_id) && (x.follower_id == loggedUser.u_id)))
                                // console.log(verifyFollow)
                                if(verifyFollow == undefined) {
                                  // console.log(follows)
                                  dispatch(followUser({
                                    uid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    receiverUid: post.u_id,
                                    receiverName: post.u_name,
                                    receiverImg: post.u_img
                                  }))
                                } else {
                                    removeFollow(verifyFollow.id)
                                }
                          }}
                      followed={followed(post.u_id)}
                      comments={countComments(post.id)}
                      likes={countLikes(post.id)}
                      liked={likedPost(post.id)}
                      bookmarks={countBookmarks(post.id)}
                      bookmarked={bookmarkedPost(post.id)}
                      likePost={() => {
                              const verifyLike = likes.find(x => ((x.post_id == post.id) && (x.u_id == loggedUser.u_id)))
                                // console.log(verifyLike)
                                if(verifyLike == undefined) {
                                  dispatch(likePost({
                                    postId: post.id, 
                                    creatorUid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    postUid: post.u_id,
                                    postBody: post.body,
                                    }))
                                } else {
                                    removeLike(verifyLike.id)
                                }
                          }}
                      bookmarkPost={() => {
                              const verifyBookmark = bookmarks.find(x => ((x.post_id == post.id) && (x.u_id == loggedUser.u_id)))
                                // console.log(verifyBookmark)
                                if(verifyBookmark == undefined) {
                                    dispatch(bookmarkPost({
                                      postId: post.id, 
                                      creatorUid: loggedUser.u_id,
                                      creatorName: loggedUser.name,
                                      creatorImg: loggedUser.u_img,
                                      postUid: post.u_id,
                                      postBody: post.body,
                                    }))
                                } else {
                                    removeBookmark(verifyBookmark.id)
                                }
                          }}
                      deletePost={()=> deletePost(post.id)}
                    />
        ) : 
         
        (post.type == 'journal') && (
              <JournalCard
                key={post.id}
                postUserId={post.u_id === loggedUser?.u_id ? true : false}
                postUserIdVal={post.u_id}
                uImg={post.u_img} 
                uName={post.u_name}
                title={post.title}
                journal={post.journal}
                privacy={post.privacy}
                datetime={post.created_at}
                liking={isLiking}
                bookmarking={isBookmarking}
                deleting={isDeletingPost}
                likes={countLikes(post.id)}
                liked={likedPost(post.id)}
                likePost={() => {
                        const verifyLike = likes.find(x => ((x.post_id == post.id) && (x.u_id == loggedUser.u_id)))
                          // console.log(verifyLike)
                          if(verifyLike == undefined) {
                            dispatch(likePost({
                              postId: post.id, 
                              creatorUid: loggedUser.u_id,
                              creatorName: loggedUser.name,
                              creatorImg: loggedUser.u_img,
                              postUid: post.u_id,
                              postBody: post.journal,
                              for: post.type
                              }))
                          } else {
                              removeLike(verifyLike.id)
                          }
                    }}
                deletePost={()=> deletePost(post.id)}
              /> 
        )
                ))
    } else {
          content = <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-5xl gap-4"><i className="bi bi-search"></i> <p className="text-base">No search result found!</p></h1>
    }
  } else {
    content = <div className="w-full flex flex-col gap-4">
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                </div>
  }
  


  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center dark:text-inherit pb-28 lg:pb-0">
      {/* <Navbar /> */}

        {/* main section  */}
          <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mb:pb-0 md:gap-5 mb:mb-0 overflow-scroll no-scrollbar">
            <SideBar
            uid={loggedUser !== null ? loggedUser.u_id : null} 
            page={'search'} />

            <div className="main w-full flex flex-col col-span-4 border-[1px] border-black/5  dark:border-neutral-300/10 py-4 lg:px-5 lg:py-7 gap-2 lg:gap-5 rounded-md">

              <div className="w-full flex px-3 bg-base-100/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">
                <BackBtn link={() => navigate(-1)} title={'Back'}/>
              </div>
              
              <div className="flex flex-col">
                  {params == '' ? '' : <p className="w-full text-center text-sm">Result for <b className="text-lg">&ldquo;{params.id}&rdquo;</b></p>}
                  {/* search  */}
                  <form 
                  onSubmit={handlePostSearch} 
                  className="flex flex-col gap-7 mt-2 px-2">
                    <label className="input input-bordered bg-primary/5 rounded-full flex items-center gap-3 dark:bg-black/50 border-[1px] dark:border-[#CBC9C9]/40 outline-none dark:focus:bg-black/50"><i className="bi bi-binoculars-fill"></i>
                      <input type="text" name="search" id="search" value={search} placeholder={params.id} className="w-full placeholder:text-inherit" onChange={(e)=>setSearch(e.target.value)}/>
                    </label>
                  </form>
              </div>

                  <>
                    <div className="w-full people">
                      <h1 className={searchedUsers?.length > 0 ? "text-lg mb-2 px-3 lg:px-0 lg:text-xl font-bold w-full flex gap-3 justify-between items-center" : "hidden"}>People <i className="bi bi-people-fill"></i></h1>
                      <div className="divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                        {people}
                      </div>
                    </div>

                    <div className="w-full content">
                      <h1 className={searchedPosts?.length > 0 ? "text-lg mb-2 px-3 lg:px-0 lg:text-xl font-bold w-full flex gap-3 justify-between items-center" : "hidden"}>Posts/Comments/Replies/Journals <i className="bi bi-chat-square-text-fill"></i></h1>
                      <div className="divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                        {content} 
                      </div>
                      <p className="py-8 flex justify-center text-primary">.</p>
                    </div>
                  </>
            </div>

          {/* side bar */}
          <div className="hidden sticky right-0 top-5 lg:flex flex-col gap-5 h-fit col-span-2 py-3 border-[1px] border-black/5 dark:border-neutral-300/10 rounded-md">

            <div>
              <h2 className="capitalize font-bold text-xl px-3 mb-4">Other Interests</h2>
              {isLoadingOtherUsers ? <div className="w-full flex flex-col gap-4">
                <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
              </div> : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                {userList}
              </div>}
            </div>
          </div>
        </div>

        <Footer 
          uid={loggedUser !== null && loggedUser?.u_id} 
          page={'search'} 
          />
    </div>
  )
}

export default Search