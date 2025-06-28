import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { userLikedPosts } from "../features/postSlice";

const useGetLikedPosts = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(profileId) => {
            dispatch(userLikedPosts(profileId))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['likes']
            })
        }
    })
}

export default useGetLikedPosts