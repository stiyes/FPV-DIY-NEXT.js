import { Header } from '@/components/fpv/Header';
import { ComponentCard } from '@/components/fpv/ComponentCard';
import { FilterPanel } from '@/components/fpv/FilterPanel';
import { StatsPanel } from '@/components/fpv/StatsPanel';
import { loadComponents, getAllBrands, getAllScenes } from '@/lib/data';
import { FPVComponent, FilterOptions, SortOption } from '@/types/fpv';
import { ClientPage } from './ClientPage';

// 服务端数据获取
async function getData() {
  const components = await loadComponents();
  const brands = await getAllBrands();
  const scenes = await getAllScenes();
  
  const prices = components.map(c => c.price);
  const priceRange = {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
  
  return {
    components,
    brands,
    scenes,
    priceRange
  };
}

export default async function Home() {
  const data = await getData();
  
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="text-[#00f0ff]">FPV</span>穿越机部件数据库
          </h1>
          <p className="text-[#888]">
            专业的穿越机部件数据库 · {data.components.length}+ 部件 · 实时价格监控
          </p>
        </div>

        {/* Stats Panel */}
        <StatsPanel components={data.components} />

        {/* Client-side interactive content */}
        <ClientPage 
          initialComponents={data.components}
          brands={data.brands}
          scenes={data.scenes}
          priceRange={data.priceRange}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,240,255,0.1)] bg-[#0a0a0f] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#00f0ff] text-2xl font-bold">FPV.DB</span>
            </div>
            <p className="text-sm text-[#888]">
              © 2024 FPV穿越机部件数据库 · 数据仅供参考
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
