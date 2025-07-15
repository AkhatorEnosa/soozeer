/* eslint-disable react/prop-types */
import { createContext } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    // Loading state skeleton
    const renderLoadingState = (height) => (
      <div className="w-full flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`skeleton dark:bg-slate-600 ${height} w-full opacity-40`}></div>
        ))}
      </div>
    );
  
    // Empty state component
    const renderEmptyState = (icon, message) => (
      <div className="w-full py-10 flex flex-col gap-4">
        <h1 className="w-full h-56 flex flex-col justify-center items-center z-50 text-9xl">
          <i className={`bi ${icon}`}></i>
          <p className="text-base">{message}</p>
        </h1>
      </div>
    );
  
    // Common user list empty state
    const userListEmptyState = () => (
      <h1 className="w-full h-56 flex flex-col gap-4 justify-center items-center z-50 text-5xl text-neutral-dark dark:text-dark-text py-5">
        <i className="bi bi-people"></i>
        <p className="text-base">No body to see, yet!</p>
      </h1>
    );
    

  return (
   <AppContext.Provider value={{
        renderLoadingState,
        renderEmptyState,
        userListEmptyState
    }}>
        {children}
   </AppContext.Provider>
  );
}