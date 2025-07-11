
import logo from '../assets/png/logo-no-background.png'

import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      <header className='w-full flex justify-between items-center px-5 md:px-20 py-3 md:py-5 shadow-sm top-0 bg-white/30 backdrop-blur-lg z-50'>
          <Link to='/'> <img src={logo} alt="logo" className="w-40"/> </Link>

          <div className="flex gap-2 md:gap-5">
            <ul className='flex gap-5 justify-center items-center text-sm font-medium'>
                  <Link to={'/login'}><li className="text-info hover:underline">Login</li></Link>
                  <Link to={'/register'}><li className="text-primary hover:underline">Register</li></Link>
            </ul>
          </div>
      </header>
      <div className='w-full h-full flex flex-col justify-center items-center px-4 text-center'>
        <h1 className='text-[10rem] md:text-[15rem] font-extrabold'>404</h1>
        <p className='text-3xl'>Oops, page not found</p>
      </div>
    </div>
  )
}

export default NotFound