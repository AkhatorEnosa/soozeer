import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCommentLikes } from "../features/singlePostSlice";

const useCommentLikes = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['commentLikes'],
        queryFn: async () => {
            try {
                const result = await dispatch(getCommentLikes()).unwrap();
                return result || []; 
            } catch (error) {
                console.error('Failed to fetch comment likes:', error);
                throw error; 
            }
        },
        initialData: [], 
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Comment likes fetch error:', error);
        }
    });
};

export default useCommentLikes;