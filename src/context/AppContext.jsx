/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../features/appSlice";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [triggerLogout, setTriggerLogout] = useState(false)
  const [showSubMenu, setShowSubMenu] = useState(false)

  const dispatch = useDispatch()


  
    const handleLogout = () => {
      dispatch(logOut())
      setTriggerLogout(false)
      setShowSubMenu(false)
    }
    // Loading state skeleton
    const renderLoadingState = (height) => (
      <div className="w-full flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`skeleton bg-neutral-dark/20 dark:bg-slate-600 ${height} w-full opacity-40`}></div>
        ))}
      </div>
    );
  
    // Empty state component
    const renderEmptyState = (icon, message) => (
      <div className="w-full py-10 flex flex-col text-neutral-dark dark:text-dark-text gap-4">
        <h1 className="w-full h-56 gap-5 font-semibold flex flex-col justify-center items-center z-50 text-9xl">
          <i className={`bi ${icon}`}></i>
          <p className="text-sm">{message}</p>
        </h1>
      </div>
    );
  
    // Common user list empty state
    const userListEmptyState = () => (
      <h1 className="w-full h-56 flex flex-col gap-5 font-semibold justify-center items-center z-50 text-5xl text-neutral-dark dark:text-dark-text py-5">
        <i className="bi bi-people"></i>
        <p className="text-sm">No body to see, yet!</p>
      </h1>
    );

    // Network and other Error state
    const renderErrorState = (message) => (
      <div className="w-full h-56 flex flex-col justify-center gap-5 font-semibold items-center z-50 text-5xl text-neutral-dark dark:text-dark-text py-5">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <p className="text-sm">{message}</p>
      </div>
    );
    

  return (
   <AppContext.Provider value={{
        triggerLogout,
        setTriggerLogout,
        showSubMenu,
        setShowSubMenu,
        handleLogout,
        renderLoadingState,
        renderEmptyState,
        userListEmptyState,
        renderErrorState
    }}>
        {children}
   </AppContext.Provider>
  );
}