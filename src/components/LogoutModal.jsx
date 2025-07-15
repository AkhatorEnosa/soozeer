/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const LogoutModal = ({ exiting }) => {
    const { handleLogout, setTriggerLogout } = useContext(AppContext)
  return (
    <dialog className="fixed w-screen h-screen flex justify-center px-10 bg-bg/80 dark:bg-dark-bg/80 items-center top-0 left-0 cursor-default z-[1000]">
          <div className="w-[85%] md:w-[50%] bg-bg dark:bg-dark-bg text-neutral-dark dark:text-dark-accent p-5 rounded-[1rem] flex flex-col gap-2 border-[1px] border-black/10 dark:border-dark-accent/20 text-dark-neutral/20 shadow-md dark:shadow-dark-accent/20">
              <h1 className="text-2xl lg:text-3xl font-semibold">Logout?</h1>
              <p>Accepting will log you out of your account. Do you want to proceed?</p>
              {
                  !exiting ? 
                      <div className="w-full flex gap-2 mt-10 font-bold justify-end">
                          <button className="w-fit px-4 py-2 rounded-full bg-error text-white lg:hover:shadow-md" onClick={() => handleLogout()}>Yes, Logout</button>
                          <button className="w-fit px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black lg:hover:shadow-md" onClick={() => setTriggerLogout(false)}>Cancel</button>
                      </div> : 
                    <div className="w-full flex gap-2 mt-10 font-bold justify-center items-center">
                        <span className="loading loading-spinner"></span>
                    </div> 
              }
          </div>
      </dialog>
  )
}

export default LogoutModal