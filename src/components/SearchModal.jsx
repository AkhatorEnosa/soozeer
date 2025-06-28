/* eslint-disable react/prop-types */
const SearchModal = ({ handleSearch, search, handleChange}) => {
  return (
    <dialog id="my_modal_2" className="modal bg-base-100/80 dark:bg-black/80">
      <div className="modal-box shadow-md flex gap-3 dark:bg-black dark:text-[#cbc9c9] rounded-full">
        <h1 className="font-semibold">What are you searching for?</h1>
        <label className="w-full input input-bordered rounded-full flex items-center gap-3 focus-within:border-[#cbc9c9] focus-within:outline-[#cbc9c9] border-[#cbc9c9] dark:bg-black/50">
          <form onSubmit={handleSearch} className="w-full flex flex-col gap-5 dark:bg-black/50">
              <input type="text" name="search" id="search" value={search} placeholder="Search..." className="w-full placeholder:text-inherit dark:bg-black/50" onChange={handleChange}/>
          </form>
        </label>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default SearchModal