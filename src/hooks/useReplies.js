import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getReplies } from "../features/postSlice";

const useReplies = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['replies'],
        queryFn: async() => {
            const result = dispatch(getReplies())
            return result;
        },
        initialData: [],
        // refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true,
        
    })
}

export default useReplies