import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { addPost } from "../features/postSlice"


const useAddPost = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (newPost) => {
      dispatch(addPost(newPost))
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        })
    }
  })
}

export default useAddPost