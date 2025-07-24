import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getReplies } from "../features/postSlice";

const useReplies = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['replies'],
        queryFn: async () => {
            try {
                const result = await dispatch(getReplies()).unwrap();
                return result || []; 
            } catch (error) {
                console.error('Failed to fetch replies:', error);
                throw error; 
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Replies query error:', error);
        }
    });
};

export default useReplies;