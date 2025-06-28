import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getCommentLikes } from "../features/singlePostSlice";

const useCommentLikes = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['commentLikes'],
        queryFn: () => {
            const result = dispatch(getCommentLikes())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
}

export default useCommentLikes