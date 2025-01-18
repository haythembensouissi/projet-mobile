import React, {createContext, useState} from 'react';

interface AuthContextType {
    user: any;
    logout: () => Promise<void>;
  }
  
  export const AuthContext = createContext<AuthContextType | null>(null);
  