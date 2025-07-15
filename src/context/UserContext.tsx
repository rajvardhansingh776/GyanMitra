// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

interface User {
  fullName: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  updateUser: (newUserData: Partial<User>) => void;
}

const teacherUser: User = {
  fullName: "Bharat Sir",
  email: "bharat.teacher@example.com",
  avatar: "https://placehold.co/128x128.png",
};

const studentUser: User = {
    fullName: "Raj Singh",
    email: "raj.singh@example.com",
    avatar: "https://placehold.co/128x128.png",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProviderContent = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // Set the initial user based on the role only once.
  const getInitialUser = () => {
    // Default to teacher if role is not specified, but this should be less of an issue now.
    return role === 'student' ? studentUser : teacherUser;
  };

  const [user, setUser] = useState<User>(getInitialUser);

  // This effect runs once on initial load if the role parameter exists,
  // and it won't re-run on every navigation anymore, making the state persistent.
  useEffect(() => {
    const initialUser = getInitialUser();
    setUser(initialUser);
  }, [role]);


  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}


export const UserProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProviderContent>{children}</UserProviderContent>
    </Suspense>
  )
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
