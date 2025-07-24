import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getPosts } from "../features/postSlice";

const usePosts = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            try {
                const result = await dispatch(getPosts()).unwrap();
                return result || []; 
            } catch (error) {
                console.error('Failed to fetch posts:', error);
                throw error; 
            }
        },
        initialData: [], 
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Posts query error:', error);
        }
    });
};

export default usePosts;