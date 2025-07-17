import { Link } from "react-router-dom"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'
import { useEffect, useState } from "react"

/* eslint-disable react/prop-types */
const NotLoggedInModal = ({uid}) => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setTimeout(() => {
        setShowModal(true)
    }, 5000);
  }, [])
  
  return (
    <>
      {showModal && !uid && <div className={showModal && !uid ? "fixed bottom-0 bg-bg/50 dark:bg-black/50 border-t-2 border-primary backdrop-blur-md py-10 px-10 gap-5 lg:gap-10 flex flex-col md:flex-row md:items-center justify-between w-screen z-[1200] text-neutral-dark dark:text-dark-accent transition-all duration-300" : "fixed -bottom-64 bg-bg/50 dark:bg-black/50 border-t-2 border-primary backdrop-blur-md py-10 px-10 gap-5 lg:gap-10 flex flex-col md:flex-row md:items-center justify-between w-screen z-[1200] text-neutral-dark dark:text-dark-accent transition-all duration-300"}>
          <div className="flex flex-col w-fit h-full justify-center gap-2 text-[12px] md:text-sm">
              <div>
                  <Link to='/' className="lg:py-5 cursor-pointer"> <img src={logo1} alt="logo" className=" dark:hidden w-32 md:w-36 lg:w-44"/> </Link>
                  <Link to='/' className="lg:py-5 cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-32 md:w-36 lg:w-44"/> </Link>
              </div>
              <p>Welcome Guest, we noticed you are not logged in. Why not Join Us to explore this platform more.</p>
          </div>

          <ul className="flex gap-4">
            <Link to={'/login'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:bg-bg">Login</li></Link>
            <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:bg-bg">Register</li></Link>
          </ul>
      </div>}
    </>
  )
}

export default NotLoggedInModal