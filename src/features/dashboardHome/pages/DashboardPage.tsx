import { Header } from '../../../components/layout/Header';
import {Sidebar} from '../../../components/layout/Sidebar'

export function DashboardPage() {

  return (
    <div className='flex w-full'> 
      <Sidebar/>
      <div className="min-h-screen bg-gray-50 flex-1">
        <Header/>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Conteúdo do dashboard virá aqui</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}