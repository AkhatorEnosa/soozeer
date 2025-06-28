import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../config/supabaseClient.config";

const initialState = {
    follows: null,
    isLoadingFollows: false,
    errorFollows: false
}



export const follows = createAsyncThunk('follow/follows', async () => {

    const {data, error} = await supabase
    .from('follows')
    .select()
    // .from('profiles')
    // .select('*, follows!inner(*)')
    // .or(`follows.followed_id.eq.${profileId}, follows.follower_id.eq.${profileId}`)

    if(error) {
      return error
    }

    if(data) {
        // console.log(data)
      return data
    }

})

export const followUser = createAsyncThunk('follow/followUser', async (props) => {

    const {data, error} = await supabase
    .from('follows')
    .insert({
        "followed_id": props.receiverUid,
        "followed_name": props.receiverName,
        "followed_img": props.receiverImg,
        "follower_id": props.uid,
        "follower_name": props.creatorName,
        "follower_img": props.creatorImg
    })
    .select()
    
    if(error) {
        return
    }

    if(data) {
        if(props.uid !== null ) {
        await supabase
        .from('notifications')
        .insert({
            "for": "follow",
            "follow_id": data[0].id,
            "receiver_id": props.receiverUid,
            "creator_name": props.creatorName,
            "creator_id": props.uid,
            "creator_img": props.creatorImg
        })
        .select()
        }
        return data[0]
    }

})

export const unfollow = createAsyncThunk('follow/unfollow', async (id) => {

    const {data, error} = await supabase
    .from('follows')
    .delete()
    .eq('id', id)
    .select()

    if(error) return

    return data[0]

})

const followSlice = createSlice({
    name: 'follows',
    initialState,
  extraReducers: (builder) => {
    builder
        .addCase(follows.pending, (state) => {
            state.isLoadingFollows = true;
        })
        .addCase(follows.fulfilled, (state, action) => {
            state.follows = action.payload,
            state.isLoadingFollows = false
        })
        .addCase(follows.rejected, (state, action) => {
            state.errorFollows = action.error.message
            state.isLoadingFollows = false
        })
        .addCase(followUser.pending, (state) => {
            state.isLoadingFollows = true;
        })
        .addCase(followUser.fulfilled, (state, action) => {
            state.follows = [action.payload, ...state.follows],
            state.isLoadingFollows = false
        })
        .addCase(followUser.rejected, (state, action) => {
            state.errorPost = action.error.message
            state.isLoadingFollows = false
        })
        .addCase(unfollow.pending, (state) => {
            state.isLoadingFollows = true;
        })
        .addCase(unfollow.fulfilled, (state, action) => {
            state.follows = state.follows.filter(x => x.id !== action.payload.id)
            state.isLoadingFollows = false
        })
        .addCase(unfollow.rejected, (state, action) => {
            state.errorPost = action.error.message
            state.isLoadingFollows = false
        })
  }
})

export default followSlice.reducer