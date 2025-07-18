import { useInfiniteQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getPosts } from '../features/postSlice';

const usePosts = () => {
  const dispatch = useDispatch();

  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await dispatch(getPosts({ page: pageParam })).unwrap();
      return result;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialData: { pages: [{ data: [], page: 1, hasNextPage: true }], pageParams: [1] },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: true,
  });
};

export default usePosts;