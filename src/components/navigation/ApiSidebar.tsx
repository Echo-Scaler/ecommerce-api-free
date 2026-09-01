import React, { useState } from 'react';
import { 
  Package, 
  FolderTree, 
  ShoppingCart, 
  User, 
  Lock, 
  ShoppingBag, 
  Search, 
  BarChart2, 
  ChevronDown, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ApiModule } from '../../types/api';
import { MethodBadge } from '../common/MethodBadge';

interface ApiSidebarProps {
  modules: ApiModule[];
  selectedEndpointId: string | null;
  onSelectEndpoint: (endpointId: string) => void;
  onSelectOverview: () => void;
}

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'Package':
      return <Package size={17} className="module-icon text-blue-400" />;
    case 'FolderTree':
      return <FolderTree size={17} className="module-icon text-amber-400" />;
    case 'ShoppingCart':
      return <ShoppingCart size={17} className="module-icon text-emerald-400" />;
    case 'User':
      return <User size={17} className="module-icon text-indigo-400" />;
    case 'Lock':
      return <Lock size={17} className="module-icon text-purple-400" />;
    case 'ShoppingBag':
      return <ShoppingBag size={17} className="module-icon text-pink-400" />;
    case 'Search':
      return <Search size={17} className="module-icon text-cyan-400" />;
    case 'BarChart2':
      return <BarChart2 size={17} className="module-icon text-orange-400" />;
    default:
      return <Package size={17} className="module-icon" />;
  }
};

export const ApiSidebar: React.FC<ApiSidebarProps> = ({
  modules,
  selectedEndpointId,
  onSelectEndpoint,
  onSelectOverview,
}) => {
  // Initialize all modules as expanded by default
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((m) => {
      initial[m.id] = true;
    });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <nav className="api-sidebar-nav" aria-label="API Documentation Navigation">
      {/* Overview Button */}
      <div className="nav-section-header">GETTING STARTED</div>
      <button
        type="button"
        className={`nav-overview-btn ${selectedEndpointId === null ? 'active' : ''}`}
        onClick={onSelectOverview}
      >
        <BookOpen size={16} />
        <span>Platform Overview</span>
      </button>

      {/* Modules List */}
      <div className="nav-section-header" style={{ marginTop: '1.25rem' }}>
        API MODULES ({modules.length})
      </div>

      <div className="module-groups-list">
        {modules.map((module) => {
          const isExpanded = expandedModules[module.id] ?? true;
          const hasActiveEndpoint = module.endpoints.some((e) => e.id === selectedEndpointId);

          return (
            <div key={module.id} className={`module-group ${hasActiveEndpoint ? 'has-active-child' : ''}`}>
              {/* Module Header */}
              <button
                type="button"
                className="module-header-btn"
                onClick={() => toggleModule(module.id)}
                aria-expanded={isExpanded}
              >
                <div className="module-header-title">
                  {getModuleIcon(module.iconName)}
                  <span className="module-name">{module.name}</span>
                </div>
                <div className="module-header-meta">
                  <span className="module-count">{module.endpoints.length}</span>
                  {isExpanded ? (
                    <ChevronDown size={15} className="chevron-icon" />
                  ) : (
                    <ChevronRight size={15} className="chevron-icon" />
                  )}
                </div>
              </button>

              {/* Endpoint Items */}
              {isExpanded && (
                <div className="endpoints-list">
                  {module.endpoints.map((endpoint) => {
                    const isSelected = endpoint.id === selectedEndpointId;

                    return (
                      <button
                        key={endpoint.id}
                        type="button"
                        className={`endpoint-nav-item ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectEndpoint(endpoint.id)}
                        title={`${endpoint.method} ${endpoint.path} — ${endpoint.name}`}
                      >
                        <MethodBadge method={endpoint.method} size="sm" />
                        <span className="endpoint-name">{endpoint.name}</span>
                        <span className="endpoint-path-subtle">{endpoint.path.replace('/api/v1', '')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
