import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import ViewPostCard from "../components/ViewPostCard"
import Footer from "../sections/Footer"
import OtherUsersCard from "../components/OtherUsersCard"
import BackBtn from "../components/BackBtn"
import { getPost, singlePostDelete, deleteSingleComment} from "../features/singlePostSlice"
import { useDispatch, useSelector } from "react-redux"
// import useDeletePost from "../hooks/useDeletePost"
import useOtherUsers from "../hooks/useOtherUsers"
import useLikes from "../hooks/useLikes"
import useBookmarks from "../hooks/useBookmarks"
import useComments from "../hooks/useComments"
import useFollows from "../hooks/useFollows"
import { followUser, unfollow } from "../features/followSlice"
import { bookmarkPost, likePost, getPostComments, unBookmark, unlike, getLikes, getBookmarks } from "../features/postSlice"
// import CommentCard from "../components/CommentCard"
// import useCommentLikes from "../hooks/useCommentLikes"
import useCommentBookmarks from "../hooks/useCommentBookmarks"
import useAddComment from "../hooks/useAddComment"
import SideBar from "../components/SideBar"
import SearchModal from "../components/SearchModal"
import NotLoggedInModal from "../components/NotLoggedInModal"
// import useAddPost from "../hooks/useAddPost"
import usePosts from "../hooks/usePosts"
import PostCard from "../components/PostCard"
import supabase from "../config/supabaseClient.config"
// import Navbar from "../components/Navbar"

const Post = () => {

  const [search, setSearch] = useState('')
  const [newComment, setNewComment] = useState('')
  const textareaRef = useRef(null);


  const navigate = useNavigate()

  const {id: paramsId} = useParams()

  const { loggedUser, otherUsers, isLoading, isLoadingOtherUsers } = useSelector((state) => state.app)
  const { postComments, likes, bookmarks, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts)
  const { currentPost, comments, posted, isLoadingPost, isPosting, isDeletingComment, errorComment } = useSelector((state) => state.singlePost)
  const { follows, isLoadingFollows } = useSelector((state) => state.follows)
  const dispatch = useDispatch()

  usePosts()
  const {mutate} = useAddComment()
  const {mutate:currPostComments} = useComments()
  // const {mutate:del} = useDeletePost()
  const {mutate:others} = useOtherUsers()
  useLikes()
  useBookmarks()
  useCommentBookmarks()
  // useComments()
  useFollows()
  // useCommentLikes()

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
              dispatch(getLikes())
              dispatch(getBookmarks())
          }
      )
      .subscribe()
  }, [])
  
   
  // fetch all other users asides the one logged in or the one whose profile is being view at the moment
  useEffect(() => {
    const getOtherusers = (uid) => {
      if(loggedUser !== null) {
        others(uid)
      }
    }

    getOtherusers({loggedId:loggedUser?.u_id, currentId: loggedUser?.u_id})
  }, [loggedUser])

  useEffect(() => {
    currPostComments(paramsId)
    dispatch(getPost(paramsId))
    dispatch(getPostComments())
  }, [paramsId])

  const deletePost = (id) => {
    dispatch(singlePostDelete(id))
    // console.log(id)
  }

  const deleteComment = (id) => {
    // console.log(id)
    dispatch(deleteSingleComment(id))
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
      const findLiked = likes.find(like => (like?.post_id == id) && (like?.u_id == loggedUser?.u_id))
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
    if(comments !== null) {
      const filterComments = comments.filter(comment => comment?.post_id === id)
      if(filterComments) {
        return filterComments.length
      }
    }
  }

  const countReplies = (id) => {
    if(postComments !== null) {
      const filterComments = postComments.filter(comment => comment?.post_id === id)
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      if(textareaRef.current.scrollHeight <= 250) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        // console.log(textareaRef.current.style.height)
      } else {
        textareaRef.current.style.height = "250px";
      }
    }
  }, [newComment])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(newComment !== '') {
      if(currentPost.type == 'post'){
        mutate({type: 'comment', body: newComment.trim(), name: loggedUser.name, postUid: currentPost.u_id, u_id: loggedUser.u_id,  u_img: loggedUser.u_img, paramsId: paramsId})
      } else if(currentPost.type == 'comment' || currentPost.type == 'reply') {
        mutate({type: 'reply', body: newComment.trim(), name: loggedUser.name, postUid: currentPost.u_id, u_id: loggedUser.u_id,  u_img: loggedUser.u_img, paramsId: paramsId})
      }
    }
    // divRef.current.innerText = ''
  }

  useEffect(() => {
    if(posted) {
      setNewComment("")
    }
  }, [posted])
  

  let newCommentForm;
  let content;
  let allComments;
  let userList;

  
  if(loggedUser === null && isLoading === true){
    content = <div className="flex w-full flex-col gap-4 opacity-15">
                  <div className="flex items-center gap-4">
                    <div className="skeleton dark:bg-slate-600 h-16 w-16 shrink-0 rounded-lg"></div>
                    <div className="flex flex-col gap-4">
                      <div className="skeleton dark:bg-slate-600 h-4 w-20"></div>
                      <div className="skeleton dark:bg-slate-600 h-4 w-28"></div>
                    </div>
                  </div>
                  <div className="skeleton dark:bg-slate-600 h-96 w-full"></div>
                </div>
  }else {
    if(currentPost == 'error') {
      content = 'error'
    } else {

      // verify id and other users availability 
      if(!isLoading && otherUsers !== null) {
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
                      const verifyFollow = follows.find(follow => ((follow.followed_id == x.u_id) && (follow.follower_id == loggedUser?.u_id)))
                        // console.log(verifyFollow)
                        if(verifyFollow == undefined) {
                          // console.log(follows)
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

      // render form input
      newCommentForm = loggedUser?.u_id !== null && !isLoadingPost && 
      <div className={`relative w-full h-auto flex gap-2 p-2 z-40`}>
        <div className="flex w-full gap-2 items-start relative">
          <div className="flex w-8 h-8 overflow-clip z-20 rounded-full  shadow-sm cursor-default">
            <img src={loggedUser?.u_img} alt="" className="relative object-cover object-center" width={80} height={80} loading="lazy"/>
          </div>
          <textarea name="body" id="body" ref={textareaRef} className={`w-full text-md z-20 flex flex-col h-auto min-h-8 box-border dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={newComment} placeholder={currentPost?.type == 'post' ? 'Comment...' : 'Reply...'} onChange={(e) => setNewComment(e.target.value)} readOnly={isPosting && true}></textarea>
        </div>

        <div className={`flex justify-end ${newComment.trim() !== '' || isPosting ? "h-fit" : "h-0"}`}>
          <button className={`px-6 py-2 bg-primary font-semibold text-white rounded-full ${newComment.trim() !== '' ? "scale-100" : "scale-0"} ${isPosting && "opacity-50"} transition-all duration-150`} onClick={handleSubmit} disabled={isPosting && "disabled"}>{isPosting ?  <span className="loading loading-spinner loading-sm text-white"></span> : currentPost?.type == 'post' ? 'Comment' : 'Reply'}</button>
        </div>
      </div>
      // <div className={`w-full flex flex-col gap-2 justify-center items-center ${newComment !== '' ? "bg-base-100" : "bg-primary-content/5"} border-t-[1px] border-b-[1px] dark:border-[#CBC9C9]/40 mb-4 z-40`}>
      //   <>
      //     <div ref={divRef} className={`relative text-md z-20 w-full flex flex-col gap-5 dark:text-slate-200 rounded-t-lg p-4 h-auto dark:bg-base-100 outline-none ${newComment.length > 0 ? "before:content-[''] before:absolute" : "before:absolute before:content-['Add_opinion...'] before:text-neutral-400"}`} contentEditable="true"></div>
      //     <div className={`w-full flex justify-end ${newComment !== '' && "px-5 pb-2"} transition-all duration-150`}
      //     onClick={() => divRef.current.focus()}>
      //       <button className={newComment !== '' ? "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100" : isPending ? "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100" : "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-0 transition-all duration-150"} onClick={handleSubmit} disabled={isPending && "disabled"}>{isPending ?  <span className="loading loading-dots loading-sm text-white"></span> : currentPost?.type == 'post' ? 'Comment' : 'Reply'}</button>
      //     </div>
      //   </>

        {/* <div className={divRef.current !== null && newComment.length > 0 ? "hidden" : "absolute top-0 z-0 w-full flex flex-col gap-5 rounded-t-lg p-4 h-auto dark:bg-base-100"}>
          <span className="text-neutral-400">Say something...</span>
        </div> */}
      // </div> 

      if(isLoadingPost) {
        content = <div className="w-full flex gap-4">
                    <div className="skeleton dark:bg-slate-600 w-14 h-14 md:w-32 md:h-32 opacity-15"></div>
                    <div className="skeleton dark:bg-slate-600 h-32 md:h-52 w-full opacity-15"></div>
                  </div>
      }
      
      if(currentPost !== null){
        // render post
        content = <ViewPostCard 
                      key={currentPost?.id}
                      userId={loggedUser?.u_id}
                      postUserId={currentPost?.u_id !== loggedUser?.u_id ? true : false}
                      postUserIdVal = {currentPost?.u_id}
                      uImg={currentPost?.u_img} 
                      uName={currentPost?.u_name} 
                      postContent={currentPost?.body}
                      datetime={currentPost?.created_at}
                      postId={currentPost?.id}
                      liking={isLiking}
                      bookmarking={isBookmarking}
                      deleting={isDeletingPost}
                      toggleFollow={() => {
                              const verifyFollow = follows.find(x => ((x.followed_id == currentPost?.u_id) && (x.follower_id == loggedUser?.u_id)))
                                // console.log(verifyFollow)
                                if(verifyFollow == undefined) {

                                    dispatch(followUser({
                                    uid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    receiverUid: currentPost?.u_id,
                                    receiverName: currentPost?.u_name,
                                    receiverImg: currentPost?.u_img
                                  }))
                                } else {
                                    removeFollow(verifyFollow.id)
                                }
                          }}
                      following={isLoadingFollows}
                      followed={followed(currentPost?.u_id)}
                      commentsCount={countComments(currentPost?.id)}
                      likes={countLikes(currentPost?.id)}
                      liked={likedPost(currentPost?.id)}
                      bookmarks={countBookmarks(currentPost?.id)}
                      bookmarked={bookmarkedPost(currentPost?.id)}
                      likePost={() => {
                              const verifyLike = likes.find(x => ((x.post_id == currentPost?.id) && (x.u_id == loggedUser?.u_id)))
                                // console.log(verifyLike)
                                if(verifyLike == undefined) {

                                  dispatch(likePost({
                                    postId: currentPost.id,
                                    commentId: currentPost.post_id, 
                                    creatorUid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    postUid: currentPost.u_id,
                                    postBody: currentPost.body,
                                    for: currentPost.type
                                    }))
                                } else {
                                    removeLike(verifyLike.id)
                                }

                        // console.log(likes)
                          }}
                      bookmarkPost={() => {
                              const verifyBookmark = bookmarks.find(x => ((x.post_id == currentPost.id) && (x.u_id == loggedUser?.u_id)))
                                // console.log(verifyBookmark)
                                if(verifyBookmark == undefined) {

                                  dispatch(bookmarkPost({
                                    postId: currentPost.id, 
                                    commentId: currentPost.post_id,
                                    creatorUid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    postUid: currentPost.u_id,
                                    postBody: currentPost.body,
                                    for: currentPost.type
                                  }))
                                } else {
                                    removeBookmark(verifyBookmark.id)
                                }

                        // console.log(bookmarks)
                          }}
                      // focusInput={() => focusInput()}
                      deletePost={()=> deletePost(currentPost.id)}
                    />

        if(comments !== null) {
          if(comments?.length > 0) {
            allComments = comments.map((post) => (
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
                      deleting={isDeletingComment}
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
                      comments={countReplies(post.id)}
                      likes={countLikes(post.id)}
                      liked={likedPost(post.id)}
                      bookmarks={countBookmarks(post.id)}
                      bookmarked={bookmarkedPost(post.id)}
                      likePost={() => {
                              const verifyLike = likes.find(x => ((x.post_id == post.id) && (x.u_id == loggedUser.u_id)))
                                console.log(verifyLike)
                                if(verifyLike == undefined) {
                                  // console.log(currentPost.body)
                                  // console.log(currentPost.id)
                                  dispatch(likePost({
                                    postId: post.id,
                                    commentId: currentPost.id,
                                    creatorUid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    postUid: post.u_id,
                                    postBody: post.body,
                                    for: post.type
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
                                      commentId: currentPost.id,
                                      creatorUid: loggedUser.u_id,
                                      creatorName: loggedUser.name,
                                      creatorImg: loggedUser.u_img,
                                      postUid: post.u_id,
                                      postBody: post.body,
                                      for: post.type
                                    }))
                                } else {
                                    removeBookmark(verifyBookmark.id)
                                }
                          }}
                      deletePost={()=> deleteComment(post.id)}
                    />
            ))
          }
          
        }
      }else if(errorComment) {
        // setLoading(false)
        content = <div className="w-full h-56 flex flex-col justify-center items-center">Network error. Try reload page.</div>
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
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0 dark:text-inherit">
      {/* <Navbar /> */}

        <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-4 lg:mt-0 pb-28 lg:pb-0 md:gap-2 mb-14 lg:mb-0">
          <SideBar
          uid={loggedUser !== null ? loggedUser.u_id : null} 
          toggleSearchBar={handleShowSearch}/>

        {currentPost == 'error' ? <div className="main w-full flex flex-col justify-center items-center col-span-6 border-[1px] border-black/5 "><p>This page does not exist.</p></div> :
          <>
            {isLoadingPost ? <div className={loggedUser?.u_id !== null && "main w-full flex flex-col col-span-4 border-[1px] border-black/5  dark:border-slate-500/20"}>
                <div className="flex w-full flex-col gap-4 opacity-15 px-5">
                  <div className="flex items-center gap-4">
                    <div className="skeleton dark:bg-slate-600 h-16 w-16 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-4">
                      <div className="skeleton dark:bg-slate-600 h-4 w-20"></div>
                      <div className="skeleton dark:bg-slate-600 h-4 w-28"></div>
                    </div>
                  </div>
                  <div className="skeleton dark:bg-slate-600 h-32 w-full"></div>
                </div>
              </div> : 

              // main section 
              <div className={loggedUser?.u_id !== null && "main w-full lg:h-screen flex flex-col col-span-4 border-r-[1px] border-l-[1px] border-black/5  dark:border-slate-500/20 overflow-scroll no-scrollbar"}>

              <div className="w-full flex justify-between px-3 bg-base-100/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">
                <BackBtn link={() => navigate(-1)} title={'Back'}/>

                {currentPost?.post_id ? <BackBtn link={() => navigate(`/post/${currentPost?.post_id}`)} title={'Jump to origin'}/> : ''}
              </div>

              <div>
                {content}
                {loggedUser?.u_id && newCommentForm}
              </div>
              <div>
                {allComments}
                <p className="py-8 flex justify-center text-primary">.</p>
              </div>

            </div>}

            {/* side bar */}
          <div className="hidden sticky right-0 top-0 lg:flex flex-col gap-5 h-fit col-span-2 py-3">
          {loggedUser?.u_id ? <>
            {/* search  */}
             <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 dark:bg-black z-50">
                <input type="text" name="search" id="search" value={search} placeholder="Search..." className="w-full px-4 py-2  border-[1px] dark:border-[#CBC9C9]/40 placeholder:text-[#cbc9c9] text-neutral-dark dark:text-dark-accent text-sm outline-none dark:bg-black dark:focus-within::bg-black/50 rounded-full" onChange={(e)=>setSearch(e.target.value)}/>
            </form>
            <div className="py-3 border-t-[1px] border-[1px] border-black/5  dark:border-slate-500/20 rounded-md">
                  <h2 className="font-bold text-xl px-5 pb-4 text-neutral-dark dark:text-neutral-lighter">You might interested in</h2>
                  {isLoading || isLoadingOtherUsers ? <div className="flex flex-col gap-4">
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                    </div> : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                    {userList}
                  </div>}
                </div>
              </> : 
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
          </>}
        </div>

        {/* search modal  */}
        <SearchModal 
          handleSearch={handleSearch}
          search={search}
          handleChange={(e)=>setSearch(e.target.value)}
        />


         <Footer 
          uid={loggedUser !== null && loggedUser?.u_id} 
          toggleSearchBar={handleShowSearch}/>

          <NotLoggedInModal uid={loggedUser?.u_id}/>
    </div>
  )
}

export default Post