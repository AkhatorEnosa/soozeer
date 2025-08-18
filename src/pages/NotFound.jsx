
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'

import { Link, useNavigate } from "react-router-dom"
import BackBtn from '../components/BackBtn'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full h-screen flex flex-col'>
       <header className='w-full flex justify-between items-center px-5 md:px-20 py-3 md:py-5 shadow-sm top-0 bg-white/30 backdrop-blur-lg z-50'>
          <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-48 md:w-56 lg:w-44"/>  </Link>
          <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-48 md:w-56 lg:w-44"/> </Link>
      </header>
      <div className='w-full h-full flex flex-col justify-center items-center px-4 text-center'>
        <h1 className='text-[10rem] md:text-[15rem] font-extrabold'>404</h1>
        <p className='text-3xl'>Oops, page not found</p>
        <BackBtn link={() => navigate(-1)} title={"Back"}/>
      </div>
    </div>
  )
}

export default NotFound