import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
const OtherUsersCard = ({uid, userIdVal, userImg, name, uName, followed, following, toggleFollow}) => {
  return (
    <div className="w-full py-3 px-3 flex flex-col items-start border-y-[1px] border-black/5 dark:border-neutral-300/10 hover:bg-primary/5 duration-200 transition-all">
        <div className="w-full flex justify-between items-center gap-2">

          <div className="w-full flex gap-2 text-xs">
            <div className="w-10 h-10 flex justify-center items-center rounded-full cursor-default overflow-hidden">
              <img src={userImg} alt="" className="w-full h-full object-cover" loading="lazy"/>
            </div>
            <Link to={`../${uName}`}>
              <p className="w-fit text-neutral-dark dark:text-dark-accent hover:underline font-semibold line-clamp-1">{name}</p>
              <span className="text-neutral-400 text-xs cursor-default">@{uName}</span>
            </Link>
          </div>

          <div className="flex justify-between items-center gap-3 md:flex-row">
              {userIdVal && !uid && <button className={followed === false ? "w-fit flex gap-1 justify-center items-center text-xs px-2 py-2 text-primary border-[1px] border-primary rounded-full hover:bg-primary hover:text-white" : "group flex gap-1 justify-center items-center text-xs px-2 py-2 text-white bg-primary border-[1px] border-primary rounded-full w-fit hover:bg-neutral hover:text-white hover:border-neutral transition-all duration-300"} onClick={toggleFollow} disabled={following}>{followed === false ? <><i className="bi bi-plus-lg"></i>  Follow</> : <>
              <span className="followed group-hover:hidden flex gap-2 justify-center items-center"><i className="bi bi-patch-check-fill"></i>  Following</span> <span className="hidden group-hover:flex gap-2 justify-center items-center"><i className="bi bi-x-circle-fill"></i> Unfollow</span></>}</button>}
          </div>
        </div>
    </div>
  )
}

export default OtherUsersCard