import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { searchedPostQuery } from "../features/postSlice";
import { searchedUserQuery } from "../features/appSlice";

const useSearchQuery = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
  
    return useMutation({
        mutationFn: async(params) => {
            dispatch(searchedPostQuery(params))
            dispatch(searchedUserQuery(params))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['results']
            })
        }
    })
}

export default useSearchQuery