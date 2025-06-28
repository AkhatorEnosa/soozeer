import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { profileEdit } from "../features/appSlice"


const useEditProfile = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (props) => {
      dispatch(profileEdit(props))
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        })
    }
  })
}

export default useEditProfile