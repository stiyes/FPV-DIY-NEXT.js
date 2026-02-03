'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Plus, 
  Save, 
  Share2, 
  Cpu, 
  Zap, 
  Wind, 
  Box,
  Battery,
  Glasses,
  Gamepad2,
  DollarSign,
  Scale,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FPVComponent } from '@/types/fpv';
import { getComponents, createBuild } from '@/lib/api';

interface BuildsClientProps {
  initialComponents: Record<string, FPVComponent[]>;
}

const categoryLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  frame: { label: '机架', icon: Box, color: '#00f0ff' },
  motor: { label: '电机', icon: Zap, color: '#ff00a0' },
  propeller: { label: '桨叶', icon: Wind, color: '#00ff88' },
  esc: { label: '电调', icon: Cpu, color: '#ffaa00' },
  fc: { label: '飞控', icon: Cpu, color: '#aa00ff' },
  camera: { label: '摄像头', icon: Box, color: '#ff5500' },
  vtx: { label: '图传', icon: Box, color: '#00aaff' },
  antenna: { label: '天线', icon: Box, color: '#ffdd00' },
  receiver: { label: '接收机', icon: Box, color: '#00ffcc' },
  battery: { label: '电池', icon: Battery, color: '#ff3333' },
  goggle: { label: '眼镜', icon: Glasses, color: '#aa66ff' },
  radio: { label: '遥控器', icon: Gamepad2, color: '#66aaff' },
};

const levelLabels: Record<string, string> = {
  entry: '入门',
  intermediate: '进阶',
  advanced: '高级',
  professional: '专业',
};

export default function BuildsClient({ initialComponents }: BuildsClientProps) {
  const [components, setComponents] = useState(initialComponents);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, FPVComponent | null>>({
    frame: null,
    motors: null,
    propellers: null,
    esc: null,
    fc: null,
    camera: null,
    vtx: null,
    antenna: null,
    receiver: null,
    battery: null,
    goggles: null,
    radio: null,
  });
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showSelector, setShowSelector] = useState<string | null>(null);
  const [buildName, setBuildName] = useState('');
  const [buildDescription, setBuildDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // 计算总价和总重
  const totalPrice = Object.values(selectedComponents)
    .filter(Boolean)
    .reduce((sum, c) => sum + (c?.price || 0), 0);
  
  const totalWeight = Object.values(selectedComponents)
    .filter(Boolean)
    .reduce((sum, c) => sum + (c?.weight || 0), 0);
  
  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;

  function handleSelectComponent(category: string, component: FPVComponent) {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component,
    }));
    setShowSelector(null);
  }

  function handleRemoveComponent(category: string) {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: null,
    }));
  }

  async function handleSaveBuild() {
    if (!buildName.trim()) {
      alert('请输入配置名称');
      return;
    }
    if (selectedCount === 0) {
      alert('请至少选择一个部件');
      return;
    }

    setSaving(true);
    
    const build: any = {
      name: buildName,
      description: buildDescription,
      components: selectedComponents,
      totalPrice,
      totalWeight,
      skillLevel: 'entry',
      tags: [],
      isPublic: false,
    };

    const result = await createBuild(build);
    
    if (result) {
      alert('配置保存成功！');
      setShowNewDialog(false);
      setBuildName('');
      setBuildDescription('');
    } else {
      alert('保存失败，请重试');
    }
    
    setSaving(false);
  }

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Wrench className="w-8 h-8 text-[#00f0ff]" />
              装机配置
            </h1>
            <p className="text-[#888]">
              自主搭配穿越机部件，保存和分享你的装机方案
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowNewDialog(true)}
              className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建配置
            </Button>
          </div>
        </div>
      </div>

      {/* Current Build Summary */}
      <Card className="bg-[#12121a] border-[rgba(0,240,255,0.2)] p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">当前装机方案</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#888] text-[#888]">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" size="sm" className="border-[#888] text-[#888]">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#888] mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">总价格</span>
            </div>
            <p className="text-2xl font-bold text-[#00f0ff]">¥{totalPrice}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#888] mb-1">
              <Scale className="w-4 h-4" />
              <span className="text-sm">总重量</span>
            </div>
            <p className="text-2xl font-bold text-[#00ff88]">{totalWeight}g</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#888] mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-sm">已选部件</span>
            </div>
            <p className="text-2xl font-bold text-[#ffaa00]">{selectedCount}/12</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#888] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">预计续航</span>
            </div>
            <p className="text-2xl font-bold text-[#aa00ff]">--</p>
          </div>
        </div>

        {/* Selected Components */}
        {selectedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-[rgba(0,240,255,0.1)]">
            <p className="text-sm text-[#888] mb-2">已选部件</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedComponents).map(([cat, comp]) => {
                if (!comp) return null;
                const config = categoryLabels[cat];
                const Icon = config?.icon || Box;
                return (
                  <div 
                    key={cat}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)]"
                  >
                    <Icon className="w-3 h-3" style={{ color: config?.color }} />
                    <span className="text-xs text-white">{comp.name}</span>
                    <button 
                      onClick={() => handleRemoveComponent(cat)}
                      className="text-[#888] hover:text-[#ff3333]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Component Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(components).map(([category, items]) => {
          const config = categoryLabels[category] || { label: category, icon: Box, color: '#888' };
          const Icon = config.icon;
          const selected = selectedComponents[category];
          
          return (
            <Card key={category} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{config.label}</h3>
                  <p className="text-xs text-[#888]">{items.length} 个选项</p>
                </div>
                {selected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#00f0ff]">{selected.name}</span>
                    <button 
                      onClick={() => handleRemoveComponent(category)}
                      className="text-[#888] hover:text-[#ff3333]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-[#00f0ff] text-[#00f0ff]"
                    onClick={() => setShowSelector(category)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {items.length > 0 ? (
                  items.slice(0, 3).map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] hover:bg-[rgba(0,240,255,0.05)] cursor-pointer transition-colors"
                      onClick={() => handleSelectComponent(category, item)}
                    >
                      <div>
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="text-xs text-[#888]">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#00f0ff]">¥{item.price}</p>
                        <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">
                          {levelLabels[item.level]}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#888] py-4">暂无数据</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Component Selector Dialog */}
      <Dialog open={!!showSelector} onOpenChange={() => setShowSelector(null)}>
        <DialogContent className="bg-[#12121a] border-[rgba(0,240,255,0.2)] max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              选择{showSelector ? categoryLabels[showSelector]?.label : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {showSelector && components[showSelector]?.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a0f] hover:bg-[rgba(0,240,255,0.1)] cursor-pointer transition-colors"
                onClick={() => handleSelectComponent(showSelector, item)}
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-[#888]">{item.brand}</p>
                  {item.specs && Object.entries(item.specs).slice(0, 2).map(([k, v]) => (
                    <span key={k} className="text-xs text-[#666] mr-2">{k}: {v}</span>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#00f0ff]">¥{item.price}</p>
                  <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">
                    {levelLabels[item.level]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Build Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="bg-[#12121a] border-[rgba(0,240,255,0.2)]">
          <DialogHeader>
            <DialogTitle className="text-white">新建装机配置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-[#888]">配置名称</label>
              <Input
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="如：我的第一台5寸机"
                className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[#888]">配置描述</label>
              <textarea
                value={buildDescription}
                onChange={(e) => setBuildDescription(e.target.value)}
                placeholder="简单描述一下这个配置..."
                className="w-full h-24 bg-[#0a0a0f] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="text-sm text-[#888]">当前选择</p>
              <p className="text-lg font-bold text-[#00f0ff]">{selectedCount} 个部件</p>
              <p className="text-sm text-[#888]">总价: ¥{totalPrice}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSaveBuild}
                disabled={saving}
                className="flex-1 bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
              >
                {saving ? '保存中...' : '保存配置'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewDialog(false)}
                className="border-[#888] text-[#888]"
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
