import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import supabase from "../config/supabaseClient.config"
import { Flip, toast } from "react-toastify"

const initialState = {
    currentPost: null,
    isLiking: false,
    isBookmarking: false,
    comments: [],
    commentLikes: [],
    commentBookmarks: [],
    isPosting: false,
    posted: false,
    isLoadingComment: false,
    isLikingComment: false,
    isBookmarkingComment: false,
    isDeletingComment: false,
    errorComment: false
}

export const getPost = createAsyncThunk('singlePost/getPost', async (paramsId) => {

      const {data, error} = await supabase.from('posts')
      .select()
      .eq('id', paramsId)

      if(error) {
        return "error"
      }

      if(data && data.length > 0) {
        return data[0]
      } else {
        window.location.replace("/#/404")
      }
})

export const singlePostDelete = createAsyncThunk('singlePost/singlePostDelete', async (id) => {

    const {data, error} = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .select()

    if(error) {
        // console.log(error)
        return error
    }

    if(data) {
       const {commentData, commentError} = await supabase
        .from('posts')
        .delete()
        .eq('post_id', data[0].id)

        if(commentError) return error

        if(commentData) {
            await supabase
            .from('posts')
            .delete()
            .eq('post_id', commentData[0].id)

        }
            data[0].post_id !== 0 ? window.location.replace(`/#/post/${data[0].post_id}`) : window.location.replace(`/#/`)
        // return data[0]
    }
})

export const getComments = createAsyncThunk('singlePost/getComments', async (paramsId) =>{

      const {data, error} = await supabase.from('posts')
      .select()
      .eq('post_id', paramsId)
        .order('id', {ascending: false})

      if(error) {
        return error
      }

      if(data) {
        // console.log(data)
        return data
      } 

})

export const addComment = createAsyncThunk('singlePost/addComment', async (userData) => {

    const { data,error } = await supabase
    .from('posts')
    .insert({ 
        body: userData.body,
        u_name: userData.name,
        u_id: userData.u_id,
        u_img: userData.u_img,
        post_id: userData.paramsId,
        type: userData.type
        // origin_id: userData.paramsId
    })
    .select()

    if(error) {
        toast.error("Oops something went wrong. Please try again later", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
    }

    if(data) {
        toast.success('Comment Posted!', {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})


        await supabase
        .from('notifications')
        .insert({
            "for": data[0].type,
            "post_id": userData.paramsId,
            "post_snippet": userData.body,
            "receiver_id": userData.postUid,
            "creator_name": userData.name,
            "creator_id": userData.u_id,
            "creator_img": userData.u_img
        })
        // .select()
        return data[0]
    }
})

export const deleteSingleComment = createAsyncThunk('singlePost/deleteSingleComment', async (id) => {
      const {data, error} = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .select()

      if(error){
        console.log("Error", error)
        return error
      }

      if(data) {
        await supabase
        .from('posts')
        .delete()
        .eq('post_id', id)

        await supabase
        .from('notifications')
        .delete()
        .eq('post_id', id)
        return data[0]
      } 
})

export const getCommentLikes = createAsyncThunk('comments/getCommentLikes', async () => {

    const {data, error} = await supabase
    .from('likes')
    .select()

    if(error) {
        console.log(error)
      return error
    }

    if(data) {
      return data
    }
})

export const commentBookmarks = createAsyncThunk('comments/commentBookmarks', async () => {

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

export const likeComment = createAsyncThunk('singlePost/likeComment', async (props) => {

    const {data, error} = await supabase
    .from('likes')
    .insert({
        "comment_id": props.commentId,
        "u_id": props.creatorUid,
        "for": ""
    })
    .select()
    
    if(error) {
        return
    }

    if(data) {
        await supabase
        .from('notifications')
        .insert({
            "for": "comment_like",
            "post_id": props.postId,
            "comment_id": props.commentId,
            "like_id": data[0].id,
            "receiver_id": props.commentUid,
            "creator_name": props.creatorName,
            "creator_id": props.creatorUid,
            "post_snippet": props.comment,
            "creator_img": props.creatorImg
        })
        // .select()
        console.log(data[0])
        return data[0]
    }

})
export const bookmarkComment = createAsyncThunk('singlePost/bookmarkComment', async (props) => {

    const {data, error} = await supabase
    .from('bookmarks')
    .insert({
        "comment_id": props.commentId,
        "u_id": props.creatorUid
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
                "for": "comment_bookmark",
                "post_id": props.postId,
                "comment_id": props.commentId,
                "bookmark_id": data[0].id,
                "receiver_id": props.commentUid,
                "creator_name": props.creatorName,
                "creator_id": props.creatorUid,
                "post_snippet": props.comment,
                "creator_img": props.creatorImg
            })
            .select()
        }
        return data[0]
    }

})

export const unlikeComment = createAsyncThunk('singlePost/unlikeComment', async (id) => {

    const {data, error} = await supabase
    .from('likes')
    .delete()
    .eq('id', id)
    .select()

    if(error) return
    // console.log(data[0])
    return data[0]

})

export const unBookmarkComment = createAsyncThunk('singlePost/unBookmarkComment', async (id) => {

    const {data, error} = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .select()

    if(error) return
    // console.log(data[0])
    return data[0]

})

// export const unlike = createAsyncThunk('posts/unlike', async (id) => {

//     const {data, error} = await supabase
//     .from('commentLikes')
//     .delete()
//     .eq('id', id)
//     .select()

//     if(error) return
//     console.log(data[0])
//     return data[0]

// })

// export const commentBookmarks = createAsyncThunk('posts/commentBookmarks', async () => {

//     const {data, error} = await supabase
//     .from('commentBookmarks')
//     .select()

//     if(error) {
//       return
//     }

//     if(data) {
//       return data
//     }
// })

// export const unBookmark = createAsyncThunk('posts/unBookmark', async (id) => {

//     const {data, error} = await supabase
//     .from('commentBookmarks')
//     .delete()
//     .eq('id', id)
//     .select()

//     if(error) return
//     return data[0]

// })

// export const comments = createAsyncThunk('posts/comments', async () => {

//     const {data, error} = await supabase
//     .from('comments')
//     .select()

//     if(error) {
//       return
//     }

//     if(data) {
//       return data
//     }

// })

// export const searchedPostQuery = createAsyncThunk('singlePost/searchedPostQuery', async (params) => {
//           const { data,error } = await supabase
//           .from('posts')
//           .select()
//           .ilike('body', `%${params.id}%`)
//           .order('body', {ascending: false})

//           const postData = data
//           const postError = error
//               if(postError) {
//                 console.log(postError)
//                 return error
//               }

//               if(postData) {
//                 return postData
//               }
// })

const singlePostSlice = createSlice({
    name: 'singlePost',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getPost.pending, (state) => {
                state.isLoadingPost = true;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.currentPost = action.payload,
                state.isLoadingPost = false
            })
            .addCase(getPost.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.currentPost = null,
                state.isLoadingPost = false
            })
            .addCase(singlePostDelete.pending, (state) => {
                state.isDeletingPost = true;
            })
            .addCase(singlePostDelete.fulfilled, (state) => {
                state.currentPost = null,
                state.isLoadingPost = false
            })
            .addCase(singlePostDelete.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isLoadingPost = false
            })
            .addCase(getComments.pending, (state) => {
                state.isLoadingComment = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.comments = action.payload,
                state.isLoadingComment = false
            })
            .addCase(getComments.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.comments = null,
                state.isLoadingComment = false
            })
            .addCase(addComment.pending, (state) => {
                state.isPosting = true
                state.posted = false
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments = [action.payload, ...state.comments],
                state.isPosting = false
                state.posted = true
            })
            .addCase(addComment.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isPosting = false
                state.posted = false
            })
            .addCase(deleteSingleComment.pending, (state) => {
                state.isDeletingComment = true;
            })
            .addCase(deleteSingleComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(x => x.id !== action.payload.id),
                state.isDeletingComment = false
            })
            .addCase(deleteSingleComment.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isDeletingComment = false
            })
            .addCase(getCommentLikes.pending, (state) => {
                state.isLoadingComment = true;
            })
            .addCase(getCommentLikes.fulfilled, (state, action) => {
                state.commentLikes = action.payload,
                state.isLoadingComment = false
            })
            .addCase(getCommentLikes.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLoadingComment = false
            })
            .addCase(commentBookmarks.pending, (state) => {
                state.isLoadingComment = true;
            })
            .addCase(commentBookmarks.fulfilled, (state, action) => {
                state.commentBookmarks = action.payload,
                state.isLoadingComment = false
            })
            .addCase(commentBookmarks.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLoadingComment = false
            })
            .addCase(likeComment.pending, (state) => {
                state.isLoadingPosts = false;
                state.isLikingComment = true
            })
            .addCase(likeComment.fulfilled, (state, action) => {
                state.commentLikes = [action.payload, ...state.commentLikes],
                // state.likedPosts,
                state.isLikingComment = false
            })
            .addCase(likeComment.rejected, (state, action) => {
                state.errorPost = action.error.message
                state.isLikingComment = false
            })
            .addCase(unlikeComment.pending, (state) => {
                state.isLikingComment = true;
            })
            .addCase(unlikeComment.fulfilled, (state, action) => {
                // state.likedComment = state.likedComment.filter(x => x.id !== action.payload.post_id)
                state.commentLikes = state.commentLikes.filter(x => x.id !== action.payload.id)
                state.isLikingComment = false
            })
            .addCase(unlikeComment.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isLikingComment = false
            })
            .addCase(unBookmarkComment.pending, (state) => {
                state.isBookmarkingComment = true;
            })
            .addCase(unBookmarkComment.fulfilled, (state, action) => {
                // state.likedComment = state.likedComment.filter(x => x.id !== action.payload.post_id)
                state.commentBookmarks = state.commentBookmarks.filter(x => x.id !== action.payload.id)
                state.isBookmarkingComment = false
            })
            .addCase(unBookmarkComment.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isBookmarkingComment = false
            })
            // .addCase(commentBookmarks.pending, (state) => {
            //     state.isLoadingPosts = true;
            // })
            // .addCase(commentBookmarks.fulfilled, (state, action) => {
            //     state.commentBookmarks = action.payload,
            //     state.isLoadingPosts = false
            // })
            // .addCase(commentBookmarks.rejected, (state, action) => {
            //     state.errorPost = action.error.message
            //     state.isLoadingPosts = false
            // })
            .addCase(bookmarkComment.pending, (state) => {
                state.isBookmarkingComment = true;
            })
            .addCase(bookmarkComment.fulfilled, (state, action) => {
                state.commentBookmarks = [action.payload, ...state.commentBookmarks],
                state.isBookmarkingComment = false
            })
            .addCase(bookmarkComment.rejected, (state, action) => {
                state.errorComment = action.error.message
                state.isBookmarkingComment = false
            })
            // .addCase(unBookmark.pending, (state) => {
            //     state.isLoadingPosts = false;
            // })
            // .addCase(unBookmark.fulfilled, (state, action) => {
            //     state.bookmarkedPosts = state.bookmarkedPosts.filter(x => x.id !== action.payload.post_id)
            //     state.commentBookmarks = state.commentBookmarks.filter(x => x.id !== action.payload.id)
            // })
            // .addCase(unBookmark.rejected, (state, action) => {
            //     state.errorPost = action.error.message
            // })
            // .addCase(comments.pending, (state) => {
            //     state.isLoadingPosts = true;
            // })
            // .addCase(comments.fulfilled, (state, action) => {
            //     state.comments = action.payload,
            //     state.isLoadingPosts = false
            // })
            // .addCase(comments.rejected, (state, action) => {
            //     state.errorPost = action.error.message
            //     state.isLoadingPosts = false
            // })
            // .addCase(searchedPostQuery.pending, (state) => {
            //     state.isLoadingPosts = true;
            // })
            // .addCase(searchedPostQuery.fulfilled, (state, action) => {
            //     state.posts = action.payload,
            //     state.isLoadingPosts = false
            // })
            // .addCase(searchedPostQuery.rejected, (state, action) => {
            //     state.errorPost = action.error.message
            //     state.posts = null,
            //     state.isLoadingPosts = false
            // })
    }
})

export default singlePostSlice.reducer