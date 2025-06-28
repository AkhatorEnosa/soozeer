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

    const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? localStorage.getItem("theme") : "light")
    const [systemThemeIsDark, setSystemThemeIsDark] = useState(false)

    const {loggedUser, isLoading, error} = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    // handle theme
    const htmlClassList = document.querySelector('html').classList
    const checkForDark = window.matchMedia(`(prefers-color-scheme: dark)`)

 useEffect(() => {
      if(('theme' in localStorage)) {
        setTheme(localStorage.getItem("theme"))
        htmlClassList.remove("dark")
        htmlClassList.remove("light")
        htmlClassList.add(theme)
      }
      setSystemThemeIsDark(checkForDark.matches)

      if(systemThemeIsDark == true) {
        setTheme("dark")
        localStorage.setItem("theme", "dark")
        htmlClassList.add("dark")

        if(htmlClassList.contains("light")) {
            htmlClassList.remove("light")
        }
      } 
  }, [theme, htmlClassList, systemThemeIsDark, checkForDark])

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
    <div className="w-full h-screen dark:text-[#CBC9C9] flex flex-col items-center overflow-clip">
        <div className="w-full h-full flex flex-col-reverse justify-center items-center lg:grid lg:grid-cols-3 gap-5 lg:gap-0">
            <div className="w-full col-span-2 flex flex-col justify-center items-center dark:text-[#CBC9C9]">
                <div className="w-full md:w-[35rem] lg:w-96 flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md p-4 md:shadow-md dark:shadow-primary/20">
                    <h1 className="text-2xl font-medium hidden lg:flex">Login</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <input type="email" name="email" id="email" value={email} placeholder="Email" className="w-full input input-bordered input-md  dark:focus-within:border-[#cbc9c9]/50 focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 rounded-full dark:bg-black/50 dark:placeholder:text-[#cbc9c9]" onChange={(e)=>setEmail(e.target.value)}/>
                        
                        <label className="w-full flex gap-2 justify-between items-center input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:bg-black/50">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} placeholder="Password" className="w-full dark:placeholder:text-[#cbc9c9]" autoComplete="" onChange={(e)=>setPassword(e.target.value)}/>
                            <span className="cursor-pointer text-neutral/50 dark:text-inherit" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}</span>
                        </label>
                        <button type="submit" className={`btn rounded-full ${email.trim() !== "" && password.trim() !== "" ? "btn-primary text-white" : "bg-primary/50 btn-primary"} disabled:bg-primary/50`} disabled={isLoading && "disabled"}>{(isLoading && !error) ? <span className="loading loading-spinner loading-sm text-white"></span> : 'Login'}</button>
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
                  <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-white dark:text-[#CBC9C9]  hover:bg-black hover:text-base-100 dark:hover:bg-white">Register</li></Link>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Login