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

// Default user when no role is specified.
const defaultUser = teacherUser;

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProviderContent = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [user, setUser] = useState<User>(defaultUser);

  // This effect now correctly sets the user based on the role parameter
  // and persists that choice across navigations within the dashboard.
  useEffect(() => {
    if (role === 'student') {
      setUser(studentUser);
    } else if (role === 'teacher') {
      setUser(teacherUser);
    }
    // We only want this effect to run when the `role` URL parameter changes.
    // This prevents the user from being reset on every navigation.
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
