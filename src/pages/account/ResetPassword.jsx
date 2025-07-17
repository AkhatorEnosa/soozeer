import { Link, useNavigate } from "react-router-dom"
import { Flip, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { getUser, signIn } from "../../features/appSlice"
import logo1 from '../../assets/logo-grayscale.png'
import logo2 from '../../assets/logo-grayscale-white.png'
import { resetPassword } from "../../features/appSlice"

const ResetPassword = () => {
    const [email, setEmail] = useState("")

    const {loggedUser, isLoading, isSendingEmail, emailSent, error} = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      if(!isLoading && loggedUser !== null) {
        navigate('/')
      }
    }, [loggedUser])

    const handleSubmit = (e) => {
        e.preventDefault()
        if(email !== "") { 
            console.log(email)
            if(loggedUser == null) {
                
                dispatch(resetPassword(email))
                setEmail("")

            } else {
                // console.log("Already Logged In")
                toast.info("An account is logged in! Logout to ResetPassword.", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
            }
        } else {
            // console.log("Empty fields")
            toast.error("Fill out all fields", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
        }
    }

  return (
    <div className="w-full h-screen dark:text-dark-accent flex flex-col items-center overflow-clip">
        <div className="w-full h-full flex flex-col-reverse justify-center items-center lg:grid lg:grid-cols-3 gap-5 lg:gap-0">
            <div className="w-full col-span-2 flex flex-col justify-center items-center">
                {isSendingEmail ? 

                    <div className="w-full md:w-[35rem] lg:w-[60%] lg:px-5 flex flex-col justify-center items-center gap-10 border-[2px] border-black/5 dark:border-neutral-light/5 rounded-md p-4 md:shadow-md dark:shadow-neutral-light/20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div> 
                
                : emailSent ? 

                    <div className="w-full md:w-[35rem] lg:w-[60%] flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md py-28 px-4 md:shadow-md dark:shadow-neutral">
                        <h1>Reset Password Email Sent!</h1>
                        <i className="bi bi-check2-circle text-green-300 text-8xl animate-pulse"></i> 
                        <p>Check your email for Reset Password Link and follow the outlined instructions.</p>
                    </div>
                
                : 
                
                    <div className="w-full md:w-[35rem] lg:w-[60%] lg:px-5 flex flex-col justify-center items-center gap-10 border-[2px] border-black/5 dark:border-neutral-light/5 rounded-md p-4 md:shadow-md dark:shadow-neutral-light/20">
                        <h1 className="text-2xl font-medium hidden lg:flex">Reset Password</h1>
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                            <input type="email" name="email" id="email" value={email} placeholder="Email" className="w-full flex gap-2 justify-between items-center input input-bordered input-md bg-bg dark:placeholder:text-dark-accent focus-within:border-dark-accent/50 rounded-full dark:focus-within:outline-dark-accent dark:border-dark-accent/50 dark:bg-black" onChange={(e)=>setEmail(e.target.value)}/>
                            <button type="submit" className={`btn border-none rounded-full ${email.trim() !== "" ? "bg-primary hover:bg-primary/80" : "hover:bg-primary/50 bg-primary/50"} text-white disabled:bg-primary/50`} disabled={isSendingEmail && "disabled"}>{(isSendingEmail && error == null) ? <span className="loading loading-dots loading-sm text-white"></span> : 'Send Password Recovery Mail'}</button>
                        </form>
                    </div>}
            </div>
            <div className="w-full lg:h-full flex flex-col justify-center items-center border-l-[1px] text-neutral-dark dark:text-dark-accent border-neutral-100 dark:border-neutral-light/10 col-span-1 overflow-clip">
                <p>Welcome to</p>
                <div className="flex py-4 px-10">
                    <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-48 md:w-56 lg:w-44"/>  </Link>
                    <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-48 md:w-56 lg:w-44"/> </Link>
                </div>
                <p>Join Us to explore</p>
                <ul className="mt-10 gap-4 hidden lg:block">
                  <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral-dark dark:border-bg dark:text-dark-accent hover:bg-black hover:text-bg dark:hover:text-neutral-dark dark:hover:bg-bg">Register</li></Link>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default ResetPassword