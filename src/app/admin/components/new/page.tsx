'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminCreateComponent } from '@/lib/api';

const categories = [
  { value: 'frame', label: '机架' },
  { value: 'motor', label: '电机' },
  { value: 'propeller', label: '桨叶' },
  { value: 'esc', label: '电调' },
  { value: 'flight_controller', label: '飞控' },
  { value: 'camera', label: '摄像头' },
  { value: 'vtx', label: '图传' },
  { value: 'antenna', label: '天线' },
  { value: 'receiver', label: '接收机' },
  { value: 'battery', label: '电池' },
  { value: 'goggles', label: '眼镜' },
  { value: 'radio', label: '遥控器' },
  { value: 'charger', label: '充电器' },
  { value: 'accessory', label: '配件' },
  { value: 'gps', label: 'GPS' },
];

const levels = [
  { value: 'entry', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' },
  { value: 'professional', label: '专业' },
];

const origins = [
  { value: 'domestic', label: '国产' },
  { value: 'international', label: '国际' },
];

export default function NewComponentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    brand: '',
    category: 'frame',
    price: '',
    level: 'entry',
    origin: 'domestic',
    weight: '',
    specs: '{}',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        ...formData,
        price: parseFloat(formData.price),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        specs: JSON.parse(formData.specs || '{}'),
        rating: 0,
        reviewCount: 0,
        scenes: [],
        inStock: true,
      };

      const result = await adminCreateComponent(data);
      if (result) {
        router.push('/admin');
      } else {
        alert('创建失败');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请检查数据格式');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[rgba(0,240,255,0.2)] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin" className="text-[#888] hover:text-[#00f0ff] flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              返回
            </Link>
            <h1 className="ml-4 text-xl font-bold text-white">新增部件</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#888]">SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="如: FR-GEP-Mark5"
                  className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#888]">名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如: Mark5 V2"
                  className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#888]">品牌</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="如: GEPRC"
                  className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#888]">价格 (¥)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="如: 458"
                  className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[#888]">分类</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-3 py-2"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#888]">级别</Label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-3 py-2"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#888]">产地</Label>
                <select
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-3 py-2"
                >
                  {origins.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#888]">重量 (g)</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="如: 118"
                className="bg-[#0a0a0f] border-[rgba(0,240,255,0.2)] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#888]">规格参数 (JSON格式)</Label>
              <textarea
                value={formData.specs}
                onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                placeholder='{"轴距": "225mm", "材质": "碳纤维"}'
                className="w-full h-32 bg-[#0a0a0f] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-3 py-2 font-mono text-sm"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? '保存中...' : '保存'}
              </Button>
              <Link href="/admin">
                <Button variant="outline" className="border-[#888] text-[#888]">
                  取消
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
