'use client';

import { useEffect, useState } from 'react';
import { FPVComponent, ComponentCategory } from '@/types/fpv';
import { 
  Database, 
  TrendingUp, 
  Package, 
  Star,
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

const categoryIcons: Record<string, React.ElementType> = {
  frame: Box,
  motor: Zap,
  propeller: Wind,
  esc: Cpu,
  fc: CircuitBoard,
  camera: Camera,
  vtx: Radio,
  antenna: Signal,
  receiver: Wifi,
  battery: Battery,
  goggle: Glasses,
  radio: Gamepad2,
  charger: Plug,
  accessory: Wrench,
};

const categoryLabels: Record<string, string> = {
  frame: '机架',
  motor: '电机',
  propeller: '桨叶',
  esc: '电调',
  fc: '飞控',
  camera: '摄像头',
  vtx: '图传',
  antenna: '天线',
  receiver: '接收机',
  battery: '电池',
  goggle: '眼镜',
  radio: '遥控器',
  charger: '充电器',
  accessory: '配件',
};

interface StatsPanelProps {
  components: FPVComponent[];
}

interface Stats {
  total: number;
  totalBrands: number;
  avgPrice: number;
  avgRating: number;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
  byOrigin: Record<string, number>;
}

export function StatsPanel({ components }: StatsPanelProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (components.length === 0) return;

    const total = components.length;
    const brands = new Set(components.map(c => c.brand));
    const avgPrice = components.reduce((sum, c) => sum + c.price, 0) / total;
    const avgRating = components.reduce((sum, c) => sum + (c.rating || 0), 0) / total;

    const byCategory: Record<string, number> = {};
    const byLevel: Record<string, number> = {};
    const byOrigin: Record<string, number> = {};

    components.forEach(c => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byLevel[c.level] = (byLevel[c.level] || 0) + 1;
      byOrigin[c.origin] = (byOrigin[c.origin] || 0) + 1;
    });

    setStats({
      total,
      totalBrands: brands.size,
      avgPrice,
      avgRating,
      byCategory,
      byLevel,
      byOrigin,
    });
  }, [components]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Components */}
      <div className="bg-gradient-to-br from-[#00f0ff20] to-[#00f0ff05] border border-[#00f0ff40] rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs text-[#888]">总部件数</span>
        </div>
        <p className="text-2xl font-bold text-[#00f0ff]">{stats.total}</p>
      </div>

      {/* Total Brands */}
      <div className="bg-gradient-to-br from-[#ff00a020] to-[#ff00a005] border border-[#ff00a040] rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-4 h-4 text-[#ff00a0]" />
          <span className="text-xs text-[#888]">品牌数量</span>
        </div>
        <p className="text-2xl font-bold text-[#ff00a0]">{stats.totalBrands}</p>
      </div>

      {/* Average Price */}
      <div className="bg-gradient-to-br from-[#00ff8820] to-[#00ff8805] border border-[#00ff8840] rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-[#888]">平均价格</span>
        </div>
        <p className="text-2xl font-bold text-[#00ff88]">¥{stats.avgPrice.toFixed(0)}</p>
      </div>

      {/* Average Rating */}
      <div className="bg-gradient-to-br from-[#ffaa0020] to-[#ffaa0005] border border-[#ffaa0040] rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-[#ffaa00]" />
          <span className="text-xs text-[#888]">平均评分</span>
        </div>
        <p className="text-2xl font-bold text-[#ffaa00]">{stats.avgRating.toFixed(1)}</p>
      </div>

      {/* Category counts */}
      {Object.entries(stats.byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([category, count]) => {
          const Icon = categoryIcons[category] || Wrench;
          return (
            <div 
              key={category}
              className="bg-[#12121a] border border-[rgba(0,240,255,0.15)] rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-[#888]" />
                <span className="text-xs text-[#888]">{categoryLabels[category]}</span>
              </div>
              <p className="text-xl font-bold text-white">{count}</p>
            </div>
          );
        })}
    </div>
  );
}
