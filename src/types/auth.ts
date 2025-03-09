export interface User {
   id: string;
   email: string;
   name: string;
   role: string;
   created_at: string;
   updated_at: string;
   id_oticas: [];
   token: string;
 }
 
 type StatusType = Record<string, unknown>

 export interface AuthContextType {
   isAuthenticated: boolean;
   login: (user: User) => void;
   logout: (status?: StatusType) => void;
   userData: User | null;
 }