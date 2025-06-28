import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../features/appSlice"
import logo1 from '../assets/logo-grayscale.png'
import logo2 from '../assets/logo-grayscale-white.png'

const Register = () => {

    const [name, setName] = useState("")
    const [u_name, setUname] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")
    const [password, setPassword] = useState("")
    const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? localStorage.getItem("theme") : "light")
    const [systemThemeIsDark, setSystemThemeIsDark] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

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

  // get today's full date in YYYY-MM-DD format 
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate()

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return formattedDate;
  }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(name !== '' && u_name !== '' && gender !== '' && email !== '' && password !== '') {
            if(password.length > 5) {

                if(loggedUser == null) {

                    await dispatch(register({
                        name,
                        u_name,
                        email,
                        gender,
                        dob: new Date(Date.parse(dob)),
                        password
                    }))
                    .then(() => {
                        navigate('/')
                    });

                } else {
                    toast.info("An account is logged in! Logout first to be able to register another account.", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true})
                }
            } else {
                toast.error("Password too short!", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true})
            }
        } else {
            toast.error("Fill out all fields", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true})
        }
    }

  return (
    <div className="w-full h-screen flex flex-col items-center overflow-hidden">
        <div className="w-full h-full flex flex-col-reverse justify-center items-center lg:grid lg:grid-cols-3 gap-5 lg:gap-0">
            <div className="w-full col-span-2 flex flex-col justify-center items-center dark:text-[#CBC9C9]">
                <div className="w-full md:w-[35rem] lg:w-96 flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md p-4  md:shadow-md dark:shadow-primary/20">
                    <h1 className="text-2xl font-medium">Register</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <input type="text" name="name" id="name" value={name} placeholder="Fullname" className="w-full input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50" onChange={(e)=>setName(e.target.value)}/>
                        <input type="text" name="username" id="username" value={u_name} placeholder="Username" className="w-full input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50" onChange={(e)=>setUname(e.target.value)}/>
                        <input type="email" name="email" id="email" value={email} placeholder="Email" className="w-full input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50" onChange={(e)=>setEmail(e.target.value)}/>
                         <select className="select select-bordered w-full input input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50" defaultValue={"Gender?"} onChange={(e) => setGender(e.target.value)}>
                            <option disabled>Gender?</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        <input type="date" name="dob" id="dob" max={getTodayDate()}
                         value={dob} placeholder="Date Of Birth" className="w-full input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50" onChange={(e)=>setDob(e.target.value)}/>
                        <label className="w-full flex gap-2 justify-between items-center input input-bordered input-md focus-within:border-[#cbc9c9]/50 rounded-full dark:focus-within:outline-[#cbc9c9] dark:border-[#cbc9c9]/50 dark:placeholder:text-[#cbc9c9] dark:bg-black/50">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} placeholder="Password" className="w-full dark:placeholder:text-[#cbc9c9]" autoComplete="" onChange={(e)=>setPassword(e.target.value)}/>
                            <span className="cursor-pointer text-neutral/50 dark:text-[#CBC9C9]" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}</span>
                        </label>
                        <button type="submit" className={`btn rounded-full ${name.trim() !== "" && u_name.trim() !== "" && gender.trim() !== "" && dob.trim() !== "" && email.trim() !== "" && password.trim() !== "" ? "btn-primary text-white" : "bg-primary/50 btn-primary"} disabled:bg-primary/50`} disabled={isLoading && "disabled"}>{(isLoading && !error) ? <span className="loading loading-spinner loading-sm text-white"></span> : 'Register'}</button>
                    </form>
                    <p className="text-xs">Already have an account? <Link to="/login" className="text-primary cursor-pointer">Login</Link></p>
                </div>
            </div>
            <div className="w-full lg:h-full flex flex-col justify-center items-center border-l-[1px] border-neutral-100 dark:border-primary/20 col-span-1 overflow-clip">
                <p>Welcome to</p>
                <div className="flex py-4 px-10">
                    <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-48 md:w-56 lg:w-44"/>  </Link>
                    <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-48 md:w-56 lg:w-44"/> </Link>
                </div>
                <p>Join Us to explore this platform.</p>
                <ul className="mt-10 gap-4 hidden lg:block">
                  <Link to={'/login'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-white dark:text-[#CBC9C9]  hover:bg-black hover:text-base-100 dark:hover:bg-white">Login</li></Link>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Register