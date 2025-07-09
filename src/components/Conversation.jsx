import { useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from "../features/messageSlice"
import ConversationSection from "./ConversationSection";
// import supabase from "../config/supabaseClient.config";

/* eslint-disable react/prop-types */
const Conversation = ({messageId, messages, userId, users, name, img}) => {
    const [messageValue, setMessageValue] = useState('')
    const { sent, isAddingMessage, isDeleting } = useSelector((state) => state.message)
    
    const divRef = useRef(null)
    const messagesRef = useRef(null)

    const dispatch = useDispatch();



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
                <ConversationSection 
                    toUId={findMessage.sender_id}
                    toImg={findMessage.sender_img}
                    toName={findMessage.sender_name}
                    messagesRef={messagesRef}
                    divRef={divRef}
                    messageValue={messageValue}
                    setMessageValue={setMessageValue}
                    isAddingMessage={isAddingMessage}
                    handleSubmit={handleSubmit}
                    getConversationMessages={() => getConversationMessages(findMessage)}
                    isDeleting={isDeleting}
                    userId={userId}
                />
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
                    <ConversationSection 
                        toUId={matchUserWithCurrentParam.u_id}
                        toImg={matchUserWithCurrentParam.u_img}
                        toName={matchUserWithCurrentParam.name}
                        messagesRef={messagesRef}
                        divRef={divRef}
                        messageValue={messageValue}
                        setMessageValue={setMessageValue}
                        isAddingMessage={isAddingMessage}
                        handleSubmit={handleSubmit}
                        getConversationMessages={() => getConversationMessages()}
                        isDeleting={isDeleting}
                        userId={userId}
                    />
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