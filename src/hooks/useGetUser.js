import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getUser } from "../features/appSlice";

const useGetUser = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const result = await dispatch(getUser()).unwrap();
            return result;
        },
        initialData: null, 
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: "offlineFirst",
        retry: 3, 
    });
};

export default useGetUser;