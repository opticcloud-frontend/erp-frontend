import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Receipt, Truck, Settings, Menu, ChevronDown, ChevronRight, UserPlus, PackagePlus, ShoppingBag, ReceiptText, Truck as TruckLoading } from 'lucide-react';

type MenuItem = {
  icon: React.ElementType;
  text: string;
  path?: string;
  subMenus?: SubMenuItem[];
};

type SubMenuItem = {
  icon: React.ElementType;
  text: string;
  path: string;
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
    { 
      icon: Users, 
      text: 'Clientes', 
      subMenus: [
        { icon: Users, text: 'Consultar Clientes', path: '/clientes' },
        { icon: UserPlus, text: 'Cadastrar Cliente', path: '/clientes/cadastrar' }
      ]
    },
    { 
      icon: Package, 
      text: 'Produtos', 
      subMenus: [
        { icon: Package, text: 'Consultar Produtos', path: '/produtos' },
        { icon: PackagePlus, text: 'Cadastrar Produto', path: '/produtos/cadastrar' }
      ]
    },
    { 
      icon: ShoppingCart, 
      text: 'Vendas', 
      subMenus: [
        { icon: ShoppingCart, text: 'Consultar Vendas', path: '/vendas' },
        { icon: ShoppingBag, text: 'Cadastrar Venda', path: '/vendas/cadastrar' }
      ]
    },
    { 
      icon: Receipt, 
      text: 'Despesas', 
      subMenus: [
        { icon: Receipt, text: 'Consultar Despesas', path: '/despesas' },
        { icon: ReceiptText, text: 'Cadastrar Despesa', path: '/despesas/cadastrar' }
      ]
    },
    { 
      icon: Truck, 
      text: 'Fornecedores', 
      subMenus: [
        { icon: Truck, text: 'Consultar Fornecedores', path: '/fornecedores' },
        { icon: TruckLoading, text: 'Cadastrar Fornecedor', path: '/fornecedores/cadastrar' }
      ]
    },
    { 
      icon: Truck, 
      text: 'Oftalmologista', 
      subMenus: [
        { icon: Truck, text: 'Consultar Oftalmologista', path: '/oftalmologista' },
        { icon: TruckLoading, text: 'Cadastrar Oftalmologista', path: '/oftamologista/cadastrar' }
      ]
    },
    { icon: Settings, text: 'Configurações', path: '/configuracoes' },
  ];

  const toggleMenu = (menuText: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedMenus({ ...expandedMenus, [menuText]: true });
    } else {
      setExpandedMenus({
        ...expandedMenus,
        [menuText]: !expandedMenus[menuText]
      });
    }
  };

  return (
    <nav className={`h-full bg-gray-800 text-white flex flex-col shrink-0 transition-all duration-300 max-w-full ${isCollapsed ? 'w-20' : 'w-60'}`}>
      {/* Header with toggle button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && <span className="text-lg font-semibold">Sistema ERP</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-700 rounded-lg"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <li key={item.text} className="mb-1">
            {item.subMenus ? (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.text)}
                  className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full ${expandedMenus[item.text] ? 'bg-gray-700' : ''}`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'justify-between w-full'}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.text}</span>}
                    </div>
                    {!isCollapsed && (
                      expandedMenus[item.text] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </div>
                </button>
                
                {expandedMenus[item.text] && !isCollapsed && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {item.subMenus.map((subItem) => (
                      <li key={subItem.path}>
                        <Link to={subItem.path} className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors space-x-3">
                          <subItem.icon size={18} />
                          <span className="text-sm">{subItem.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link to={item.path || '#'}>
                <div className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.text}</span>}
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}