import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getBookmarks } from "../features/postSlice";

const useBookmarks = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['bookmarks'],
        queryFn: async() => {
            const result = dispatch(getBookmarks())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
}

export default useBookmarks