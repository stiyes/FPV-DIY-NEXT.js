'use client';

import { useState, useEffect, useMemo } from 'react';
import { ComponentCard } from '@/components/fpv/ComponentCard';
import { FilterPanel } from '@/components/fpv/FilterPanel';
import { FPVComponent, FilterOptions, SortOption } from '@/types/fpv';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Grid3X3, 
  List, 
  ChevronLeft,
  ChevronRight,
  Cpu,
  Scale
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: '价格: 低到高' },
  { value: 'price-desc', label: '价格: 高到低' },
  { value: 'rating-desc', label: '评分: 高到低' },
  { value: 'newest', label: '最新上架' },
  { value: 'popular', label: '最受欢迎' },
];

interface ClientPageProps {
  initialComponents: FPVComponent[];
  brands: string[];
  scenes: string[];
  priceRange: { min: number; max: number };
}

export function ClientPage({ initialComponents, brands, scenes, priceRange }: ClientPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: priceRange,
    skillLevels: [],
    origins: [],
    scenes: [],
    inStockOnly: false,
  });
  const [detailComponent, setDetailComponent] = useState<FPVComponent | null>(null);

  const pageSize = 24;

  const levelLabels: Record<string, string> = {
    entry: '入门',
    intermediate: '进阶',
    advanced: '高级',
    professional: '专业',
  };

  // Apply filters and sorting
  const filteredComponents = useMemo(() => {
    let result = [...initialComponents];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.brand.toLowerCase().includes(query) ||
        c.sku.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(c => filters.categories.includes(c.category));
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(c => filters.brands.includes(c.brand));
    }

    // Apply skill level filter
    if (filters.skillLevels.length > 0) {
      result = result.filter(c => filters.skillLevels.includes(c.level));
    }

    // Apply origin filter
    if (filters.origins.length > 0) {
      result = result.filter(c => filters.origins.includes(c.origin));
    }

    // Apply scene filter
    if (filters.scenes && filters.scenes.length > 0) {
      result = result.filter(c => 
        c.scenes?.some(s => filters.scenes?.includes(s))
      );
    }

    // Apply price filter
    result = result.filter(c => 
      c.price >= filters.priceRange.min && c.price <= filters.priceRange.max
    );

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'popular':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    return result;
  }, [initialComponents, filters, sort, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredComponents.length / pageSize));

  // Reset page when filters change, and clamp to valid range
  useEffect(() => {
    setPage(1);
  }, [filters, sort, searchQuery]);

  useEffect(() => {
    if (page > totalPages && totalPages >= 1) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Paginate results
  const paginatedComponents = filteredComponents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleComponentClick = (component: FPVComponent) => {
    setDetailComponent(component);
  };

  return (
    <>
      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888]" />
          <Input
            placeholder="搜索部件名称、品牌、SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#12121a] border-[rgba(0,240,255,0.2)] text-white placeholder:text-[#666] focus:border-[#00f0ff] focus:ring-[#00f0ff]"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-40 bg-[#12121a] border-[rgba(0,240,255,0.2)] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a25] border-[rgba(0,240,255,0.2)]">
              {sortOptions.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="text-white hover:bg-[rgba(0,240,255,0.1)]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex bg-[#12121a] border border-[rgba(0,240,255,0.2)] rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[rgba(0,240,255,0.2)] text-[#00f0ff]' : 'text-[#888] hover:text-white'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[rgba(0,240,255,0.2)] text-[#00f0ff]' : 'text-[#888] hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          priceRange={priceRange}
          brands={brands}
          scenes={scenes}
        />

        {/* Component Grid */}
        <div className="flex-1">
          {filteredComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#888]">
              <Cpu className="w-16 h-16 mb-4 opacity-30" />
              <p>未找到匹配的部件</p>
              <p className="text-sm mt-1">请尝试调整筛选条件</p>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {paginatedComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onClick={handleComponentClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-[rgba(0,240,255,0.2)] text-white hover:bg-[rgba(0,240,255,0.1)] disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                      const pageNum = Math.min(startPage + i, totalPages);
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={page === pageNum
                            ? 'bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]'
                            : 'border-[rgba(0,240,255,0.2)] text-white hover:bg-[rgba(0,240,255,0.1)]'
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-[rgba(0,240,255,0.2)] text-white hover:bg-[rgba(0,240,255,0.1)] disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Results count */}
              <div className="text-center mt-4 text-sm text-[#888]">
                显示 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredComponents.length)} / {filteredComponents.length} 个部件
              </div>
            </>
          )}
        </div>
      </div>

      {/* Component Detail Dialog */}
      <Dialog open={!!detailComponent} onOpenChange={() => setDetailComponent(null)}>
        <DialogContent className="bg-[#12121a] border-[rgba(0,240,255,0.2)] max-w-lg max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {detailComponent?.name}
            </DialogTitle>
          </DialogHeader>
          {detailComponent && (
            <div className="space-y-4 mt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#888] text-sm">{detailComponent.brand}</p>
                  <p className="text-[#666] text-xs">{detailComponent.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#00f0ff]">¥{detailComponent.price}</p>
                  <Badge variant="outline" className="text-xs border-[#00ff88] text-[#00ff88]">
                    {levelLabels[detailComponent.level]}
                  </Badge>
                </div>
              </div>
              {detailComponent.specs && Object.keys(detailComponent.specs).length > 0 && (
                <div>
                  <p className="text-sm text-[#888] mb-2">规格参数</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(detailComponent.specs).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-1 rounded bg-[#0a0a0f] text-[#aaa] border border-[rgba(0,240,255,0.1)]"
                      >
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(detailComponent.weight || detailComponent.rating) && (
                <div className="flex gap-4 text-sm text-[#888]">
                  {detailComponent.weight && (
                    <span className="flex items-center gap-1">
                      <Scale className="w-4 h-4" />{detailComponent.weight}g
                    </span>
                  )}
                  {detailComponent.rating && (
                    <span>评分 {detailComponent.rating}</span>
                  )}
                </div>
              )}
              {detailComponent.scenes && detailComponent.scenes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {detailComponent.scenes.map((scene: string) => (
                    <span
                      key={scene}
                      className="text-xs px-2 py-0.5 rounded-full bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border border-[rgba(0,240,255,0.2)]"
                    >
                      {scene}
                    </span>
                  ))}
                </div>
              )}
              {detailComponent.remarks && (
                <p className="text-sm text-[#888]">{detailComponent.remarks}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
