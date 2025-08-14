/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../config/supabaseClient.config";
import { AppContext } from "../context/AppContext";
import {
  bookmarkPost,
  unlike,
  likePost,
  unBookmark,
  getPostComments,
  getPosts,
  getLikes,
  getBookmarks,
} from "../features/postSlice";
import { followUser, unfollow } from "../features/followSlice";
import usePosts from "../hooks/usePosts";
import useAddPost from "../hooks/useAddPost";
import useDeletePost from "../hooks/useDeletePost";
import useLikes from "../hooks/useLikes";
import useBookmarks from "../hooks/useBookmarks";
import useFollows from "../hooks/useFollows";
import useOtherUsers from "../hooks/useOtherUsers";
import useGetUsers from "../hooks/useGetUsers";
import PostCard from "../components/PostCard";
import JournalCard from "../components/JournalCard";
import OtherUsersCard from "../components/OtherUsersCard";
import SideBar from "../components/SideBar";
import SearchModal from "../components/SearchModal";
import NotLoggedInModal from "../components/NotLoggedInModal";
import Footer from "../sections/Footer";

const Home = () => {
  // State
  const [tab, setTab] = useState("forYou");
  const [search, setSearch] = useState("");
  const [postValue, setPostValue] = useState("");
  const [title, setTitle] = useState("");
  const [journalText, setJournalText] = useState("");
  const [privacy, setPrivacy] = useState(null);
  const [showPostInModal, setShowPostInModal] = useState(false);
  const textAreaRef = useRef(null);

  // Hooks
  const { id: paramsId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { renderEmptyState, renderLoadingState, userListEmptyState } = useContext(AppContext);
  const { loggedUser, allUsers, otherUsers, isLoading, isLoadingOtherUsers } = useSelector(
    (state) => state.app
  );
  const { posts, likes, bookmarks, postComments, posted, isAddingPost, isDeletingPost, isLiking, isBookmarking } =
    useSelector((state) => state.posts);
  const { follows, isLoadingFollows } = useSelector((state) => state.follows);

  // Custom Hooks
  useGetUsers();
  usePosts();
  useLikes();
  useBookmarks();
  useFollows();
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: loggedUser?.u_id });
  const { mutate: addPost } = useAddPost();
  const { mutate: deletePost } = useDeletePost();

  // Effects
  useEffect(() => {
    document.body.style.cssText = showPostInModal
      ? "height: 100vh; overflow-y: hidden;"
      : "height: 100vh; overflow-y: scroll;";
  }, [showPostInModal]);

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public" }, () => {
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
  }, [dispatch, loggedUser?.u_id]);

  useEffect(() => {
    if (showPostInModal && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${
        textAreaRef.current.scrollHeight <= 450 ? textAreaRef.current.scrollHeight : 450
      }px`;
    }
  }, [showPostInModal, postValue, journalText]);

  useEffect(() => {
    if (posted) {
      setShowPostInModal(false);
      setPostValue("");
      setJournalText("");
      setTitle("");
      setPrivacy(null);
    }
  }, [posted]);

  useEffect(() => {
    if (tab === "journal" && !loggedUser) {
      setTab("forYou");
    }
  }, [loggedUser, tab]);

  // Utility Functions
  const countItems = (items, id, key = "post_id") =>
    items?.filter((item) => item[key] === id).length || 0;


  const followed = (id) => 
    follows?.some(follow => follow.followed_id === id && follow.follower_id === loggedUser?.u_id);

  const hasUserInteracted = (items, id, userId, key = "post_id") =>
    !!items?.find((item) => item[key] === id && item.u_id === userId);

  const handleFollowToggle = (user) => {
    const follow = follows.find(
      (f) => f.followed_id === user.u_id && f.follower_id === loggedUser?.u_id
    );
    if (!follow) {
      dispatch(
        followUser({
          uid: loggedUser.u_id,
          creatorName: loggedUser.name,
          creatorImg: loggedUser.u_img,
          receiverUid: user.u_id,
          receiverName: user.name || user.u_name,
          receiverImg: user.u_img,
        })
      );
    } else {
      dispatch(unfollow(follow.id));
    }
  };

  const handleLikeToggle = (post) => {
    const like = likes.find((l) => l.post_id === post.id && l.u_id === loggedUser.u_id);
    if (!like) {
      dispatch(
        likePost({
          postId: post.id,
          creatorUid: loggedUser.u_id,
          creatorName: loggedUser.name,
          creatorImg: loggedUser.u_img,
          postUid: post.u_id,
          postBody: post.body || post.journal,
          for: post.type,
        })
      );
    } else {
      dispatch(unlike(like.id));
    }
  };

  const handleBookmarkToggle = (post) => {
    const bookmark = bookmarks.find((b) => b.post_id === post.id && b.u_id === loggedUser.u_id);
    if (!bookmark) {
      dispatch(
        bookmarkPost({
          postId: post.id,
          creatorUid: loggedUser.u_id,
          creatorName: loggedUser.name,
          creatorImg: loggedUser.u_img,
          postUid: post.u_id,
          postBody: post.body,
        })
      );
    } else {
      dispatch(unBookmark(bookmark.id));
    }
  };

  const handleSubmitPost = () => {
    if (postValue.trim()) {
      addPost({
        type: "post",
        body: postValue.trim(),
        name: loggedUser.name,
        u_id: loggedUser.u_id,
        u_img: loggedUser.u_img,
        paramsId,
      });
    }
  };

  const handleSubmitJournal = () => {
    if (title.trim() && journalText.trim() && privacy) {
      addPost({
        type: "journal",
        journal: journalText.trim(),
        title: title.trim(),
        privacy,
        name: loggedUser.name,
        u_id: loggedUser.u_id,
        u_img: loggedUser.u_img,
        paramsId,
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
  };

  const handleShowSearch = () => {
    document.getElementById("my_modal_2").showModal();
  };

  // Render Functions
  const renderPostForm = () => {
    if (!loggedUser) return null;

    const closePostFormModal = () => {
      setShowPostInModal(false);
      setPostValue("");
      setTitle("");
      setJournalText("");
      setPrivacy(null);
      if (textAreaRef.current) textAreaRef.current.textContent = "";
    };

    return (
      <dialog
        className={`w-screen h-screen ${
          showPostInModal ? "flex" : "hidden"
        } flex-col justify-start md:justify-center items-center fixed top-0 left-0 bg-bg/90 dark:bg-black/90 text-neutral-dark dark:text-dark-accent shadow-lg mb-4 z-[220]`}
      >
        <div className="flex flex-col mt-20 md:mt-0 justify-center items-center bg-bg dark:bg-black p-5 gap-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-dark-text-dark-accent/20 shadow-md dark:shadow-dark-text-dark-accent/20">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                src={loggedUser?.u_img}
                alt=""
                className="relative z-20 w-10 h-10 object-cover object-center rounded-full shadow-sm cursor-default"
                width={80}
                height={80}
                loading="lazy"
              />
              <h1 className="font-semibold text-lg lg:text-2xl">
                {tab === "journal" ? "Write a Journal" : "Write a Post"}
              </h1>
            </div>
            <button
              className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full"
              onClick={closePostFormModal}
            >
              <i className="bi bi-x-lg cursor-pointer"></i>
            </button>
          </div>
          <div className="w-full flex flex-col gap-4">
            {tab === "journal" ? (
              <>
                <input
                  type="text"
                  value={title}
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-bg dark:border-dark-accent/40 text-neutral-dark dark:text-dark-accent text-md w-full min-h-8 dark:bg-black dark:placeholder:text-dark-accent/60 outline-none"
                />
                <textarea
                  ref={textAreaRef}
                  value={journalText}
                  placeholder="Body"
                  onChange={(e) => setJournalText(e.target.value)}
                  className="bg-bg dark:border-dark-accent/40 text-neutral-dark dark:text-dark-accent text-md w-full min-h-8 dark:bg-black dark:placeholder:text-dark-accent/60 outline-none resize-none"
                />
                <div className="w-full flex justify-between mt-4">
                  <select
                    className="bg-accent/5 border-[1px] border-black/20 dark:border-dark-text-dark-accent/20 w-full max-w-fit rounded-full text-xs font-semibold px-2 py-0 outline-none"
                    onChange={(e) => setPrivacy(e.target.value)}
                    defaultValue="Change Privacy?"
                  >
                    <option disabled>Change Privacy?</option>
                    <option>For me</option>
                    <option>Everyone</option>
                  </select>
                  <button
                    className={
                      title.trim() && journalText.trim() && !isAddingPost && privacy
                        ? "px-6 py-2 bg-accent font-semibold text-white rounded-full scale-100"
                        : "px-6 py-2 bg-accent/30 font-semibold text-white rounded-full transition-all duration-150 cursor-not-allowed"
                    }
                    onClick={handleSubmitJournal}
                    disabled={isAddingPost}
                  >
                    {isAddingPost ? "Posting..." : "Post"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  ref={textAreaRef}
                  value={postValue}
                  placeholder="What are you thinking?"
                  onChange={(e) => setPostValue(e.target.value)}
                  readOnly={isAddingPost}
                  autoFocus={showPostInModal}
                  className="bg-bg dark:border-dark-accent/40 text-neutral-dark dark:text-dark-accent text-md w-full min-h-8 dark:bg-black dark:placeholder:text-dark-accent/60 outline-none resize-none"
                />
                <button
                  className={
                    postValue.trim() && !isAddingPost
                      ? "px-6 py-2 bg-primary font-semibold text-white rounded-full scale-100"
                      : "px-6 py-2 bg-primary/30 font-semibold text-white rounded-full transition-all duration-150 cursor-not-allowed"
                  }
                  onClick={handleSubmitPost}
                  disabled={postValue.trim() === "" || isAddingPost}
                >
                  {isAddingPost ? "Posting..." : "Post"}
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    );
  };

  const renderUserList = () =>
    otherUsers?.length > 0 ? (
      otherUsers.slice(0, 4).map((user) => (
        <OtherUsersCard
          key={user.u_id}
          userImg={user.u_img}
          name={user.name}
          uName={user.u_name}
          uid={user.u_id === loggedUser?.u_id}
          userIdVal={user.u_id}
          followed={followed(user.u_id)}
          following={isLoadingFollows}
          toggleFollow={() => handleFollowToggle(user)}
        />
      ))
    ) : (
      userListEmptyState()
    );

  const renderContent = () => {
    if (!posts) return null;

    if (tab === "forYou") {
      const allPosts = posts.filter((post) => post.type === "post");
      return allPosts.length > 0 ? (
        allPosts.map((post) => (
          <PostCard
            key={post.id}
            userId={loggedUser?.u_id}
            users={allUsers ? [...allUsers] : []}
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
            toggleFollow={() => handleFollowToggle(post)}
            followed={followed(post.u_id)}
            following={isLoadingFollows}
            comments={countItems(postComments, post.id)}
            likes={countItems(likes, post.id)}
            liked={hasUserInteracted(likes, post.id, loggedUser?.u_id)}
            bookmarks={countItems(bookmarks, post.id)}
            bookmarked={hasUserInteracted(bookmarks, post.id, loggedUser?.u_id)}
            likePost={() => handleLikeToggle(post)}
            bookmarkPost={() => handleBookmarkToggle(post)}
            type={post.type}
            deletePost={() => deletePost({ id: post.id })}
          />
        ))
      ) : (
        renderEmptyState()
      );
    }

    if (tab === "following") {
      const followedIds = follows
        .filter((follow) => follow.follower_id === loggedUser?.u_id)
        .map((follow) => follow.followed_id);
      const followingPosts = posts.filter(
        (post) => (post.u_id === loggedUser?.u_id || followedIds.includes(post.u_id)) && post.type === "post"
      );

      return followingPosts.length > 0 ? (
        followingPosts.map((post) => (
          <PostCard
            key={post.id}
            userId={loggedUser?.u_id}
            users={allUsers ? [...allUsers] : []}
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
            toggleFollow={() => handleFollowToggle(post)}
            followed={hasUserInteracted(follows, post.u_id, loggedUser?.u_id, "followed_id")}
            comments={countItems(postComments, post.id)}
            likes={countItems(likes, post.id)}
            liked={hasUserInteracted(likes, post.id, loggedUser?.u_id)}
            bookmarks={countItems(bookmarks, post.id)}
            bookmarked={hasUserInteracted(bookmarks, post.id, loggedUser?.u_id)}
            likePost={() => handleLikeToggle(post)}
            bookmarkPost={() => handleBookmarkToggle(post)}
            type={post.type}
            deletePost={() => deletePost({ id: post.id })}
          />
        ))
      ) : (
        <div className="w-full h-56 flex flex-col justify-center items-center">Nothing to see</div>
      );
    }

    if (tab === "journal") {
      const allJournals = posts
        .filter((post) => post.type === "journal")
        .filter((post) => post.privacy === "Everyone" || post.u_id === loggedUser?.u_id);

      return allJournals.length > 0 ? (
        allJournals.map((post) => (
          <JournalCard
            key={post.id}
            users={allUsers ? [...allUsers] : []}
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
            likes={countItems(likes, post.id)}
            liked={hasUserInteracted(likes, post.id, loggedUser?.u_id)}
            likePost={() => handleLikeToggle(post)}
            deletePost={() => deletePost({ id: post.id })}
          />
        ))
      ) : (
        <div className="w-full h-56 flex flex-col justify-center items-center">No Journals to see yet</div>
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0 dark:text-inherit">
      {renderPostForm()}
      <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-4 lg:mt-0 pb-14 lg:pb-0 md:gap-2 mb-14 lg:mb-0">
        {loggedUser && (
          <SideBar
            uid={loggedUser.u_id}
            uName={loggedUser?.u_name || ""}
            page="home"
            toggleSearchBar={handleShowSearch}
          />
        )}
        <div
          className={
            loggedUser?.u_id
              ? "w-full flex flex-col col-span-6 xl:col-span-4 border-r-[1px] border-l-[1px] mt-5 border-black/5 dark:border-dark-accent/20"
              : "w-full flex flex-col col-span-6 border-r-[1px] border-l-[1px] border-black/5 dark:border-dark-accent/20 justify-center items-center"
          }
        >
          {loggedUser?.u_id && (
            <div className="sticky top-0 grid grid-cols-3 justify-evenly text-center text-neutral-dark w-full bg-bg/90 dark:bg-black/90 backdrop-blur-sm overflow-scroll no-scrollbar text-xs md:text-sm md:text-neutral-dark dark:text-dark-accent font-semibold z-40">
              <button
                className={`w-full ${
                  tab === "forYou" ? "bg-primary/5 font-bold border-b-2 border-primary" : ""
                } py-3 px-4 md:px-10 hover:bg-primary/5 cursor-pointer`}
                onClick={() => setTab("forYou")}
              >
                For you
              </button>
              <button
                className={`w-full ${
                  tab === "following" ? "bg-primary/5 font-bold border-b-[1px] border-primary" : ""
                } py-3 px-4 md:px-10 hover:bg-primary/5 cursor-pointer`}
                onClick={() => setTab("following")}
              >
                Following
              </button>
              <button
                className={`w-full ${
                  tab === "journal" ? "bg-accent/5 font-bold border-b-[1px] border-accent" : ""
                } py-3 px-10 hover:bg-accent/5 cursor-pointer`}
                onClick={() => setTab("journal")}
              >
                Journal
              </button>
            </div>
          )}
          <div className="w-full relative flex flex-col">
            {isLoading ? (
              renderLoadingState("h-40")
            ) : (
              <div className="relative w-full justify-center text-neutral-dark dark:text-dark-accent divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                {loggedUser && (
                  <div className="w-full flex justify-end lg:justify-start items-center px-4 my-5 text-sm dark:text-dark-accent fixed bottom-20 left-0 lg:sticky lg:top-12 py-2 lg:bg-bg/90 dark:lg:dark:bg-black/90 lg:backdrop-blur-sm z-[110]">
                    <button
                      className={`w-fit flex gap-2 justify-center items-center border-[1px] border-black bg-bg dark:bg-black dark:border-dark-text-dark-accent font-semibold ${
                        tab === "journal"
                          ? "hover:bg-[#fdfbf5] hover:border-accent hover:text-accent dark-hover:text-inherit"
                          : "hover:bg-[#f3f9ff] hover:border-primary hover:text-primary"
                      } px-4 py-2 rounded-full shadow-md lg:shadow-none`}
                      onClick={() => setShowPostInModal(!showPostInModal)}
                    >
                      <i className="bi bi-pencil"></i>
                      {tab === "journal" ? "Write Journal" : "Write Post"}
                    </button>
                  </div>
                )}
                <div className="w-full flex flex-col gap-5 pt-20 lg:pt-0">
                  {renderContent()}
                </div>
                <p className="py-8 flex justify-center text-primary">.</p>
              </div>
            )}
          </div>
        </div>
        <div className="hidden sticky top-0 xl:flex flex-col gap-5 h-fit col-span-2 py-3 z-0">
          {loggedUser?.u_id ? (
            <>
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-5 py-2 bg-bg dark:bg-black dark:text-dark-accent z-50"
              >
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
                {isLoadingOtherUsers || isLoading ? (
                  renderLoadingState("h-10")
                ) : (
                  <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">
                    {renderUserList()}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-fit flex flex-col py-32 justify-center items-center">
              <p>Join Us to</p>
              <h1 className="font-bold text-4xl">Explore</h1>
              <ul className="flex mt-10 gap-4">
                <Link to="/login">
                  <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:bg-slate-200">
                    Login
                  </li>
                </Link>
                <Link to="/register">
                  <li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-slate-200 dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:bg-slate-200">
                    Register
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      </div>
      <SearchModal handleSearch={handleSearch} search={search} handleChange={(e) => setSearch(e.target.value)} />
      <Footer uid={loggedUser?.u_id || null} uName={loggedUser?.u_name || ""} page="home" toggleSearchBar={handleShowSearch} />
      <NotLoggedInModal uid={loggedUser?.u_id} />
    </div>
  );
};

export default Home;