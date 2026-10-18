// Social Media/src/lib/react-query/queriesAndMutations.ts
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createUserAccount, signInAccount, signOutAccount, createPost } from '../appwrite/api';
import { IEmailUserAuthentication, INewPost, INewUser } from '@/types';
// import { QUERY_KEYS } from './queryKeys';

export const userCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: IEmailUserAuthentication) => signInAccount(user)
    });
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: () => signOutAccount()
    });
}

export const useCreatePost = () => {
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
    });
  };