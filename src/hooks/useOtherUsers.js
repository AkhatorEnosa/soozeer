import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../features/appSlice";

const useOtherUsers = (uid) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['otherUsers', uid?.loggedId, uid?.currentId],
    queryFn: async () => {
      try {
        const result = await dispatch(getOtherUsers(uid)).unwrap();
        return result || [];
      } catch (error) {
        console.error('Failed to fetch other users:', error);
        throw error;
      }
    },
    initialData: [],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    enabled: Boolean(uid?.loggedId && uid?.currentId), 
    onError: (error) => {
      console.error('Failed to fetch other users:', error);
    }
  });
};

export default useOtherUsers;