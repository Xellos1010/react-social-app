// src/lib/appwrite/api.ts
import { ID, Query } from "appwrite";
import { IEmailUserAuthentication, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { createLogger } from '@/utils/logger';

const logger = createLogger('ApiService');

export async function createUserAccount(user: INewUser) {
    try {
        logger.info('Creating user account');
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });
        logger.info(`User account created with ID: ${newAccount.$id}`);
        return newUser;
    } catch (error) {
        logger.error('Error creating user account', error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        logger.info('Saving user to DB');
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            user,
        );
        logger.info('User saved to DB', newUser);
        return newUser;
    } catch (error) {
        logger.error('Error saving user to DB', error);
    }
}

export async function signInAccount(user: IEmailUserAuthentication) {
    try {
        logger.info('Signing in account');
        // Check if there's an existing session
        const sessions = await account.listSessions();

        // If there's at least one session, return the first one
        if (sessions.sessions.length > 0) {
            return sessions.sessions[0];
        }

        // If no sessions exist, create a new one
        const session = await account.createEmailPasswordSession(user.email, user.password);
        logger.info('Account signed in', session);
        return session;
    } catch (error) {
        logger.error('Error signing in account', error);
    }
}

export async function getCurrentUser() {
    try {
        logger.info('Getting current user');
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        logger.info('Current user retrieved', currentUser.documents[0]);
        return currentUser.documents[0];
    } catch (error) {
        logger.error('Error getting current user', error);
    }
}
