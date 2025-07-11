import { HashRouter as Router, Route, Routes } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Search = lazy(() => import("./pages/Search"))
const Profile = lazy(() => import("./pages/Profile"))
const Post = lazy(() => import("./pages/Post"))
const Notifications = lazy(() => import("./pages/Notifications"))
const Messages = lazy(() => import("./pages/Messages"))
const ResetPassword = lazy(() => import("./pages/account/ResetPassword"))
const UpdatePassword = lazy(() => import("./pages/account/UpdatePassword"))

const App = () => {
  return (
    <div className="dark:bg-dark-bg">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <Suspense>
              <Home />
            </Suspense>
          }/>

          <Route path="/login" element={
            <Suspense>
              <Login />
            </Suspense>}/>

          <Route path="/register" element={
            <Suspense>
              <Register />
            </Suspense>}/>

          <Route path="/account/reset-password" element={
            <Suspense>
              <ResetPassword />
            </Suspense>}/>

          <Route path="/account/update-password" element={
            <Suspense>
              <UpdatePassword />
            </Suspense>}/>

          <Route path="/search/:id" element={
            <Suspense>
              <Search />
            </Suspense>
          }/>

          <Route path="/:id" element={
            <Suspense>
              <Profile />
            </Suspense>
          }/>

          <Route path="/post/:id" element={
            <Suspense>
              <Post />
            </Suspense>
          }/>

          <Route path="/notifications" element={
            <Suspense>
              <Notifications />
            </Suspense>
          }/>

          <Route path="/messages/:id" element={
            <Suspense>
              <Messages />
            </Suspense>
          }/>
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  )
}

export default App