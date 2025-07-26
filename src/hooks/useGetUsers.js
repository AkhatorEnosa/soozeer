import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getUsers } from "../features/appSlice";

const useGetUsers = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await dispatch(getUsers()).unwrap();
            return result;
        },
        initialData: null, 
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: "offlineFirst",
        retry: 3, 
    });
};

export default useGetUsers;