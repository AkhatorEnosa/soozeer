/* eslint-disable react/prop-types */
const OriginBtn = ({link, title}) => {
    // const navigate = useNavigate()
  return (
        <div className="w-fit py-3 ">
          <button onClick={link} className="w-fit badge bg-neutral-dark/10 hover:bg-bg dark:bg-bg/10 dark:hover:bg-black text-neutral-dark dark:text-dark-accent py-3 flex gap-2 justify-center items-center hover:text-primary duration-200 transition-colors rounded-full text-xs md:text-sm cursor-pointer">
            <i className="bi bi-arrow-90deg-up"></i>
              {title}
          </button>
        </div>
  )
}

export default OriginBtn