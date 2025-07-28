import Linkify from "linkify-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const PostCard = ({users, userId, postId, liking, bookmarking, deleting, deleted, postUserId, postUserIdVal, uImg, uName, toggleFollow, followed, postContent, comments, openComment, liked, likes, likePost, bookmarked, bookmarks, bookmarkPost, deletePost, datetime}) => {

  const [showDelete, setShowDelete] = useState(false)
  const [expandPost, setExpandPost] = useState(false)

//  moment("2024-09-27T12:58:43.57827+00:00").format('Do MMM,YYYY hh:mm a')
  // document.querySelector('.content').appendChild(newLinkElem)

  const getPostUserName = () => {
    if(postUserIdVal) {
      const findUser = users?.find(user => user.u_id === postUserIdVal);
      if(findUser) {
        return findUser.u_name;
      }
    }
  }


  
  const body = document.body
  useMemo(() => {
    deleted && setShowDelete(false)
    if(showDelete) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }

    console.log(body.style.overflowY)
  }, [body.style, deleted, showDelete])

  const validateSize = (text) => {
    const strLength = text.length
    let newStr;

    if(strLength > 500) {
      newStr = text.substring(0, 500)
      return  newStr + '...'
    } else {

      return text
    }
  }

  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <Link to={href} target="_blank" {...props} className="relative z-20 hover:underline">{content}</Link>;
  };

  const togglePost = () => {
    setExpandPost(!expandPost)
  }

  return ( 
    <div className={"relative w-full flex flex-col items-start text-sm border-y-[1px] text-neutral-dark border-black/5  dark:border-neutral-300/10 duration-200 transition-all dark:text-dark-accent"}>
        <Link to={`/post/${postId}`} className="absolute top-0 w-full h-full z-0"></Link>
      <div className="w-full h-full">
        <div className="flex w-full gap-3 px-3 ">
          <div className="pt-4 w-full col-span-6">
              <div className="w-full flex">
                <div className="w-14 h-14">
                  <Link to={userId && `/${getPostUserName()}`}><img src={uImg} alt="" className="relative z-20 w-10 h-10 object-cover object-center rounded-full  shadow-sm cursor-default" width={80} height={80} loading="lazy"/></Link>
                </div>
                
                <div className="w-full flex flex-col">
                  <div className="w-full flex justify-between items-center mb-2">
                    <div className="w-fit flex flex-col">
                      <Link to={userId && `/${getPostUserName()}`} className="w-fit relative z-20 "><h3 className="w-fit font-bold text-left hover:underline text-neutral-dark dark:text-neutral-lighter cursor-default">{uName}</h3></Link>
                      <span className="w-full text-start text-[0.5rem] text-neutral-400">{moment(datetime).format("Do MMM, YYYY hh:mm a") + ' . ' + moment(datetime).fromNow()}</span>
                    </div>
                  </div>
                  <div  className="w-fit text-xs md:text-sm cursor-pointer">
                    <div className="break-words whitespace-pre-wrap font-sans"><p className="content text-start">{expandPost === false && postContent?.length > 500 ? <>{validateSize(postContent)} <a className="relative z-20 text-xs text-primary cursor-pointer" onClick={togglePost}>See more</a></> : expandPost === true && postContent.length > 100 ? <><Linkify options={{ render: renderLink }}>{postContent}</Linkify> <a className="relative z-20 text-xs text-primary cursor-pointer" onClick={togglePost}>See Less</a></>: <Linkify options={{ render: renderLink }}>{postContent}</Linkify>}</p></div>
                  </div>
                </div>
              </div>  
          </div>
          <div className="relative z-20 flex flex-col justify-center items-center">
            {userId && !postUserId && <button className={followed === false ? "flex w-fit h-fit gap-1 items-center text-xs px-2 py-2 text-primary border-[1px] border-primary rounded-lg md:rounded-full lg:hover:bg-primary lg:hover:text-white" : "group w-fit h-fit flex gap-1 justify-center items-center text-xs px-2 py-2 text-white bg-primary rounded-lg md:rounded-full lg:hover:bg-neutral lg:hover:text-white lg:hover:border-neutral border-[1px] border-primary transition-all duration-300"} onClick={toggleFollow}>{followed === false ? <><i className="bi bi-plus-lg"></i> <span className="hidden md:flex">Follow</span></> : <>
            <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> <span className="hidden md:flex">Following</span></span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> <span className="hidden md:flex">Unfollow</span></span></>}</button>}
          </div>
        </div>
      </div>
        
        {
          userId ? <div className="w-full border-t-[1px] border-black/5 px-5 py-4 gap-2 justify-between items-center text-[10px] md:text-xs pt-2 grid grid-cols-7 text-xs">
          <div className="w-full flex gap-10 md:gap-20 col-span-6">
              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 bg-neutral-100 dark:bg-neutral-500/30 hover:bg-primary/10 rounded-full hover:text-primary cursor-pointer`} onClick={openComment}><i className="bi bi-chat text-xs md:text-base"></i>{comments} </button>

              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 ${liked ? "bg-[#f50569]/10 text-[#f50569]" : "bg-neutral-100 dark:bg-neutral-500/30"} hover:bg-[#f50569]/10 rounded-full hover:text-[#f50569] cursor-pointer`} onClick={likePost} disabled={liking}><i className={liked == false ? "bi bi-heart text-xs md:text-base" : "bi bi-heart-fill text-[#f50569] text-xs md:text-base"}></i>{likes} </button>

              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 ${bookmarked ? "bg-[#05a9f5]/10 text-[#05a9f5]" : "bg-neutral-100 dark:bg-neutral-500/30"} hover:bg-[#05a9f5]/10 rounded-full hover:text-[#05a9f5] cursor-pointer`} onClick={bookmarkPost} disabled={bookmarking}><i className={bookmarked == false ? "bi bi-bookmark text-xs md:text-base" : "bi bi-bookmark-fill text-[#05a9f5] text-xs md:text-base"}></i>{bookmarks} </button>
            </div>

            {postUserId ? <button className={`relative z-20 flex justify-center items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-500/30 hover:text-red-700 size-10  p-2 hover:bg-red-400/10 cursor-pointer`} onClick={() => setShowDelete(!showDelete)} disabled={deleting}><i className="bi bi-x-lg text-sm md:text-base"></i> </button> : '' }

          </div> : <div className="w-full border-t-[1px] border-black/5 px-5 py-4 gap-2 justify-between items-center text-[10px] md:text-xs pt-2 grid grid-cols-7 text-xs">
          <div className="w-full flex gap-20 col-span-6">
              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 hover:bg-primary/10 rounded-full hover:text-primary cursor-pointer`} onClick={()=> location.assign('/#/login')}><i className="bi bi-chat text-xs md:text-base"></i>{comments} </button>

              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 hover:bg-[#f50569]/10 rounded-full hover:text-[#f50569] cursor-pointer`} onClick={()=> location.assign('/#/login')}><i className={liked == false ? "bi bi-heart text-xs md:text-base" : "bi bi-heart-fill text-[#f50569] text-xs md:text-base"}></i>{likes} </button>

              <button className={`relative z-20 flex justify-center items-center gap-1 px-2 hover:bg-[#05a9f5]/10 rounded-full hover:text-[#05a9f5] cursor-pointer`} onClick={()=> location.assign('/#/login')}><i className={bookmarked == false ? "bi bi-bookmark text-xs md:text-base" : "bi bi-bookmark-fill text-[#05a9f5] text-xs md:text-base"}></i>{bookmarks} </button>
            </div>

          </div>
        }

        {/* Delete modal  */}
        {showDelete && <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/80 dark:bg-black/80 items-center top-0 left-0 cursor-default z-[1000]">
              <div className="w-[85%] md:w-[50%] bg-base-100 dark:bg-black dark:text-dark-accent p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-dark-accent/20 shadow-md dark:shadow-dark-accent/20">
                {!deleting ?
                  <>
                    <h1 className="text-2xl lg:text-3xl font-semibold">Delete Post?</h1>
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

export default PostCard