import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api';
import { IEmailUserAuthentication, INewUser } from '@/types';

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