import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { getUser } from "../features/appSlice";

const useGetUser = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['user'],
        queryFn: () => {
            const result = dispatch(getUser())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode:"offlineFirst",
        retry: true
    })
}

export default useGetUser