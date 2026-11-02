// Social Media/src/lib/appwrite/api.ts
import { ID, ImageGravity, Query } from "appwrite";
import { IEmailUserAuthentication, INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
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
        try {
            // Check if there's an existing session
            logger.info('Checking if Session Exists');
            const sessions = await account.listSessions();
            
            // If there's at least one session, return the first one
            if (sessions.sessions.length > 0) {
                logger.info('Existing session found', sessions.sessions[0]);
                return sessions.sessions[0];
            }
        } catch (listError) {
            logger.error('Error listing sessions', listError);
        }

        try {
            // If no sessions exist or listSessions failed, create a new session
            const session = await account.createEmailPasswordSession(user.email, user.password);
            logger.info('Account signed in', session);
            return session;
        } catch (createError) {
            logger.error('Error creating session', createError);
            throw createError;
        }

    } catch (finalError) {
        logger.error('Error signing in account', finalError);
        throw finalError;
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

export async function signOutAccount()
{
    try {
        logger.info('Signing out current session');
        const session = await account.deleteSession("current");
        logger.info('Successfully Signed out current session');
        return session
    } catch (error) {
        logger.error('Error signing out account', error);
    }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  