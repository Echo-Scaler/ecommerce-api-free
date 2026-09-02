import React, { useState, useMemo } from 'react';
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
  BookOpen,
  SearchX,
  GraduationCap,
  SlidersHorizontal
} from 'lucide-react';
import { ApiModule } from '../../types/api';
import { MethodBadge } from '../common/MethodBadge';
import { ApiSearchInput } from './ApiSearchInput';
import { useLanguage } from '../../context/LanguageContext';

export type AppView = 'console' | 'docs' | 'learn';

interface ApiSidebarProps {
  modules: ApiModule[];
  selectedEndpointId: string | null;
  onSelectEndpoint: (endpointId: string) => void;
  onSelectOverview: () => void;
  currentView?: AppView;
  onSelectView?: (view: AppView) => void;
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
  currentView = 'console',
  onSelectView
}) => {
  const { t, isMyanmar } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter modules and endpoints dynamically based on search query
  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return modules;

    return modules
      .map((module) => {
        const isModuleMatch = module.name.toLowerCase().includes(query);
        const matchingEndpoints = module.endpoints.filter((endpoint) => {
          const nameMatch = endpoint.name.toLowerCase().includes(query);
          const pathMatch = endpoint.path.toLowerCase().includes(query);
          const methodMatch = endpoint.method.toLowerCase() === query || endpoint.method.toLowerCase().includes(query);
          const summaryMatch = endpoint.summary.toLowerCase().includes(query);
          const tagsMatch = endpoint.tags.some((t) => t.toLowerCase().includes(query));

          return nameMatch || pathMatch || methodMatch || summaryMatch || tagsMatch || isModuleMatch;
        });

        if (matchingEndpoints.length === 0) return null;

        return {
          ...module,
          endpoints: matchingEndpoints,
        };
      })
      .filter((m): m is ApiModule => m !== null);
  }, [modules, searchQuery]);

  const totalMatchingEndpoints = filteredModules.reduce((acc, m) => acc + m.endpoints.length, 0);

  return (
    <nav className="api-sidebar-nav" aria-label="API Documentation Navigation">
      {/* Search Bar Component */}
      <ApiSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t('searchPlaceholder')}
      />

      {/* Main Navigation Pages Section */}
      {!searchQuery && (
        <>
          <div className="nav-section-header">{isMyanmar ? 'အဓိက ကဏ္ဍများ' : 'NAVIGATION & PAGES'}</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
            {/* Console / Overview Button */}
            <button
              type="button"
              className={`nav-overview-btn ${currentView === 'console' && selectedEndpointId === null ? 'active' : ''}`}
              onClick={() => {
                if (onSelectView) onSelectView('console');
                onSelectOverview();
              }}
            >
              <SlidersHorizontal size={15} />
              <span>{t('overviewNav')}</span>
            </button>

            {/* Documentation Button */}
            <button
              type="button"
              className={`nav-overview-btn ${currentView === 'docs' ? 'active' : ''}`}
              onClick={() => {
                if (onSelectView) onSelectView('docs');
              }}
            >
              <BookOpen size={15} className="text-emerald-500" />
              <span>{t('navDocs')}</span>
            </button>

            {/* Learn Center Button */}
            <button
              type="button"
              className={`nav-overview-btn ${currentView === 'learn' ? 'active' : ''}`}
              onClick={() => {
                if (onSelectView) onSelectView('learn');
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <GraduationCap size={16} className="text-amber-500" />
                <span>{isMyanmar ? 'လေ့လာရန် စင်တာ' : 'Learning Center'}</span>
              </div>
              <span className="nav-tab-badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{isMyanmar ? 'တိုက်ရိုက်' : 'Live'}</span>
            </button>
          </div>
        </>
      )}

      {/* Modules List Header */}
      <div className="nav-section-header" style={{ marginTop: searchQuery ? '0.25rem' : '1rem' }}>
        {searchQuery ? (
          <div className="search-results-count">
            <span>{isMyanmar ? `ရလဒ်များ (${totalMatchingEndpoints})` : `RESULTS (${totalMatchingEndpoints})`}</span>
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-link" 
                onClick={() => setSearchQuery('')}
              >
                {t('resetBtn')}
              </button>
            )}
          </div>
        ) : (
          isMyanmar ? `API ကဏ္ဍများ (${modules.length})` : `API MODULES (${modules.length})`
        )}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 ? (
        <div className="sidebar-empty-search">
          <SearchX size={32} className="empty-search-icon" />
          <div className="empty-search-title">{t('noEndpointsFound')}</div>
          <div className="empty-search-subtitle">
            {isMyanmar ? (
              <>「<span className="font-mono">{searchQuery}</span>」နှင့် ကိုက်ညီသော API မရှိပါ</>
            ) : (
              <>No matches for &ldquo;<span className="font-mono">{searchQuery}</span>&rdquo;</>
            )}
          </div>
          <button
            type="button"
            className="empty-search-reset-btn"
            onClick={() => setSearchQuery('')}
          >
            {t('resetBtn')}
          </button>
        </div>
      ) : (
        <div className="module-groups-list">
          {filteredModules.map((module) => {
            // When searching, always expand groups
            const isExpanded = searchQuery ? true : (expandedModules[module.id] ?? true);
            const hasActiveEndpoint = module.endpoints.some((e) => e.id === selectedEndpointId);

            return (
              <div key={module.id} className={`module-group ${hasActiveEndpoint ? 'has-active-child' : ''}`}>
                {/* Module Header */}
                <button
                  type="button"
                  className="module-header-btn"
                  onClick={() => !searchQuery && toggleModule(module.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="module-header-title">
                    {getModuleIcon(module.iconName)}
                    <span className="module-name">{module.name}</span>
                  </div>
                  <div className="module-header-meta">
                    <span className="module-count">{module.endpoints.length}</span>
                    {!searchQuery && (
                      isExpanded ? (
                        <ChevronDown size={15} className="chevron-icon" />
                      ) : (
                        <ChevronRight size={15} className="chevron-icon" />
                      )
                    )}
                  </div>
                </button>

                {/* Endpoint Items */}
                {isExpanded && (
                  <div className="endpoints-list">
                    {module.endpoints.map((endpoint) => {
                      const isSelected = endpoint.id === selectedEndpointId && currentView === 'console';

                      return (
                        <button
                          key={endpoint.id}
                          type="button"
                          className={`endpoint-nav-item ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            if (onSelectView) onSelectView('console');
                            onSelectEndpoint(endpoint.id);
                          }}
                          title={`${endpoint.method} ${endpoint.path} — ${endpoint.name}`}
                        >
                          <MethodBadge method={endpoint.method} size="sm" />
                          <span className="endpoint-name">{endpoint.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};
