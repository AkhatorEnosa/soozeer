import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getBookmarks } from "../features/postSlice";

const useBookmarks = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['bookmarks'],
        queryFn: async () => {
            try {
                const result = await dispatch(getBookmarks()).unwrap();
                return result || [];
            } catch (error) {
                console.error('Failed to fetch bookmarks:', error);
                throw error; 
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Bookmarks fetch error:', error);
        }
    });
};

export default useBookmarks;