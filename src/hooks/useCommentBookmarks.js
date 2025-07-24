import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { commentBookmarks } from "../features/singlePostSlice";

const useCommentBookmarks = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['commentBookmarks'],
        queryFn: async () => {
            try {
                const result = await dispatch(commentBookmarks()).unwrap();
                return result || []; 
            } catch (error) {
                console.error('Failed to fetch comment bookmarks:', error);
                throw error;
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Comment bookmarks error:', error);
        }
    });
};

export default useCommentBookmarks;