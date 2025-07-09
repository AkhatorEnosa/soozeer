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

const showToast = (type, message) => {
    toast[type](message, {
        className: "text-sm font-semibold",
        autoClose: 2000,
        position: 'top-right',
        closeOnClick: true,
        transition: Flip,
        hideProgressBar: true
    });
};


// const randomizeSortFilter = () => {
//     const seeds = [ 'created_at', 'body', 'journal']
//     const seed = seeds[Math.floor(Math.random() * seeds.length)]

//     return seed
// }


export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('post_id', 0)
            .order('created_at', { ascending: false });
  
        if (error) {
            console.error('Error fetching posts:', error);
            return error;
        }
    
        return data;
    } catch (err) {
      console.error('getPosts failed:', err);
      return 'error';
    }
});
  

export const getReplies = createAsyncThunk('posts/getReplies', async () => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .neq('post_id', 0)
            .order('created_at', { ascending: false });
        // .limit(15)

        if (error) {
            console.error('Error fetching replies:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getReplies failed:', err);
        return 'error';
    }
});
  

export const userLikedPosts = createAsyncThunk('posts/userLikedPosts', async (profileId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, likes!inner(*)')
            .eq('likes.u_id', profileId);

        if (error) {
            console.error('Error fetching liked posts:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('userLikedPosts failed:', err);
        return 'error';
    }
});

export const userBookmarkedPosts = createAsyncThunk('posts/userBookmarkedPosts', async (profileId) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, bookmarks!inner(*)')
            .eq('bookmarks.u_id', profileId);

        if (error) {
            console.error('Error fetching bookmarked posts:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('userBookmarkedPosts failed:', err);
        return 'error';
    }
});export const addPost = createAsyncThunk('posts/addPost', async (userData) => {
    try {
        const { data, error } = await supabase
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
            .select();

        if (error) {
            console.error('Error inserting post:', error);
            showToast('error', "Oops something went wrong. Please try again later");
            return error;
        }

        if (data) {
            showToast('success', PostedLink);
            return data[0];
        }
    } catch (err) {
        console.error('addPost failed:', err);
        showToast('error', "Oops something went wrong. Please try again later");
        return 'error';
    }
});


export const deletePost = createAsyncThunk('posts/deletePost', async (details) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', details.id)
            .select();

        if (error) {
            console.error('Error deleting post:', error);
            return error;
        }

        if (data) {
            await supabase
                .from('posts')
                .delete()
                .eq('post_id', details.id);

            return data[0];
        }
    } catch (err) {
        console.error('deletePost failed:', err);
        return 'error';
    }
});

export const getLikes = createAsyncThunk('posts/getLikes', async () => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .select();

        if (error) {
            console.error('Error fetching likes:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getLikes failed:', err);
        return 'error';
    }
});

export const likePost = createAsyncThunk('posts/likePost', async (props) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .insert({
                post_id: props.postId,
                u_id: props.creatorUid,
                for: props.for
            })
            .select();

        if (error) {
            console.error('Error liking post:', error);
            return error;
        }

        if (data && props.creatorUid !== null) {
            await supabase
                .from('notifications')
                .insert({
                    for: data[0].for === 'post' ? 'like' : data[0].for + '_like',
                    post_id: props.postId,
                    like_id: data[0].id,
                    receiver_id: props.postUid,
                    creator_name: props.creatorName,
                    creator_id: props.creatorUid,
                    post_snippet: props.postBody,
                    creator_img: props.creatorImg,
                    comment_id: data[0].for !== 'post' && props.commentId
                })
                .select();
        }

        return data[0];
    } catch (err) {
        console.error('likePost failed:', err);
        return 'error';
    }
});

export const unlike = createAsyncThunk('posts/unlike', async (id) => {
    try {
        const { data, error } = await supabase
            .from('likes')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error unliking post:', error);
            return error;
        }

        return data[0];
    } catch (err) {
        console.error('unlike failed:', err);
        return 'error';
    }
});

export const getBookmarks = createAsyncThunk('posts/getBookmarks', async () => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .select();

        if (error) {
            console.error('Error fetching bookmarks:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getBookmarks failed:', err);
        return 'error';
    }
});

export const bookmarkPost = createAsyncThunk('posts/bookmarkPost', async (props) => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert({
                post_id: props.postId,
                u_id: props.creatorUid,
                for: props.for
            })
            .select();

        if (error) {
            console.error('Error bookmarking post:', error);
            return error;
        }

        if (data && props.creatorUid !== null) {
            await supabase
                .from('notifications')
                .insert({
                    for: data[0].for === 'post' ? 'bookmark' : data[0].for + '_bookmark',
                    post_id: props.postId,
                    bookmark_id: data[0].id,
                    receiver_id: props.postUid,
                    creator_name: props.creatorName,
                    creator_id: props.creatorUid,
                    post_snippet: props.postBody,
                    creator_img: props.creatorImg,
                    comment_id: data[0].for !== 'post' && props.commentId
                })
                .select();
        }

        return data[0];
    } catch (err) {
        console.error('bookmarkPost failed:', err);
        return 'error';
    }
});

export const unBookmark = createAsyncThunk('posts/unBookmark', async (id) => {
    try {
        const { data, error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error removing bookmark:', error);
            return error;
        }

        return data[0];
    } catch (err) {
        console.error('unBookmark failed:', err);
        return 'error';
    }
});

export const getPostComments = createAsyncThunk('posts/getPostComments', async () => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .neq('post_id', 0);

        if (error) {
            console.error('Error fetching comments:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('getPostComments failed:', err);
        return 'error';
    }
});

export const searchedPostQuery = createAsyncThunk('posts/searchedPostQuery', async (params) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select()
            .or(`body.ilike.%${params.id}%,journal.ilike.%${params.id}%,title.ilike.%${params.id}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Search error:', error);
            return error;
        }

        return data;
    } catch (err) {
        console.error('searchedPostQuery failed:', err);
        return 'error';
    }
});


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