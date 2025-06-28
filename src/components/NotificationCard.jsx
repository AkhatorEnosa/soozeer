import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
const NotificationCard = ({action, postId, viewStatus, commentId, img, name, post, followerId}) => {

  const validateSize = (text) => {
    const strLength = text.length
    let newStr;

    if(strLength > 200) {
      newStr = text.substring(0, 200)
      return  newStr + '...'
    } else {

      return text
    }
  }

  return (
    <div className={viewStatus === false ? "w-full flex border-t-[1px] bg-[#2eff6917] cursor-pointer" : "w-full flex border-t-[1px] hover:bg-primary/5 dark:border-neutral-300/10 cursor-pointer transition-all duration-200"}>
        {action === 'like' ? 
          <Link to={`/post/${postId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-2 md:gap-4 items-start">
              <img src={img} className="w-10 h-10 object-cover object-center rounded-full cursor-default" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> liked your post</span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-heart-fill text-[#f50569] text-xl"></i>
          </Link> 

        :action === 'journal_like' ? 
          // <Link to={`/post/${postId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
          //   <div className="w-full flex gap-2 md:gap-4 items-start">
          //     <img src={img} className="w-10 h-10 object-cover object-center rounded-full cursor-default" loading="lazy"/>
          //     <div className="w-full flex flex-col">
          //       <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> gave your public journal a star</span>
          //       <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
          //     </div>
          //   </div>
          //   <i className="bi bi-star-fill text-[#d4af37] text-xl"></i>
          // </Link> 

          <div className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-2 md:gap-4 items-start">
              <img src={img} className="w-10 h-10 object-cover object-center rounded-full cursor-default" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> gave your public journal a star</span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-star-fill text-[#d4af37] text-xl"></i>
          </div> 

        : action === 'bookmark' ? 
          <Link to={`/post/${postId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full flex flex-col">
                <b className="dark:text-[#CBC9C9]">Your post got a bookmark</b>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
             <i className="bi bi-bookmark-fill text-[#05a9f5] text-xl"></i>
          </Link>  : 

          action === 'follow' ? 
          <Link to={`/${followerId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <img src={img} className="w-10 h-10 rounded-full" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> followed you</span>
              </div>
            </div>
            <i className="bi bi-person-fill-check text-primary text-xl"></i>
          </Link> : 
          
          action === 'comment_like' ? 
          <Link to={`/post/${commentId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <img src={img} className="w-10 h-10 rounded-full" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> liked your comment</span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-heart-fill text-[#f50569] text-xl"></i>
          </Link>  :
          
          action === 'reply_like' ? 
          <Link to={`/post/${commentId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <img src={img} className="w-10 h-10 rounded-full" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> liked your reply</span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-heart-fill text-[#f50569] text-xl"></i>
          </Link>  :

          action === 'comment_bookmark' ?
           
          <Link to={`/post/${commentId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full flex flex-col">
                <b className="dark:text-[#CBC9C9]">Your comment got a bookmark</b>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
             <i className="bi bi-bookmark-fill text-[#05a9f5] text-xl"></i>
          </Link> : 

          action === 'reply_bookmark' ?
           
          <Link to={`/post/${commentId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full flex flex-col">
                <b className="dark:text-[#CBC9C9]">Your reply got a bookmark</b>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
             <i className="bi bi-bookmark-fill text-[#05a9f5] text-xl"></i>
          </Link> : 

          action === 'comment' ? 
          <Link to={`/post/${postId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <img src={img} className="w-10 h-10 rounded-full" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> commented on your post </span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-chat-fill text-[#05a9f5] text-xl"></i>
          </Link> : 

          action === 'reply' && 
          <Link to={`/post/${postId}`} className="px-3 md:px-5 py-4 lg:py-5 w-full flex items-center justify-between gap-3 text-neutral dark:text-neutral-content">
            <div className="w-full flex gap-4 items-center">
              <img src={img} className="w-10 h-10 rounded-full" loading="lazy"/>
              <div className="w-full flex flex-col">
                <span><b><Link to={`/${followerId}`} className="text-neutral dark:text-[#CBC9C9] hover:underline">{name}</Link></b> replied </span>
                <p className="text-black/40 dark:text-neutral-400 text-sm">{validateSize(post)}</p>
              </div>
            </div>
            <i className="bi bi-chat-fill text-[#05a9f5] text-xl"></i>
          </Link>
          
          }
    </div>
  )
}

export default NotificationCard