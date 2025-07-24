import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getNotifications } from "../features/appSlice";

const useNotifications = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
  
    return useMutation({
        mutationFn: async (uid) => {
            try {
                const result = await dispatch(getNotifications(uid)).unwrap();
                return result;
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                throw error; 
            }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['notifications'], data);
        },
        onError: (error) => {
            console.error('Notification fetch failed:', error);
        }
    });
};

export default useNotifications;