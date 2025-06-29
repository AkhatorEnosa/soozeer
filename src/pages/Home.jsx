// /* eslint-disable react-hooks/exhaustive-deps */

// import Navbar from "../components/Navbar"
import { useEffect, useRef, useState } from "react"
import PostCard from "../components/PostCard"
import Footer from "../components/Footer"
import { Link, useNavigate, useParams } from "react-router-dom"
import OtherUsersCard from "../components/OtherUsersCard"
import { useDispatch, useSelector } from "react-redux"
import { bookmarkPost, unlike, likePost, unBookmark, getPostComments, getPosts, getLikes, getBookmarks } from "../features/postSlice"
import usePosts from "../hooks/usePosts"
import useAddPost from "../hooks/useAddPost"
import useDeletePost from "../hooks/useDeletePost"
import useLikes from "../hooks/useLikes"
import useBookmarks from "../hooks/useBookmarks"
import useFollows from "../hooks/useFollows"
import { followUser, unfollow } from "../features/followSlice"
import useOtherUsers from "../hooks/useOtherUsers"
import SideBar from "../components/SideBar"
import SearchModal from "../components/SearchModal"
import NotLoggedInModal from "../components/NotLoggedInModal"
import supabase from "../config/supabaseClient.config"
import JournalCard from "../components/JournalCard"

const Home = () => {

  const [tab, setTab] = useState("forYou")
  const [search, setSearch] = useState("")
  const [postValue, setPostValue] = useState("")
  const [title, setTitle] = useState('')
  const [journalText, setJournalText] = useState('')
  const [privacy, setPrivacy] = useState(null)
  const divRef = useRef(null);
  const [showPostInModal, setShowPostInModal] = useState(false)
  const [theme, setTheme] = useState('theme' in localStorage ? localStorage.getItem("theme") : "light")
  const [systemThemeIsDark, setSystemThemeIsDark] = useState(false)
  // const [offset, setOffset] = useState(0)

  const {id: paramsId} = useParams()
  const navigate = useNavigate()

  const { loggedUser, otherUsers, isLoading, isLoadingOtherUsers } = useSelector((state) => state.app)
  const { posts, likes, bookmarks, postComments, posted, isAddingPost, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts)
  const { follows, isLoadingFollows } = useSelector((state) => state.follows)
  const dispatch = useDispatch()

  usePosts()
  const {mutate} = useAddPost()
  const {mutate:del} = useDeletePost()
  useLikes()
  useBookmarks()
  useFollows()
  const {mutate:others} = useOtherUsers()
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


  // useEffect(() => {
  //   dispatch(getPosts({ limit: 10, offset }));
  // }, [offset, dispatch]);

  // const handleScroll = () => {
  //   const scrollPosition = window.scrollY;
  //   const scrollHeight = document.body.offsetHeight;

  //   if (scrollPosition == scrollHeight && hasNextPage && !isLoadingPosts) {
  //     setOffset((prevOffset) => prevOffset + 10);
  //   }

  //   console.log("innerHeight",window.innerHeight)
  //   console.log("scrollY",window.scrollY)
  //   console.log("scrollPos",scrollPosition)
  //   console.log("scrollHeight",scrollHeight)
  // };

  //  useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [hasNextPage, isLoading]);
  
  const body = document.body
  useEffect(() => {
    if(showPostInModal) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [showPostInModal])

  useEffect(() => {
      supabase
      .channel('schema-db-changes')
      .on(
          'postgres_changes',
          {
          event: '*',
          schema: 'public',
          },
          () => {
              // console.log(payload)
              setTimeout(() => {
                dispatch(getPosts())
                dispatch(getLikes())
                dispatch(getBookmarks())
              }, 10000);
          }
      )
      .subscribe()
  }, [])
  

  // fetch all other users asides the one logged in or the one whose profile is being view at the moment
  const getOtherusers = (uid) => {
      if(loggedUser !== null) {
        others(uid)
      }
    }

  useEffect(() => {
    getOtherusers({loggedId:loggedUser?.u_id, currentId: loggedUser?.u_id})
    
    dispatch(getPostComments())
  }, [loggedUser, loggedUser?.u_id])


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
      const findLiked = likes.find(like => (like.post_id == id) && (like.u_id == loggedUser?.u_id))
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
      const findBookmarked = bookmarks.find(bookmark => (bookmark.post_id == id) && (bookmark.u_id == loggedUser?.u_id))
      if(findBookmarked) {
        return true
      } else {
        return false
      }
    }
  }

  const countComments = (id) => {
    if(postComments !== null) {
      const filterComments = postComments.filter(comment => comment.post_id == id)
      if(filterComments) {
        return filterComments.length
      }
    }
  }

  const followed = (id) => {
    if(follows !== null) {
      const findFollowed = follows.find(follow => (follow.followed_id == id) && (follow.follower_id == loggedUser?.u_id))
      if(findFollowed) {
        return true
      } else {
        return false
      }
    }
  }

  //Add New Post
  const handleSubmit = () => {
    if(postValue.trim() !== '') {
        mutate({type: 'post', body: postValue.trim(), name: loggedUser.name, u_id: loggedUser.u_id,  u_img: loggedUser.u_img, paramsId: paramsId})
    }
  }

  //Add New Post
  const handleSubmitJournal = () => {
    if(title.trim() !== '' && journalText.trim() !== '' && privacy !== null) {
        mutate({type: 'journal', journal: journalText.trim(), title: title.trim(), privacy: privacy, name: loggedUser.name, u_id: loggedUser.u_id,  u_img: loggedUser.u_img, paramsId: paramsId})
        // console.log(title, journalText, privacy)
    }
  }

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.height = 'auto';
      if(divRef.current.scrollHeight <= 450) {
        divRef.current.style.height = `${divRef.current.scrollHeight}px`
        // console.log(divRef.current.style.height)
      } else {
        divRef.current.style.height = "450px";
      }
    }
  }, [postValue, journalText])

  useEffect(() => {
    if(posted) {
      setShowPostInModal(false)
      setPostValue('')

      setJournalText('')
      setTitle('')
      setPrivacy(null)
    }
  }, [posted])

  let newPostForm;
  let content;
  let userList;
  
  if(posts !== null) {
    
    // verify id and other users availability 
    if(otherUsers !== null) {
      if(otherUsers?.length > 0) {
        userList = otherUsers.slice(0,4).map(x => (
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
      } else {
        userList = <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-people"></i><p className="text-base">No body to see, yet!</p></h1>
      }
    }

    if(tab === 'forYou') { 
        const closePostFormModal = () => {
          setShowPostInModal(false)
          setPostValue('')
          divRef.current.textContent = ''
        }

      // render form input based on tab
      newPostForm = loggedUser !== null && 

        <div className={`w-screen h-screen ${showPostInModal ? "flex" : "hidden"} flex-col justify-center items-center fixed top-0 left-0 bg-base-100/90 dark:bg-black/90 dark:text-[#cbc9c9] shadow-lg mb-4 z-[120]`}>
          <div className="flex flex-col justify-center items-center bg-base-100 dark:bg-black p-5 gap-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img src={loggedUser?.u_img} alt="" className="relative z-20 w-10 h-10 object-cover object-center rounded-full  shadow-sm cursor-default" width={80} height={80} loading="lazy"/>
                <h1 className="font-semibold text-lg lg:text-2xl">Write a Post</h1>
              </div>

              {/* closePostFormModal button */}
              <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full" onClick={() => closePostFormModal()}><i className="bi bi-x-lg cursor-pointer"></i></span>
            </div>
            
            <div className="w-full flex flex-col gap-4">
              <textarea name="body" id="body" ref={divRef} className={`text-md z-20 w-full flex flex-col min-h-8 dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={postValue} placeholder="What are you thinking?" onChange={(e) => setPostValue(e.target.value)} readOnly={isAddingPost && true}></textarea>

              <button className={postValue.trim() !== '' && !isAddingPost ? "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100" : "px-6 py-2 bg-primary/30 font-semibold text-white rounded-full transition-all duration-150 cursor-not-allowed"} onClick={handleSubmit} disabled={postValue.trim() == '' || isAddingPost && "disabled"}>{isAddingPost ?  'Posting...' : 'Post'}</button>
            </div>
          </div>
        </div> 
        
      const allPosts = posts.filter((post) => post.type == 'post')
      if(allPosts?.length > 0){
        // get all posts 
        content = allPosts.map(post => (
                    <PostCard 
                      key={post.id}
                      userId={loggedUser?.u_id}
                      postUserId={post.u_id === loggedUser?.u_id ? true : false}
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
                      toggleFollow={() => {
                              const verifyFollow = follows.find(x => ((x.followed_id == post.u_id) && (x.follower_id == loggedUser?.u_id)))
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
                    ))
      }
      if(allPosts.length === 0){
        content = <div className="w-full h-56 flex flex-col justify-center items-center">No posts to see yet</div>
      }
    } else if (tab === 'following') {
        const closePostFormModal = () => {
          setShowPostInModal(false)
          setPostValue('')
          divRef.current.textContent = ''
        }

        // render form input based on tab
        newPostForm = loggedUser !== null && 

          <div className={`w-screen h-screen ${showPostInModal ? "flex" : "hidden"} flex-col justify-center items-center fixed top-0 left-0 bg-base-100/90 dark:bg-black/90 dark:text-[#cbc9c9] shadow-lg mb-4 z-[120]`}>
            <div className="flex flex-col justify-center items-center bg-base-100 dark:bg-black p-5 gap-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <img src={loggedUser?.u_img} alt="" className="relative z-20 w-10 h-10 object-cover object-center rounded-full  shadow-sm cursor-default" width={80} height={80} loading="lazy"/>
                  <h1 className="font-semibold text-lg lg:text-2xl">Write a Post</h1>
                </div>

                {/* closePostFormModal button */}
                <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full" onClick={() => closePostFormModal()}><i className="bi bi-x-lg cursor-pointer"></i></span>
              </div>
              
              <div className="w-full flex flex-col gap-4">
                <textarea name="body" id="body" ref={divRef} className={`text-md z-20 w-full flex flex-col h-auto min-h-8 box-border dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={postValue} placeholder="What are you thinking?" onChange={(e) => setPostValue(e.target.value).trim()} readOnly={isAddingPost && true}></textarea>
                <button className={postValue.trim() !== '' && !isAddingPost ? "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100" : "px-6 py-2 bg-primary/30 font-semibold text-white rounded-full transition-all duration-150 cursor-not-allowed"} onClick={handleSubmit} disabled={postValue.trim() == '' || isAddingPost && "disabled"}>{isAddingPost ?  'Posting...' : 'Post'}</button>
              </div>
            </div>
          </div> 

        // filter follows
        const filterFollow = follows.filter(follow => follow.follower_id == loggedUser?.u_id)
        const getFollowedId = filterFollow.map(x => x.followed_id) //then map to get followed id 
        // console.log(getFollowedId)
        // const allPosts = posts.filter((post) => post.type == 'post')

        // filter posts based on if post user id is included in getFollowedId result array 
        const followingPosts = posts.filter((post) => (post.u_id == loggedUser?.u_id || getFollowedId.includes(post.u_id)) && post.type == 'post')
        if(followingPosts?.length > 0){
          // get all posts 
          content = followingPosts.map(post => (
                      <PostCard 
                        key={post.id}
                        userId={loggedUser?.u_id}
                        postUserId={post.u_id === loggedUser?.u_id ? true : false}
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
                        toggleFollow={() => {
                                const verifyFollow = follows.find(x => ((x.followed_id == post.u_id) && (x.follower_id == loggedUser?.u_id)))
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
                      ))
        }
        if(followingPosts.length === 0){
          content = <div className="w-full h-56 flex flex-col justify-center items-center">Nothing to see</div>
        }
    } else if (tab === 'journal') {

        // switch to forYou tab post list on log out or if user is not logged in 
        if(loggedUser == null ) {
          setTab('forYou')
        }

        const closePostFormModal = () => {
          setShowPostInModal(false)
          setTitle('')
          setJournalText('')
          setPrivacy(null)
        }
        // render form input based on tab
        newPostForm = loggedUser !== null && 
        <div className={`w-screen h-screen ${showPostInModal ? "flex" : "hidden"} flex-col justify-center items-center fixed top-0 left-0 bg-base-100/90 dark:bg-black/90 dark:text-[#cbc9c9] mb-4 z-[120]`}>
          <div className="flex flex-col justify-center items-center bg-base-100 dark:bg-black p-5 gap-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img src={loggedUser?.u_img} alt="" className="relative z-20 w-10 h-10 object-cover object-center rounded-full  shadow-sm cursor-default" width={80} height={80} loading="lazy"/>
                <h1 className="font-semibold text-lg lg:text-2xl">Write a Journal</h1>
              </div>

              {/* closePostFormModal button */}
              <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full" onClick={() => closePostFormModal()}><i className="bi bi-x-lg cursor-pointer"></i></span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <input type="text" className={`text-md z-20 w-full flex flex-col min-h-8 dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none`} value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>

              <textarea name="body" id="body" ref={divRef} className={`text-md z-20 w-full flex flex-col min-h-8 dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={journalText} placeholder="Body" onChange={(e) => setJournalText(e.target.value)}></textarea>
              
              <div className={`w-full flex justify-between transition-all duration-150 mt-4`}>
                <select className="bg-accent/5 border-[1px] border-black/20 dark:border-[#CBC9C9]/20 w-full max-w-fit rounded-full text-xs font-semibold px-2 py-0 outline-none" onChange={(e) => setPrivacy(e.target.value)} defaultValue={"Change Privacy?"}>
                  <option disabled>Change Privacy?</option>
                  <option>For me</option>
                  <option>Everyone</option>
                </select>
                <button className={title !== '' && journalText.trim() !== '' && !isAddingPost && privacy !== null ? "px-6 py-2 bg-accent font-semibold text-white rounded-full scale-100" : "px-6 py-2 bg-accent/30 font-semibold text-white rounded-full transition-all duration-150 cursor-not-allowed"} onClick={handleSubmitJournal} disabled={isAddingPost && "disabled"}>{isAddingPost ?  'Posting...' : 'Post'}</button>
              </div>
            </div>
          </div>
        </div> 
        
        const allJournals = posts.filter((post) => post.type == 'journal').map(post => (post.privacy == 'Everyone' || post.u_id == loggedUser?.u_id) && post)
        const filterJournals = allJournals.filter(post => post !== false)
        // console.log(filterJournals)
        if(filterJournals?.length > 0){
          // get all posts 
          content = filterJournals.map(post => (
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
                      ))
        }
        if(filterJournals.length < 1){
          content = <div className="w-full h-56 flex flex-col justify-center items-center">No Journals to see yet</div>
        }
    }
      
  }

  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if(search.trim() !== '') {
      navigate(`/search/${search}`)
    }
  }


  return (
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0">
        {/* <Navbar /> */}
        {newPostForm}

        <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-0 pb-20 md:pb-28 lg:pb-0 md:gap-5 mb-7 md:mb-14 lg:mb-0">

          <SideBar
          uid={loggedUser !== null ? loggedUser.u_id : null} 
          page={'home'} 
          toggleSearchBar={handleShowSearch}/>

          {/* main section  */}
          <div className={loggedUser?.u_id !== null ? "w-full flex flex-col col-span-4 border-r-[1px] border-l-[1px] mt-5 border-black/5 dark:border-[#CBC9C9]/20" : "w-full flex flex-col col-span-4 border-r-[1px] border-l-[1px] border-black/5 dark:border-[#CBC9C9]/20 justify-center items-center"}>

            {loggedUser?.u_id && <ul className="sticky top-0 flex justify-evenly text-center dark:text-[#CBC9C9] w-full bg-base-100/90 dark:bg-black/90 backdrop-blur-md overflow-scroll no-scrollbar text-sm md:text-base font-medium z-40">
              <li className={`w-full ${tab === 'forYou' && "bg-primary/5 font-bold border-b-2 border-primary"} py-3 px-10 hover:bg-primary/5 cursor-pointer`} onClick={() => setTab('forYou')}>For you</li>
              <li className={`w-full ${tab === 'following' && "bg-primary/5 font-bold border-b-[1px] border-primary"} py-3 px-10 hover:bg-primary/5 cursor-pointer`} onClick={() => setTab('following')}>Following</li>
              <li className={`w-full ${tab === 'journal' && "bg-accent/5 font-bold border-b-[1px] border-accent"} py-3 px-10 hover:bg-accent/5 cursor-pointer`} onClick={() => setTab('journal')}>Journal</li>
            </ul>}


            
            <div className="relative flex flex-col">
              {isLoading ? <div className="flex flex-col gap-4 p-4">
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                  <div className="skeleton dark:bg-slate-600 h-24 w-full opacity-15"></div>
                </div> : 
                <div className="relative w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                  {loggedUser && <div className="w-full flex justify-end lg:justify-start items-center px-4 my-5 text-sm dark:text-[#cbc9c9] fixed bottom-20 left-0 lg:sticky lg:top-12 py-2 lg:bg-base-100/90 dark:lg:dark:bg-black/90 lg:backdrop-blur-sm z-[110]"> 
                    <button className={`w-fit flex gap-2 justify-center items-center border-[1px] border-black bg-base-100 dark:bg-black dark:border-[#CBC9C9] font-semibold ${tab == 'journal' ? "hover:bg-accent/5 hover:border-accent hover:text-accent dark-hover:text-inherit" : "hover:bg-primary/5 hover:border-primary hover:text-primary "}  px-4 py-2 rounded-full shadow-md lg:shadow-none`} onClick={()=> setShowPostInModal(!showPostInModal)}><i className="bi bi-pencil"></i>{tab == 'journal' ? "Write Journal" : "Write Post"}</button>
                  </div>}
                  {content}
                  <p className="py-8 flex justify-center text-primary">.</p>
                </div>}
            </div>
          </div>

          {/* side bar */}
          <div className="hidden sticky top-0 lg:flex flex-col gap-5 h-fit col-span-2 py-3 z-0">
            {loggedUser?.u_id || isLoadingOtherUsers ? <>
              {/* search  */}
              <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 bg-base-100 dark:bg-black dark:text-[#cbc9c9] z-50">
                  <input type="text" name="search" id="search" value={search} placeholder="Search..." className="w-full px-4 py-2  border-[1px] dark:border-[#CBC9C9]/40 placeholder:text-inherit outline-none dark:bg-black dark:focus-within:bg-black/50 rounded-full" onChange={(e)=> setSearch(e.target.value).trim()}/>
              </form>
              <div className="py-3 border-t-[1px] border-[1px] border-black/5  dark:border-[#CBC9C9]/20 rounded-md">
                <h2 className="font-bold text-xl px-5 pb-4 dark:text-[#CBC9C9]">Suggested</h2>
                {isLoadingOtherUsers ? <div className="hidden sticky col-span-2 lg:flex flex-col gap-4">
                    <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                    <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                    <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                    <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                  </div> : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                  {userList}
                </div>}
              </div>
            </> 
            : 
            <div className="w-full h-fit flex flex-col py-32 justify-center items-center">
                <p>Join Us to</p>
                <h1 className="font-bold text-4xl">Explore</h1>
                <ul className="flex mt-10 gap-4">
                  <Link to={'/login'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-[#CBC9C9]   hover:bg-black hover:text-base-100 dark:hover:bg-slate-200">Login</li></Link>
                  <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-[#CBC9C9]   hover:bg-black hover:text-base-100 dark:hover:bg-slate-200">Register</li></Link>
                </ul>
            </div>
            }
          </div>
          
        </div>
         
         {/* Posted modal 
        {posted && postDetails.u_id && <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/80 items-center top-0 left-0 cursor-default z-[1000]">
            <p>Posted!</p>
            <Link to={window.location.origin+"/post/"+postDetails?.id}>View Post</Link>
        </div>} */}

        {/* search modal  */}
        <SearchModal 
          handleSearch={handleSearch}
          search={search}
          handleChange={(e)=>setSearch(e.target.value)}
        />


        <Footer 
        uid={loggedUser !== null ? loggedUser.u_id : null} 
        page={'home'} 
        toggleSearchBar={handleShowSearch}/>

        <NotLoggedInModal uid={loggedUser?.u_id}/>
    </div>
  )
}

export default Home