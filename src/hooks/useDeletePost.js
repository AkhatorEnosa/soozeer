import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { deletePost } from "../features/postSlice"

const useDeletePost = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(details) => {
            dispatch(deletePost(details))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts']
            })
        }
    })
}

export default useDeletePost