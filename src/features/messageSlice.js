import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabaseClient.config";

const initialState = {
    messages: null,
    isLoadingMessages: false,
    isAddingMessage: false,
    sent: false,
    isDeleting: false,
    errorMessages: false
}



export const getMessages = createAsyncThunk('message/getMessages', async (uid) => {
  // console.log(uid)
  if(uid) {
    const {data, error} = await supabase
    .from('messages')
    .select()
    .or(`receiver_id.eq.${uid}, sender_id.eq.${uid}`)
    .neq('user1_copy_delete', uid)
    .order('created_at', {ascending: false})

    if(error) {
      console.log(error)
      return 'error'
    }

    if(data) {
      // console.log(data)
      return data
    }
  }
})

export const addMessage = createAsyncThunk('message/addMessage', async (userData) => {
    const { data,error } = await supabase
      .from('messages')
      .insert({ 
          message: userData.message,
          sender_id: userData.senderId,
          receiver_id: userData.receiverId,
          sender_name: userData.senderName,
          sender_img: userData.senderImg,
          message_id: userData.messageId
        })
        .select()

        if(error) {
            console.log(error)
          // toast.error("Oops something went wrong. Please try again later", {className: "bg-error text-white text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          return error
        }

        if(data) {
          // toast.success('Posted!', {className: "bg-success text-white text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          return data[0]
        }
})

export const deleteSingleMessage = createAsyncThunk('message/deleteSingleMessage', async (singleMessageId) => {
    const {data, error} = await supabase
        .from('messages')
        .delete()
        .eq('id', singleMessageId)
        .select()

    if(error) return error
    return data[0]
})

export const deleteMessageConvo = createAsyncThunk('message/deleteMessageConvo', async (details) => {
  // console.log('receiver', details.receiver_id)
  // console.log('sender', details.sender_id)

    const {data, error} = await supabase
    .from('messages')
    .select()
    .or(`user1_copy_delete.eq.${details.receiver_id},user1_copy_delete.eq.${details.sender_id}`)

    if(error) return error
    
    if(data.length > 0) {
      console.log(data)
      await supabase.from('messages')
      .delete(details.id)
      .or(`and(receiver_id.eq.${details.receiver_id},sender_id.eq.${details.sender_id}),and(receiver_id.eq.${details.sender_id},sender_id.eq.${details.receiver_id})`)
      .select()

      return data
    } else {
        // console.log('else', data)
      const {data, error} = await supabase
      .from('messages')
      .update({user1_copy_delete: details.uid})
      .or(`and(receiver_id.eq.${details.receiver_id},sender_id.eq.${details.sender_id}),and(receiver_id.eq.${details.sender_id},sender_id.eq.${details.receiver_id})`)
      .select()

      if(error) return error
      console.log('data', data)
      return data
    }

})

const messageSlice = createSlice({
    name: 'messages',
    initialState,
  extraReducers: (builder) => {
    builder
        .addCase(getMessages.pending, (state) => {
            state.isLoadingMessages = true;
        })
        .addCase(getMessages.fulfilled, (state, action) => {
            state.messages = action.payload,
            state.isLoadingMessages = false
        })
        .addCase(getMessages.rejected, (state, action) => {
            state.errorMessages = action.error.message
            state.isLoadingMessages = false
        })
        .addCase(addMessage.pending, (state) => {
            state.isAddingMessage = true;
            state.sent = false
        })
        .addCase(addMessage.fulfilled, (state, action) => {
            state.messages = [...state.messages, action.payload],
            state.isAddingMessage = false,
            state.sent = true
        })
        .addCase(addMessage.rejected, (state, action) => {
            state.errorMessages = action.error.message
            state.isAddingMessage = false,
            state.sent = false
        })
        .addCase(deleteSingleMessage.pending, (state) => {
            state.isDeleting = true;
        })
        .addCase(deleteSingleMessage.fulfilled, (state, action) => {
            state.messages = state.messages.filter((message) => message.id !== action.payload.id)
            state.isDeleting = false
        })
        .addCase(deleteSingleMessage.rejected, (state, action) => {
            state.errorMessages = action.error.message
            state.isDeleting = false
        })
        .addCase(deleteMessageConvo.pending, (state) => {
            state.isDeleting = true;
        })
        .addCase(deleteMessageConvo.fulfilled, (state, action) => {
            state.messages = state.messages.filter((message) => !action.payload.map(x => x.id).includes(message.id))
            state.isDeleting = false
        })
        .addCase(deleteMessageConvo.rejected, (state, action) => {
            state.errorMessages = action.error.message
            state.isDeleting = false
        })
  }
})

export default messageSlice.reducer