/* eslint-disable react/prop-types */
const SearchModal = ({ handleSearch, search, handleChange}) => {
  return (
    <dialog id="my_modal_2" className="modal bg-bg/80 dark:bg-dark-bg/80">
      <div className="modal-box shadow-md flex gap-3 bg-bg dark:bg-dark-bg text-neutral-dark dark:text-dark-accent rounded-full">
        <h1 className="font-semibold">What are you searching for?</h1>
        <label className="w-full input input-bordered bg-bg rounded-full flex items-center gap-3 focus-within:border-dark-accent focus-within:outline-dark-accent border-dark-accent dark:bg-dark-bg/50">
          <form onSubmit={handleSearch} className="w-full flex flex-col gap-5 bg-bg dark:bg-dark-bg/50">
              <input type="text" name="search" id="search" value={search} placeholder="Search..." className="w-full placeholder:text-inherit dark:bg-dark-bg/50" onChange={handleChange}/>
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