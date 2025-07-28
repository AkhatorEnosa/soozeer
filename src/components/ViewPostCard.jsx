import Linkify from "linkify-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const ViewPostCard = ({users,userId, deleting, liking, bookmarking, following, postUserId, postUserIdVal, uImg, uName, toggleFollow, followed, postContent, commentsCount, liked, likes, likePost, bookmarked, bookmarks, bookmarkPost, type, deletePost, datetime, focusInput}) => {

  
  const { deleted } = useSelector((state) => state.posts)
  const [showDelete, setShowDelete] = useState(false)

  const getPostUserName = () => {
    if(postUserIdVal) {
      const findUser = users?.find(user => user.u_id === postUserIdVal);
      if(findUser) {
        return findUser.u_name;
      }
    }
  }

  const body = document.body
  useEffect(() => {
    if(deleted) {
      setShowDelete(false)
    }
    if(showDelete) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [deleted, showDelete])

  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <Link to={href} target="_blank" {...props} className="relative z-20 hover:underline">{content}</Link>;
  };

  return ( 
    <div className={`w-full py-2 px-2 md:py-5 md:px-5 flex gap-3 flex-col items-start text-sm rounded-t-md border-b-[1px] border-black/5 dark:border-neutral-300/10 ${deleting && "opacity-30"} text-neutral-dark dark:text-dark-accent`}>
        <div className="w-full flex flex-col gap-3">


          <div className="relative w-full flex gap-2">
            <Link to={`/${getPostUserName()}`} className="w-12 md:w-14"><img src={uImg} alt="" className="size-10 md:size-12 rounded-full object-cover object-center" loading="lazy"/></Link>

            <div className="w-full flex justify-between items-center mb-2">
              <div className="w-full flex flex-col">
                <Link to={`/${getPostUserName()}`} className="w-full"><h3 className="w-fit text-md md:text-lg font-bold text-left hover:underline text-neutral-dark dark:text-neutral-lighter">{uName}</h3></Link>
                <span className="w-full text-start text-[0.6rem] lg:text-xs  text-neutral-400">{moment(datetime).format("Do MMM, YYYY . HH:MM a")}</span>
              </div>
              {userId && postUserId && <button className={followed === false ? "flex gap-1 justify-center items-center text-xs px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:text-black hover:border-black" : "group flex gap-1 justify-center items-center text-xs px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:border-neutral border-[1px] border-primary transition-all duration-300"} onClick={toggleFollow}>{following ? <span className={`loading loading-ring loading-sm ${followed ? "text-white" : "text-primary"}`}></span> : (!following && followed === false) ? <><i className="bi bi-plus-lg"></i> Follow</> : <>
              <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> <span className="hidden md:flex">Following</span></span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> <span className="hidden md:flex">Unfollow</span></span></>}</button>}
            </div>
          </div>
          <div className="w-full">
            <div className="break-words whitespace-pre-wrap font-sans"><p className="content text-start text-base"><Linkify options={{ render: renderLink }}>{postContent}</Linkify></p></div>
          </div> 
        </div>
        
        {
        userId ? <div className="w-full border-t-[1px] border-black/5 px-5 py-4 gap-2 justify-between items-center text-[10px] md:text-xs pt-2 grid grid-cols-7 text-xs">
          <div className="w-full flex gap-20 col-span-6">
            <button className={`relative z-20 flex justify-center items-center gap-1 px-2 bg-neutral-100 dark:bg-neutral-500/30 hover:bg-primary/10 rounded-full hover:text-primary cursor-pointer`}><i className="bi bi-chat text-xs md:text-base" onClick={() => focusInput()}></i>{commentsCount} </button>

            <button className={`relative z-20 flex justify-center items-center gap-1 px-2 ${liked ? "bg-[#f50569]/10 text-[#f50569]" : "bg-neutral-100 dark:bg-neutral-500/30"} hover:bg-[#f50569]/10 rounded-full hover:text-[#f50569] cursor-pointer`} onClick={likePost} disabled={liking}><i className={liked == false ? "bi bi-heart text-xs md:text-base" : "bi bi-heart-fill text-[#f50569] text-xs md:text-base"}></i>{likes} </button>

            <button className={`relative z-20 flex justify-center items-center gap-1 px-2 ${bookmarked ? "bg-[#05a9f5]/10 text-[#05a9f5]" : "bg-neutral-100 dark:bg-neutral-500/30"} hover:bg-[#05a9f5]/10 rounded-full hover:text-[#05a9f5] cursor-pointer`} onClick={bookmarkPost} disabled={bookmarking}><i className={bookmarked == false ? "bi bi-bookmark text-xs md:text-base" : "bi bi-bookmark-fill text-[#05a9f5] text-xs md:text-base"}></i>{bookmarks} </button>
          </div>
          
          {!postUserId ? <button className="relative z-20 flex justify-center items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-500/30 hover:text-red-700 size-10  p-2 hover:bg-red-400/10 cursor-pointer" onClick={()=> setShowDelete(true)} disabled={deleting}><i className="bi bi-x-lg text-sm md:text-base"></i>  </button> : '' }
        </div> : 
        <div className="w-full border-t-[1px] border-black/5 px-5 py-4 gap-2 justify-between items-center text-[10px] md:text-xs pt-2 grid grid-cols-7 text-xs">
          <div className="w-full flex gap-20 col-span-6">
            <button className="flex justify-center items-center gap-1 hover:text-primary cursor-pointer" onClick={()=> location.assign('/#/login')}><i className="bi bi-chat text-xs"></i>{commentsCount} </button>

            <button className="flex justify-center items-center gap-1 lg:hover:text-[#f50569] cursor-pointer" onClick={()=> location.assign('/#/login')}><i className={"bi bi-heart text-xs md:text-base"}></i>{likes} </button>

            <button className="flex justify-center items-center gap-1 lg:hover:text-[#05a9f5] cursor-pointer" onClick={()=> location.assign('/#/login')}><i className="bi bi-bookmark text-xs md:text-base"></i>{bookmarks} </button>
          </div>
        </div>
        }

        {showDelete && <div className="fixed w-screen h-screen flex justify-center px-10 bg-bg/80 dark:bg-black/80 items-center top-0 left-0 cursor-default z-[1000]">
                <div className="w-[85%] md:w-[50%] bg-bg dark:bg-black p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-dark-accent/20 shadow-md dark:shadow-dark-accent/20">
                {!deleting ?
                  <>
                    <h1 className="text-2xl lg:text-3xl font-semibold">Delete {type === "comment" ? "Comment" : "Post"}?</h1>
                    <p>You are about to delete. Do you want to proceed?</p>
                    <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                        <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={deletePost}>Delete</button>
                        <button className="w-fit px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black lg:hover:shadow-md" onClick={() => setShowDelete(false)}>Cancel</button>
                    </div>
                  </> :
                  <>
                    <h1 className="text-3xl font-semibold animate-pulse">Deleting...</h1>
                    <p>Please hold a while..</p>
                    <div className="w-full flex justify-center items-center"><span className="loading loading-spinner"></span></div>
                  </>
                }
            </div>
        </div>}
    </div>
  )
}

export default ViewPostCard