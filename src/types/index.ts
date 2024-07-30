export type IBaseUser = {
  email: string;
}

export type IEmailUserAuthentication = IBaseUser & {
  password: string;
}

export type INewUser = IEmailUserAuthentication & {
  name: string;
  username: string;
}

export type IUpdateUser = IBaseUser & {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
}

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
}

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
}

export type IUser = IBaseUser & {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  bio: string;
}

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}