import { Header } from '@/components/fpv/Header';
import { loadComponents } from '@/lib/data';
import { FPVComponent } from '@/types/fpv';
import BuildsClient from './BuildsClient';

// 获取各类别部件
async function getComponentsByCategory() {
  const components = await loadComponents();
  
  const byCategory: Record<string, FPVComponent[]> = {
    frame: [],
    motor: [],
    propeller: [],
    esc: [],
    fc: [],
    camera: [],
    vtx: [],
    antenna: [],
    receiver: [],
    battery: [],
    goggle: [],
    radio: [],
  };
  
  components.forEach(c => {
    // 将flight_controller映射到fc，goggles映射到goggle
    let cat = c.category;
    if (cat === 'flight_controller') cat = 'fc';
    if (cat === 'goggles') cat = 'goggle';
    
    if (byCategory[cat]) {
      byCategory[cat].push(c);
    }
  });
  
  // 每个类别只取前5个作为示例
  Object.keys(byCategory).forEach(key => {
    byCategory[key] = byCategory[key].slice(0, 5);
  });
  
  return byCategory;
}

export default async function BuildsPage() {
  const componentsByCategory = await getComponentsByCategory();
  
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BuildsClient initialComponents={componentsByCategory} />
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
