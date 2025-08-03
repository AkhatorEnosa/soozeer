import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../config/supabaseClient.config";

// Components
import ViewPostCard from "../components/ViewPostCard";
import Footer from "../sections/Footer";
import OtherUsersCard from "../components/OtherUsersCard";
import BackBtn from "../components/BackBtn";
import SideBar from "../components/SideBar";
import SearchModal from "../components/SearchModal";
import NotLoggedInModal from "../components/NotLoggedInModal";
import PostCard from "../components/PostCard";

// Hooks
import useOtherUsers from "../hooks/useOtherUsers";
import useLikes from "../hooks/useLikes";
import useBookmarks from "../hooks/useBookmarks";
import useComments from "../hooks/useComments";
import useFollows from "../hooks/useFollows";
import useCommentBookmarks from "../hooks/useCommentBookmarks";
import useAddComment from "../hooks/useAddComment";
import usePosts from "../hooks/usePosts";

// Redux actions
import { getPost, singlePostDelete, deleteSingleComment } from "../features/singlePostSlice";
import { followUser, unfollow } from "../features/followSlice";
import { 
  bookmarkPost, 
  likePost, 
  getPostComments, 
  unBookmark, 
  unlike, 
  getLikes, 
  getBookmarks 
} from "../features/postSlice";

// Context
import { AppContext } from "../context/AppContext";
import useGetUsers from "../hooks/useGetUsers";

const Post = () => {
  // State
  const [search, setSearch] = useState('');
  const [newComment, setNewComment] = useState('');
  const textareaRef = useRef(null);

  // Router hooks
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const dispatch = useDispatch();

  // Selectors
  const { 
    error, 
    loggedUser, 
    allUsers,
    otherUsers, 
    isLoading, 
    isLoadingOtherUsers 
  } = useSelector((state) => state.app);
  
  const { 
    postError, 
    postComments, 
    likes, 
    bookmarks, 
    isDeletingPost, 
    isBookmarking, 
    isLiking 
  } = useSelector((state) => state.posts);
  
  const { 
    currentPost, 
    comments, 
    posted, 
    isLoadingPost,
    isLoadingComments,
    isPosting, 
    isDeletingComment, 
    errorComment 
  } = useSelector((state) => state.singlePost);
  
  const { 
    follows, 
    isLoadingFollows 
  } = useSelector((state) => state.follows);

  // Context
  const { renderErrorState, renderLoadingState } = useContext(AppContext);

  // Custom hooks
  useGetUsers();
  usePosts();
  const { mutate: addComment } = useAddComment();
  const { mutate: currPostComments } = useComments();
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: loggedUser?.u_id });
  useLikes();
  useBookmarks();
  useCommentBookmarks();
  useFollows();

  // Effects
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        () => {
          dispatch(getLikes());
          dispatch(getBookmarks());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !loggedUser) {
      navigate('/login');
    }
  }, [isLoading, loggedUser, navigate]);

  useEffect(() => {
    currPostComments(paramsId);
    dispatch(getPost(paramsId));
    dispatch(getPostComments());
  }, [paramsId, currPostComments, dispatch]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      if (textareaRef.current.scrollHeight <= 250) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else {
        textareaRef.current.style.height = "250px";
      }
    }
  }, [newComment]);

  useEffect(() => {
    if (posted) {
      setNewComment("");
    }
  }, [posted]);

  // Helper functions
  const deletePost = (id) => dispatch(singlePostDelete(id));
  const deleteComment = (id) => dispatch(deleteSingleComment(id));
  const removeLike = (id) => dispatch(unlike(id));
  const removeBookmark = (id) => dispatch(unBookmark(id));
  const removeFollow = (id) => dispatch(unfollow(id));

  const countLikes = (id) => likes?.filter(like => like.post_id === id)?.length || 0;
  const likedPost = (id) => likes?.some(like => like.post_id === id && like.u_id === loggedUser?.u_id);
  const countBookmarks = (id) => bookmarks?.filter(bookmark => bookmark.post_id === id)?.length || 0;
  const bookmarkedPost = (id) => bookmarks?.some(bookmark => bookmark.post_id === id && bookmark.u_id === loggedUser?.u_id);
  const countComments = (id) => comments?.filter(comment => comment?.post_id === id)?.length || 0;
  const countReplies = (id) => postComments?.filter(comment => comment?.post_id === id)?.length || 0;
  const followed = (id) => follows?.some(follow => follow.followed_id === id && follow.follower_id === loggedUser?.u_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      const commentData = {
        type: currentPost.type === 'post' ? 'comment' : 'reply',
        body: newComment.trim(),
        name: loggedUser.name,
        postUid: currentPost.u_id,
        u_id: loggedUser.u_id,
        u_img: loggedUser.u_img,
        paramsId: paramsId
      };
      addComment(commentData);
    }
  };

  const handleFollowUser = (user) => {
    const verifyFollow = follows.find(follow => 
      follow.followed_id === user.u_id && follow.follower_id === loggedUser.u_id
    );

    if (!verifyFollow) {
      dispatch(followUser({
        uid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        receiverUid: user.u_id,
        receiverName: user.name,
        receiverImg: user.u_img
      }));
    } else {
      removeFollow(verifyFollow.id);
    }
  };

  const handleLikePost = (post) => {
    const verifyLike = likes.find(like => 
      like.post_id === post.id && like.u_id === loggedUser.u_id
    );

    if (!verifyLike) {
      dispatch(likePost({
        postId: post.id,
        commentId: post.post_id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body,
        for: post.type
      }));
    } else {
      removeLike(verifyLike.id);
    }
  };

  const handleBookmarkPost = (post) => {
    const verifyBookmark = bookmarks.find(bookmark => 
      bookmark.post_id === post.id && bookmark.u_id === loggedUser.u_id
    );

    if (!verifyBookmark) {
      dispatch(bookmarkPost({
        postId: post.id,
        commentId: post.post_id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body,
        for: post.type
      }));
    } else {
      removeBookmark(verifyBookmark.id);
    }
  };

  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      navigate(`/search/${search}`);
    }
  };

  const handleTextAreaFocus = () => {
    textareaRef.current.focus();
  }

  // Render functions
  const renderLoadingContent = () => (
    <div className="flex w-full flex-col gap-4 opacity-40">
      <div className="flex items-center gap-4">
        <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-16 w-16 shrink-0 rounded-lg"></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-4 w-20"></div>
          <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-4 w-28"></div>
        </div>
      </div>
      <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-96 w-full"></div>
    </div>
  );

  const renderUserList = () => {
    if (isLoading || isLoadingOtherUsers) {
      return renderLoadingState("h-10");
    }

    if (!otherUsers?.length) {
      return (
        <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl">
          <i className="bi bi-people"></i>
          <p className="text-base">No body to see, yet!</p>
        </h1>
      );
    }

    return otherUsers.slice(0, 4).map(user => (
      <OtherUsersCard 
        key={user.id}
        userImg={user.u_img}
        name={user.name}
        uName={user.u_name}
        uid={user.u_id === loggedUser?.u_id}
        userIdVal={user.u_id}
        followed={followed(user.u_id)}
        following={isLoadingFollows}
        toggleFollow={() => handleFollowUser(user)}
      />
    ));
  };

  const renderNewCommentForm = () => {
    if (!loggedUser?.u_id || isLoadingPost) return null;

    return (
      <div className="relative w-full h-auto flex gap-2 p-2 z-40">
        <div className="flex w-full gap-2 items-start relative">
          <div className="flex w-8 h-8 overflow-clip border-[1px] bg-bg dark:border-dark-accent/40 z-20 rounded-full shadow-sm cursor-default">
            <img 
              src={loggedUser?.u_img} 
              alt="" 
              className="relative object-cover object-center" 
              width={80} 
              height={80} 
              loading="lazy"
            />
          </div>
          <textarea 
            name="body" 
            id="body" 
            ref={textareaRef} 
            className="w-full text-md z-20 flex flex-col h-auto min-h-8 box-border dark:text-dark-accent bg-bg dark:bg-dark-bg dark:placeholder:text-dark-accent/60 outline-none resize-none" 
            value={newComment} 
            placeholder={currentPost?.type === 'post' ? 'Comment...' : 'Reply...'} 
            onChange={(e) => setNewComment(e.target.value)} 
            readOnly={isPosting}
          />
        </div>

        <div className={`flex justify-end ${newComment.trim() !== '' || isPosting ? "h-fit" : "h-0"}`}>
          <button 
            className={`px-6 py-2 bg-primary font-semibold text-white rounded-full ${
              newComment.trim() !== '' ? "scale-100" : "scale-0"
            } ${isPosting && "opacity-50"} transition-all duration-150`} 
            onClick={handleSubmit} 
            disabled={isPosting}
          >
            {isPosting ? (
              <span className="loading loading-spinner loading-sm text-white"></span>
            ) : (
              currentPost?.type === 'post' ? 'Comment' : 'Reply'
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderPostContent = () => {
    if (errorComment) {
      return <div className="w-full h-56 flex flex-col justify-center items-center">Network error. Try reload page.</div>;
    }

    if (!currentPost) return null;

    if (isLoadingPost) {
      return (
        <div className="w-full flex gap-4">
          <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 w-14 h-14 md:w-32 md:h-32 opacity-15"></div>
          <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-32 md:h-52 w-full opacity-15"></div>
        </div>
      );
    } else {
      return (
        <ViewPostCard 
          key={currentPost.id}
          users={allUsers && [...allUsers]}
          userId={loggedUser?.u_id}
          postUserId={currentPost.u_id !== loggedUser?.u_id}
          postUserIdVal={currentPost.u_id}
          uImg={currentPost.u_img}
          uName={currentPost.u_name}
          postContent={currentPost.body}
          datetime={currentPost.created_at}
          postId={currentPost.id}
          liking={isLiking}
          bookmarking={isBookmarking}
          deleting={isDeletingPost}
          toggleFollow={() => handleFollowUser({
            u_id: currentPost.u_id,
            u_name: currentPost.u_name,
            u_img: currentPost.u_img
          })}
          following={isLoadingFollows}
          followed={followed(currentPost.u_id)}
          commentsCount={countComments(currentPost.id)}
          focusInput={() => handleTextAreaFocus()}
          likes={countLikes(currentPost.id)}
          liked={likedPost(currentPost.id)}
          bookmarks={countBookmarks(currentPost.id)}
          bookmarked={bookmarkedPost(currentPost.id)}
          likePost={() => handleLikePost(currentPost)}
          bookmarkPost={() => handleBookmarkPost(currentPost)}
          type={currentPost.type}
          deletePost={() => deletePost(currentPost.id)}
        />
      );
    }

  };

  const renderComments = () => {
    if (!comments?.length) return null;

    if (errorComment) {
      return <div className="w-full h-56 flex flex-col justify-center items-center">Network error. Try reload page.</div>;
    }

    if(isLoadingComments) {
      return (
        <div className="w-full flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="loading loading-spinner "></div>
            </div>
          ))}
        </div>
      );
    } else {

      return comments.map(comment => (
        <PostCard 
          key={comment.id}
          users={allUsers && [...allUsers]}
          userId={loggedUser?.u_id}
          postUserId={comment.u_id === loggedUser?.u_id}
          postUserIdVal={comment.u_id}
          uImg={comment.u_img}
          openComment={() => navigate(`/post/${comment.id}`)}
          uName={comment.u_name}
          postContent={comment.body}
          datetime={comment.created_at}
          postId={comment.id}
          liking={isLiking}
          bookmarking={isBookmarking}
          deleting={isDeletingComment}
          toggleFollow={() => handleFollowUser({
            u_id: comment.u_id,
            u_name: comment.u_name,
            u_img: comment.u_img
          })}
          followed={followed(comment.u_id)}
          comments={countReplies(comment.id)}
          likes={countLikes(comment.id)}
          liked={likedPost(comment.id)}
          bookmarks={countBookmarks(comment.id)}
          bookmarked={bookmarkedPost(comment.id)}
          likePost={() => handleLikePost(comment)}
          bookmarkPost={() => handleBookmarkPost(comment)}
          type={comment.type}
          deletePost={() => deleteComment(comment.id)}
        />
      ));
    }
    
  };

  const renderSidebar = () => (
    <div className="hidden sticky right-0 top-0 xl:flex flex-col gap-5 h-fit col-span-2 py-3">
      {loggedUser?.u_id || isLoading ? (
        <>
          <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 dark:bg-black z-50">
            <input 
              type="text" 
              name="search" 
              id="search" 
              value={search} 
              placeholder="Search..." 
              className="w-full px-4 py-2 border-[1px] bg-bg dark:border-dark-accent/40 text-neutral-dark dark:text-dark-accent text-sm placeholder:text-inherit outline-none dark:bg-black dark:focus-within:bg-black/50 rounded-full" 
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="py-3 border-t-[1px] border-[1px] border-black/5 dark:border-slate-500/20 rounded-md">
            <h2 className="font-bold text-xl px-5 pb-4 text-neutral-dark dark:text-neutral-lighter">
              You might be interested in
            </h2>
            {isLoadingOtherUsers || isLoading ? (
              renderLoadingState('h-10')
            ) : (
              <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                {renderUserList()}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-fit flex flex-col py-32 justify-center items-center text-neutral-dark dark:text-dark-accent">
          <p>Join Us To</p>
          <h1 className="font-bold text-4xl">Explore</h1>
          <ul className="flex mt-10 gap-4">
            <Link to="/login">
              <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">
                Login
              </li>
            </Link>
            <Link to="/register">
              <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">
                Register
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );

  if (error || postError) {
    return renderErrorState('Something went wrong. Please try again later.');
  }

  return (
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0 dark:text-inherit">
      <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-4 lg:mt-0 pb-14 lg:pb-0 md:gap-2 mb-14 lg:mb-0">
        {loggedUser && (
          <SideBar
            uid={loggedUser.u_id}
            uName={loggedUser?.u_name || ''}
            toggleSearchBar={handleShowSearch}
          />
        )}

        {currentPost === 'error' ? (
          <div className="main w-full flex flex-col justify-center items-center col-span-6 border-[1px] border-black/5">
            <p>This page does not exist.</p>
          </div>
        ) : (
          <>
            <div className={`main w-full lg:h-screen flex flex-col ${
              loggedUser ? "col-span-6 xl:col-span-4" : "col-span-8 xl:col-span-6"
            } border-r-[1px] border-l-[1px] border-black/5 dark:border-slate-500/20`}>
              <div className="w-full flex justify-between px-3 bg-bg/90 dark:bg-black/90 backdrop-blur-sm sticky top-0 z-[100]">
                <BackBtn link={() => navigate(-1)} title={'Back'}/>
                {currentPost?.post_id !== 0 && (
                  <BackBtn link={() => navigate(`/post/${currentPost.post_id}`)} title={'Jump to origin'}/>
                )}
              </div>

              <div>
                {isLoadingPost || isLoading ? renderLoadingContent() : <>{renderPostContent()}  {renderNewCommentForm()}</>}
              </div>
              <div>
                {!isLoading && renderComments()}
                <p className="py-8 flex justify-center text-primary">.</p>
              </div>
            </div>

            {renderSidebar()}
          </>
        )}
      </div>

      <SearchModal 
        handleSearch={handleSearch}
        search={search}
        handleChange={(e) => setSearch(e.target.value)}
      />
      
      <Footer 
        uid={loggedUser?.u_id || null} 
        uName={loggedUser?.u_name || ''} 
        toggleSearchBar={handleShowSearch} 
      />

      <NotLoggedInModal uid={loggedUser?.u_id}/>
    </div>
  );
};

export default Post;