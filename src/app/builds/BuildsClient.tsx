'use client';

import { useState, useEffect, useMemo } from 'react';
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
  X,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FPVComponent } from '@/types/fpv';
import { getComponents, createBuild } from '@/lib/api';

// 将组件分类 key 映射到 BuildConfiguration 格式
const categoryToBuildKey: Record<string, string> = {
  frame: 'frame',
  motor: 'motors',
  propeller: 'propellers',
  esc: 'esc',
  fc: 'fc',
  camera: 'camera',
  vtx: 'vtx',
  antenna: 'antenna',
  receiver: 'receiver',
  battery: 'battery',
  goggle: 'goggles',
  radio: 'radio',
};

// 检查配置兼容性，返回警告信息
function getCompatibilityWarnings(
  selected: Record<string, FPVComponent | null>
): string[] {
  const warnings: string[] = [];
  const frame = selected.frame;
  const motor = selected.motor;
  const propeller = selected.propeller;
  const esc = selected.esc;
  const battery = selected.battery;
  const fc = selected.fc;
  const camera = selected.camera;

  // 机架与桨叶尺寸匹配 (如 5寸架配5寸桨)
  if (frame && propeller && frame.specs && propeller.specs) {
    const frameSize = String(frame.specs['尺寸'] || frame.specs['寸'] || '').replace(/[^\d寸]/g, '');
    const propSize = String(propeller.specs['尺寸'] || propeller.specs['寸'] || propeller.specs['桨叶'] || '').replace(/[^\d寸]/g, '');
    if (frameSize && propSize && !frameSize.includes(propSize) && !propSize.includes(frameSize)) {
      warnings.push(`机架尺寸(${frameSize})与桨叶尺寸(${propSize})可能不匹配`);
    }
  }

  // 电机 KV 与电池 S 数建议 (高 KV 配低 S)
  if (motor && battery && motor.specs && battery.specs) {
    const kv = Number(motor.specs['KV'] || motor.specs['kv'] || 0);
    const cells = Number(battery.specs['S'] || battery.specs['s'] || battery.specs['节'] || 0);
    if (kv > 0 && cells > 0) {
      if (cells >= 6 && kv > 2000) {
        warnings.push(`6S 及以上电池配 ${kv}KV 电机可能过高，建议使用较低 KV`);
      }
      if (cells <= 2 && kv < 10000) {
        warnings.push(`2S 及以下电池配 ${kv}KV 电机可能动力不足`);
      }
    }
  }

  // 电调电流与电机
  if (esc && motor && esc.specs) {
    const escA = Number(esc.specs['电流'] || esc.specs['A'] || esc.specs['持续'] || 0);
    if (escA > 0 && escA < 35 && (motor.category === 'motor')) {
      const motorA = Number(motor.specs?.['最大电流'] || motor.specs?.['电流'] || 0);
      if (motorA > 0 && escA * 4 < motorA) {
        warnings.push(`电调 ${escA}A 可能不足以驱动电机`);
      }
    }
  }

  // 飞控安装孔与机架
  if (fc && frame && fc.specs && frame.specs) {
    const fcMount = String(fc.specs['安装'] || fc.specs['孔距'] || '');
    const frameMount = String(frame.specs['安装孔'] || frame.specs['飞控孔'] || '');
    if (fcMount && frameMount && !frameMount.includes(fcMount.replace(/[^\d.]/g, ''))) {
      warnings.push(`飞控安装孔距(${fcMount})与机架(${frameMount})可能不兼容`);
    }
  }

  // 摄像头电压与图传/飞控
  if (camera && camera.specs) {
    const voltage = String(camera.specs['电压'] || camera.specs['供电'] || '');
    if (voltage && !voltage.includes('5') && !voltage.includes('3.3')) {
      warnings.push(`摄像头供电需求(${voltage})请确认与飞控/图传匹配`);
    }
  }

  // 使用 compatibleWith 字段
  Object.entries(selected).forEach(([cat, comp]) => {
    if (!comp?.compatibleWith?.length) return;
    const others = Object.entries(selected).filter(([k, c]) => k !== cat && c);
    others.forEach(([_, other]) => {
      if (other && !comp.compatibleWith!.includes(other.id) && !comp.compatibleWith!.includes(other.sku)) {
        // 可选：严格模式下提示
      }
    });
  });

  return warnings;
}

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
    motor: null,
    propeller: null,
    esc: null,
    fc: null,
    camera: null,
    vtx: null,
    antenna: null,
    receiver: null,
    battery: null,
    goggle: null,
    radio: null,
  });
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showSelector, setShowSelector] = useState<string | null>(null);
  const [detailComponent, setDetailComponent] = useState<FPVComponent | null>(null);
  const [buildName, setBuildName] = useState('');
  const [buildDescription, setBuildDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // 从 API 拉取最新部件数据，与数据库保持一致
  useEffect(() => {
    getComponents().then((all) => {
      if (!all?.length) return;
      const byCategory: Record<string, FPVComponent[]> = {
        frame: [], motor: [], propeller: [], esc: [], fc: [], camera: [],
        vtx: [], antenna: [], receiver: [], battery: [], goggle: [], radio: [],
      };
      all.forEach((c) => {
        let cat = c.category;
        if (cat === 'flight_controller') cat = 'fc';
        if (cat === 'goggles') cat = 'goggle';
        if (byCategory[cat]) byCategory[cat].push(c);
      });
      setComponents(byCategory);
    });
  }, []);

  // 计算总价和总重
  const totalPrice = Object.values(selectedComponents)
    .filter(Boolean)
    .reduce((sum, c) => sum + (c?.price || 0), 0);
  
  const totalWeight = Object.values(selectedComponents)
    .filter(Boolean)
    .reduce((sum, c) => sum + (c?.weight || 0), 0);
  
  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
  const compatibilityWarnings = useMemo(
    () => getCompatibilityWarnings(selectedComponents),
    [selectedComponents]
  );

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
    const apiComponents: Record<string, FPVComponent | FPVComponent[] | undefined> = {};
    Object.entries(selectedComponents).forEach(([cat, comp]) => {
      if (!comp) return;
      const key = categoryToBuildKey[cat] ?? cat;
      apiComponents[key] = comp;
    });

    const build: any = {
      name: buildName,
      description: buildDescription,
      components: apiComponents,
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
      {/* Hero Section - Compact */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Wrench className="w-7 h-7 text-[#00f0ff]" />
          装机配置
        </h1>
        <p className="text-sm text-[#888] mt-1">
          自主搭配穿越机部件，保存和分享你的装机方案
        </p>
      </div>

      {/* Sticky Summary Bar - Always visible for quick save */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 mb-6 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-[rgba(0,240,255,0.15)]">
        <div className="flex flex-wrap items-center gap-4">
          {/* Stats - Compact inline */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-lg font-bold text-white">¥{totalPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00ff88]" />
              <span className="text-lg font-bold text-white">{totalWeight}g</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ffaa00]" />
              <span className="text-sm text-[#888]">{selectedCount}/12 部件</span>
            </div>
          </div>
          {/* Actions - Prominent save */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={() => setShowNewDialog(true)}
              size="sm"
              className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
            >
              <Save className="w-4 h-4 mr-1.5" />
              保存配置
            </Button>
            <Button variant="outline" size="sm" className="border-[#888] text-[#888]">
              <Share2 className="w-4 h-4 mr-1.5" />
              分享
            </Button>
          </div>
        </div>
        {/* Compatibility warnings */}
        {compatibilityWarnings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[rgba(255,170,0,0.3)]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {compatibilityWarnings.map((msg, i) => (
                  <span key={i} className="text-xs text-amber-400">{msg}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Selected components - Compact pills */}
        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[rgba(0,240,255,0.1)]">
            {Object.entries(selectedComponents).map(([cat, comp]) => {
              if (!comp) return null;
              const config = categoryLabels[cat];
              const Icon = config?.icon || Box;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)]"
                >
                  <Icon className="w-3 h-3 shrink-0" style={{ color: config?.color }} />
                  <span className="text-xs text-white truncate max-w-[80px]">{comp.name}</span>
                  <button
                    onClick={() => handleRemoveComponent(cat)}
                    className="text-[#888] hover:text-[#ff3333] shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Component Selection - Denser grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(components).map(([category, items]) => {
          const config = categoryLabels[category] || { label: category, icon: Box, color: '#888' };
          const Icon = config.icon;
          const selected = selectedComponents[category];
          
          return (
            <Card key={category} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-3">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{config.label}</h3>
                  <p className="text-xs text-[#888]">{items.length} 个选项</p>
                </div>
                {selected ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs text-[#00f0ff] truncate max-w-[100px]">{selected.name}</span>
                    <button
                      onClick={() => handleRemoveComponent(category)}
                      className="text-[#888] hover:text-[#ff3333] shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#00f0ff] text-[#00f0ff] h-7 px-2 shrink-0"
                    onClick={() => setShowSelector(category)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                {items.length > 0 ? (
                  items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md bg-[#0a0a0f] hover:bg-[rgba(0,240,255,0.05)] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{item.name}</p>
                        <p className="text-xs text-[#888]">{item.brand}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <p className="text-sm font-semibold text-[#00f0ff]">¥{item.price}</p>
                        <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">
                          {levelLabels[item.level]}
                        </Badge>
                        <button
                          onClick={() => setDetailComponent(item)}
                          className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[rgba(0,240,255,0.1)]"
                          title="查看详情"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSelectComponent(category, item)}
                          className="p-1.5 rounded text-[#00f0ff] hover:bg-[rgba(0,240,255,0.15)]"
                          title="加入配置"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : null}
                {items.length > 5 && (
                  <button
                    onClick={() => setShowSelector(category)}
                    className="w-full py-2 text-xs text-[#00f0ff] hover:bg-[rgba(0,240,255,0.05)] rounded-md transition-colors"
                  >
                    查看更多 ({items.length - 5} 个)
                  </button>
                )}
                {items.length === 0 && (
                  <p className="text-center text-[#888] py-3 text-sm">暂无数据</p>
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
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#0a0a0f] hover:bg-[rgba(0,240,255,0.05)] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-[#888]">{item.brand}</p>
                  {item.specs && Object.entries(item.specs).slice(0, 2).map(([k, v]) => (
                    <span key={k} className="text-xs text-[#666] mr-2">{k}: {v}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-lg font-bold text-[#00f0ff]">¥{item.price}</p>
                  <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">
                    {levelLabels[item.level]}
                  </Badge>
                  <button
                    onClick={() => { setDetailComponent(item); setShowSelector(null); }}
                    className="p-2 rounded text-[#888] hover:text-white hover:bg-[rgba(0,240,255,0.1)]"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Button
                    size="sm"
                    onClick={() => handleSelectComponent(showSelector, item)}
                    className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    加入
                  </Button>
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
              {detailComponent.remarks && (
                <p className="text-sm text-[#888]">{detailComponent.remarks}</p>
              )}
              <div className="pt-2 flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
                  onClick={() => {
                    const cat = detailComponent.category === 'flight_controller' ? 'fc' : detailComponent.category === 'goggles' ? 'goggle' : detailComponent.category;
                    if (categoryLabels[cat]) {
                      handleSelectComponent(cat, detailComponent);
                      setDetailComponent(null);
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  加入配置
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
