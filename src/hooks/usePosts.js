import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getPosts } from "../features/postSlice";

const usePosts = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['posts'],
        queryFn: async() => {
            const result = dispatch(getPosts())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true,
        
    })
}

export default usePosts