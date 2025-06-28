import moment from "moment";
import { Link } from "react-router-dom";
import Linkify from "linkify-react"

/* eslint-disable react/prop-types */ 
const CommentCard = ({userId, deleting, liking, bookmarking, commentUserId, commentUserIdVal, uImg, uName, toggleFollow, followed, commentContent, liked, likes, likeComment, bookmarked, bookmarks, bookmarkComment, deleteComment, datetime}) => {


  return ( 
    <div className={deleting ? "w-full flex gap-3 flex-col items-start text-sm opacity-30" : "w-full flex gap-3 flex-col items-start text-sm dark:text-slate-200"}>
      <div className="flex w-full">
        <div className="py-3 md:py-5 px-3 w-full">
            <div className="w-full flex gap-2">
              <Link to={`/${commentUserIdVal}`} className="w-fit"><img src={uImg} alt="" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"/></Link>
              <div className="basis-11/12 w-full flex flex-col m-0 col-span-4 gap-2">
                  <div className="w-full flex flex-col">
                    <Link to={`/${commentUserIdVal}`} className="w-full"><h3 className="w-fit font-bold text-left hover:underline text-neutral dark:text-slate-200">{uName}</h3></Link>
                    <span className="w-full text-start text-[0.5rem] text-neutral-400">{moment(datetime).format("Do MMM, YYYY . HH:MM a")}</span>
                  </div>
                <div className="w-full">
                  <pre className="break-words whitespace-pre-wrap font-sans"><p className="content text-start w-full">
                    <Linkify>{commentContent}</Linkify>
                  </p></pre>
                </div>
              </div>
            </div>  
        </div>
        <div className="flex justify-end items-center px-5 col-span-1">
          {userId && !commentUserId && <button className={followed === false ? "flex w-fit h-fit justify-end gap-1 items-center text-xs px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group w-fit h-fit flex gap-1 justify-center items-center text-xs px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral border-[1px] border-primary transition-all duration-300"} onClick={toggleFollow}>{followed === false ? <><i className="bi bi-plus-lg"></i> Follow</> : <>
          <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span></>}</button>}
        </div>
      </div>
        
        {
          userId && <div className="w-full px-5 py-4 flex lg:grid lg:grid-cols-4 justify-between items-center text-xs">


              <button className="flex justify-center items-center col-span-1 gap-1 lg:hover:text-[#f50569] cursor-pointer" onClick={likeComment} disabled={liking}><i className={liked == false ? "bi bi-heart text-xs md:text-base" : "bi bi-heart-fill text-[#f50569] text-xs md:text-base"}></i>{likes} Like</button>

              <button className="flex justify-center items-center col-span-1 gap-1 lg:hover:text-[#05a9f5] cursor-pointer" onClick={bookmarkComment} disabled={bookmarking}><i className={bookmarked == false ? "bi bi-bookmark text-xs md:text-base" : "bi bi-bookmark-fill text-[#05a9f5] text-xs md:text-base"}></i>{bookmarks} Bookmark</button>

                {commentUserId && <div className=" col-span-2 flex justify-end"><button className="flex justify-end items-center gap-1 hover:text-red-700 cursor-pointer" onClick={deleteComment} disabled={deleting}><i className="bi bi-trash-fill text-sm md:text-base"></i> Delete </button></div>}
          </div>
        }
    </div>
  )
}

export default CommentCard