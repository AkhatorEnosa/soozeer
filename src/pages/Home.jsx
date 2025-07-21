/* eslint-disable react/prop-types */

// import Navbar from "../components/Navbar"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import PostCard from "../components/PostCard"
import Footer from "../sections/Footer"
import { Link, useNavigate, useParams } from "react-router-dom"
import OtherUsersCard from "../components/OtherUsersCard"
import { useDispatch, useSelector } from "react-redux"
import { bookmarkPost, unlike, likePost, unBookmark, getPostComments, getPosts, getLikes, getBookmarks } from "../features/postSlice"
import usePosts from "../hooks/usePosts"
import useAddPost from "../hooks/useAddPost"
import useDeletePost from "../hooks/useDeletePost"
import useLikes from "../hooks/useLikes"
import useBookmarks from "../hooks/useBookmarks"
import useFollows from "../hooks/useFollows"
import { followUser, unfollow } from "../features/followSlice"
import useOtherUsers from "../hooks/useOtherUsers"
import SideBar from "../components/SideBar"
import SearchModal from "../components/SearchModal"
import NotLoggedInModal from "../components/NotLoggedInModal"
import supabase from "../config/supabaseClient.config"
import JournalCard from "../components/JournalCard"
import { AppContext } from "../context/AppContext"

const PostFormModal = ({ isOpen, onClose, isJournal, loggedUser, textAreaRef, postValue, setPostValue, title, setTitle, journalText, setJournalText, privacy, setPrivacy, handleSubmit, isAddingPost }) => (
  <dialog
    open={isOpen}
    className={`w-screen h-screen ${isOpen ? 'flex' : 'hidden'} flex-col justify-center items-center fixed top-0 left-0 bg-bg/90 dark:bg-black/90 dark:text-dark-accent shadow-lg mb-4 z-[220]`}
  >
    <div className="flex flex-col justify-center items-center bg-bg dark:bg-black p-5 gap-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-dark-accent/20 shadow-md dark:shadow-dark-accent/20">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img
            src={loggedUser?.u_img || ''}
            alt={loggedUser?.name || 'User avatar'}
            className="w-10 h-10 object-cover rounded-full shadow-sm cursor-default"
            width={80}
            height={80}
            loading="lazy"
          />
          <h1 className="font-semibold text-lg lg:text-2xl">{isJournal ? 'Write a Journal' : 'Write a Post'}</h1>
        </div>
        <button
          aria-label="Close modal"
          className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full"
          onClick={onClose}
        >
          <i className="bi bi-x-lg cursor-pointer"></i>
        </button>
      </div>
      <div className="w-full flex flex-col gap-4">
        {isJournal && (
          <input
            type="text"
            className="text-md w-full dark:text-dark-accent dark:bg-black dark:placeholder:text-dark-accent/60 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Journal title"
          />
        )}
        <textarea
          name="body"
          id="body"
          ref={textAreaRef}
          className="text-md w-full min-h-8 dark:text-dark-accent dark:bg-black dark:placeholder:text-dark-accent/60 outline-none resize-none"
          value={isJournal ? journalText : postValue}
          onChange={(e) => (isJournal ? setJournalText(e.target.value) : setPostValue(e.target.value))}
          placeholder={isJournal ? 'Body' : 'What are you thinking?'}
          readOnly={isAddingPost}
          aria-label={isJournal ? 'Journal body' : 'Post body'}
        />
        {isJournal && (
          <div className="w-full flex justify-between mt-4">
            <select
              className="bg-accent/5 border-[1px] border-black/20 dark:border-dark-accent/20 w-full max-w-fit rounded-full text-xs font-semibold px-2 py-0 outline-none"
              onChange={(e) => setPrivacy(e.target.value)}
              value={privacy || 'Change Privacy?'}
              aria-label="Privacy setting"
            >
              <option disabled value="Change Privacy?">Change Privacy?</option>
              <option value="For me">For me</option>
              <option value="Everyone">Everyone</option>
            </select>
            <button
              className={
                title.trim() && journalText.trim() && privacy && !isAddingPost
                  ? 'px-6 py-2 bg-accent font-semibold text-white rounded-full scale-100'
                  : 'px-6 py-2 bg-accent/30 font-semibold text-white rounded-full cursor-not-allowed'
              }
              onClick={handleSubmit}
              disabled={isAddingPost || !title.trim() || !journalText.trim() || !privacy}
            >
              {isAddingPost ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}
        {!isJournal && (
          <button
            className={
              postValue.trim() && !isAddingPost
                ? 'px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100'
                : 'px-6 py-2 bg-primary/30 font-semibold text-white rounded-full cursor-not-allowed'
            }
            onClick={handleSubmit}
            disabled={isAddingPost || !postValue.trim()}
          >
            {isAddingPost ? 'Posting...' : 'Post'}
          </button>
        )}
      </div>
    </div>
  </dialog>
);

const PostCardWrapper = ({ post, loggedUser, follows, likes, bookmarks, isLiking, isBookmarking, isDeletingPost, navigate, dispatch, removeLike, removeBookmark, removeFollow, countComments, countBookmarks, countLikes, likedPost, bookmarkedPost, followed, deletePost }) => {
  const toggleFollow = useCallback(() => {
    const verifyFollow = follows.find((x) => x.followed_id === post.u_id && x.follower_id === loggedUser?.u_id);
    if (!verifyFollow) {
      dispatch(followUser({
        uid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        receiverUid: post.u_id,
        receiverName: post.u_name,
        receiverImg: post.u_img,
      }));
    } else {
      removeFollow(verifyFollow.id);
    }
  }, [dispatch, follows, loggedUser, post, removeFollow]);

  const toggleLike = useCallback(() => {
    const verifyLike = likes.find((x) => x.post_id === post.id && x.u_id === loggedUser?.u_id);
    if (!verifyLike) {
      dispatch(likePost({
        postId: post.id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body,
      }));
    } else {
      removeLike(verifyLike.id);
    }
  }, [dispatch, likes, loggedUser, post, removeLike]);

  const toggleBookmark = useCallback(() => {
    const verifyBookmark = bookmarks.find((x) => x.post_id === post.id && x.u_id === loggedUser?.u_id);
    if (!verifyBookmark) {
      dispatch(bookmarkPost({
        postId: post.id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body,
      }));
    } else {
      removeBookmark(verifyBookmark.id);
    }
  }, [dispatch, bookmarks, loggedUser, post, removeBookmark]);

  return (
    <PostCard
      key={post.id}
      userId={loggedUser?.u_id}
      postUserId={post.u_id === loggedUser?.u_id}
      postUserIdVal={post.u_id}
      uImg={post.u_img}
      openComment={() => navigate(`/post/${post.id}`)}
      uName={post.u_name}
      postContent={post.body}
      datetime={post.created_at}
      postId={post.id}
      liking={isLiking}
      bookmarking={isBookmarking}
      deleting={isDeletingPost}
      toggleFollow={toggleFollow}
      followed={followed(post.u_id)}
      comments={countComments(post.id)}
      likes={countLikes(post.id)}
      liked={likedPost(post.id)}
      bookmarks={countBookmarks(post.id)}
      bookmarked={bookmarkedPost(post.id)}
      likePost={toggleLike}
      bookmarkPost={toggleBookmark}
      deletePost={() => deletePost(post.id)}
    />
  );
};

const JournalCardWrapper = ({ post, loggedUser, likes, isLiking, isDeletingPost, dispatch, removeLike, countLikes, likedPost, deletePost }) => {
  const toggleLike = useCallback(() => {
    const verifyLike = likes.find((x) => x.post_id === post.id && x.u_id === loggedUser?.u_id);
    if (!verifyLike) {
      dispatch(likePost({
        postId: post.id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.journal,
        for: post.type,
      }));
    } else {
      removeLike(verifyLike.id);
    }
  }, [dispatch, likes, loggedUser, post, removeLike]);

  return (
    <JournalCard
      key={post.id}
      postUserId={post.u_id === loggedUser?.u_id}
      postUserIdVal={post.u_id}
      uImg={post.u_img}
      uName={post.u_name}
      title={post.title}
      journal={post.journal}
      privacy={post.privacy}
      datetime={post.created_at}
      liking={isLiking}
      // bookmarking={isBookmarking}
      deleting={isDeletingPost}
      likes={countLikes(post.id)}
      liked={likedPost(post.id)}
      likePost={toggleLike}
      deletePost={() => deletePost(post.id)}
    />
  );
};

const Home = () => {
  const [tab, setTab] = useState('forYou');
  const [search, setSearch] = useState('');
  const [postValue, setPostValue] = useState('');
  const [title, setTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [privacy, setPrivacy] = useState(null);
  const [showPostInModal, setShowPostInModal] = useState(false);
  const textAreaRef = useRef(null);

  const { renderErrorState, renderEmptyState, renderLoadingState, userListEmptyState } = useContext(AppContext);
  const { id: paramsId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loggedUser, otherUsers, isLoading, isLoadingOtherUsers } = useSelector((state) => state.app);
  const { posts, likes, bookmarks, postComments, posted, isAddingPost, isLoadingPosts, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts);
  const { follows, isLoadingFollows } = useSelector((state) => state.follows);

  usePosts();
  const { mutate } = useAddPost();
  const { mutate: del } = useDeletePost();
  useLikes();
  useBookmarks();
  useFollows();
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: loggedUser?.u_id });

  // Handle body scroll locking
  useEffect(() => {
    document.body.style.height = showPostInModal ? '100vh' : 'auto';
    document.body.style.overflowY = showPostInModal ? 'hidden' : 'scroll';
  }, [showPostInModal]);

  // Supabase real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        setTimeout(() => {
          dispatch(getPosts());
          dispatch(getLikes());
          dispatch(getBookmarks());
        }, 10000);
      })
      .subscribe();
    return () => channel.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPostComments());
  }, [dispatch]);

  // Handle post submission
  const handleSubmit = useCallback(() => {
    if (postValue.trim()) {
      mutate({ type: 'post', body: postValue.trim(), name: loggedUser.name, u_id: loggedUser.u_id, u_img: loggedUser.u_img, paramsId });
    }
  }, [postValue, loggedUser, mutate, paramsId]);

  const handleSubmitJournal = useCallback(() => {
    if (title.trim() && journalText.trim() && privacy) {
      mutate({ type: 'journal', journal: journalText.trim(), title: title.trim(), privacy, name: loggedUser.name, u_id: loggedUser.u_id, u_img: loggedUser.u_img, paramsId });
    }
  }, [title, journalText, privacy, loggedUser, mutate, paramsId]);

  // Reset form after posting
  useEffect(() => {
    if (posted) {
      setShowPostInModal(false);
      setPostValue('');
      setJournalText('');
      setTitle('');
      setPrivacy(null);
      if (textAreaRef.current) textAreaRef.current.textContent = '';
    }
  }, [posted]);

  // Auto-resize textarea and focus
  useEffect(() => {
    if (showPostInModal && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.height = 'auto';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight <= 450 ? `${scrollHeight}px` : '450px';
    }
  }, [showPostInModal, postValue, journalText]);

  // Utility functions
  const deletePost = useCallback((id) => del({ id }), [del]);
  const removeLike = useCallback((id) => dispatch(unlike(id)), [dispatch]);
  const removeBookmark = useCallback((id) => dispatch(unBookmark(id)), [dispatch]);
  const removeFollow = useCallback((id) => dispatch(unfollow(id)), [dispatch]);

  const countLikes = useCallback((id) => likes?.filter((like) => like.post_id === id).length || 0, [likes]);
  const likedPost = useCallback((id) => !!likes?.find((like) => like.post_id === id && like.u_id === loggedUser?.u_id), [likes, loggedUser]);
  const countBookmarks = useCallback((id) => bookmarks?.filter((bookmark) => bookmark.post_id === id).length || 0, [bookmarks]);
  const bookmarkedPost = useCallback((id) => !!bookmarks?.find((bookmark) => bookmark.post_id === id && bookmark.u_id === loggedUser?.u_id), [bookmarks, loggedUser]);
  const countComments = useCallback((id) => postComments?.filter((comment) => comment.post_id === id).length || 0, [postComments]);
  const followed = useCallback((id) => !!follows?.find((follow) => follow.followed_id === id && follow.follower_id === loggedUser?.u_id), [follows, loggedUser]);

  // User list
  const userList = useMemo(() => {
    if (!otherUsers?.length && !isLoading && !isLoadingOtherUsers) {return (
      <div className="w-full py-10 flex flex-col text-neutral-dark dark:text-dark-accent gap-4">
        userListEmptyState()
      </div>
    ) } else {
      return otherUsers?.slice(0, 4).map((user) => (
        <OtherUsersCard
          key={user.id}
          userImg={user.u_img}
          name={user.name}
          uName={user.u_name}
          uid={user.u_id === loggedUser?.u_id}
          userIdVal={user.u_id}
          followed={followed(user.u_id)}
          following={isLoadingFollows}
          toggleFollow={() => {
            const verifyFollow = follows.find((follow) => follow.followed_id === user.u_id && follow.follower_id === loggedUser?.u_id);
            if (!verifyFollow) {
              dispatch(followUser({
                uid: loggedUser.u_id,
                creatorName: loggedUser.name,
                creatorImg: loggedUser.u_img,
                receiverUid: user.u_id,
                receiverName: user.name,
                receiverImg: user.u_img,
              }));
            } else {
              removeFollow(verifyFollow.id);
            }
          }}
        />
      ));
    }

  }, [otherUsers, loggedUser, userListEmptyState, follows, isLoadingFollows, dispatch, followed, removeFollow]);

  // Content rendering
  const renderContent = useMemo(() => {
    // if (!posts) return null;

    if(isLoadingPosts) {
      return ( 
        <span className="loading loading-spinner loading-sm text-primary"></span>
      );
    } else {
      if (tab === 'forYou') {
        const allPosts = posts?.filter((post) => post.type === 'post');

        return allPosts.length > 0 ? (
          allPosts.map((post) => (
            <PostCardWrapper
              key={post.id}
              post={post}
              loggedUser={loggedUser}
              follows={follows}
              likes={likes}
              bookmarks={bookmarks}
              isLiking={isLiking}
              isBookmarking={isBookmarking}
              isDeletingPost={isDeletingPost}
              navigate={navigate}
              dispatch={dispatch}
              removeLike={removeLike}
              removeBookmark={removeBookmark}
              removeFollow={removeFollow}
              countComments={countComments}
              countLikes={countLikes}
              likedPost={likedPost}
              bookmarkedPost={bookmarkedPost}
              countBookmarks={countBookmarks}
              followed={followed}
              deletePost={deletePost}
            />
          ))
        ) : (
          <div className="w-full h-screen flex flex-col justify-center items-center">
            {renderEmptyState('bi bi-chat-left-text', 'No posts to see yet')}
            <p className="text-neutral-dark dark:text-dark-accent font-semibold">Start following people to see their posts here.</p>
          </div>
        );
      } else if (tab === 'following') {
        const followedIds = follows.filter((follow) => follow.follower_id === loggedUser?.u_id).map((x) => x.followed_id);
        const followingPosts = posts.filter((post) => (post.u_id === loggedUser?.u_id || followedIds.includes(post.u_id)) && post.type === 'post');
        return followingPosts.length > 0 ? (
          followingPosts.map((post) => (
            <PostCardWrapper
              key={post.id}
              post={post}
              loggedUser={loggedUser}
              follows={follows}
              likes={likes}
              bookmarks={bookmarks}
              isLiking={isLiking}
              isBookmarking={isBookmarking}
              isDeletingPost={isDeletingPost}
              navigate={navigate}
              dispatch={dispatch}
              removeLike={removeLike}
              removeBookmark={removeBookmark}
              removeFollow={removeFollow}
              countComments={countComments}
              countLikes={countLikes}
              likedPost={likedPost}
              bookmarkedPost={bookmarkedPost}
              countBookmarks={countBookmarks}
              followed={followed}
              deletePost={deletePost}
            />
          ))
        ) : (
          <div className="w-full h-screen flex flex-col justify-center items-center">
            {renderEmptyState('bi bi-chat-left-text', 'No posts to see yet')}
            <p className="text-neutral-dark dark:text-dark-accent font-semibold">Start following people to see their posts here.</p>
          </div>
        );
      } else if (tab === 'journal') {
        if (!loggedUser) {
          setTab('forYou');
          return null;
        }
        const filterJournals = posts.filter((post) => post.type === 'journal' && (post.privacy === 'Everyone' || post.u_id === loggedUser?.u_id));
        return filterJournals.length > 0 ? (
          filterJournals.map((post) => (
            <JournalCardWrapper
              key={post.id}
              post={post}
              loggedUser={loggedUser}
              likes={likes}
              isLiking={isLiking}
              isDeletingPost={isDeletingPost}
              dispatch={dispatch}
              removeLike={removeLike}
              countLikes={countLikes}
              likedPost={likedPost}
              deletePost={deletePost}
            />
          ))
        ) : (
          <div className="w-full h-56 flex flex-col justify-center items-center">
            {renderEmptyState('bi bi-journal', 'No journals to see yet')}
          </div>
        );
      }
    }

  }, [tab, posts, loggedUser, follows, likes, bookmarks, countBookmarks, renderEmptyState, isLoadingPosts, isLiking, isBookmarking, isDeletingPost, navigate, dispatch, removeLike, removeBookmark, removeFollow, countComments, countLikes, likedPost, bookmarkedPost, followed, deletePost]);

  const closePostFormModal = useCallback(() => {
    setShowPostInModal(false);
    setPostValue('');
    setTitle('');
    setJournalText('');
    setPrivacy(null);
    if (textAreaRef.current) textAreaRef.current.textContent = '';
  }, []);

  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search.trim()}`);
    }
  };

  if (!isLoading && error) {
    return (renderErrorState('Network or server error occurred. Please try again later.'));
  } else {
    return (
      <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0">
        {loggedUser && (
          <PostFormModal
            isOpen={showPostInModal}
            onClose={closePostFormModal}
            isJournal={tab === 'journal'}
            loggedUser={loggedUser}
            textAreaRef={textAreaRef}
            postValue={postValue}
            setPostValue={setPostValue}
            title={title}
            setTitle={setTitle}
            journalText={journalText}
            setJournalText={setJournalText}
            privacy={privacy}
            setPrivacy={setPrivacy}
            handleSubmit={tab === 'journal' ? handleSubmitJournal : handleSubmit}
            isAddingPost={isAddingPost}
          />
        )}
        <div className={`w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-0 pb-20 md:pb-28 lg:pb-0 md:gap-2 mb-7 md:mb-14 lg:mb-0`}>
          {/* side bar */}
          {loggedUser && <SideBar uid={loggedUser?.u_id || null} page="home" toggleSearchBar={handleShowSearch} />}
  
          <div className={loggedUser?.u_id ? 'w-full flex flex-col col-span-6 xl:col-span-4 border-r-[1px] border-l-[1px] mt-5 border-black/5 dark:border-dark-accent/20' : 'w-full flex flex-col col-span-6 border-r-[1px] border-l-[1px] border-black/5 dark:border-dark-accent/20 justify-center items-center'}>
            {loggedUser?.u_id && (
              <div className="sticky top-0 grid grid-cols-3 justify-evenly text-center text-neutral-dark w-full bg-bg/90 dark:bg-black/90 backdrop-blur-md overflow-scroll no-scrollbar text-xs md:text-sm md:text-neutral-dark dark:text-dark-accent font-semibold z-40">
                <button className={`w-full ${tab === 'forYou' ? 'bg-primary/5 font-bold border-b-2 border-primary' : ''} py-3 px-4 md:px-10 hover:bg-primary/5 cursor-pointer`} onClick={() => setTab('forYou')}>
                  For you
                </button>
                <button className={`w-full ${tab === 'following' ? 'bg-primary/5 font-bold border-b-[1px] border-primary' : ''} py-3 px-4 md:px-10 hover:bg-primary/5 cursor-pointer`} onClick={() => setTab('following')}>
                  Following
                </button>
                <button className={`w-full ${tab === 'journal' ? 'bg-accent/5 font-bold border-b-[1px] border-accent' : ''} py-3 px-10 hover:bg-accent/5 cursor-pointer`} onClick={() => setTab('journal')}>
                  Journal
                </button>
              </div>
            )}
            <div className="relative flex flex-col">
              {isLoading ? (
                renderLoadingState('h-40')
              ) : (
                <div className="relative w-full text-neutral-dark dark:text-dark-accent divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                  {loggedUser && (
                    <div className="w-full flex justify-end lg:justify-start items-center px-4 my-5 text-sm dark:text-dark-accent fixed bottom-20 left-0 lg:sticky lg:top-12 py-2 lg:bg-bg/90 dark:lg:dark:bg-black/90 lg:backdrop-blur-sm z-[110]">
                      <button
                        className={`w-fit flex gap-2 justify-center items-center border-[1px] border-black bg-bg dark:bg-black dark:border-dark-accent font-semibold ${tab === 'journal' ? 'hover:bg-accent/5 hover:border-accent hover:text-accent dark-hover:text-inherit' : 'hover:bg-primary/5 hover:border-primary hover:text-primary'} px-4 py-2 rounded-full shadow-md lg:shadow-none`}
                        onClick={() => setShowPostInModal(!showPostInModal)}
                      >
                        <i className="bi bi-pencil"></i>{tab === 'journal' ? 'Write Journal' : 'Write Post'}
                      </button>
                    </div>
                  )}
                  {renderContent}
                  <p className="py-8 flex justify-center text-primary">.</p>
                </div>
              )}
            </div>
          </div>
          <div className="hidden sticky top-0 xl:flex flex-col gap-5 h-fit col-span-2 py-3 z-0">
            {loggedUser?.u_id || isLoading ? (
              <>
                <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 bg-bg dark:bg-black dark:text-dark-accent z-50">
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
                <div className="py-3 border-t-[1px] border-[1px] text-neutral-dark border-black/5 dark:border-dark-accent/20 rounded-md">
                  <h2 className="font-bold text-xl px-5 pb-4 dark:text-dark-accent">Suggested For You</h2>
                  {isLoadingOtherUsers || isLoading ? renderLoadingState('h-10') : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">{userList}</div>}
                </div>
              </>
            ) : (
              <div className="w-full h-fit flex flex-col py-32 justify-center items-center text-neutral-dark dark:text-dark-accent">
                <p>Join Us To</p>
                <h1 className="font-bold text-4xl">Explore</h1>
                <ul className="flex mt-10 gap-4">
                  <Link to="/login">
                    <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">Login</li>
                  </Link>
                  <Link to="/register">
                    <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">Register</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        </div>
        <SearchModal handleSearch={handleSearch} search={search} handleChange={(e) => setSearch(e.target.value)} />
        <Footer uid={loggedUser?.u_id || null} page="home" toggleSearchBar={handleShowSearch} />
        <NotLoggedInModal uid={loggedUser?.u_id} />
      </div>
    );
  }

};

export default Home;