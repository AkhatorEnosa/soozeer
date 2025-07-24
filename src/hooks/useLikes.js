import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getLikes } from "../features/postSlice";

const useLikes = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['likes'],
        queryFn: async () => {
            const result = await dispatch(getLikes()).unwrap();
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        onError: (error) => {
            console.error('Failed to fetch likes:', error);
        }
    });
};

export default useLikes;