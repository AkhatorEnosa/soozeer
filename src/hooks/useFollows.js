import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import { follows } from "../features/followSlice";

const useFollows = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ['follows'],
        queryFn: () => {
            const result = dispatch(follows())
            return result;
        },
        initialData: [],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: true
    })
    // const queryClient = useQueryClient()
    // const dispatch = useDispatch()
  
    // return useMutation({
    //     mutationFn: async(profileId) => {
    //         dispatch(follows(profileId))
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({
    //             queryKey: ['follows']
    //         })
    //     }
    // })
}

export default useFollows