import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../sections/Footer";
import OtherUsersCard from "../components/OtherUsersCard";
import PostCard from "../components/PostCard";
import BackBtn from "../components/BackBtn";
import SideBar from "../components/SideBar";
import JournalCard from "../components/JournalCard";
import { AppContext } from "../context/AppContext";

// Hooks
import useAddPost from "../hooks/useAddPost";
import usePosts from "../hooks/usePosts";
import useDeletePost from "../hooks/useDeletePost";
import useLikes from "../hooks/useLikes";
import useBookmarks from "../hooks/useBookmarks";
import useComments from "../hooks/useComments";
import useFollows from "../hooks/useFollows";
import useOtherUsers from "../hooks/useOtherUsers";
import useSearchQuery from "../hooks/useSearchQuery";

// Redux actions
import { bookmarkPost, likePost, unBookmark, unlike } from "../features/postSlice";
import { followUser, unfollow } from "../features/followSlice";

const Search = () => {
  // State
  const [search, setSearch] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const { 
    error, 
    loggedUser, 
    otherUsers, 
    searchedUsers, 
    isLoading, 
    isLoadingOtherUsers 
  } = useSelector((state) => state.app);
  
  const { 
    searchedPosts, 
    likes, 
    bookmarks, 
    comments, 
    isDeletingPost, 
    isBookmarking, 
    isLiking 
  } = useSelector((state) => state.posts);
  
  const { 
    follows, 
    isLoadingFollows 
  } = useSelector((state) => state.follows);

  // Context
  const { renderLoadingState, renderErrorState } = useContext(AppContext);

  // Custom hooks
  usePosts();
  useAddPost();
  const { mutate: del } = useDeletePost();
  useLikes();
  useBookmarks();
  useComments();
  useFollows();
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: loggedUser?.u_id });
  const { mutate: searchQuery } = useSearchQuery();

  // Effects
  useEffect(() => {
    if (!isLoading && loggedUser == null) {
      navigate('/login');
    }
  }, [loggedUser, isLoading, navigate]);

  useEffect(() => {
    if (params !== null) {
      searchQuery(params);
    }
  }, [params, searchQuery]);

  // Helper functions
  const deletePost = (id) => del({ id });
  const removeLike = (id) => dispatch(unlike(id));
  const removeBookmark = (id) => dispatch(unBookmark(id));
  const removeFollow = (id) => dispatch(unfollow(id));

  const countLikes = (id) => likes?.filter(like => like.post_id === id)?.length || 0;
  const likedPost = (id) => likes?.some(like => like.post_id === id && like.u_id === loggedUser?.u_id);
  const countBookmarks = (id) => bookmarks?.filter(bookmark => bookmark.post_id === id)?.length || 0;
  const bookmarkedPost = (id) => bookmarks?.some(bookmark => bookmark.post_id === id && bookmark.u_id === loggedUser?.u_id);
  const countComments = (id) => comments?.filter(comment => comment.post_id === id)?.length || 0;
  const followed = (id) => follows?.some(follow => follow.followed_id === id && follow.follower_id === loggedUser?.u_id);

  const handlePostSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      navigate(`/search/${search}`);
    }
  };

  const handleFollow = (user) => {
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

  const handleLike = (post) => {
    const verifyLike = likes.find(like => 
      like.post_id === post.id && like.u_id === loggedUser.u_id
    );

    if (!verifyLike) {
      dispatch(likePost({
        postId: post.id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body || post.journal,
        ...(post.type === 'journal' && { for: post.type }),
      }));
    } else {
      removeLike(verifyLike.id);
    }
  };

  const handleBookmark = (post) => {
    const verifyBookmark = bookmarks.find(bookmark => 
      bookmark.post_id === post.id && bookmark.u_id === loggedUser.u_id
    );

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
  };

  // Render functions
  const renderUserList = () => {
    if (isLoadingOtherUsers) {
      return renderLoadingState("h-10");
    }

    if (!otherUsers?.length) {
      return (
        <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-5xl gap-4">
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
        userIdVal={user.u_id}
        followed={followed(user.u_id)}
        following={isLoadingFollows}
        toggleFollow={() => handleFollow(user)}
      />
    ));
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="w-full h-56 flex flex-col justify-center items-center">
          <span className="loading loading-spinner loading-sm text-primary"></span>
        </div>
      );
    }

    if (!searchedPosts?.length && !searchedUsers?.length) {
      return (
        <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-5xl gap-4">
          <i className="bi bi-search"></i> 
          <p className="text-base">No search result found!</p>
        </h1>
      );
    }

    return (
      <>
        {searchedUsers?.length > 0 && (
          <div className="w-full people text-neutral-dark dark:text-neutral-lighter">
            <h1 className="text-lg mb-2 px-3 lg:px-0 lg:text-xl font-bold w-full flex gap-3 justify-between items-center">
              People <i className="bi bi-people-fill"></i>
            </h1>
            <div className="divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
              {searchedUsers.map(user => (
                <OtherUsersCard 
                  key={user.id}
                  userImg={user.u_img}
                  name={user.name}
                  uName={user.u_name}
                  uid={user.u_id === loggedUser.u_id}
                  userIdVal={user.u_id}
                  followed={followed(user.u_id)}
                  following={isLoadingFollows}
                  toggleFollow={() => handleFollow(user)}
                />
              ))}
            </div>
          </div>
        )}

        {searchedPosts?.length > 0 && (
          <div className="w-full content text-neutral-dark dark:text-neutral-lighter">
            <h1 className="text-lg mb-2 px-3 lg:px-0 lg:text-xl font-bold w-full flex gap-3 justify-between items-center">
              Posts/Comments/Replies/Journals <i className="bi bi-chat-square-text-fill"></i>
            </h1>
            <div className="divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
              {searchedPosts.map(post => (
                post.type === 'journal' ? (
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
                    bookmarking={isBookmarking}
                    deleting={isDeletingPost}
                    likes={countLikes(post.id)}
                    liked={likedPost(post.id)}
                    likePost={() => handleLike(post)}
                    deletePost={() => deletePost(post.id)}
                  />
                ) : (
                  <PostCard 
                    key={post.id}
                    userId={loggedUser.u_id}
                    postUserId={post.u_id === loggedUser.u_id}
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
                    following={isLoadingFollows}
                    followed={followed(post.u_id)}
                    comments={countComments(post.id)}
                    likes={countLikes(post.id)}
                    liked={likedPost(post.id)}
                    bookmarks={countBookmarks(post.id)}
                    bookmarked={bookmarkedPost(post.id)}
                    toggleFollow={() => handleFollow({
                      u_id: post.u_id,
                      u_name: post.u_name,
                      u_img: post.u_img
                    })}
                    likePost={() => handleLike(post)}
                    bookmarkPost={() => handleBookmark(post)}
                    deletePost={() => deletePost(post.id)}
                  />
                )
              ))}
            </div>
            <p className="py-8 flex justify-center text-primary">.</p>
          </div>
        )}
      </>
    );
  };

  if (error) {
    return renderErrorState('Something went wrong. Please try again later.');
  }

  return (
    <div className="w-full h-screen flex flex-col gap-5 items-center dark:text-inherit pb-28 lg:pb-0">
      <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mb:pb-0 md:gap-2 mb:mb-0 overflow-scroll no-scrollbar">
        <SideBar
          uid={loggedUser?.u_id || null} 
          page={'search'} 
        />

        <div className="main w-full flex flex-col col-span-6 xl:col-span-4 border-[1px] border-black/5 dark:border-neutral-300/10 py-4 lg:px-5 lg:py-7 gap-2 lg:gap-5 text-neutral-dark dark:text-dark-text rounded-md">
          <div className="w-full flex px-3 bg-bg/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">
            <BackBtn link={() => navigate(-1)} title={'Back'}/>
          </div>
          
          <div className="flex flex-col">
            {params.id && (
              <p className="w-full text-center text-sm">
                Result for <b className="text-lg">&ldquo;{params.id}&rdquo;</b>
              </p>
            )}
            <form onSubmit={handlePostSearch} className="flex flex-col gap-7 mt-2 px-2">
              <div className="input input-bordered bg-primary/5 text-neutral-dark dark:text-dark-accent rounded-full flex items-center text-sm gap-3 dark:bg-black border-[1px] dark:border-dark-accent/40 outline-none dark:focus:bg-black/50">
                <i className="bi bi-binoculars-fill"></i>
                <input 
                  type="text" 
                  name="search" 
                  id="search" 
                  value={search} 
                  placeholder={"Search for posts, comments, journals, or users..."} 
                  className="w-full placeholder:text-inherit" 
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

          {renderSearchResults()}
        </div>

        <div className="hidden sticky right-0 top-5 xl:flex flex-col gap-5 h-fit col-span-2 py-3 border-[1px] border-black/5 dark:border-neutral-300/10 rounded-md">
          <div>
            <h2 className="capitalize font-bold text-xl px-3 mb-4 text-neutral-dark dark:text-neutral-lighter">
              Other Interests
            </h2>
            <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
              {renderUserList()}
            </div>
          </div>
        </div>
      </div>

      <Footer 
        uid={loggedUser?.u_id} 
        page={'search'} 
      />
    </div>
  );
};

export default Search;