import { useDispatch } from "react-redux";
import { getComments } from "../features/singlePostSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useComments = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(paramsId) => {
            dispatch(getComments(paramsId))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments']
            })
        }
    })
}

export default useComments