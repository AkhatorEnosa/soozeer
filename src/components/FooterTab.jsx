import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
const FooterTab = ({location, page, pageValue, fillIcon, strokeIcon}) => {
  return (
    <Link to={location} className=" text-neutral dark:text-[#CBC9C9]">
        <li className={page === pageValue ? "text-primary backdrop-blur-none border-b-2 border-primary h-full flex flex-col justify-center items-center cursor-pointer" : "hover:text-primary hover hover:border-b-2 hover:border-primary h-full flex flex-col justify-center items-center cursor-pointer"}><i className={`bi-${page === pageValue ? fillIcon : strokeIcon}`}></i></li>
    </Link>
  )
}

export default FooterTab