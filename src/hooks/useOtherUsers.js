import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../features/appSlice";

const useOtherUsers = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(uid) => {
            dispatch(getOtherUsers(uid))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            })
        }
    })
}

export default useOtherUsers