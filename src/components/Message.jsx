import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { deleteMessageConvo } from "../features/messageSlice"

/* eslint-disable react/prop-types */
const Message = ({messageId, viewStatus, img, uid, u_name, messages, message, datetime, deleting}) => {
    const [triggerDeleteWarning, setTriggerDeleteWarning] = useState(false)
  
  const body = document.body
  useEffect(() => {
    if(triggerDeleteWarning) {
      body.style.height = '100vh'
      body.style.overflowY = 'hidden'
    } else {
      body.style.height = '100vh'
      body.style.overflowY = 'scroll'
    }
  }, [triggerDeleteWarning])

    const dispatch = useDispatch();

    const findMessage = messages?.find(x => x.message_id == messageId)

    const handleDeleteConvo = () => {
      if(findMessage !== undefined) {
        console.log({...findMessage, uid: uid})
        // console.log(id)
        // console.log(messageId)
        dispatch(deleteMessageConvo({...findMessage, uid: uid}))
      }
    }

  return (
    <div className={viewStatus === false ? "w-full flex bg-[#2eff6917]" : "group  hover:bg-primary/5 w-full flex pr-2 pt-2 cursor-pointer transition-all duration-200"}>
      <Link to={`/messages/${messageId}`} className="px-3 md:px-5 py-4 lg:py-5 flex items-center justify-between gap-3 w-full text-neutral-dark dark:text-dark-accent">
        <div className="w-full flex gap-2 items-start">
          <img src={img} className="size-8 lg:size-10 object-cover rounded-full cursor-default" loading="lazy"/>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <b className="text-xs lg:text-sm">{u_name}</b>
              <span className="text-[10px]">at {moment(datetime).format("MMM DD")}</span>
            </div>
            <p className="w-fit text-slate-400 dark:text-neutral-400 text-xs lg:text-sm">{message}</p>
          </div>
        </div>
      </Link> 

      <div className="flex justify-center items-center px-2 py-3 scale-0 opacity-0 group-hover:opacity-100 group-hover:scale-100 size-8 hover:bg-base-100 hover:text-error rounded-full transition-opacity duration-150" onClick={() => setTriggerDeleteWarning(true)}>
        <i className="bi bi-folder-x"></i>
      </div>

      {/* warning modal  */}
      {
          triggerDeleteWarning && 
          <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/80 dark:bg-black/80 items-center top-0 left-0 cursor-default z-[1000]">
                <div className="w-[85%] md:w-[50%] bg-base-100 dark:bg-black p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20">
                  <h1 className="text-2xl lg:text-3xl font-semibold">Delete Conversation?</h1>
                  <p>You are about to delete your own copy of this conversation. Do you want to proceed?</p>
                  {!deleting ?
                    <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                      <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={() => handleDeleteConvo()}>Delete</button>
                      <button className="w-fit px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black lg:hover:shadow-md" onClick={() => setTriggerDeleteWarning(false)}>Cancel</button>
                    </div> :
                    <div className="w-full flex gap-2 mt-10 font-bold justify-center items-center">
                        <span className="loading loading-spinner"></span>
                    </div> 
                  }
              </div>
          </div>
      }
    </div>
  )
}

export default Message

// moment(datetime).fromNow()