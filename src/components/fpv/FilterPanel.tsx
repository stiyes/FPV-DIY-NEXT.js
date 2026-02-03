'use client';

import { useState } from 'react';
import { 
  ComponentCategory, 
  SkillLevel, 
  Origin, 
  FilterOptions 
} from '@/types/fpv';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Filter, 
  RotateCcw, 
  ChevronDown,
  Box,
  Zap,
  Wind,
  Cpu,
  CircuitBoard,
  Camera,
  Radio,
  Signal,
  Wifi,
  Battery,
  Glasses,
  Gamepad2,
  Plug,
  Wrench
} from 'lucide-react';

// 分类映射 - 支持多种category值映射到同一个UI分类
const categoryMapping: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  frame: { label: '机架', icon: Box, color: '#00f0ff' },
  motor: { label: '电机', icon: Zap, color: '#ff00a0' },
  propeller: { label: '桨叶', icon: Wind, color: '#00ff88' },
  esc: { label: '电调', icon: Cpu, color: '#ffaa00' },
  fc: { label: '飞控', icon: CircuitBoard, color: '#aa00ff' },
  flight_controller: { label: '飞控', icon: CircuitBoard, color: '#aa00ff' },
  camera: { label: '摄像头', icon: Camera, color: '#ff5500' },
  vtx: { label: '图传', icon: Radio, color: '#00aaff' },
  antenna: { label: '天线', icon: Signal, color: '#ffdd00' },
  receiver: { label: '接收机', icon: Wifi, color: '#00ffcc' },
  battery: { label: '电池', icon: Battery, color: '#ff3333' },
  goggle: { label: '眼镜', icon: Glasses, color: '#aa66ff' },
  goggles: { label: '眼镜', icon: Glasses, color: '#aa66ff' },
  radio: { label: '遥控器', icon: Gamepad2, color: '#66aaff' },
  charger: { label: '充电器', icon: Plug, color: '#88ff00' },
  accessory: { label: '配件', icon: Wrench, color: '#cccccc' },
  gps: { label: 'GPS', icon: Signal, color: '#00ffcc' },
  tool: { label: '工具', icon: Wrench, color: '#cccccc' },
};

const categories = Object.entries(categoryMapping).map(([id, config]) => ({
  id: id as ComponentCategory,
  ...config,
}));

const skillLevels: { id: SkillLevel; label: string; color: string }[] = [
  { id: 'entry', label: '入门', color: '#00ff88' },
  { id: 'intermediate', label: '进阶', color: '#ffaa00' },
  { id: 'advanced', label: '高级', color: '#ff5500' },
  { id: 'professional', label: '专业', color: '#ff00a0' },
];

const origins: { id: Origin; label: string; color: string }[] = [
  { id: 'domestic', label: '国产', color: '#ff3333' },
  { id: 'international', label: '国际', color: '#00aaff' },
];

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  priceRange: { min: number; max: number };
  brands: string[];
  scenes: string[];
}

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  priceRange, 
  brands, 
  scenes 
}: FilterPanelProps) {
  const [localPriceRange, setLocalPriceRange] = useState([priceRange.min, priceRange.max]);

  const handleCategoryToggle = (category: ComponentCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSkillLevelToggle = (level: SkillLevel) => {
    const newLevels = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter(l => l !== level)
      : [...filters.skillLevels, level];
    onFilterChange({ ...filters, skillLevels: newLevels });
  };

  const handleOriginToggle = (origin: Origin) => {
    const newOrigins = filters.origins.includes(origin)
      ? filters.origins.filter(o => o !== origin)
      : [...filters.origins, origin];
    onFilterChange({ ...filters, origins: newOrigins });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleSceneToggle = (scene: string) => {
    const newScenes = filters.scenes?.includes(scene)
      ? filters.scenes.filter(s => s !== scene)
      : [...(filters.scenes || []), scene];
    onFilterChange({ ...filters, scenes: newScenes });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value);
    onFilterChange({ 
      ...filters, 
      priceRange: { min: value[0], max: value[1] } 
    });
  };

  const handleReset = () => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      skillLevels: [],
      origins: [],
      scenes: [],
      inStockOnly: false,
    });
  };

  const activeFilterCount = 
    filters.categories.length +
    filters.brands.length +
    filters.skillLevels.length +
    filters.origins.length +
    (filters.scenes?.length || 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange.min !== priceRange.min || filters.priceRange.max !== priceRange.max ? 1 : 0);

  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-[#12121a] border border-[rgba(0,240,255,0.15)] rounded-lg p-4 sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="font-semibold text-white">筛选条件</h2>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#00f0ff] text-[#0a0a0f] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[#888] hover:text-[#ff00a0] hover:bg-[rgba(255,0,160,0.1)]"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
          )}
        </div>

        <Accordion type="multiple" defaultValue={['categories', 'price', 'level']} className="space-y-2">
          {/* Categories */}
          <AccordionItem value="categories" className="border-0">
            <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
              部件分类
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all
                      ${filters.categories.includes(cat.id)
                        ? 'bg-[rgba(0,240,255,0.2)] text-[#00f0ff] border border-[#00f0ff]'
                        : 'text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                      }
                    `}
                  >
                    <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price" className="border-0">
            <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
              价格区间
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-2 py-2">
                <Slider
                  value={localPriceRange}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={10}
                  onValueChange={handlePriceChange}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-[#888]">
                  <span>¥{localPriceRange[0]}</span>
                  <span>¥{localPriceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skill Level */}
          <AccordionItem value="level" className="border-0">
            <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
              入门级别
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {skillLevels.map((level) => (
                  <label
                    key={level.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <Checkbox
                      checked={filters.skillLevels.includes(level.id)}
                      onCheckedChange={() => handleSkillLevelToggle(level.id)}
                      className="border-[rgba(0,240,255,0.3)] data-[state=checked]:bg-[#00f0ff] data-[state=checked]:border-[#00f0ff]"
                    />
                    <span className="text-xs" style={{ color: level.color }}>{level.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Origin */}
          <AccordionItem value="origin" className="border-0">
            <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
              产地
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {origins.map((origin) => (
                  <label
                    key={origin.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <Checkbox
                      checked={filters.origins.includes(origin.id)}
                      onCheckedChange={() => handleOriginToggle(origin.id)}
                      className="border-[rgba(0,240,255,0.3)] data-[state=checked]:bg-[#00f0ff] data-[state=checked]:border-[#00f0ff]"
                    />
                    <span className="text-xs" style={{ color: origin.color }}>{origin.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands */}
          {brands.length > 0 && (
            <AccordionItem value="brands" className="border-0">
              <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
                品牌 ({brands.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
                    >
                      <Checkbox
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                        className="border-[rgba(0,240,255,0.3)] data-[state=checked]:bg-[#00f0ff] data-[state=checked]:border-[#00f0ff]"
                      />
                      <span className="text-xs text-[#888]">{brand}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Scenes */}
          {scenes.length > 0 && (
            <AccordionItem value="scenes" className="border-0">
              <AccordionTrigger className="text-sm text-white hover:text-[#00f0ff] py-2">
                适用场景
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {scenes.map((scene) => (
                    <button
                      key={scene}
                      onClick={() => handleSceneToggle(scene)}
                      className={`
                        px-2 py-1 rounded text-xs transition-all
                        ${filters.scenes?.includes(scene)
                          ? 'bg-[rgba(0,240,255,0.2)] text-[#00f0ff] border border-[#00f0ff]'
                          : 'text-[#888] hover:text-white bg-[rgba(255,255,255,0.05)]'
                        }
                      `}
                    >
                      {scene}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* In Stock */}
          <div className="pt-2 border-t border-[rgba(0,240,255,0.1)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => 
                  onFilterChange({ ...filters, inStockOnly: checked as boolean })
                }
                className="border-[rgba(0,240,255,0.3)] data-[state=checked]:bg-[#00f0ff] data-[state=checked]:border-[#00f0ff]"
              />
              <span className="text-sm text-[#888]">仅显示有货</span>
            </label>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
