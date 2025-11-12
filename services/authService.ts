
import type { User } from '../types';

const USERS_KEY = 'ai_imager_users';
const CURRENT_USER_KEY = 'ai_imager_current_user';

const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signUp = (username: string, email: string, password: string):User | null => {
  const users = getUsers();
  const existingUser = users.find(user => user.email === email);
  
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    passwordHash: password, // In a real app, this should be a hash
  };

  users.push(newUser);
  saveUsers(users);
  
  // Automatically log in the user after sign up
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return newUser;
};

export const login = (email: string, password: string):User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.passwordHash === password);

  if (!user) {
    throw new Error('Invalid email or password.');
  }
  
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};
