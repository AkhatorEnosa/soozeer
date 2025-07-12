import { Link, useNavigate } from "react-router-dom";
import BackBtn from "./BackBtn";
import MessageBubble from "./MessageBubble";

/* eslint-disable react/prop-types */
const ConversationSection = ({toUId, toImg, toName, messagesRef, divRef, messageValue, setMessageValue, isAddingMessage, handleSubmit, getConversationMessages, isDeleting, userId }) => {
    const navigate = useNavigate();
  return (
    <div className="absolute top-0 left-0 w-full h-screen md:relative flex flex-col md:h-fit col-span-3 lg:border-[1px] border-black/5 dark:border-neutral-300/10 lg:px-1 py-4 rounded-t-lg rounded-b-3xl pb-24 md:pb-2 bg-base-100 dark:bg-black gap-2 justify-between lg:pt-5">
        <div className="flex flex-col w-full h-full gap-4">
            <div className="w-full flex flex-col px-4 bg-base-100 dark:bg-black lg:px-0 lg:justify-between items-center z-30">
                {/* back button */}
                <div className="w-full flex bg-base-100 dark:bg-black px-4 md:hidden">
                    <BackBtn link={() => navigate('../messages/conversations')} title={'Back'}/>
                </div>
                <Link to={`/${toUId}`} className="px-3 md:px-5 w-full flex md:flex-col items-center justify-center gap-2 text-neutral-dark dark:text-dark-text">
                    <img src={toImg} className="w-8 h-8 object-cover object-center rounded-full cursor-default"/>
                    <b className="md:text-md">{toName}</b>
                </Link> 
            </div>
            <div className="message relative h-full flex flex-col gap-4 md:h-[50vh] px-3 py-2 lg:px-3 overflow-scroll" ref={messagesRef}>
                <div className="w-full h-full bg-[url('/message-bg-light.webp')] dark:bg-[url('/message-bg-dark.webp')] bg-cover absolute top-0 left-0 opacity-10 dark:opacity-35 overflow-clip z-10">
                </div>
                <div className="relative w-full flex flex-col gap-2 overflow-scroll z-40">
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
        </div>

        <div className="relative md:bottom-0 h-fit w-full lg:px-0 z-30">
            <div className="w-full flex justify-center items-center gap-2 px-4 overflow-clip">
                <textarea name="body" id="body" ref={divRef} className={`text-md focus:bg-primary/5 w-full flex flex-col dark:text-[#CBC9C9] dark:bg-black dark:placeholder:text-[#cbc9c9]/60 px-2 pt-2 rounded-md outline-none resize-none`} value={messageValue} placeholder="Type your message here" onChange={(e) => setMessageValue(e.target.value)?.trim()} readOnly={isAddingMessage && true}></textarea>
                <div className="flex flex-col justify-center w-[5%] h-full">
                    <button className={`border-none text-xl ${messageValue.trim() !== '' ? "text-primary rotate-45" : "text-primary/50 cursor-not-allowed"} font-semibold hover:bg-inherit disabled:bg-transparent transition-all duration-150 disabled:bg-transparent"`} onClick={handleSubmit} disabled={messageValue.trim() == '' || isAddingMessage && "disabled"}>
                        {
                            isAddingMessage ?  
                                <span className="loading loading-spinner loading-sm text-neutral-400"></span> 
                                    : 
                                <i className={messageValue.trim() !== '' ? "bi bi-send-fill rotate-45 transition-all duration-150" : "bi bi-send-fill rotate-0 transition-all duration-150"}></i>
                        }
                    </button>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default ConversationSection