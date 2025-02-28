import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Header() {
   const { logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

    return (
      <nav className="bg-white shadow-sm">
         <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" mx-auto flex justify-between h-16">
               <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-blue-600">Sistema ERP</h1>
               </div>
               <div className="flex items-center">
                  <button
                     onClick={handleLogout}
                     className="ml-4 px-4 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-lg"
                     >
                     Sair
                  </button>
               </div>
            </div>
         </div>
      </nav>
    )
}
