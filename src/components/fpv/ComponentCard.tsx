'use client';

import { FPVComponent } from '@/types/fpv';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
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
  Wrench,
  Star,
  Scale,
  MapPin
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  frame: Box,
  motor: Zap,
  propeller: Wind,
  esc: Cpu,
  fc: CircuitBoard,
  flight_controller: CircuitBoard,
  camera: Camera,
  vtx: Radio,
  antenna: Signal,
  receiver: Wifi,
  battery: Battery,
  goggle: Glasses,
  goggles: Glasses,
  radio: Gamepad2,
  charger: Plug,
  accessory: Wrench,
  gps: Signal,
  tool: Wrench,
};

const categoryColors: Record<string, string> = {
  frame: '#00f0ff',
  motor: '#ff00a0',
  propeller: '#00ff88',
  esc: '#ffaa00',
  fc: '#aa00ff',
  flight_controller: '#aa00ff',
  camera: '#ff5500',
  vtx: '#00aaff',
  antenna: '#ffdd00',
  receiver: '#00ffcc',
  battery: '#ff3333',
  goggle: '#aa66ff',
  goggles: '#aa66ff',
  radio: '#66aaff',
  charger: '#88ff00',
  accessory: '#cccccc',
  gps: '#00ffcc',
  tool: '#cccccc',
};

const levelLabels: Record<string, { label: string; color: string }> = {
  entry: { label: '入门', color: '#00ff88' },
  intermediate: { label: '进阶', color: '#ffaa00' },
  advanced: { label: '高级', color: '#ff5500' },
  professional: { label: '专业', color: '#ff00a0' },
};

const originLabels: Record<string, { label: string; color: string }> = {
  domestic: { label: '国产', color: '#ff3333' },
  international: { label: '国际', color: '#00aaff' },
};

interface ComponentCardProps {
  component: FPVComponent;
  onClick?: (component: FPVComponent) => void;
  isSelected?: boolean;
}

export function ComponentCard({ component, onClick, isSelected }: ComponentCardProps) {
  const Icon = categoryIcons[component.category] || Wrench;
  const categoryColor = categoryColors[component.category] || '#888';
  const levelInfo = levelLabels[component.level] || { label: component.level, color: '#888' };
  const originInfo = originLabels[component.origin] || { label: component.origin, color: '#888' };

  return (
    <Card
      onClick={() => onClick?.(component)}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 group
        ${isSelected 
          ? 'border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
          : 'border border-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.4)]'
        }
        bg-[#12121a] hover:bg-[#1a1a25]
      `}
    >
      {/* Holographic effect overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}08 0%, transparent 50%)`,
        }}
      />

      <div className="p-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${categoryColor}20 0%, ${categoryColor}10 100%)`,
                border: `1px solid ${categoryColor}40`
              }}
            >
              <Icon className="w-5 h-5" style={{ color: categoryColor }} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-[#00f0ff] transition-colors">
                {component.name}
              </h3>
              <p className="text-xs text-[#888]">{component.brand}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#00f0ff]">¥{component.price}</p>
            <p className="text-[10px] text-[#888]">{component.sku}</p>
          </div>
        </div>

        {/* Specs preview */}
        {component.specs && Object.keys(component.specs).length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {Object.entries(component.specs).slice(0, 3).map(([key, value]) => (
              <span 
                key={key} 
                className="text-[10px] px-2 py-0.5 rounded bg-[#0a0a0f] text-[#888] border border-[rgba(0,240,255,0.1)]"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {component.scenes && component.scenes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {component.scenes.slice(0, 3).map((scene) => (
              <span 
                key={scene}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border border-[rgba(0,240,255,0.2)]"
              >
                {scene}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,240,255,0.1)]">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-[10px] px-2 py-0.5"
              style={{ 
                borderColor: levelInfo.color + '40', 
                color: levelInfo.color,
                backgroundColor: levelInfo.color + '10'
              }}
            >
              {levelInfo.label}
            </Badge>
            <Badge 
              variant="outline" 
              className="text-[10px] px-2 py-0.5"
              style={{ 
                borderColor: originInfo.color + '40', 
                color: originInfo.color,
                backgroundColor: originInfo.color + '10'
              }}
            >
              {originInfo.label}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] text-[#888]">
            {component.weight && (
              <span className="flex items-center gap-1">
                <Scale className="w-3 h-3" />
                {component.weight}g
              </span>
            )}
            {component.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#ffaa00]" />
                {component.rating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
      )}
    </Card>
  );
}
