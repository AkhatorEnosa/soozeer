import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getNotifications } from "../features/appSlice";

const useNotifications = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(uid) => {
            dispatch(getNotifications(uid))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications']
            })
        }
    })
}

export default useNotifications