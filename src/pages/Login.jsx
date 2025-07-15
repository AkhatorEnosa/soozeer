import { Link, useNavigate } from "react-router-dom"
import { Flip, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUser, signIn } from "../features/appSlice"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const {loggedUser, isLoading, error} = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      if(!isLoading && loggedUser !== null) {
        navigate('/')
      }
    }, [loggedUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(email !== "" && password !== "") { 
            if(loggedUser == null) {
                // console.log("We can go ahead and log in")
                await dispatch(signIn({
                    email,
                    password
                }))

                await dispatch(getUser())
                setPassword("")

            } else {
                // console.log("Already Logged In")
                toast.info("An account is logged in! Logout to login.", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
            }
        } else {
            // console.log("Empty fields")
            toast.error("Fill out all fields", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
        }
    }

  return (
    <div className="w-full h-screen text-neutral-dark dark:text-dark-accent flex flex-col items-center overflow-clip">
        <div className="w-full h-full flex flex-col-reverse justify-center items-center lg:grid lg:grid-cols-3 gap-5 lg:gap-0">
            <div className="w-full col-span-2 flex flex-col justify-center items-center dark:text-dark-accent">
                <div className="w-full md:w-[35rem] lg:w-[60%] lg:px-5 flex flex-col justify-center items-center gap-10 border-[2px] border-black/5 dark:border-neutral-light/5 rounded-md p-4 md:shadow-md dark:shadow-neutral-light/20">
                    <h1 className="text-2xl font-medium hidden lg:flex">Login</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <input type="email" name="email" id="email" value={email} placeholder="Email" className="w-full input input-bordered input-md  dark:focus-within:border-dark-accent/50 focus-within:outline-dark-accent dark:border-dark-accent/50 rounded-full dark:bg-black/50 dark:placeholder:text-dark-accent" onChange={(e)=>setEmail(e.target.value)}/>
                        
                        <label className="w-full flex gap-2 justify-between items-center input input-bordered input-md focus-within:border-dark-accent/50 rounded-full dark:focus-within:outline-dark-accent dark:border-dark-accent/50 dark:bg-black/50">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} placeholder="Password" className="w-full dark:placeholder:text-dark-accent" autoComplete="" onChange={(e)=>setPassword(e.target.value)}/>
                            <span className="cursor-pointer text-neutral/50 dark:text-inherit" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}</span>
                        </label>
                        <button type="submit" className={`btn rounded-full ${email.trim() !== "" && password.trim() !== "" ? "bg-primary hover:bg-primary/80" : "hover:bg-primary/50 bg-primary/50"} text-white disabled:bg-primary/50`} disabled={isLoading && "disabled"}>{(isLoading && !error) ? <span className="loading loading-spinner loading-sm text-white"></span> : 'Login'}</button>
                    </form>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-xs">Don&lsquo;t have an account?<Link to="/register" className="text-primary cursor-pointer"> Join Us</Link></p>
                        <p className="text-xs">Forgotten your password?<Link to="/account/reset-password" className="text-primary cursor-pointer"> Reset Password</Link></p>
                    </div>
                </div>
            </div>
            <div className="w-full lg:h-full flex flex-col justify-center items-center border-l-[1px] border-neutral-100 dark:border-primary/20 col-span-1 overflow-clip">
                <p>Welcome to</p>
                <div className="flex py-4 px-10">
                    <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-48 md:w-56 lg:w-44"/>  </Link>
                    <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-48 md:w-56 lg:w-44"/> </Link>
                </div>
                <p>Log into your account.</p>
                <ul className="mt-10 gap-4 hidden lg:block">
                  <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-white dark:text-dark-accent  hover:bg-black hover:text-base-100 dark:hover:bg-white dark:hover:text-neutral-dark">Register</li></Link>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Login