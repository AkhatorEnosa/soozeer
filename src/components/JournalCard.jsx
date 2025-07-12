import Linkify from "linkify-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
const JournalCard = ({privacy, postUserIdVal, postUserId, title, journal, uImg, uName, liked, likes, likePost, deletePost, liking, deleting, datetime}) => {

  const [showDelete, setShowDelete] = useState(false)
  const [expandPost, setExpandPost] = useState(false)
  const body = document.body

  useEffect(() => {
    if(showDelete) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [showDelete])

  const validateSize = (text) => {
    const strLength = text.length
    let newStr;

    if(strLength > 100) {
      newStr = text.substring(0, 100)
      return  newStr + '...'
    } else {

      return text
    }
  }

  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return <Link to={href} target="_blank" {...props} className="relative z-20">{content}</Link>;
  };

  const togglePost = () => {
    setExpandPost(!expandPost)
  }

  return (
    <div className={`w-full px-5 py-4 flex flex-col dark:text-dark-text gap-3`}>
        <div className="w-full p-2 shadow-sm">
            <div className="flex justify-center items-center">
                <div className="w-full flex flex-col gap-0">
                    <h1 className="text-xl lg:text-lg font-semibold dark:text-white">{title}</h1>
                    <div className="w-fit flex gap-2 items-center">
                      <i className="text-[10px] not-italic text-neutral-400">{moment(datetime).format("Do MMM, YYYY hh:mm a") + ' . ' + moment(datetime).fromNow()}</i>
                      <span className="flex gap-1 justify-center items-center text-[8px] px-2 border-[1px] border-accent text-accent bg-accent/10 font-semibold rounded-full"><i className="bi bi-person-fill-lock"></i>{privacy}</span>
                    </div>
                </div>

                {postUserId && <div className="w-fit p-2 flex gap-2 text-sm">
                    {/* <span title="Edit" className="size-6 flex justify-center items-center rounded-full bg-secondary/10 hover:bg-secondary hover:text-white transition-all duration-150 cursor-pointer"><i className="bi bi-pencil-fill"></i></span> */}
                    <span title="Delete" className="flex justify-center items-center transition-all duration-150 gap-1 rounded-full bg-neutral-100 dark:bg-neutral-500/30 hover:text-red-700 size-10  p-2 hover:bg-red-400/10 cursor-pointer"  onClick={() => setShowDelete(!showDelete)} disabled={deleting}><i className="bi bi-x-lg"></i></span>
                </div>}
            </div>
            <blockquote className="text-sm text-justify break-words whitespace-pre-wrap">{expandPost === false && journal?.length > 500 ? <>{validateSize(journal)} <a className="relative z-20 text-xs text-primary cursor-pointer" onClick={togglePost}>See more</a></> : expandPost === true && journal.length > 100 ? <><Linkify options={{ render: renderLink }}>{journal}</Linkify> <a className="relative z-20 text-xs text-primary cursor-pointer" onClick={togglePost}>See Less</a></>: <Linkify options={{ render: renderLink }}>{journal}</Linkify>}</blockquote>

            <div className="w-full flex justify-between items-center text-sm font-medium mt-2">
                <div className={`w-fit p-2 rounded-full flex px-2 py-0 ${liked ? "bg-[#FFD700]/10 text-accent" : "bg-neutral-100 dark:bg-neutral-500/30"} hover:text-accent hover:bg-accent/10 cursor-pointer`} title="Star this journal" onClick={likePost} disabled={liking}>
                    <span className="flex justify-center items-center text-sm gap-1 font-light rounded-full transition-all duration-150"><i className={`${liked ? "bi bi-star-fill" : "bi bi-star"}`}></i>{likes}</span>
                </div>
                <Link to={`/${postUserIdVal}`} className="w-fit flex items-center justify-end gap-2 px-3 py-2 rounded-full font-semibold hover:bg-primary/5 text-inherit dark:text-[#cbc9c9] hover:underline">
                    <img src={uImg} alt="" className="relative z-20 w-6 h-6 object-cover object-center rounded-full  shadow-sm cursor-default border-[1px] border-neutral-500" width={80} height={80}/>
                    <span className="cursor-pointer">{uName}</span>
                </Link>
            </div>
        </div>

         
        {showDelete && <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/90 dark:bg-black/90 items-center top-0 left-0 cursor-default z-[1000]">
              <div className="w-[85%] md:w-[50%] bg-base-100 dark:bg-black dark:text-[#cbc9c9] p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
                {!deleting ?
                  <>
                    <h1 className="text-2xl lg:text-3xl font-semibold">Delete Journal?</h1>
                    <p>You are about to delete this Journal. Do you want to proceed?</p>
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
export default JournalCard