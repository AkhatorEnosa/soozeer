import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import PostCard from "../components/PostCard";
import OtherUsersCard from "../components/OtherUsersCard";
import Footer from "../sections/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import useComments from "../hooks/useComments";
import useFollows from "../hooks/useFollows";
import useOtherUsers from "../hooks/useOtherUsers";
import { useDispatch, useSelector } from "react-redux";
import useDeletePost from "../hooks/useDeletePost";
import usePosts from "../hooks/usePosts";
import useAddPost from "../hooks/useAddPost";
import useLikes from "../hooks/useLikes";
import useBookmarks from "../hooks/useBookmarks";
import { bookmarkPost, likePost, unBookmark, unlike } from "../features/postSlice";
import { followUser, unfollow } from "../features/followSlice";
import useGetCurrentProfile from "../hooks/useGetCurrentProfile";
import useGetLikedPosts from "../hooks/useGetLikedPosts";
import useGetBookmarkedPosts from "../hooks/useGetBookmarkedPosts";
import supabase from "../config/supabaseClient.config";
import { Flip, toast } from "react-toastify";
import SideBar from "../components/SideBar";
import SearchModal from "../components/SearchModal";
import NotLoggedInModal from "../components/NotLoggedInModal";
import useReplies from "../hooks/useReplies";
import JournalCard from "../components/JournalCard";
import moment from "moment";
import { profileEdit } from "../features/appSlice";
// import Navbar from "../components/Navbar";

const Profile = () => {
  const [currentProfile, setCurrentProfile] = useState('')
  const [fullNameVal, setFullNameVal] = useState('')
  const [bioVal, setBioVal] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const [dob, setDob] = useState('')
  const [fileFound, setFileFound] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [fullNameValCount, setFullNameValCount] = useState(0)
  const [bioValCount, setBioValCount] = useState(0)
  const [dobPrivacy, setBobPrivacy] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [tab, setTab] = useState('posts')
  const [search, setSearch] = useState('')
  const [showFollowsModal, setShowFollowsModal] = useState(false)
  const [followType, setFollowType] = useState('')
  const tabsRef = useRef(null)
  
  const body = document.body

  // react router dom navigation and params 
  const navigate = useNavigate();
  const {id : profileId} = useParams()


  const { profileUser, loggedUser, otherUsers, isLoading, isLoadingProfile, isLoadingOtherUsers, isUpdatingProfile, updated } = useSelector((state) => state.app)
  const { posts, replies, postComments, likedPosts, bookmarkedPosts, likes, bookmarks, isLoadingPosts, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts)
  const { follows, isLoadingFollows } = useSelector((state) => state.follows)
  const dispatch = useDispatch()

  usePosts()
  useReplies()
  useAddPost()
  useLikes()
  useBookmarks()
  useComments ()
  useFollows()

  const {mutate:del} = useDeletePost()
  const {mutate:others} = useOtherUsers()
  const {mutate:profile} = useGetCurrentProfile()
  // const {mutate:profileFollows} = useFollows()
  const {mutate:profileLikedPosts} = useGetLikedPosts()
  const {mutate:profileBookmarkedPosts} = useGetBookmarkedPosts()

  useMemo(() => profile(profileId), [profile, profileId])
  // useMemo(() => profileFollows(profileId), [profileFollows, profileId])
  useMemo(() => profileLikedPosts(profileId), [profileLikedPosts, profileId])
  useMemo(() => profileBookmarkedPosts(profileId), [profileBookmarkedPosts, profileId])

  useEffect(() => {
    // console.log(loggedUser?.dob)
    if(showEdit || showFollowsModal) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [showEdit, showFollowsModal])
  
  useEffect(() => {
    setProfilePic(currentProfile?.u_img)
    const getOtherusers = (uid) => {
      if(loggedUser !== null && !isLoadingOtherUsers) {
        others(uid)
      }
    }

    getOtherusers({loggedId:loggedUser?.u_id, currentId: profileId})
    setCurrentProfile(JSON.parse(JSON.stringify(profileUser)))
  }, [profileId, currentProfile !== null ? "" : currentProfile, loggedUser, profileUser, likedPosts])

  // get today's full date in YYYY-MM-DD format 
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate()

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

  const getFollowings = () => {
    const followings = follows?.filter(follow => follow.follower_id === profileId)
    return followings
  } 

  const getFollowers = () => {
    const followers = follows?.filter(follow => follow.followed_id === profileId)
    return followers
  } 

  
  const deletePost = (id) => {
    del({id})
  }

  const removeLike =(id) => {
    console.log(id)
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
      const filterComments = postComments.filter(comment => comment?.post_id === id)
      if(filterComments) {
        return filterComments.length
      }
    }
  }

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

  
  // feeding content to be rendered conditionally
  let content;
  let userList;

  // Loading? 
  if(isLoading){
      content =
          <div className="w-full flex flex-col gap-4">
            <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
            <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
            <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
            <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
          </div>
  }else{ 
    
    // verify id and other users availability 
    if(loggedUser?.u_id) {
      if (otherUsers !== null) {
        if(otherUsers?.length > 0 && !isLoadingOtherUsers) {
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
                    const verifyFollow = follows.find(follow => ((follow.followed_id == x.u_id) && (follow.follower_id == loggedUser?.u_id)))
                      console.log(verifyFollow)
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
        userList = <h1 className="w-full h-56 flex flex-col gap-4 justify-center items-center z-50 text-5xl text-black/50 py-5"><i className="bi bi-people"></i> <p className="text-base">No body to see, yet!</p></h1>
      }
      }
    } else {
      userList = <h1 className="w-full h-56 flex flex-col gap-4 justify-center items-center z-50 text-5xl text-black/50 py-5"><i className="bi bi-people"></i> <p className="text-base">No body to see, yet!</p></h1>
    }

    // render posts based on tab 
    if(tab === 'posts') {
      // if(tabsRef.current !== null) {
      //       tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
      //   }

      const filteredPost = posts?.filter((post) => post?.u_id == profileId && post.type == 'post')
      if(filteredPost?.length > 0) {
        content = filteredPost.map(post => (
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
                                    profileId: profileId
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
      } else {content = <div className="w-full py-10 flex flex-col gap-4">
        <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-chat-text"></i> <p className="text-base">No Posts yet!</p></h1>
      </div>
      }
    } 
    else if(tab === 'likes') {
      if(loggedUser?.u_id == profileId) {
        const sortLikedPosts = JSON.parse(JSON.stringify(likedPosts)).sort((a, b) => b.likes[0].id - a.likes[0].id)
        // const filterLikes  = sortLikedPosts(post => post.type)
        if(sortLikedPosts.length > 0) {
          content = sortLikedPosts.map(post => (
                    (post.type == 'post') ? (
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
        } else {content = <div className="w-full py-10 flex flex-col gap-4"><h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-heart"></i> <p className="text-base">No Likes yet!</p></h1></div>
        }
      } else {
        setTab("posts")
      }
      // if(tabsRef.current !== null) {
      //       tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
      //   }
      
    }  
    else if(tab === 'replies') {
      // if(tabsRef.current !== null) {
      //       tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
      //   }
        const filteredReplies = replies?.filter((reply) => reply?.u_id == profileId && reply?.post_id !== 0)
      // const sortLikedPosts = JSON.parse(JSON.stringify(likedPosts)).sort((a, b) => b.likes[0].id - a.likes[0].id)
      if(filteredReplies.length > 0) {
        content = filteredReplies.map(reply => (
                    <PostCard 
                      key={reply.id}
                      userId={loggedUser?.u_id}
                      postUserId={reply.u_id === loggedUser?.u_id ? true : false}
                      postUserIdVal = {reply.u_id}
                      uImg={reply.u_img} 
                      openComment={() => {
                        navigate(`/post/${reply.id}`)
                      }}
                      uName={reply.u_name} 
                      postContent={reply.body}
                      datetime={reply.created_at}
                      postId={reply.id}
                      liking={isLiking}
                      bookmarking={isBookmarking}
                      deleting={isDeletingPost}
                      following={isLoadingFollows}
                      toggleFollow={() => {
                              const verifyFollow = follows.find(x => ((x.followed_id == reply.u_id) && (x.follower_id == loggedUser.u_id)))
                                // console.log(verifyFollow)
                                if(verifyFollow == undefined) {
                                  // console.log(follows)
                                  dispatch(followUser({
                                    uid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    receiverUid: reply.u_id,
                                    receiverName: reply.u_name,
                                    receiverImg: reply.u_img
                                  }))
                                } else {
                                    removeFollow(verifyFollow.id)
                                }
                          }}
                      followed={followed(reply.u_id)}
                      comments={countComments(reply.id)}
                      likes={countLikes(reply.id)}
                      liked={likedPost(reply.id)}
                      bookmarks={countBookmarks(reply.id)}
                      bookmarked={bookmarkedPost(reply.id)}
                      likePost={() => {
                              const verifyLike = likes.find(x => ((x.post_id == reply.id) && (x.u_id == loggedUser.u_id)))
                                // console.log(verifyLike)
                                if(verifyLike == undefined) {
                                  dispatch(likePost({
                                    postId: reply.id, 
                                    creatorUid: loggedUser.u_id,
                                    creatorName: loggedUser.name,
                                    creatorImg: loggedUser.u_img,
                                    postUid: reply.u_id,
                                    postBody: reply.body,
                                    }))
                                } else {
                                    removeLike(verifyLike.id)
                                }
                          }}
                      bookmarkPost={() => {
                              const verifyBookmark = bookmarks.find(x => ((x.post_id == reply.id) && (x.u_id == loggedUser.u_id)))
                                // console.log(verifyBookmark)
                                if(verifyBookmark == undefined) {
                                    dispatch(bookmarkPost({
                                      postId: reply.id, 
                                      creatorUid: loggedUser.u_id,
                                      creatorName: loggedUser.name,
                                      creatorImg: loggedUser.u_img,
                                      postUid: reply.u_id,
                                      postBody: reply.body,
                                    }))
                                } else {
                                    removeBookmark(verifyBookmark.id)
                                }
                          }}
                      deletePost={()=> deletePost(reply.id)}
                    />
                    ))
      } else {content = <div className="w-full py-10 flex flex-col gap-4"><h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-chat-text"></i> <p className="text-base">No Replies Yet!</p></h1></div>
      }
    } 
    else if(tab === 'journals') {
      const getJournalsByProfiileViewer = () => {
        if(loggedUser?.u_id === profileId) {
          return posts.filter((post) => post.type == 'journal' && post.u_id == loggedUser?.u_id)
        } else {
          return posts.filter((post) => post.type == 'journal' && post.privacy == 'Everyone' && post.u_id == profileId)
        }
      }
          
        // const allJournals = posts.filter((post) => post.type == 'journal')
        const filterJournals = getJournalsByProfiileViewer()
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
        } else {content = <div className="w-full py-10 flex flex-col gap-4"><h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-chat-text"></i> <p className="text-base">No Journals Yet!</p></h1></div>
      }
    } 
    else {
      if(loggedUser?.u_id == profileId) {
        const sortBookmarkedPosts = JSON.parse(JSON.stringify(bookmarkedPosts)).sort((a, b) => b.bookmarks[0].id - a.bookmarks[0].id)
        if(sortBookmarkedPosts?.length > 0) {
          content = sortBookmarkedPosts?.map(post => (
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
                      ))
        } else {
          content = <div className="w-full py-10 flex flex-col gap-4"><h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl"><i className="bi bi-bookmark-dash"></i> <p className="text-base">No Bookmarks yet!</p></h1></div>
        }
      } else {
        setTab("posts")
      }
    }
  } 

  // Toggle Search Bar 
  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal()
  }

  // Toggle Edit Modal 
  const handleShowEdit = () => {
    if(loggedUser.bio !== null && loggedUser.bio.length > 0) {
      setBioVal(loggedUser.bio)
      setBioValCount(loggedUser.bio.length)
    } else {
      setBioVal('')
      setBioValCount(0)
    }

    if(loggedUser.name.length > 0) {
      setFullNameVal(currentProfile.name)
      setFullNameValCount(currentProfile.name.length)
    } else {
      setFullNameVal('')
      setFullNameValCount(0)
    }

    if(loggedUser.dob !== null) {
      setDob(currentProfile.dob)
    } else {
      setDob('')
    }
    setShowEdit(true)
  }

  const handleFile = (e) => {
    setUpdating(true)
    if(e.target.files.length > 0) {
      setFileFound(e.target.files[0])
      console.log("fileFound" , fileFound)
    }
  }

  // Edit bio field onchange function 
  const handleBioChange = (e) => {
    // check and track bio field value length 
   if (bioVal?.length <= 150)  {
    setBioVal(e.target.value)
    setBioValCount(e.target.value.length)
   }
  }

  // Edit fullname field onchange function 
  const handleFullNameChange = (e) => {
    // check and track fullname field value length 
   if (fullNameVal.length <= 50)  {
    setFullNameVal(e.target.value)
    setFullNameValCount(e.target.value.length)
   }
  }

  useEffect(() => {
    const displayImage = async() => {
      if(fileFound !== '' && typeof(fileFound) === 'object') {

        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        const filesize = fileFound.size


        if(filesize > 1048576) {
          toast.info("File size too large. Must be below 1MB", {className: "bg-info text-white text-sm md:w-full font-semibold]", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          setUpdating(false)
        }

        if(!allowedExtensions.exec(fileFound.name)) {
          toast.error("Only upload JPG, JPEG or PNG files", {className: "bg-error text-sm text-white md:w-full font-semibold]", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          setUpdating(false)
        }

        if(filesize < 1000000 && allowedExtensions.exec(fileFound.name)){ 
          const {data, error} = await supabase.storage
          .from('uploads')
          .upload(`${uuidv4()}_${currentProfile.u_id}`, fileFound)

          if(error) {
            toast.error("Could not process your image upload. Try again", {className: "bg-error text-sm text-white md:w-full font-semibold]", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          }

          if(data) {
            setProfilePic(`https://zkyloatzdjcjvjoehrdu.supabase.co/storage/v1/object/public/uploads/${data.path}`)
            toast.info("Image ready for upload", {className: " text-sm bg-info text-white md:w-full font-semibold]", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
            setImagePath(data.path)
            console.log("profilePic", profilePic)
            console.log("path", imagePath)
          }
            setUpdating(false)
        }
      } else {
        setProfilePic(currentProfile?.u_img)
      }
    }

    displayImage()
  }, [fileFound])

  useEffect(() => {
    if(updated && !isUpdatingProfile) {
      setShowEdit(false)
      setUpdating(false)
      currentProfile.bio = bioVal
      currentProfile.name = fullNameVal
    }
  }, [updated])

  // Edit bio function 
  const handleEdit = (e) => {
    // setUpdating(true)
    e.preventDefault()

    if(bioVal?.length <= 150 && dob !== '') {
      dispatch(profileEdit({
        name: fullNameVal,
        bio: bioVal,
        dob: dob,
        dob_privacy: dobPrivacy == "For me" || dobPrivacy == null ? true : false,
        u_img: profilePic,
        u_id: loggedUser?.u_id
      }))

    } else {
      toast.info('Your bio should not be more than 50 characters.', {className: "bg-info text-white text-xs", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
        setUpdating(false)
    }
    
  }

  // Do if Edit modal is canceled/closed 
  const handleCloseEdit = async() => {
    setFullNameVal(loggedUser.name)
    setBioVal(loggedUser.bio)
    setDob(loggedUser.dob)

    // deletefrom storage item 
    if(imagePath !== '') {
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .remove([imagePath])

        if(error) {
          return error
        }

        if(data.length > 0) {
          // console.log(imagePath)
          console.log('removed')
          // console.log(data)
          setImagePath('')
          setProfilePic('')
          setShowEdit(false) 
        }
    } else {
      setShowEdit(false)
    }
  }

  // search function 
  const handleSearch = (e) => {
    e.preventDefault()
    if(search.trim() !== '') {
      navigate(`/search/${search}`)
    }
  }



  return (
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0">
      {/* <Navbar /> */}

        {/* main section  */}
          <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-0 mb-24 lg:pb-0 md:gap-5 mb:mb-0">
            <SideBar
            uid={loggedUser !== null ? loggedUser.u_id : null} 
            page={'profile'} 
            paramsId={profileId}
            toggleSearchBar={handleShowSearch}/>

            {profileUser == 'error' ? <div className="main w-full flex flex-col justify-center items-center col-span-6 border-r-[1px] border-l-[1px] border-black/5 "><p>This page does not exist.</p></div> :

              // main section 
              <>
                <div className="main w-full flex flex-col col-span-4 border-r-[1px] border-l-[1px] border-black/5 dark:border-slate-500/20">

                  <div className="w-full flex px-3 bg-base-100/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">
                    <BackBtn link={() => navigate(-1)} title={'Back'}/>
                  </div>

                  <div className="relative info w-full flex gap-2 md:gap-5 justify-between items-center py-5 md:py-8 overflow-hidden">

                    {isLoadingProfile ? 
                      <div className="skeleton dark:bg-slate-600 h-48 w-full opacity-15 z-40"></div> : 
                      <div className="relative w-full flex gap-2 px-2 md:px-8 md:gap-4 items-start z-40">
                          <img src={currentProfile?.u_img} alt="" className="w-20 h-20 object-cover object-center rounded-md z-50" width={80} height={80} onClick={() => window.open(currentProfile.u_img, '_blank').focus()} loading="lazy"/>
                          <div className="w-full flex flex-col md:flex-row md:justify-between gap-3">
                            <div className="w-full flex flex-col gap-2">
                              <div className="w-full">
                                <h1 className="md:text-2xl font-semibold dark:text-[#CBC9C9]">{fullNameVal === '' ? currentProfile?.name : fullNameVal}</h1>
                                <div className="relative -top-1 ">
                                  <h3 className="text-[10px] md:text-xs text-neutral-400">@{currentProfile?.u_name}</h3>
                                  <p className={currentProfile?.bio === null || currentProfile?.bio === '' ? "hidden" : "w-full text-xs md:text-sm text-left mt-1"}>{bioVal === '' ? currentProfile?.bio : bioVal}</p>
                                </div>
                                {currentProfile?.u_id == loggedUser?.u_id || currentProfile?.dob !== null && currentProfile?.dob_privacy == false  ? <div className="w-full flex items-center text-inherit dark:text-[#cbc9c9] gap-2 text-neutral-500 font-semibold">
                                  {currentProfile?.dob !== null && <><span className="w-fit flex gap-2 text-xs items-center"><i className="bi bi-cake2-fill"></i>Birthday on {moment(currentProfile?.dob).format("MMMM Do, YYYY")}</span>
                                  {currentProfile?.u_id == loggedUser?.u_id && <span className="flex gap-1 justify-center items-center text-[8px] px-2 border-[1px] border-info text-info bg-info/10 font-semibold rounded-full"><i className="bi bi-person-fill-lock"></i>{currentProfile?.dob_privacy == true ? "For Me" : "Everyone"}</span>}</>}
                                </div> : "" 
                                }
                                <p className="w-full flex items-center text-xs dark:text-[#cbc9c9] gap-2 text-neutral-500 font-semibold"><i className="bi bi-calendar3"></i>Joined {moment(currentProfile?.created_at).format('MMMM YYYY')}</p>
                              </div>


                              <div className="w-full flex gap-3 text-xs md:text-sm font-bold">
                                <p className="hover:underline cursor-pointer" onClick={() => setShowFollowsModal(true) & setFollowType('followings')}>{getFollowings()?.length} Followings</p>
                                <p className="hover:underline cursor-pointer" onClick={() => setShowFollowsModal(true) & setFollowType('followers')}>{getFollowers()?.length} Followers</p>
                              </div>
                            </div>

                            {loggedUser !==null && (profileId !== loggedUser?.u_id) && 
                              <div className="absolute right-4 h-fit flex gap-2 items-center">
                                <button className="flex size-8 lg:size-10 gap-1 justify-center items-center  text-[10px] md:text-sm text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" onClick={() => navigate(`/messages/${profileId}`)}><i className="bi bi-envelope"></i></button>

                                <button className={!followed(profileId) ? "flex w-fit h-fit gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group w-fit flex gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300"} onClick={() => {
                                const verifyFollow = follows.find(follow => ((follow.followed_id == profileId) && (follow.follower_id == loggedUser?.u_id)))
                                  if(verifyFollow == undefined) {
                                    // console.log({
                                    //   "Follower UserId": loggedUser.u_id,
                                    //   "Follower Username": loggedUser.name, 
                                    //   "Follower User Image": loggedUser.u_img, 
                                    //   "Followed UserId": currentProfile.u_id,
                                    //   "Followed Username": currentProfile.name,
                                    //   "Followed User Image": currentProfile.u_img
                                    //   })
                                      dispatch(followUser({
                                        uid: loggedUser.u_id,
                                        creatorName: loggedUser.name,
                                        creatorImg: loggedUser.u_img,
                                        receiverUid: currentProfile.u_id,
                                        receiverName: currentProfile.name,
                                        receiverImg: currentProfile.u_img
                                      }))
                                  } else {
                                      removeFollow(verifyFollow.id)
                                  }
                                }}>{followed(profileId) === false ? <><i className="bi bi-plus-lg"></i> Follow</> : <>
                                  <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span></>}</button>
                              </div>
                            }
                          </div>
                      </div>}

                    {profileId === loggedUser?.u_id && <button onClick={handleShowEdit} className="absolute right-3 top-0 z-40 flex gap-2 justify-center m-2 bg-black hover:bg-primary cursor-pointer w-7 h-7 md:w-10 md:h-10 items-center text-sm md:text-lg text-white rounded-full shadow-md" title="Edit Bio"><i className="bi bi-pencil-square"></i></button>}
                  </div>

                  <div className="tabs divide-y-[1px] divide-black/5 dark:divide-slate-500/20 flex flex-col items-center">
                    <ul className={`grid ${loggedUser?.u_id === profileId ? "w-full grid-cols-5" : "w-full md:w-[60%] grid-cols-3"} justify-between overflow-scroll no-scrollbar text-sm md:text-base font-medium bg-base-100/50 dark:bg-black/50 backdrop-blur-sm sticky top-10 z-[100]`} ref={tabsRef}>
                      <li className={tab === 'posts' ? "w-full text-center border-b-2 border-primary py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"} onClick={() => setTab('posts')}>Posts</li>
                      <li className={tab === 'replies' ? "w-full text-center border-b-2 border-primary py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"} onClick={() => setTab('replies')}>Replies</li>
                      <li className={tab === 'journals' ? "w-full text-center border-b-2 border-primary py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"} onClick={() => setTab('journals')}>Journals</li>
                      {loggedUser?.u_id === profileId && <li className={tab === 'likes' ? "w-full text-center border-b-2 border-primary py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"} onClick={() => setTab('likes')}>Likes</li>}
                      {loggedUser?.u_id === profileId && <li className={tab === 'bookmarks' ? "w-full text-center border-b-2 border-primary py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"} onClick={() => setTab('bookmarks')}>Bookmarks</li>}
                    </ul>
                    {<div className="w-full content">
                      {isLoadingPosts || isLoadingProfile ? <div className="w-full flex flex-col gap-4">
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                        <div className="skeleton dark:bg-slate-600 h-20 w-full opacity-15"></div>
                      </div>  : content}
                      <p className="py-8 flex justify-center text-primary">.</p>
                    </div>}
                  </div>
                </div> 

                {/* side bar */}
                <div className="hidden sticky right-0 top-0 lg:flex flex-col gap-5 h-fit col-span-2 py-3">
                {loggedUser?.u_id ? <>
                  {/* search  */}
                  <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 bg-base-100 dark:bg-black z-50">
                      <input type="text" name="search" id="search" value={search} placeholder="Search..." className="w-full px-4 py-2 border-[1px] dark:border-[#CBC9C9]/40 placeholder:text-inherit outline-none dark:bg-black dark:focus-within::bg-black/50 rounded-full" onChange={(e)=>setSearch(e.target.value)}/>
                  </form>
                  <div className="py-3 border-t-[1px] border-[1px] border-black/5  dark:border-slate-500/20 rounded-md">
                    <h2 className="capitalize font-bold text-xl px-5 mb-3 dark:text-[#CBC9C9]">Other Interests</h2>
                    {isLoading || isLoadingOtherUsers ? <div className="w-full flex flex-col gap-4">
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                      <div className="skeleton dark:bg-slate-600 h-10 w-full opacity-15"></div>
                    </div> : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                      {userList}
                    </div>}
                  </div></> : 
                  <div className="w-full flex flex-col py-32 justify-center items-center">
                      <p>Join Us to</p>
                      <h1 className="font-bold text-4xl">Explore</h1>
                      <ul className="flex mt-10 gap-4">
                        <Link to={'/login'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-[#CBC9C9]   hover:bg-black hover:text-base-100 dark:hover:bg-slate-200">Login</li></Link>
                        <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-[#CBC9C9]   hover:bg-black hover:text-base-100 dark:hover:bg-slate-200">Register</li></Link>
                      </ul>
                  </div>}
                </div>
              </>
            }
          </div>

        {/* bio edit modal  */}
        <div className={showEdit == false ? 'hidden' : "fixed w-screen h-screen flex justify-center px-10 bg-base-100/90 dark:bg-black/90 items-center top-0 left-0 cursor-default z-[1000]"} >
          <div className="w-full flex flex-col md:w-[80%] lg:w-[50%] max-h-[90%] bg-base-100 dark:bg-black px-2 md:px-4 py-2 md:py-5 rounded-md gap-6 border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20 overflow-scroll">
            <div className="w-full flex justify-between items-center">
              <h1 className="font-bold w-fit flex gap-2 justify-center items-center text-lg md:text-xl">Edit <i className="bi bi-pencil-square"></i></h1>
              <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full" onClick={handleCloseEdit}><i className="bi bi-x-lg cursor-pointer"></i></span>
            </div>

            <form className="w-full flex flex-col gap-2 md:gap-7 justify-center items-center px-2 md:px-4 py-2 md:py-4 rounded-lg text-xs">


              <label className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-center gap-2">
                  <p className="font-semibold text-xs md:text-sm">Fullname</p>
                  <p className="font-bold text-xs md:text-sm text-primary dark:text-white">{`${fullNameValCount}/50`}</p>
                </div>
                <input name="fullname" id="fullname" maxLength={50}
                  className={fullNameVal !== '' ? "w-full rounded-lg p-2 dark:bg-black placeholder:text-sm text-sm md:text-xl border-[1px] dark:border-[#CBC9C9]/40 outline-none" : "w-full rounded-lg p-2 dark:bg-black placeholder:text-sm text-sm md:text-xl border border-error bg-error/5 dark:bg-black/50 outline-none"} value={fullNameVal} placeholder="Fullname" onChange={handleFullNameChange}/>
              </label>


              <label className="w-full flex flex-col gap-2">
                <p className="font-semibold text-xs md:text-sm">Display Picture</p>
                <div className="w-full flex gap-5 items-center border-[1px] px-2 py-4 rounded-lg md:p-3 group dark:bg-black/50 hover:bg-primary-content/5  dark:border-[#CBC9C9]/40 cursor-pointer">
                  <div className="relative w-fit flex justify-center items-center">
                    <img src={profilePic} alt="profilepic" className="w-10 h-10 md:w-48 md:h-48 z-30 object-cover object-center rounded-full" width={80} height={80} loading="lazy"/>
                      <div className="absolute w-full h-full flex flex-col justify-center gap-1 z-50 text-white/70 transition-all duration-200 bg-black/50 rounded-full">
                      {updating ? <p className="w-full flex justify-center items-center"><span className="loading loading-spinner loading-sm text-white"></span></p> : <>
                        <i className="bi bi-image w-full text-center text-xl md:text-3xl lg:text-5xl hover:text-white cursor-pointer"></i>
                        <input type="file" name="file" id="file" className="hidden" onChange={handleFile}/></>}
                      </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="mb-2 text-sm font-semibold">Click to upload</p>
                    <p className="text-xs">PNG, JPG or JPEG (MAX. 1MB)</p>
                  </div>
                </div>
              </label>

              <label className="w-full">
                <div className="w-full flex justify-between items-center gap-2 mb-2">
                  <p className="font-semibold">Bio</p>
                  <p className="font-bold text-sm text-primary dark:text-white">{`${bioValCount}/150`}</p>
                </div>
                <textarea rows={5} maxLength={150} name="post" id="edit" 
                  className="w-full rounded-lg p-2 placeholder:text-sm text-sm md:text-base border dark:bg-black/50 dark:border-[#CBC9C9]/40 outline-none" value={bioVal} placeholder="Bio..." onChange={handleBioChange}/>
              </label>

              <label className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-center gap-2">
                  <p className="font-semibold text-xs md:text-sm">Date Of Birth</p>
                  <select className="bg-primary/5 border-[1px] border-black/20 dark:border-[#CBC9C9]/40 dark:bg-primary/20 w-full max-w-fit rounded-full text-xs font-semibold px-2 py-0 outline-none" onChange={(e) => setBobPrivacy(e.target.value)} defaultValue={"Change Privacy?"}>
                    <option disabled>Change Privacy?</option>
                    <option>For me</option>
                    <option>Everyone</option>
                  </select>
                </div>
                <input name="dob" id="dob" type="date" max={getTodayDate()}
                  className={dob !== '' ? "w-full rounded-lg p-2 dark:text-[#cbc9c9] dark:bg-black placeholder:text-sm text-sm md:text-xl border-[1px] dark:border-[#CBC9C9]/40 outline-none" : "w-full rounded-lg p-2 dark:text-[#cbc9c9] dark:bg-black placeholder:text-sm text-sm md:text-xl border border-error bg-error/5 dark:bg-black/50 outline-none"} value={moment(dob).format("YYYY-MM-DD")} placeholder="Enter your Date of Birth" onChange={(e) => setDob(e.target.value)}/>
              </label>

              {fullNameVal !== '' && dob !== '' && <button className="w-full btn btn-primary text-white rounded-full" onClick={handleEdit} disabled={isUpdatingProfile && "disabled"}>{isUpdatingProfile ?  <span className="loading loading-spinner loading-sm text-white"></span> : 'Update'}</button>}

            </form>
          </div>
        </div>

        {/* followings/followers modal  */}
        <div className={`w-screen h-screen ${showFollowsModal ? "flex" : "hidden"} flex-col justify-center items-center fixed top-0 left-0 bg-base-100/90 dark:bg-black/90 shadow-lg mb-4 z-[120]`}>
          <div className="flex flex-col justify-center items-center bg-base-100 dark:bg-black p-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
            <div className="w-full flex justify-between items-center mb-5">
              <div className="flex gap-2 items-center">
                <h1 className="font-semibold text-lg lg:text-2xl">{followType == 'followers' ? "Followers" : "Followings"}</h1>
              </div>

              {/* closePostFormModal button */}
              <span className="size-10 flex justify-center items-center p-2 bg-black/5 lg:bg-none hover:bg-black/5 rounded-full" onClick={() => setShowFollowsModal(!showFollowsModal)}><i className="bi bi-x-lg cursor-pointer"></i></span>
            </div>

            {followType == "followers" && getFollowers()?.length > 0 ? getFollowers()?.map((follower) => (
              <div key={follower.id} className="px-3 py-2 lg:py-3 flex items-center justify-between gap-3 w-full text-neutral dark:text-neutral-content hover:bg-primary/5">
              <Link to={`../${follower.follower_id}`} className="w-full flex items-center text-inherit dark:text-[#cbc9c9] underline hover:no-underline gap-2">
                <img src={follower.follower_img} className="size-8 lg:size-10 object-cover rounded-full cursor-default" loading="lazy"/>
                <div className="flex flex-col">
                  <b className="text-xs lg:text-sm">{follower.follower_name}</b> 
                </div>
              </Link>
              {loggedUser?.u_id !== follower.follower_id && <button className={!followed(follower.follower_id) ? "flex w-fit h-fit gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group w-fit flex gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300"} onClick={() => {
                                const verifyFollow = follows.find(follow => ((follow.followed_id == follower.follower_id) && (follow.follower_id == loggedUser?.u_id)))

                                  if(verifyFollow == undefined) {
                                      dispatch(followUser({
                                        uid: loggedUser.u_id,
                                        creatorName: loggedUser.name,
                                        creatorImg: loggedUser.u_img,
                                        receiverUid: follower.follower_id,
                                        receiverName: follower.follower_name,
                                        receiverImg: follower.follower_img
                                      }))
                                  } else {
                                    // console.log(verifyFollow.id)
                                      removeFollow(verifyFollow.id)
                                  }
                                }}>{followed(follower.follower_id) === false ? <><i className="bi bi-plus-lg"></i> Follow</> : <>
                                  <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span></>}</button>}
            </div> 
            )) : followType == "followings" && getFollowings()?.length > 0 ? getFollowings()?.map((following) => (
              <div key={following.id} className="px-3 py-2 lg:py-3 flex items-center justify-between gap-3 w-full text-neutral dark:text-neutral-content hover:bg-primary/5">
              <Link to={`../${following.followed_id}`} className="w-full flex items-center text-inherit dark:text-[#cbc9c9] underline hover:no-underline gap-2">
                <img src={following.followed_img} className="size-8 lg:size-10 object-cover rounded-full cursor-default" loading="lazy"/>
                <div className="flex flex-col">
                  <b className="text-xs lg:text-sm">{following.followed_name}</b> 
                </div>
              </Link>
              {loggedUser?.u_id !== following.followed_id && <button className={!followed(following.followed_id) ? "flex w-fit h-fit gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group w-fit flex gap-1 justify-center items-center  text-[10px] md:text-sm px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300"} onClick={() => {
                                const verifyFollow = follows.find(follow => ((follow.followed_id == following.followed_id) && (follow.follower_id == loggedUser?.u_id)))

                                  if(verifyFollow == undefined) {
                                      dispatch(followUser({
                                        uid: loggedUser.u_id,
                                        creatorName: loggedUser.name,
                                        creatorImg: loggedUser.u_img,
                                        receiverUid: following.followed_id,
                                        receiverName: following.followed_name,
                                        receiverImg: following.followed_img
                                      }))
                                  } else {
                                      removeFollow(verifyFollow.id)
                                  }
                                }}>{followed(following.followed_id) === false ? <><i className="bi bi-plus-lg"></i> Follow</> : <>
                                  <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span></>}</button>}
            </div> 
            )) : (getFollowers()?.length <= 0) ? "No Followers" : (getFollowings()?.length <= 0) && "No Followings"}
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
          page={'profile'} 
          paramsId={profileId}
          toggleSearchBar={handleShowSearch}/>

        <NotLoggedInModal uid={loggedUser?.u_id}/>
    </div>
  )
}

export default Profile