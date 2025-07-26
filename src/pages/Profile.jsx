import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Flip, toast } from "react-toastify";
import moment from "moment";
import supabase from "../config/supabaseClient.config";
import { AppContext } from "../context/AppContext";
import {
  bookmarkPost,
  likePost,
  unBookmark,
  unlike,
} from "../features/postSlice";
import { followUser, unfollow } from "../features/followSlice";
import { profileEdit } from "../features/appSlice";
import usePosts from "../hooks/usePosts";
import useReplies from "../hooks/useReplies";
import useAddPost from "../hooks/useAddPost";
import useLikes from "../hooks/useLikes";
import useBookmarks from "../hooks/useBookmarks";
import useComments from "../hooks/useComments";
import useFollows from "../hooks/useFollows";
import useOtherUsers from "../hooks/useOtherUsers";
import useDeletePost from "../hooks/useDeletePost";
import useGetCurrentProfile from "../hooks/useGetCurrentProfile";
import useGetLikedPosts from "../hooks/useGetLikedPosts";
import useGetBookmarkedPosts from "../hooks/useGetBookmarkedPosts";
import PostCard from "../components/PostCard";
import JournalCard from "../components/JournalCard";
import OtherUsersCard from "../components/OtherUsersCard";
import SideBar from "../components/SideBar";
import SearchModal from "../components/SearchModal";
import NotLoggedInModal from "../components/NotLoggedInModal";
import Footer from "../sections/Footer";
import BackBtn from "../components/BackBtn";

// Profile component
const Profile = () => {
  // State management
  const [currentProfile, setCurrentProfile] = useState({});
  const [fullNameVal, setFullNameVal] = useState("");
  const [bioVal, setBioVal] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [dob, setDob] = useState("");
  const [fileFound, setFileFound] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [fullNameValCount, setFullNameValCount] = useState(0);
  const [bioValCount, setBioValCount] = useState(0);
  const [dobPrivacy, setDobPrivacy] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tab, setTab] = useState("posts");
  const [search, setSearch] = useState("");
  const [showFollowsModal, setShowFollowsModal] = useState(false);
  const [followType, setFollowType] = useState("");
  const tabsRef = useRef(null);

  // Hooks and navigation
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const dispatch = useDispatch();
  const { renderLoadingState, renderEmptyState, userListEmptyState, renderErrorState } = useContext(AppContext);
  const { error, profileUser, loggedUser, otherUsers, isLoading, isLoadingProfile, isLoadingOtherUsers, isUpdatingProfile, updated } = useSelector((state) => state.app);
  const { posts, replies, postComments, likedPosts, bookmarkedPosts, likes, bookmarks, isLoadingPosts, isDeletingPost, isBookmarking, isLiking } = useSelector((state) => state.posts);
  const { follows, isLoadingFollows } = useSelector((state) => state.follows);


  // const getProfileId = () => {
  //   if(profileId) {
  //     const findUser = otherUsers?.find(user => user.u_id === postUserIdVal);
  //     if(findUser) {
  //       return findUser.u_name;
  //     }
  //   }
  // }

  // Custom hooks
  usePosts();
  useReplies();
  useAddPost();
  useLikes();
  useBookmarks();
  useComments();
  useFollows();
  useOtherUsers({ loggedId: loggedUser?.u_id, currentId: profileId });
  const { mutate: del } = useDeletePost();
  const { mutate: profile } = useGetCurrentProfile();
  const { mutate: profileLikedPosts } = useGetLikedPosts();
  const { mutate: profileBookmarkedPosts } = useGetBookmarkedPosts();

  // Memoized profile data fetching
  useMemo(() => {
    profile(profileId);
    profileLikedPosts(profileId);
    profileBookmarkedPosts(profileId);
  }, [profile, profileId, profileLikedPosts, profileBookmarkedPosts]);

  // Handle body scroll lock for modals
  useEffect(() => {
    document.body.style.height = showEdit || showFollowsModal ? "100vh" : "auto";
    document.body.style.overflowY = showEdit || showFollowsModal ? "hidden" : "scroll";
  }, [showEdit, showFollowsModal]);

  // Update current profile and profile picture
  useEffect(() => {
    setCurrentProfile({ ...profileUser });
    setProfilePic(profileUser?.u_img);
  }, [profileId, loggedUser?.u_id, profileUser?.u_id]);

  // Handle profile update completion
  useEffect(() => {
    if (updated && !isUpdatingProfile) {
      setShowEdit(false);
      setUpdating(false);
      setCurrentProfile({ ...currentProfile, bio: bioVal, name: fullNameVal });
    }
  }, [updated, isUpdatingProfile, bioVal, fullNameVal]);

  // Utility functions
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  };

  const getFollowings = () => follows?.filter((follow) => follow.follower_id === profileId) || [];
  const getFollowers = () => follows?.filter((follow) => follow.followed_id === profileId) || [];

  // Toggle Search Bar 
  const handleShowSearch = () => {
    document.getElementById('my_modal_2').showModal()
  }

  // Interaction handlers
  const handleFollowToggle = (user) => {
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
      dispatch(unfollow(verifyFollow.id));
    }
  };

  const handleLikePost = (post) => {
    const verifyLike = likes.find((like) => like.post_id === post.id && like.u_id === loggedUser.u_id);
    if (!verifyLike) {
      dispatch(likePost({
        postId: post.id,
        creatorUid: loggedUser.u_id,
        creatorName: loggedUser.name,
        creatorImg: loggedUser.u_img,
        postUid: post.u_id,
        postBody: post.body || post.journal,
        ...(post.type === "journal" && { for: post.type }),
      }));
    } else {
      dispatch(unlike(verifyLike.id));
    }
  };

  const handleBookmarkPost = (post) => {
    const verifyBookmark = bookmarks.find((bookmark) => bookmark.post_id === post.id && bookmark.u_id === loggedUser.u_id);
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
      dispatch(unBookmark(verifyBookmark.id));
    }
  };

  // Post interaction utilities
  const countLikes = (id) => likes?.filter((like) => like.post_id === id).length || 0;
  const likedPost = (id) => !!likes?.find((like) => like.post_id === id && like.u_id === loggedUser?.u_id);
  const countBookmarks = (id) => bookmarks?.filter((bookmark) => bookmark.post_id === id).length || 0;
  const bookmarkedPost = (id) => !!bookmarks?.find((bookmark) => bookmark.post_id === id && bookmark.u_id === loggedUser?.u_id);
  const countComments = (id) => postComments?.filter((comment) => comment?.post_id === id).length || 0;
  const followed = (id) => !!follows?.find((follow) => follow.followed_id === id && follow.follower_id === loggedUser?.u_id);

  // Common post interaction handlers
  const getPostInteractionHandlers = (post) => ({
    toggleFollow: () => handleFollowToggle({ u_id: post.u_id, u_name: post.u_name, u_img: post.u_img }),
    likePost: () => handleLikePost(post),
    bookmarkPost: () => handleBookmarkPost(post),
    deletePost: () => del({ id: post.id }),
  });

  // Common post props
  const getCommonPostProps = (post) => ({
    userId: loggedUser?.u_id,
    postUserId: post.u_id === loggedUser?.u_id,
    postUserIdVal: post.u_id,
    uImg: post.u_img,
    openComment: () => navigate(`/post/${post.id}`),
    uName: post.u_name,
    postContent: post.body,
    datetime: post.created_at,
    postId: post.id,
    liking: isLiking,
    bookmarking: isBookmarking,
    deleting: isDeletingPost,
    following: isLoadingFollows,
    followed: followed(post.u_id),
    comments: countComments(post.id),
    likes: countLikes(post.id),
    liked: likedPost(post.id),
    bookmarks: countBookmarks(post.id),
    bookmarked: bookmarkedPost(post.id),
  });

  // Common journal props
  const getCommonJournalProps = (post) => ({
    postUserId: post.u_id === loggedUser?.u_id,
    postUserIdVal: post.u_id,
    uImg: post.u_img,
    uName: post.u_name,
    title: post.title,
    journal: post.journal,
    privacy: post.privacy,
    datetime: post.created_at,
    liking: isLiking,
    bookmarking: isBookmarking,
    deleting: isDeletingPost,
    likes: countLikes(post.id),
    liked: likedPost(post.id),
  });

  // Render user list
  const renderUserList = useMemo(() => {
    if (!otherUsers?.length && !isLoading && !isLoadingOtherUsers) {
      return <div className="w-full py-10 flex flex-col text-neutral-dark dark:text-dark-text gap-4">{userListEmptyState()}</div>;
    }
    return otherUsers?.slice(0, 4).map((user) => (
      <OtherUsersCard
        key={user.id}
        userImg={user.u_img}
        name={user.name}
        uName={user.u_name}
        userIdVal={user.u_id}
        followed={followed(user.u_id)}
        following={isLoadingFollows}
        toggleFollow={() => handleFollowToggle(user)}
      />
    ));
  }, [otherUsers, isLoading, isLoadingOtherUsers, isLoadingFollows]);

  // Render content based on tab
  const renderContent = () => {
    if (isLoading || isLoadingPosts || isLoadingProfile) return renderLoadingState("h-52");
    switch (tab) {
      case "posts":
        return renderPosts();
      case "likes":
        return renderLikes();
      case "replies":
        return renderReplies();
      case "journals":
        return renderJournals();
      case "bookmarks":
        return renderBookmarks();
      default:
        return null;
    }
  };

  // Render posts
  const renderPosts = () => {
    const filteredPosts = posts?.filter((post) => post?.u_id === profileId && post.type === "post");
    if (!filteredPosts?.length) return renderEmptyState("bi-chat-text", "No Posts yet!");
    return filteredPosts.map((post) => (
      <PostCard key={post.id} {...getCommonPostProps(post)} {...getPostInteractionHandlers(post)} />
    ));
  };

  // Render likes
  const renderLikes = () => {
    if (loggedUser?.u_id !== profileId) {
      setTab("posts");
      return null;
    }
    const sortedLikedPosts = [...(likedPosts || [])].sort((a, b) => b.likes[0].id - a.likes[0].id);
    if (!sortedLikedPosts.length) return renderEmptyState("bi-heart", "No Likes yet!");
    return sortedLikedPosts.map((post) =>
      post.type === "post" ? (
        <PostCard key={post.id} {...getCommonPostProps(post)} {...getPostInteractionHandlers(post)} />
      ) : (
        <JournalCard key={post.id} {...getCommonJournalProps(post)} {...getPostInteractionHandlers(post)} />
      )
    );
  };

  // Render replies
  const renderReplies = () => {
    const filteredReplies = replies?.filter((reply) => reply?.u_id === profileId && reply?.post_id !== 0);
    if (!filteredReplies.length) return renderEmptyState("bi-chat-text", "No Replies Yet!");
    return filteredReplies.map((reply) => (
      <PostCard key={reply.id} {...getCommonPostProps(reply)} {...getPostInteractionHandlers(reply)} />
    ));
  };

  // Render journals
  const renderJournals = () => {
    const filterJournals =
      loggedUser?.u_id === profileId
        ? posts.filter((post) => post.type === "journal" && post.u_id === loggedUser?.u_id)
        : posts.filter((post) => post.type === "journal" && post.privacy === "Everyone" && post.u_id === profileId);
    if (!filterJournals?.length) return renderEmptyState("bi-chat-text", "No Journals Yet!");
    return filterJournals.map((post) => (
      <JournalCard key={post.id} {...getCommonJournalProps(post)} {...getPostInteractionHandlers(post)} />
    ));
  };

  // Render bookmarks
  const renderBookmarks = () => {
    if (loggedUser?.u_id !== profileId) {
      setTab("posts");
      return null;
    }
    const sortedBookmarkedPosts = [...(bookmarkedPosts || [])].sort((a, b) => b.bookmarks[0].id - a.bookmarks[0].id);
    if (!sortedBookmarkedPosts?.length) return renderEmptyState("bi-bookmark-dash", "No Bookmarks yet!");
    return sortedBookmarkedPosts.map((post) => (
      <PostCard key={post.id} {...getCommonPostProps(post)} {...getPostInteractionHandlers(post)} />
    ));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search/${search}`);
  };

  // Handle edit modal
  const handleShowEdit = () => {
    setBioVal(loggedUser.bio || "");
    setBioValCount(loggedUser.bio?.length || 0);
    setFullNameVal(currentProfile.name || "");
    setFullNameValCount(currentProfile.name?.length || 0);
    setDob(currentProfile.dob || "");
    setShowEdit(true);
  };

  const handleCloseEdit = async () => {
    setFullNameVal(loggedUser.name);
    setBioVal(loggedUser.bio);
    setDob(loggedUser.dob);
    if (imagePath) {
      const { error } = await supabase.storage.from("uploads").remove([imagePath]);
      if (!error) {
        setImagePath("");
        setProfilePic("");
      }
    }
    setShowEdit(false);
  };

  // Handle file upload
  const handleFile = (e) => {
    setUpdating(true);
    const file = e.target.files[0];
    if (!file) {
      setUpdating(false);
      return;
    }
    setFileFound(file);
  };

  // Handle image upload
  useEffect(() => {
    const uploadImage = async () => {
      if (fileFound && typeof fileFound === "object") {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        const fileSize = fileFound.size;

        if (fileSize > 1048576) {
          toast.info("File size too large. Must be below 1MB", {
            className: "bg-info text-white text-sm md:w-full font-semibold",
            autoClose: 2000,
            position: "top-right",
            closeOnClick: true,
            transition: Flip,
            hideProgressBar: true,
          });
          setUpdating(false);
          return;
        }

        if (!allowedExtensions.test(fileFound.name)) {
          toast.error("Only upload JPG, JPEG or PNG files", {
            className: "bg-error text-sm text-white md:w-full font-semibold",
            autoClose: 2000,
            position: "top-right",
            closeOnClick: true,
            transition: Flip,
            hideProgressBar: true,
          });
          setUpdating(false);
          return;
        }

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`${uuidv4()}_${currentProfile.u_id}`, fileFound);

        if (error) {
          toast.error("Could not process your image upload. Try again", {
            className: "bg-error text-sm text-white md:w-full font-semibold",
            autoClose: 2000,
            position: "top-right",
            closeOnClick: true,
            transition: Flip,
            hideProgressBar: true,
          });
        } else {
          setProfilePic(`https://zkyloatzdjcjvjoehrdu.supabase.co/storage/v1/object/public/uploads/${data.path}`);
          toast.info("Image ready for upload", {
            className: "text-sm bg-info text-white md:w-full font-semibold",
            autoClose: 2000,
            position: "top-right",
            closeOnClick: true,
            transition: Flip,
            hideProgressBar: true,
          });
          setImagePath(data.path);
        }
        setUpdating(false);
      } else {
        setProfilePic(currentProfile?.u_img);
      }
    };
    uploadImage();
  }, [fileFound, currentProfile.u_id]);

  // Handle form input changes
  const handleBioChange = (e) => {
    if (e.target.value.length <= 150) {
      setBioVal(e.target.value);
      setBioValCount(e.target.value.length);
    }
  };

  const handleFullNameChange = (e) => {
    if (e.target.value.length <= 50) {
      setFullNameVal(e.target.value);
      setFullNameValCount(e.target.value.length);
    }
  };

  // Handle profile edit submission
  const handleEdit = (e) => {
    e.preventDefault();
    if (bioVal?.length <= 150 && dob) {
      dispatch(profileEdit({
        name: fullNameVal,
        bio: bioVal,
        dob,
        dob_privacy: dobPrivacy === "For me" || dobPrivacy === null,
        u_img: profilePic,
        u_id: loggedUser?.u_id,
      }));
    } else {
      toast.info("Your bio should not be more than 150 characters.", {
        className: "bg-info text-white text-xs",
        autoClose: 2000,
        position: "top-right",
        closeOnClick: true,
        transition: Flip,
        hideProgressBar: true,
      });
      setUpdating(false);
    }
  };

  // Render follow modal content
  const renderFollowModalContent = () => {
    const items = followType === "followers" ? getFollowers() : getFollowings();
    if (!items?.length) return followType === "followers" ? "No Followers" : "No Followings";
    return items.map((item) => (
      <div key={item.id} className="px-3 py-2 lg:py-3 flex items-center justify-between gap-3 w-full text-neutral dark:text-neutral-content hover:bg-primary/5">
        <Link to={`../${followType === "followers" ? item.follower_id : item.followed_id}`} className="w-full flex items-center text-inherit text-neutral-dark dark:text-dark-accent underline hover:no-underline gap-2">
          <img src={followType === "followers" ? item.follower_img : item.followed_img} className="size-8 lg:size-10 object-cover rounded-full cursor-default" loading="lazy" />
          <div className="flex flex-col">
            <b className="text-xs lg:text-sm">{followType === "followers" ? item.follower_name : item.followed_name}</b>
          </div>
        </Link>
        {loggedUser?.u_id !== (followType === "followers" ? item.follower_id : item.followed_id) && (
          <button
            className={!followed(followType === "followers" ? item.follower_id : item.followed_id) ? "flex w-fit h-fit gap-1 justify-center items-center text-[10px] md:text-sm px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group w-fit flex gap-1 justify-center items-center text-[10px] md:text-sm px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300"}
            onClick={() => {
              const verifyFollow = follows.find((follow) => follow.followed_id === (followType === "followers" ? item.follower_id : item.followed_id) && follow.follower_id === loggedUser?.u_id);
              if (!verifyFollow) {
                dispatch(followUser({
                  uid: loggedUser.u_id,
                  creatorName: loggedUser.name,
                  creatorImg: loggedUser.u_img,
                  receiverUid: followType === "followers" ? item.follower_id : item.followed_id,
                  receiverName: followType === "followers" ? item.follower_name : item.followed_name,
                  receiverImg: followType === "followers" ? item.follower_img : item.followed_img,
                }));
              } else {
                dispatch(unfollow(verifyFollow.id));
              }
            }}
          >
            {followed(followType === "followers" ? item.follower_id : item.followed_id) ? (
              <>
                <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span>
                <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span>
              </>
            ) : (
              <><i className="bi bi-plus-lg"></i> Follow</>
            )}
          </button>
        )}
      </div>
    ));
  };

  // Main render
  if (error || profileUser === "error") return renderErrorState("Something went wrong. Please try again later.");

  return (
    <div className="w-full h-screen flex flex-col items-center px-2 md:p-0 md:m-0">
      <div className="w-full lg:grid lg:grid-cols-8 px-2 md:px-20 mt-2 md:mt-0 mb-24 lg:pb-0 md:gap-2">
      {loggedUser && (
        <SideBar
          uid={loggedUser.u_id}
          uName={loggedUser?.u_name || ''}
          page="profile"
          paramsId={profileId}
          toggleSearchBar={() => document.getElementById("my_modal_2").showModal()}
        />
      )}
        <div className={`main w-full flex flex-col ${loggedUser ? "col-span-6 xl:col-span-4" : "col-span-8 xl:col-span-6"} border-r-[1px] border-l-[1px] border-black/5 dark:border-slate-500/20 overflow-scroll no-scrollbar`}>
          <div className="w-full flex px-3 bg-bg/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-[100]">
            <BackBtn link={() => navigate(-1)} title="Back" />
          </div>
          <div className="relative info w-full flex gap-2 md:gap-5 justify-between items-center py-5 md:py-8 overflow-hidden">
            {isLoadingProfile ? (
              <div className="skeleton bg-neutral-dark/20 dark:bg-slate-600 h-48 w-full opacity-40 z-40"></div>
            ) : (
              <div className="relative w-full flex gap-2 px-2 md:px-8 md:gap-4 text-neutral-dark dark:text-dark-accent items-start z-40">
                <img
                  src={currentProfile?.u_img}
                  alt=""
                  className="w-20 h-20 object-cover object-center rounded-md z-50"
                  width={80}
                  height={80}
                  onClick={() => window.open(currentProfile.u_img, "_blank").focus()}
                  loading="lazy"
                />
                <div className="w-full flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full">
                      <h1 className="md:text-2xl font-semibold text-neutral-dark dark:text-neutral-light">{fullNameVal || currentProfile?.name}</h1>
                      <div className="relative -top-1">
                        <h3 className="text-[10px] md:text-xs text-neutral-dark dark:text-neutral">@{currentProfile?.u_name}</h3>
                        {currentProfile?.bio && <p className="w-full text-xs md:text-sm text-left mt-1">{bioVal || currentProfile?.bio}</p>}
                      </div>
                      {(currentProfile?.u_id === loggedUser?.u_id || (currentProfile?.dob && !currentProfile?.dob_privacy)) && (
                        <div className="w-full flex items-center text-inherit text-neutral-dark dark:text-dark-accent gap-2 font-semibold">
                          {currentProfile?.dob && (
                            <>
                              <span className="w-fit flex gap-2 text-xs items-center"><i className="bi bi-cake2-fill"></i>Birthday on {moment(currentProfile?.dob).format("MMMM Do, YYYY")}</span>
                              {currentProfile?.u_id === loggedUser?.u_id && (
                                <span className="flex gap-1 justify-center items-center text-[8px] px-2 border-[1px] border-info text-info bg-info/10 font-semibold rounded-full">
                                  <i className="bi bi-person-fill-lock"></i>{currentProfile?.dob_privacy ? "For Me" : "Everyone"}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      <p className="w-full flex items-center text-xs text-neutral-dark dark:text-dark-accent gap-2 font-semibold">
                        <i className="bi bi-calendar3"></i>Joined {moment(currentProfile?.created_at).format("MMMM YYYY")}
                      </p>
                    </div>
                    <div className="w-full flex gap-3 text-xs md:text-sm font-bold text-neutral-dark dark:text-neutral-light">
                      <p className="hover:underline cursor-pointer" onClick={() => { setShowFollowsModal(true); setFollowType("followings"); }}>{getFollowings().length} Followings</p>
                      <p className="hover:underline cursor-pointer" onClick={() => { setShowFollowsModal(true); setFollowType("followers"); }}>{getFollowers().length} Followers</p>
                    </div>
                  </div>
                  {loggedUser && profileId !== loggedUser?.u_id && (
                    <div className="absolute right-4 h-fit flex gap-2 items-center">
                      <button className="flex size-8 lg:size-10 gap-1 justify-center items-center text-[10px] md:text-sm text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" onClick={() => navigate(`/messages/${profileId}`)}>
                        <i className="bi bi-envelope"></i>
                      </button>
                      <button
                        className={followed(profileId) ? "group w-fit flex gap-1 justify-center items-center text-[10px] md:text-sm px-2 py-2 text-white bg-primary rounded-full hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300" : "flex w-fit h-fit gap-1 justify-center items-center text-[10px] md:text-sm px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white"}
                        onClick={() => handleFollowToggle({ u_id: profileId, name: currentProfile.name, u_img: currentProfile.u_img })}
                      >
                        {followed(profileId) ? (
                          <>
                            <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i> Following</span>
                            <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span>
                          </>
                        ) : (
                          <><i className="bi bi-plus-lg"></i> Follow</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {profileId === loggedUser?.u_id && (
              <button onClick={handleShowEdit} className="absolute right-3 top-0 z-40 flex gap-2 justify-center m-2 bg-black hover:bg-primary cursor-pointer w-7 h-7 md:w-10 md:h-10 items-center text-sm md:text-lg text-white rounded-full shadow-md" title="Edit Bio">
                <i className="bi bi-pencil-square"></i>
              </button>
            )}
          </div>
          <div className="tabs divide-y-[1px] divide-black/5 dark:divide-slate-500/20 flex flex-col items-center">
            <ul className={`grid ${loggedUser?.u_id === profileId ? "w-full grid-cols-5" : "w-full grid-cols-3"} justify-between overflow-scroll no-scrollbar text-sm md:text-neutral-dark font-medium text-neutral-dark dark:text-dark-accent bg-bg/50 dark:bg-black/50 backdrop-blur-sm sticky top-10 z-[100]`} ref={tabsRef}>
              {["posts", "replies", "journals", ...(loggedUser?.u_id === profileId ? ["likes", "bookmarks"] : [])].map((tabName) => (
                <li
                  key={tabName}
                  className={tab === tabName ? "w-full text-center border-b-2 border-primary dark:text-neutral-lightest py-3 px-0 cursor-pointer" : "w-full text-center hover:border-b-2 border-primary/30 hover:bg-primary/5 py-3 px-0 cursor-pointer"}
                  onClick={() => setTab(tabName)}
                >
                  {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                </li>
              ))}
            </ul>
            <div className="w-full content">
              {renderContent()}
              <p className="py-8 flex justify-center text-primary">.</p>
            </div>
          </div>
        </div>
        <div className="hidden sticky right-0 top-0 xl:flex flex-col gap-5 h-fit col-span-2 py-3">
          {loggedUser?.u_id || isLoading ? (
            <>
              <form onSubmit={handleSearch} className="flex flex-col gap-5 py-2 bg-bg dark:bg-black z-50">
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
                <h2 className="capitalize font-bold text-xl px-5 mb-3 text-neutral-dark dark:text-neutral-lighter">Other Interests</h2>
                {isLoadingOtherUsers || isLoading ? renderLoadingState("h-10") : <div className="w-full divide-y-[1px] divide-black/5 dark:divide-slate-500/20">{renderUserList}</div>}
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
  
      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed w-screen h-screen flex justify-center px-10 bg-bg/90 dark:bg-black/90 text-neutral-dark dark:text-neutral-lighter items-center top-0 left-0 cursor-default z-[1000]">
          <div className="w-full flex flex-col md:w-[80%] lg:w-[50%] max-h-[90%] bg-bg dark:bg-black px-2 md:px-4 py-2 md:py-5 rounded-md gap-6 border-[1px] border-black/10 dark:border-dark-accent/20 shadow-md dark:shadow-dark-accent/20 overflow-scroll">
            <div className="w-full flex justify-between items-center">
              <h1 className="font-bold w-fit flex gap-2 justify-center items-center text-lg md:text-xl">Edit <i className="bi bi-pencil-square"></i></h1>
              <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 rounded-full" onClick={handleCloseEdit}><i className="bi bi-x-lg cursor-pointer"></i></span>
            </div>
            <form className="w-full flex flex-col gap-2 md:gap-7 justify-center items-center px-2 md:px-4 py-2 md:py-4 rounded-lg text-xs">
              <label className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-center gap-2">
                  <p className="font-semibold text-xs md:text-sm">Fullname</p>
                  <p className="font-bold text-xs md:text-sm text-primary dark:text-white">{`${fullNameValCount}/50`}</p>
                </div>
                <input
                  name="fullname"
                  id="fullname"
                  maxLength={50}
                  className={fullNameVal ? "w-full flex gap-2 justify-between items-center input input-bordered input-md bg-bg focus-within:border-dark-accent/50 dark:focus-within:outline-dark-accent rounded-lg p-2 dark:text-dark-accent dark:bg-black placeholder:text-sm text-sm md:text-xl border-[1px] dark:border-dark-accent/40 outline-none" : "w-full rounded-lg p-2 dark:bg-black dark:text-dark-accent placeholder:text-sm text-sm md:text-xl border border-error bg-error/5 dark:bg-black/50 outline-none"}
                  value={fullNameVal}
                  placeholder="Fullname"
                  onChange={handleFullNameChange}
                />
              </label>
              <label className="w-full flex flex-col gap-2">
                <p className="font-semibold text-xs md:text-sm">Display Picture</p>
                <div className="w-full flex gap-5 items-center border-[1px] px-2 py-4 rounded-lg md:p-3 group dark:bg-black/50 hover:bg-primary-content/5 dark:border-dark-accent/40 dark:text-dark-accent cursor-pointer">
                  <div className="relative w-fit flex justify-center items-center">
                    <img src={profilePic} alt="profilepic" className="w-10 h-10 md:w-48 md:h-48 z-30 object-cover object-center rounded-full" width={80} height={80} loading="lazy" />
                    <div className="absolute w-full h-full flex flex-col justify-center gap-1 z-50 text-white/70 transition-all duration-200 bg-black/50 rounded-full">
                      {updating ? (
                        <p className="w-full flex justify-center items-center"><span className="loading loading-spinner loading-sm text-white"></span></p>
                      ) : (
                        <>
                          <i className="bi bi-image w-full text-center text-xl md:text-3xl lg:text-5xl hover:text-white cursor-pointer"></i>
                          <input type="file" name="file" id="file" className="hidden" onChange={handleFile} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="mb-2 text-sm font-semibold">Click to upload</p>
                    <p className="text-xs">PNG, JPG or JPEG (MAX. 1MB)</p>
                  </div>
                </div>
              </label>
              <label className="w-full">
                <div className="w-full flex justify-between items-center gap-2 mb-2">
                  <p className="font-semibold">Bio</p>
                  <p className="font-bold text-sm text-primary dark:text-white">{`${bioValCount}/150`}</p>
                </div>
                <textarea
                  rows={5}
                  maxLength={150}
                  name="post"
                  id="edit"
                  className="w-full rounded-lg p-2 placeholder:text-sm text-sm text-neutral-dark dark:text-dark-accent border bg-bg dark:bg-black dark:border-dark-accent/40 outline-none"
                  value={bioVal}
                  placeholder="Bio..."
                  onChange={handleBioChange}
                />
              </label>
              <label className="w-full flex flex-col gap-2">
                <div className="w-full flex justify-between items-center gap-2">
                  <p className="font-semibold text-xs md:text-sm">Date Of Birth</p>
                  <select className="bg-primary/5 border-[1px] border-black/20 dark:border-dark-accent/40 dark:bg-primary/20 w-full max-w-fit rounded-full text-xs font-semibold px-2 py-0 outline-none" onChange={(e) => setDobPrivacy(e.target.value)} defaultValue="Change Privacy?">
                    <option disabled>Change Privacy?</option>
                    <option>For me</option>
                    <option>Everyone</option>
                  </select>
                </div>
                <input
                  name="dob"
                  id="dob"
                  type="date"
                  max={getTodayDate()}
                  className={dob ? "w-full rounded-lg p-2 text-neutral-dark dark:text-dark-accent bg-bg dark:bg-black placeholder:text-sm text-sm md:text-xl border-[1px] dark:border-dark-accent/40 outline-none" : "w-full rounded-lg p-2 text-neutral-dark dark:text-dark-accent dark:bg-black placeholder:text-sm text-sm md:text-xl border border-error bg-error/5 dark:bg-black/50 outline-none"}
                  value={moment(dob).format("yyyy-MM-dd")}
                  placeholder="Enter your Date of Birth"
                  onChange={(e) => setDob(e.target.value)}
                />
              </label>
              {fullNameVal && dob && (
                <button className="w-full btn border-none bg-primary text-white hover:bg-primary/80" onClick={handleEdit} disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? <span className="loading loading-spinner loading-sm text-white"></span> : "Update"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Follow Modal */}
      {showFollowsModal && (
        <div className="w-screen h-screen flex flex-col justify-center items-center fixed top-0 left-0 bg-bg/90 dark:bg-black/90 shadow-lg mb-4 z-[201]">
          <div className="flex flex-col justify-center items-center bg-bg dark:bg-black p-5 rounded-lg w-[80%] md:w-[60%] lg:w-[40%] border-[1px] border-black/10 dark:border-dark-accent/20 shadow-md dark:shadow-dark-accent/20">
            <div className="w-full flex justify-between items-center mb-5">
              <div className="flex gap-2 items-center">
                <h1 className="font-semibold text-lg lg:text-2xl text-neutral-dark dark:text-neutral-lighter">{followType === "followers" ? "Followers" : "Followings"}</h1>
              </div>
              <span className="size-10 flex justify-center items-center p-2 hover:bg-black/5 text-neutral-dark dark:text-dark-accent dark:hover:bg-neutral-light/10 rounded-full" onClick={() => setShowFollowsModal(false)}>
                <i className="bi bi-x-lg cursor-pointer"></i>
              </span>
            </div>
            {renderFollowModalContent()}
          </div>
        </div>
      )}
    </div>
      <SearchModal handleSearch={handleSearch} search={search} handleChange={(e) => setSearch(e.target.value)} />
      <Footer
        uid={loggedUser?.u_id || null} 
        uName={loggedUser?.u_name || null}
        page="profile" 
        paramsId={profileId}
        toggleSearchBar={handleShowSearch} 
      />
      <NotLoggedInModal uid={loggedUser?.u_id} />
    </div>
  );
};

export default Profile;