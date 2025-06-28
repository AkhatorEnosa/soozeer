import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import supabase from "../config/supabaseClient.config"
import { Flip, toast } from "react-toastify"
import PostedLink from "../components/PostedLink"

const initialState = {
    posts: [],
    searchedPosts: null,
    likes: null,
    likedPosts: [],
    bookmarks: [],
    bookmarkedPosts: null,
    postComments: [],
    replies: null,
    isAddingPost: false,
    posted: false,
    postDetails: null,
    isLoadingPosts: false,
    isDeletingPost: false,
    isLiking: false,
    isBookmarking: false,
    errorPost: false,
    hasNextPage: true
}

// const randomizeSortFilter = () => {
//     const seeds = [ 'created_at', 'body', 'journal']
//     const seed = seeds[Math.floor(Math.random() * seeds.length)]

//     return seed
// }


export const getPosts = createAsyncThunk('posts/getPosts', async () =>{

    const {data, error} = await supabase.from('posts')
    .select()
    .eq('post_id', 0)
    .order('created_at', {ascending: false})
    // .order('body', {ascending: false})
    // .limit(limit)
    // .range(offset, offset + limit - 1);

    if(error) {
        console.log(error)
        return error
    }

    if(data) {
        return data
    } 

})

export const getReplies = createAsyncThunk('posts/getReplies', async () =>{

    const {data, error} = await supabase.from('posts')
    .select()
    .neq('post_id', 0)
    .order('created_at', {ascending: false})
    // .limit(15)

    if(error) {
        console.log(error)
        return error
    }

    if(data) {
        return data
    } 

})

export const userLikedPosts = createAsyncThunk('posts/userLikedPosts', async (profileId) =>{
    const { data, error } = await supabase
    .from('posts')
    .select('*, likes!inner(*)')
    .eq('likes.u_id', profileId)

    if(error) {
        console.log(error)
        return error
    }

    if(data) {
        return data
    } 

})

export const userBookmarkedPosts = createAsyncThunk('posts/userBookmarkedPosts', async (profileId) =>{
    const { data, error } = await supabase
    .from('posts')
    .select('*, bookmarks!inner(*)')
    .eq('bookmarks.u_id', profileId)

    if(error) {
        console.log(error)
        return error
    }

    if(data) {
        return data
    } 

})

export const addPost = createAsyncThunk('posts/addPost', async (userData) => {
    const { data,error } = await supabase
      .from('posts')
      .insert({
          body: userData.body,
          u_name: userData.name,
          u_id: userData.u_id,
          u_img: userData.u_img,
          post_id: userData.paramsId,
          title: userData.title,
          journal: userData.journal,
          privacy: userData.privacy,
          type: userData.type
        })
        .select()

        if(error) {
            console.log(error)
          toast.error("Oops something went wrong. Please try again later", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          return error
        }

        if(data) {
          toast.success(PostedLink, {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
          return data[0]
        }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (details) => {
    const {data, error} = await supabase
        .from('posts')
        .delete()
        .eq('id', details.id)
        .select()

    if(error) return

    if (data){
        await supabase
        .from('posts')
        .delete()
        .eq('post_id', details.id)
        return data[0]
    }
})

export const getLikes = createAsyncThunk('posts/getLikes', async () => {

    const {data, error} = await supabase
    .from('likes')
    .select()

    if(error) {
      return
    }

    if(data) {
      return data
    }
})

export const likePost = createAsyncThunk('posts/likePost', async (props) => {

    const {data, error} = await supabase
    .from('likes')
    .insert({
        "post_id": props.postId,
        "u_id": props.creatorUid,
        "for": props.for
    })
    .select()
    
    if(error) {
        return
    }

    if(data) {
        if(props.creatorUid !== null) {
            await supabase
            .from('notifications')
            .insert({
                "for": data[0].for == 'post' ? 'like' : data[0].for + '_like',
                "post_id": props.postId,
                "like_id": data[0].id,
                "receiver_id": props.postUid,
                "creator_name": props.creatorName,
                "creator_id": props.creatorUid,
                "post_snippet": props.postBody,
                "creator_img": props.creatorImg,
                "comment_id": data[0].for !== 'post' && props.commentId
            })
            .select()
        }
        return data[0]
    }

})

export const unlike = createAsyncThunk('posts/unlike', async (id) => {

    const {data, error} = await supabase
    .from('likes')
    .delete()
    .eq('id', id)
    .select()

    if(error) return
    return data[0]

})

export const getBookmarks = createAsyncThunk('posts/getBookmarks', async () => {

    const {data, error} = await supabase
    .from('bookmarks')
    .select()

    if(error) {
      return
    }

    if(data) {
      return data
    }
})

export const bookmarkPost = createAsyncThunk('posts/bookmarkPost', async (props) => {

    const {data, error} = await supabase
    .from('bookmarks')
    .insert({
        "post_id": props.postId,
        "u_id": props.creatorUid,
        "for": props.for
    })
    .select()
    
    if(error) {
        return
    }

    if(data) {
        if(props.creatorUid !== null) {
            await supabase
            .from('notifications')
            .insert({
                "for": data[0].for == 'post' ? 'bookmark' : data[0].for + '_bookmark',
                "post_id": props.postId,
                "bookmark_id": data[0].id,
                "receiver_id": props.postUid,
                "creator_name": props.creatorName,
                "creator_id": props.creatorUid,
                "post_snippet": props.postBody,
                "creator_img": props.creatorImg,
                "comment_id": data[0].for !== 'post' && props.commentId
            })
            .select()
        }
        return data[0]
    }

})

export const unBookmark = createAsyncThunk('posts/unBookmark', async (id) => {

    const {data, error} = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .select()

    if(error) return
    return data[0]

})

export const getPostComments = createAsyncThunk('posts/getPostComments', async () => {

    const {data, error} = await supabase.from('posts')
    .select()
    .neq('post_id', 0)

    if(error) {
      return
    }

    if(data) {
      return data
    }

})

export const searchedPostQuery = createAsyncThunk('posts/searchedPostQuery', async (params) => {
          const { data,error } = await supabase
          .from('posts')
          .select()
          .or(`body.ilike.%${params.id}%,journal.ilike.%${params.id}%,title.ilike.%${params.id}%`)
          .order('created_at', {ascending: false})

          const postData = data
          const postError = error
              if(postError) {
                console.log(postError)
                return error
              }

              if(postData) {
                return postData
              }
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.posts = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.posts = null,
                state.isLoadingPosts = false
            })
            .addCase(getReplies.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(getReplies.fulfilled, (state, action) => {
                state.replies = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(getReplies.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.replies = null,
                state.isLoadingPosts = false
            })
            .addCase(addPost.pending, (state) => {
                state.isAddingPost = true;
                state.posted = false
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts],
                state.postDetails = action.payload
                state.isAddingPost = false
                state.posted = true
            })
            .addCase(addPost.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isAddingPost = false
                state.posted = false
            })
            .addCase(deletePost.pending, (state) => {
                state.isDeletingPost = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(x => x.id !== action.payload.id),
                state.isDeletingPost = false
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isDeletingPost = false
            })
            .addCase(getLikes.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(getLikes.fulfilled, (state, action) => {
                state.likes = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(getLikes.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLoadingPosts = false
            })
            .addCase(userLikedPosts.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(userLikedPosts.fulfilled, (state, action) => {
                state.likedPosts = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(userLikedPosts.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.likedPosts = null
                state.isLoadingPosts = false
            })
            .addCase(userBookmarkedPosts.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(userBookmarkedPosts.fulfilled, (state, action) => {
                state.bookmarkedPosts = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(userBookmarkedPosts.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.bookmarkedPosts = null
                state.isLoadingPosts = false
            })
            .addCase(likePost.pending, (state) => {
                state.isLoadingPosts = false;
                state.isLiking = true
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.likes = [action.payload, ...state.likes],
                // state.likedPosts,
                state.isLiking = false
            })
            .addCase(likePost.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLiking = false
            })
            .addCase(unlike.pending, (state) => {
                state.isLiking = true;
            })
            .addCase(unlike.fulfilled, (state, action) => {
                state.likedPosts = state.likedPosts.filter(x => x.id !== action.payload.post_id)
                state.likes = state.likes.filter(x => x.id !== action.payload.id)
                state.isLiking = false
            })
            .addCase(unlike.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLiking = false
            })
            .addCase(getBookmarks.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(getBookmarks.fulfilled, (state, action) => {
                state.bookmarks = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(getBookmarks.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLoadingPosts = false
            })
            .addCase(bookmarkPost.pending, (state) => {
                state.isBookmarking = true;
            })
            .addCase(bookmarkPost.fulfilled, (state, action) => {
                state.bookmarks = [action.payload, ...state.bookmarks],
                state.isBookmarking = false
            })
            .addCase(bookmarkPost.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isBookmarking = false
            })
            .addCase(unBookmark.pending, (state) => {
                state.isLoadingPosts = false;
            })
            .addCase(unBookmark.fulfilled, (state, action) => {
                state.bookmarkedPosts = state.bookmarkedPosts?.filter(x => x.id !== action.payload.post_id)
                state.bookmarks = state.bookmarks.filter(x => x.id !== action.payload.id)
            })
            .addCase(unBookmark.rejected, (state, action) => {
                state.errorPost = action.error.message
            })
            .addCase(getPostComments.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(getPostComments.fulfilled, (state, action) => {
                state.postComments = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(getPostComments.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLoadingPosts = false
            })
            .addCase(searchedPostQuery.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(searchedPostQuery.fulfilled, (state, action) => {
                state.searchedPosts = action.payload,
                state.isLoadingPosts = false
            })
            .addCase(searchedPostQuery.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.searchedPosts = null,
                state.isLoadingPosts = false
            })
    }
})

export default postSlice.reducer