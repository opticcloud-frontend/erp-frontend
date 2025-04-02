import { useAuth } from '../contexts/AuthContext';


export class ValidateToken{
   public static validate = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const { userData} = useAuth();
      
      try {
         const response = await fetch(apiUrl + 'auth/validate', {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + userData?.token
           },
         });
   
         if (response.status != 200) {
           return false
         }
       } catch (err) {
         console.error("erro ao validar token: " + err);
         return false
       }
       return true
   }
}
