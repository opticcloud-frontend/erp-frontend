import {Sidebar} from '../../layout/Sidebar'

export function ProdutosPage() {

  return (
    <>
      <Sidebar/>
      <div className="min-h-screen bg-gray-50 flex-1">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <p>produtos</p>
        </main>
      </div>
    </>
  );
}