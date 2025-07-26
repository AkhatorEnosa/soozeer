import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getProfile } from "../features/appSlice";

const useGetCurrentProfile = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(profileId) => {
            dispatch(getProfile(profileId))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['userProfile']
            })
        }
    })
}

export default useGetCurrentProfile