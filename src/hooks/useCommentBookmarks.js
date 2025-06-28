import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { commentBookmarks } from "../features/singlePostSlice";

const useCommentBookmarks = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['commentBookmarks'],
        queryFn: async() => {
            const result = dispatch(commentBookmarks())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
}

export default useCommentBookmarks