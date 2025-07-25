import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import supabase from "../config/supabaseClient.config"
import { showErrorToast, showSuccessToast } from "../utils/toastNotify";

const initialState = {
    currentPost: null,
    isLiking: false,
    isBookmarking: false,
    comments: [],
    commentLikes: [],
    commentBookmarks: [],
    isPosting: false,
    posted: false,
    isLoadingComment: true,
    isLikingComment: false,
    isBookmarkingComment: false,
    isDeletingComment: false,
    errorComment: false
}

export const getPost = createAsyncThunk('singlePost/getPost', async (paramsId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('id', paramsId);

        if (error) {
            console.error('Error fetching post:', error);
            return 'error';
        }

        if (data?.length > 0) {
            return data[0];
        } else {
            window.location.replace('/#/404');
            return null;
        }
    } catch (err) {
        console.error('getPost failed:', err);
        return 'error';
    }
});


export const singlePostDelete = createAsyncThunk('singlePost/singlePostDelete', async (id) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting single post:', error);
            return error;
        }

        if (data?.length > 0) {
            const postId = data[0].id;

            const { data: commentData, error: commentError } = await supabase
                .from('posts')
                .delete()
                .eq('post_id', postId);

            if (commentError) {
                console.error('Error deleting related comments:', commentError);
                return commentError;
            }

            if (commentData?.length > 0) {
                await supabase
                    .from('posts')
                    .delete()
                    .eq('post_id', commentData[0].id);
            }

            const redirectPath = data[0].post_id !== 0 
                ? `/#/post/${data[0].post_id}` 
                : '/#/';

            window.location.replace(redirectPath);

            return data[0];
        }

    } catch (err) {
        console.error('singlePostDelete failed:', err);
        return 'error';
    }
});


export const getComments = createAsyncThunk('singlePost/getComments', async (paramsId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('post_id', paramsId)
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getComments failed:', err);
        return 'error';
    }
});


export const addComment = createAsyncThunk('singlePost/addComment', async (userData) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert({
                body: userData.body,
                u_name: userData.name,
                u_id: userData.u_id,
                u_img: userData.u_img,
                post_id: userData.paramsId,
                type: userData.type
            })
            .select();

        if (error) {
            console.error('Error adding comment:', error);
            showErrorToast('Failed to post comment. Please try again later.');
            return error;
        }

        if (data?.length > 0) {
            showSuccessToast('Comment Posted!');

            await supabase
                .from('notifications')
                .insert({
                    for: data[0].type,
                    post_id: userData.paramsId,
                    post_snippet: userData.body,
                    receiver_id: userData.postUid,
                    creator_name: userData.name,
                    creator_id: userData.u_id,
                    creator_img: userData.u_img
                });

            return data[0];
        }
    } catch (err) {
        console.error('addComment failed:', err);
        showErrorToast('Failed to post comment. Please try again later.');
        return 'error';
    }
});

export const deleteSingleComment = createAsyncThunk('singlePost/deleteSingleComment', async (id) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error deleting comment:', error);
            return error;
        }

        if (data?.length > 0) {
            await supabase
                .from('posts')
                .delete()
                .eq('post_id', id);

            await supabase
                .from('notifications')
                .delete()
                .eq('post_id', id);

            return data[0];
        }
    } catch (err) {
        console.error('deleteSingleComment failed:', err);
        return 'error';
    }
});

export const getCommentLikes = createAsyncThunk('comments/getCommentLikes', async () => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .select();

        if (error) {
            console.error('Error fetching comment likes:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getCommentLikes failed:', err);
        return 'error';
    }
});

export const commentBookmarks = createAsyncThunk('comments/commentBookmarks', async () => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .select();

        if (error) {
            console.error('Error fetching comment bookmarks:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('commentBookmarks failed:', err);
        return 'error';
    }
});

export const likeComment = createAsyncThunk('singlePost/likeComment', async (props) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .insert({
                comment_id: props.commentId,
                u_id: props.creatorUid,
                for: ""
            })
            .select();

        if (error) {
            console.error('Error liking comment:', error);
            return error;
        }

        if (data?.length > 0) {
            await supabase
                .from('notifications')
                .insert({
                    for: "comment_like",
                    post_id: props.postId,
                    comment_id: props.commentId,
                    like_id: data[0].id,
                    receiver_id: props.commentUid,
                    creator_name: props.creatorName,
                    creator_id: props.creatorUid,
                    post_snippet: props.comment,
                    creator_img: props.creatorImg
                });

            console.log(data[0]);
            return data[0];
        }
    } catch (err) {
        console.error('likeComment failed:', err);
        return 'error';
    }
});

export const bookmarkComment = createAsyncThunk('singlePost/bookmarkComment', async (props) => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert({
                comment_id: props.commentId,
                u_id: props.creatorUid
            })
            .select();

        if (error) {
            console.error('Error bookmarking comment:', error);
            return error;
        }

        if (data?.length > 0 && props.creatorUid !== null) {
            await supabase
                .from('notifications')
                .insert({
                    for: "comment_bookmark",
                    post_id: props.postId,
                    comment_id: props.commentId,
                    bookmark_id: data[0].id,
                    receiver_id: props.commentUid,
                    creator_name: props.creatorName,
                    creator_id: props.creatorUid,
                    post_snippet: props.comment,
                    creator_img: props.creatorImg
                });
        }

        return data[0];
    } catch (err) {
        console.error('bookmarkComment failed:', err);
        return 'error';
    }
});

export const unlikeComment = createAsyncThunk('singlePost/unlikeComment', async (id) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error unliking comment:', error);
            return error;
        }

        return data?.[0];
    } catch (err) {
        console.error('unlikeComment failed:', err);
        return 'error';
    }
});

export const unBookmarkComment = createAsyncThunk('singlePost/unBookmarkComment', async (id) => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error removing comment bookmark:', error);
            return error;
        }

        return data?.[0];
    } catch (err) {
        console.error('unBookmarkComment failed:', err);
        return 'error';
    }
});


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
    }
})

export default singlePostSlice.reducer