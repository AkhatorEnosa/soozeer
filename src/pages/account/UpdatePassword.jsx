import { Link, useNavigate } from "react-router-dom"
import { Flip, toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { getUser, signIn } from "../../features/appSlice"
import logo1 from '../../assets/logo-grayscale.png'
import logo2 from '../../assets/logo-grayscale-white.png'
import { updatePassword } from "../../features/appSlice"

const UpdatePassword = () => {
    const [confirmPassword, setConfirmPassword] = useState("")
    const [password, setPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)

    const {loggedUser, isLoading, updatingPassword, updatedPassword, error} = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      if(!isLoading && loggedUser !== null) {
        navigate('/')
      }
    }, [loggedUser])

    // useEffect(() => {
    //     // const access_token = (window.location.hash.split('&')[0]).split("=")[1]
    //     // refresh_token = new URLSearchParams(window.location.hash).get('refresh_token');

    // }, [])
    

    const handleSubmit = (e) => {
        e.preventDefault()

        // get refresh_token 
        let refresh_token = new URLSearchParams(window.location.hash).get('refresh_token')

        if(confirmPassword !== "" && password !== "") { 
            if(confirmPassword === password) {
                // console.log("Update success")
                if(loggedUser == null) {
                    // console.log("We can go ahead and update password")
                    dispatch(updatePassword({password: password, refresh_token: refresh_token}))
                    setPassword("")
                    setConfirmPassword("")
                } else {
                    // console.log("Already Logged In")
                    toast.info("An account is logged in! Logout to Update Password.", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
                }
            } else {
                toast.error("Passwords do not match", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
            }
        } else {
            // console.log("Empty fields")
            toast.error("Fill out all fields", {className: "text-sm  font-semibold", autoClose: 2000, position: 'top-right', closeOnClick: true, transition: Flip, hideProgressBar: true})
        }
    }

  return (
    <div className="w-full h-screen dark:text-[#CBC9C9] flex flex-col items-center overflow-clip">
        <div className="w-full h-full flex flex-col-reverse justify-center items-center lg:grid lg:grid-cols-3 gap-5 lg:gap-0">
            <div className="w-full col-span-2 flex flex-col justify-center items-center">
                {updatingPassword ? 

                    <div className="w-full md:w-[35rem] lg:w-[60%] flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md py-20 px-4 md:shadow-md dark:shadow-neutral">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div> 
                
                : updatedPassword ? 

                    <div className="w-full md:w-[35rem] lg:w-[60%] flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md py-28 px-4 md:shadow-md dark:shadow-neutral">
                        <i className="bi bi-check2-circle text-green-300 text-8xl animate-pulse"></i> 
                        <p>Password Updated</p>
                        <Link to={'../login'}>Login</Link>
                    </div>
                
                : 
                <div className="w-full md:w-[35rem] lg:w-96 flex flex-col justify-center items-center gap-10 border-[1px] border-black/5 dark:border-neutral-100/5 rounded-md p-4 md:shadow-md dark:shadow-neutral">
                    <h1 className="text-2xl font-medium hidden lg:flex">Update Password</h1>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <label className="w-full flex gap-2 justify-between items-center input input-bordered input-md">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password} placeholder="Password" className="w-full" autoComplete="" onChange={(e)=>setPassword(e.target.value)}/>
                            <span className="cursor-pointer text-neutral/50 dark:text-[#CBC9C9]" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}</span>
                        </label>
                        <label className="w-full flex gap-2 justify-between items-center input input-bordered input-md">
                            <input type={showPassword ? "text" : "password"} name="confirm-password" id="confirm-password" value={confirmPassword} placeholder="Re-enter Password" className="w-full" autoComplete="" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                            <span className="cursor-pointer text-neutral/50 dark:text-[#CBC9C9]" onClick={() => setShowPassword(!showPassword)}>{showPassword ?<i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}</span>
                        </label>
                        <button type="submit" className="btn btn-primary text-white" disabled={isLoading && "disabled"}>{(isLoading && error == null) ? <span className="loading loading-dots loading-sm text-white"></span> : 'Update Password'}</button>
                    </form>
                </div>}
            </div>
            <div className="w-full lg:h-full flex flex-col justify-center items-center border-l-[1px] border-neutral-100 dark:border-neutral/90 col-span-1 overflow-clip">
                <p>Welcome to</p>
                <div className="flex py-4 px-10">
                    <Link to='/' className="cursor-pointer"> <img src={logo1} alt="logo" className="dark:hidden w-48 md:w-56 lg:w-44"/>  </Link>
                    <Link to='/' className="cursor-pointer"> <img src={logo2} alt="logo" className="hidden dark:flex w-48 md:w-56 lg:w-44"/> </Link>
                </div>
                <p>Log into your account.</p>
                <ul className="mt-10 gap-4 hidden lg:block">
                  <Link to={'/register'}><li className="py-2 px-4 border-[1px] rounded-full border-black text-neutral dark:border-white dark:text-white  hover:bg-black hover:text-base-100 dark:hover:bg-white">Register</li></Link>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default UpdatePassword