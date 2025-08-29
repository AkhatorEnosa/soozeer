/* eslint-disable react/prop-types */

import moment from "moment"
import { useEffect, useState } from "react"
import { deleteSingleMessage } from "../features/messageSlice"
import { useDispatch } from "react-redux"
import Linkify from "linkify-react"
import { Link } from "react-router-dom"

const MessageBubble = ({singleMessageId, userId, senderId, receiverId, createdAt, message, deleting}) => {
    const [triggerDeleteWarning, setTriggerDeleteWarning] = useState(false)
    const dispatch = useDispatch()
  
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

    // delete single Message 
    const handleSingleMessageDelete = (singleMessageId) => {
        dispatch(deleteSingleMessage(singleMessageId))
    }
    const renderLink = ({ attributes, content }) => {
        const { href, ...props } = attributes;
        return <Link to={href} target="_blank" {...props} className={`relative z-20 font-semibold ${receiverId == userId ? "text-black dark:text-base-100" : "text-white"} underline`}>{content}</Link>;
    };

  return (
    <div className={`w-full flex flex-col text-black ${senderId == userId && "justify-end items-end cursor-pointer"}`}>


        <div className={`w-fit flex flex-col ${senderId == userId ? 'items-end ml-10' : 'items-start mr-10'}`}>
            <div className="relative group flex gap-2">
                <span className="absolute w-fit h-full flex justify-end -left-8 text-xl">
                    {senderId == userId && <div className={" w-fit h-full hidden group-hover:flex justify-center items-center gap-2 px-2 py-0 text-error"} onClick={() => setTriggerDeleteWarning(true)}>
                        <span className="text-left font-bold z-50"><i className="bi bi-x"></i></span>
                    </div>}
                </span>
                  <pre className="break-words whitespace-pre-wrap font-sans">
                      <div className={`flex flex-col max-w-64 text-xs lg:text-sm px-2 py-2 mb-[1px] rounded-md ${receiverId == userId ? "bg-neutral-200" : "bg-primary text-white"}`}>
                        <Linkify options={{ render: renderLink }}>
                            {message}
                        </Linkify>
                      </div>
                  </pre>
            </div>
            <div className={`w-full gap-3 flex ${senderId == userId ? "justify-end" : "justify-start"}`}>
                <p className={`whitespace-nowrap text-neutral-600 dark:text-[#cbc9c9] text-[10px] lg:text-[8px] ${senderId == userId && 'text-right'}`}>
                    {moment(createdAt).format("Do MMM, YYYY hh:mm a") + ' . ' + moment(createdAt).fromNow()}
                </p>
            </div>
        </div>
            {/* {triggerDeleteWarning && senderId == userId && <div className="absolute w-screen h-screen top-0 left-0 z-40"></div>} */}
            {
                triggerDeleteWarning && senderId == userId && 
                <div className="fixed w-screen h-screen flex justify-center px-10 bg-base-100/80 dark:bg-black/80 items-center top-0 left-0 cursor-default z-[1000]">
                <div className="w-[85%] md:w-[50%] bg-base-100 dark:bg-black p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-[#CBC9C9]/20 shadow-md dark:shadow-[#cbc9c9]/20  dark:text-[#cbc9c9]">
                        <h1 className="text-2xl lg:text-3xl font-semibold">Delete Message?</h1>
                        <p>You are about to delete a message. Do you want to proceed?</p>
                        {
                            !deleting ? 
                                <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                                    <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={() => handleSingleMessageDelete(singleMessageId)}>Delete</button>
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

export default MessageBubble