import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getLikes } from "../features/postSlice";

const useLikes = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['likes'],
        queryFn: () => {
            const result = dispatch(getLikes())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
}

export default useLikes