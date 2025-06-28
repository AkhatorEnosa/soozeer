import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { userBookmarkedPosts } from "../features/postSlice";

const useGetBookmarkedPosts = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(profileId) => {
            dispatch(userBookmarkedPosts(profileId))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['bookmarks']
            })
        }
    })
}

export default useGetBookmarkedPosts