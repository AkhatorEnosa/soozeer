import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { follows } from "../features/followSlice";

const useFollows = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['follows'],
        queryFn: async () => {
            try {
                const result = await dispatch(follows()).unwrap();
                return result || [];
            } catch (error) {
                console.error('Failed to fetch follows:', error);
                throw error; 
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Follows fetch error:', error);
        }
    });
};

export default useFollows;