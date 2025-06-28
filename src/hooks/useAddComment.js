import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { addComment } from "../features/singlePostSlice"


const useAddComment = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (newComment) => {
      dispatch(addComment(newComment))
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        })
    }
  })
}

export default useAddComment