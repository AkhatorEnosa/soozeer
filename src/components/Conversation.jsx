import { useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from "react-router-dom"
import { addMessage } from "../features/messageSlice"
import MessageBubble from "./MessageBubble";
import BackBtn from "./BackBtn";
import bgLight from '../assets/message-bg-light.webp'
import bgDark from '../assets/message-bg-dark.webp'
// import supabase from "../config/supabaseClient.config";

/* eslint-disable react/prop-types */
const Conversation = ({messageId, messages, userId, users, name, img}) => {
    const [messageValue, setMessageValue] = useState('')
    const { sent, isAddingMessage, isDeleting } = useSelector((state) => state.message)
    
    const divRef = useRef(null)
    const messagesRef = useRef(null)

    const dispatch = useDispatch();
    const navigate = useNavigate()



    // useEffect(() => {
    //     supabase
    //     .channel('schema-db-changes')
    //     .on(
    //         'postgres_changes',
    //         {
    //         event: '*',
    //         schema: 'public',
    //         },
    //         (payload) => {
    //             console.log(payload)
    //             dispatch(getMessages(userId))
    //         }
    //     )
    //     .subscribe()
    // }, [])

    const findMessage = messages?.find(message => message.message_id == messageId)
    // console.log(findMessage)
    
    const getConversationMessages = (findMessage) => {
        if(findMessage !== undefined) {
            const filterMessages = messages.filter(x => x.sender_id == findMessage.sender_id || x.receiver_id == findMessage.sender_id)
            const sortMessages = filterMessages.sort((a, b) => a.id - b.id)

            return sortMessages
        } else {
            return []
        }
    }

    // scroll to current message onload 
    useMemo(() => {
        if(messageId !== 'conversations' && messagesRef.current !== null) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            messagesRef.current.scrollIntoView({
              behavior: 'smooth'
            })
        }
    }, [messageId, messages])

    // send message 
    const handleSubmit = (e) => {
        e.preventDefault()
        if(messageValue.trim() !== '') {
            dispatch(addMessage({
                message: messageValue.trim(),
                senderId: userId,
                receiverId: findMessage !== undefined ? findMessage.sender_id : messageId,
                senderName: name,
                senderImg: img,
                messageId: uuidv4(),
            }))
        }
    }
  
    useMemo(() => {
        if (divRef.current) {
            divRef.current.style.height = 'auto';
            if(divRef.current.scrollHeight <= 150) {
                divRef.current.style.height = `${divRef.current.scrollHeight}px`
                // console.log(divRef.current.style.height)
            } else {
                divRef.current.style.height = "150px";
            }
        }
    }, [messageValue])


    useMemo(() => {
        if(sent) {
            setMessageValue("")
        }
    }, [sent])

    if(messageId !== 'conversations') {
        if(findMessage !== undefined) {
        // console.log(findMessage)
            // console.log(messageId)
            getConversationMessages(findMessage)
            return (
                <div className="absolute top-0 left-0 w-full h-screen md:relative flex flex-col md:h-fit col-span-3 lg:border-[1px] border-black/5 dark:border-neutral-300/10 lg:px-1 py-4 rounded-t-lg rounded-b-3xl pb-24 md:pb-2 bg-base-100 dark:bg-black dark:text-[#CBC9C9] gap-2 justify-between lg:pt-5">
                    <div className="flex flex-col w-full h-full gap-4">
                        <div className="w-full flex flex-col px-4 bg-base-100 dark:bg-black lg:px-0 lg:justify-between items-center z-30">
                            {/* back button */}
                            <div className="w-full flex bg-base-100 dark:bg-black px-4 md:hidden">
                                <BackBtn link={() => navigate('../messages/conversations')} title={'Back'}/>
                            </div>
                            <Link to={`/${findMessage.sender_id}`} className="px-3 md:px-5 w-full flex md:flex-col items-center justify-center gap-2 text-neutral dark:text-[#CBC9C9]">
                                <img src={findMessage.sender_img} className="w-8 h-8 object-cover object-center rounded-full cursor-default"/>
                                <b className="md:text-md">{findMessage.sender_name}</b>
                            </Link> 
                        </div>
                        <div className="message relative h-full flex flex-col gap-4 md:max-h-[50vh] px-3 lg:px-3 overflow-scroll" ref={messagesRef}>
                            <div className="w-full h-full absolute overflow-clip">
                                <img src={bgLight} className="dark:hidden flex absolute top-0 opacity-10" alt="" />
                                <img src={bgDark} className="dark:flex absolute hidden top-0 opacity-20" alt="" />
                            </div>

                            {getConversationMessages(findMessage).map(message => (
                                    <MessageBubble 
                                        key={message.id}
                                        senderId={message.sender_id}
                                        receiverId={message.receiver_id}
                                        userId={userId}
                                        message={message.message}
                                        createdAt={message.created_at}
                                        singleMessageId={message.id}
                                        deleting={isDeleting}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="relative bottom-0 h-fit w-full lg:px-0 ">
                        <div className="w-full flex justify-center items-center gap-2 px-4 py-2 md:px-4 md:py-0 mt-auto overflow-clip">
                            <textarea name="body" id="body" ref={divRef} className={`text-md z-20 w-full flex flex-col min-h-8 dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={messageValue} placeholder="Type your message here" onChange={(e) => setMessageValue(e.target.value)?.trim()} readOnly={isAddingMessage && true}></textarea>

                            <div className={`w-fit flex justify-center items-center`}>
                                <button className={messageValue.trim() !== '' ? "btn p-0 bg-base-100 dark:bg-black border-none text-primary font-semibold hover:bg-inherit transition-all duration-150 disabled:bg-transparent" : "btn p-0 bg-base-100 dark:bg-black border-none text-primary/50 font-semibold hover:bg-inherit text-neutral-400] transition-all duration-150 cursor-not-allowed disabled:bg-transparent"} onClick={handleSubmit} disabled={isAddingMessage && "disabled"}>{isAddingMessage ?  <span className="loading loading-spinner loading-sm text-neutral-400"></span> : <i className={messageValue.trim() !== '' ? "bi bi-send-fill rotate-45 transition-all duration-150" : "bi bi-send-fill rotate-0 transition-all duration-150"}></i>}</button>
                            </div>
                        </div> 
                    </div>
                </div>
            )
        } else {
            const matchUserWithCurrentParam = users?.find(user => user.u_id == messageId)
            // console.log("matchUserWithCurrentParam", matchUserWithCurrentParam)

            if(matchUserWithCurrentParam !== undefined) {
    
                const getConversationMessages = () => {
                    if(findMessage == undefined) {
                        const filterMessages = messages?.filter(x => x.sender_id == matchUserWithCurrentParam?.u_id || x.receiver_id == matchUserWithCurrentParam.u_id)
                        // console.log(filterMessages)
                        const sortMessages = filterMessages?.sort((a, b) => a.id - b.id)

                        return sortMessages
                    }
                }
                return (
                    <div className="absolute top-0 left-0 w-full h-screen md:relative flex flex-col md:h-fit col-span-3 lg:border-[1px] border-black/5 dark:border-neutral-300/10 lg:px-1 py-4 rounded-t-lg rounded-b-3xl pb-24 md:pb-2 bg-base-100 dark:bg-black dark:text-[#CBC9C9] gap-2 justify-between lg:pt-5">
                        <div className="flex flex-col w-full h-full gap-4">
                            <div className="w-full flex flex-col px-4 bg-base-100 dark:bg-black lg:px-0 lg:justify-between items-center z-30">
                                {/* back button */}
                                <div className="w-full flex bg-base-100 dark:bg-black px-4 md:hidden">
                                    <BackBtn link={() => navigate('../messages/conversations')} title={'Back'}/>
                                </div>
                                <Link to={`/${matchUserWithCurrentParam.u_id}`} className="px-3 md:px-5 w-full flex md:flex-col items-center justify-center gap-2 text-neutral dark:text-[#CBC9C9]">
                                    <img src={matchUserWithCurrentParam.u_img} className="w-8 h-8 object-cover object-center rounded-full cursor-default"/>
                                    <b className="md:text-md">{matchUserWithCurrentParam.name}</b>
                                </Link> 
                            </div>
                            <div className="message relative h-full flex flex-col gap-4 md:max-h-[50vh] px-3 lg:px-3 overflow-scroll" ref={messagesRef}>
                                <div className="w-full h-full absolute overflow-clip">
                                    <img src={bgLight} className="dark:hidden flex absolute top-0 opacity-10" alt="" />
                                    <img src={bgDark} className="dark:flex absolute hidden top-0 opacity-20" alt="" />
                                </div>
                                {getConversationMessages()?.map(message => (
                                    <MessageBubble 
                                        key={message.id}
                                        singleMessageId={message.id}
                                        senderId={message.sender_id}
                                        receiverId={message.receiver_id}
                                        userId={userId}
                                        message={message.message}
                                        createdAt={message.created_at}
                                        deleting={isDeleting}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative bottom-0 h-fit w-full lg:px-0 ">
                            <div className="w-full flex justify-center items-center gap-2 px-4 py-2 md:px-4 md:py-0 mt-auto overflow-clip">
                                <textarea name="body" id="body" ref={divRef} className={`text-md z-20 w-full flex flex-col min-h-8 dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 outline-none resize-none`} value={messageValue} placeholder="Type your message here" onChange={(e) => setMessageValue(e.target.value)?.trim()} readOnly={isAddingMessage && true}></textarea>

                                <div className={`w-fit flex justify-center items-center`}>
                                    <button className={messageValue.trim() !== '' ? "btn p-0 bg-base-100 dark:bg-black border-none text-primary font-semibold hover:bg-inherit transition-all duration-150 disabled:bg-transparent" : "btn p-0 bg-base-100 dark:bg-black border-none text-primary/50 font-semibold hover:bg-inherit text-neutral-400] transition-all duration-150 cursor-not-allowed disabled:bg-transparent"} onClick={handleSubmit} disabled={isAddingMessage && "disabled"}>{isAddingMessage ?  <span className="loading loading-spinner loading-sm text-neutral-400"></span> : <i className={messageValue.trim() !== '' ? "bi bi-send-fill rotate-45 transition-all duration-150" : "bi bi-send-fill rotate-0 transition-all duration-150"}></i>}</button>
                                </div>
                            </div> 
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="hidden md:flex flex-col text-center justify-center items-center h-96 col-span-3 border-[1px] border-black/5 dark:border-neutral-300/10 px-4 py-4 rounded-md">
                        <h1 className="font-bold text-3xl">Select a message</h1>
                        <p>Choose from your existing conversations, start a new one, or just keep soozing 😂 .</p>
                    </div>
                )
            }
        }
    } else {
        return (
            <div className="hidden md:flex flex-col text-center justify-center items-center h-96 col-span-3 border-[1px] border-black/5 dark:border-neutral-300/10 px-4 py-4 rounded-md">
                <h1 className="font-bold text-3xl">Select a message</h1>
                <p>Choose from your existing conversations, start a new one, or just keep soozing 😂 .</p>
            </div>
        )
    }
}

export default Conversation

// moment(datetime).fromNow()