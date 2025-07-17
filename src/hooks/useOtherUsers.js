import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../features/appSlice";

const useOtherUsers = (uid) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['otherUsers', uid.loggedId, uid.currentId],
    queryFn: async () => {
      const result = await dispatch(getOtherUsers(uid)).unwrap(); // Assuming getOtherUsers is a thunk
      return result;
    },
    enabled: !!uid.loggedId && !!uid.currentId, // Only run if IDs are present
  });
};

export default useOtherUsers;