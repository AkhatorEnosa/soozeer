import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message"
import SideBar from "../components/SideBar"
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getMessages } from "../features/messageSlice";
import Footer from "../sections/Footer";
import Conversation from "../components/Conversation";
import supabase from "../config/supabaseClient.config";
import SearchModal from "../components/SearchModal";
import { AppContext } from "../context/AppContext";
import useOtherUsers from "../hooks/useOtherUsers";

const Messages = () => {
  const [search, setSearch] = useState('')

     // react router dom navigation and params 
  const navigate = useNavigate();
  const {id: paramsId} = useParams()
  const { error, loggedUser, otherUsers, isLoading } = useSelector((state) => state.app)
  const { messages, isLoadingMessages, isDeleting, errorMessages } = useSelector((state) => state.message)
  const { renderLoadingState, renderErrorState } = useContext(AppContext)
  const dispatch = useDispatch()
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: loggedUser?.u_id });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(!loggedUser?.u_id) {
        navigate('/')
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [loggedUser?.u_id])
  
  const udpatedMessageStatus = async(uid) => {
    if(loggedUser !== null || uid!== undefined) {

      dispatch(getMessages(loggedUser?.u_id))
        await supabase
        .from('messages')
        .update({ viewed: true})
        .eq('viewed', false)
        .eq('receiver_id', uid)
    }
  }

  useEffect(() => {
    udpatedMessageStatus(loggedUser?.u_id )
  }, [loggedUser?.u_id])

  // searh bar function 
  const handleSearch = (e) => {
    e.preventDefault()
    if(search.trim() !== '') {
      navigate(`../search/${search}`)
    }
  }

  // Toggle Search Bar 
  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal()
  }


  const groupMessages = () => {
    if(messages !== null) {
      const grouped = Object.groupBy(messages, ({ sender_id }) => sender_id !== loggedUser.u_id && sender_id)
      // console.log(grouped)
      let newMessages = [];
      Object.keys(grouped).forEach(key => {
        if(key !== 'false') {
          newMessages = [...newMessages, grouped[key][0]]
        }
      })

      return newMessages
    }
  }

  let content;

    if(errorMessages) {
      content = <h1>Error: Error loading your messages at this time. Try again!</h1>
    }

    if(isLoading && isLoadingMessages || !loggedUser?.u_id) {
      content = renderLoadingState('h-20')
    } else {
      if(messages !== null  && !isLoadingMessages ) {
        if(messages?.length > 0) {
          content = groupMessages().map(message => (
            <Message 
              key={message.id}
              uid={loggedUser?.u_id}
              messageId={message.message_id}
              message={message.message}
              messages={messages}
              viewStatus={message.viewed}
              u_name={message.sender_name}
              img={message.sender_img}
              datetime={message.created_at}
              deleting={isDeleting}
            />
          ))
        } else {
          content = <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-4xl"><i className="bi bi-envelope"></i><p className="text-neutral-dark">No Messages!</p></h1>
        }
      } else {
      content = renderLoadingState('h-20')
      }
    }

    if(error) {
      return renderErrorState('Something went wrong. Please try again later.');
    } else {
      return (
        <div className="w-full flex flex-col items-center px-2 md:p-0 md:m-0">
  
            <div className="sticky w-full lg:grid text-neutral-dark dark:text-dark-accent lg:grid-cols-8 px-2 md:px-20 pb-10 md:pb-28 md:gap-2 lg:mb-0 lg:pb-0">
              {loggedUser && <SideBar
              uid={loggedUser !== null ? loggedUser.u_id : null} 
              page={'messages'} 
              toggleSearchBar={handleShowSearch}
              />}
  
  
              {
                messages == 'error' ? 
                <div className="main w-full flex flex-col justify-center items-center col-span-6 border-[1px] border-black/5 "><p>This page does not exist.</p></div> 
                :
                <div className={`w-full top-0 grid grid-cols-6 ${loggedUser ? "col-span-6" : "col-span-8"} gap-2 mt-5`}>
                  <div className={`col-span-3 border-[1px] border-black/5 dark:border-slate-500/20 h-fit rounded-md`}>
                  {/* <div className="hidden w-full lg:flex px-3 bg-bg/50 backdrop-blur-sm sticky top-0 z-[100]">
                    <BackBtn link={() => navigate(-1)} title={'Back'}/>
                  </div> */}
                    <h1 className="text-xl font-bold px-3 py-5 border-b-[1px] border-black/5 dark:border-slate-500/20 dark:text-dark-accent bg-bg/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[30px]">Messages</h1>
                    <div className="divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                      {content}
                    </div>
                  </div>
                  
                  <Conversation 
                    messageId = {paramsId}
                    messages={messages}
                    users={otherUsers}
                    userId={loggedUser?.u_id}
                    name={loggedUser?.name}
                    img={loggedUser?.u_img}
                  />
                  
                </div>}
            </div>
  
            {/* search modal  */}
            <SearchModal 
              handleSearch={handleSearch}
              search={search}
              handleChange={(e)=> setSearch(e.target.value)}
            />
  
            <Footer 
              uid={loggedUser !== null && loggedUser?.u_id} 
              page={'messages'} 
              toggleSearchBar={handleShowSearch}/>
        </div>
      )
    }
}

export default Messages