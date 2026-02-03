'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Wrench, 
  Users, 
  TrendingUp, 
  Plus,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FPVComponent } from '@/types/fpv';
import { adminGetComponents, adminDeleteComponent } from '@/lib/api';

const categoryLabels: Record<string, string> = {
  frame: '机架',
  motor: '电机',
  propeller: '桨叶',
  esc: '电调',
  fc: '飞控',
  flight_controller: '飞控',
  camera: '摄像头',
  vtx: '图传',
  antenna: '天线',
  receiver: '接收机',
  battery: '电池',
  goggle: '眼镜',
  goggles: '眼镜',
  radio: '遥控器',
  charger: '充电器',
  accessory: '配件',
  gps: 'GPS',
  tool: '工具',
};

const levelLabels: Record<string, string> = {
  entry: '入门',
  intermediate: '进阶',
  advanced: '高级',
  professional: '专业',
};

export default function AdminPage() {
  const [components, setComponents] = useState<FPVComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    loadComponents();
  }, [page, category, search]);

  async function loadComponents() {
    setLoading(true);
    const result = await adminGetComponents({
      category: category || undefined,
      search: search || undefined,
      page,
      pageSize,
    });
    setComponents(result.data);
    setTotal(result.meta?.total || 0);
    setTotalPages(result.meta?.totalPages || 1);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个部件吗？')) return;
    
    const success = await adminDeleteComponent(id);
    if (success) {
      loadComponents();
    } else {
      alert('删除失败');
    }
  }

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({ key, label }));

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[rgba(0,240,255,0.2)] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Cpu className="w-8 h-8 text-[#00f0ff]" />
              <div>
                <span className="text-xl font-bold text-white">FPV.DB</span>
                <span className="ml-2 text-sm text-[#888]">管理后台</span>
              </div>
            </div>
            <Link 
              href="/" 
              className="text-[#888] hover:text-[#00f0ff] transition-colors"
            >
              返回前台
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-[#00f0ff]" />
              <div>
                <p className="text-2xl font-bold text-white">{total}</p>
                <p className="text-xs text-[#888]">总部件</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-[#ff00a0]" />
              <div>
                <p className="text-2xl font-bold text-white">--</p>
                <p className="text-xs text-[#888]">装机方案</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-[#00ff88]" />
              <div>
                <p className="text-2xl font-bold text-white">--</p>
                <p className="text-xs text-[#888]">用户</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#ffaa00]" />
              <div>
                <p className="text-2xl font-bold text-white">--</p>
                <p className="text-xs text-[#888]">今日访问</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888]" />
            <Input
              placeholder="搜索部件..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#12121a] border-[rgba(0,240,255,0.2)] text-white"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#12121a] border border-[rgba(0,240,255,0.2)] text-white rounded-md px-4 py-2"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <Link href="/admin/components/new">
            <Button className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]">
              <Plus className="w-4 h-4 mr-2" />
              新增部件
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,240,255,0.1)]">
                <TableHead className="text-[#888]">ID</TableHead>
                <TableHead className="text-[#888]">名称</TableHead>
                <TableHead className="text-[#888]">品牌</TableHead>
                <TableHead className="text-[#888]">分类</TableHead>
                <TableHead className="text-[#888]">价格</TableHead>
                <TableHead className="text-[#888]">级别</TableHead>
                <TableHead className="text-[#888]">产地</TableHead>
                <TableHead className="text-[#888]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#888]">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : components.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#888]">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                components.map((c) => (
                  <TableRow key={c.id} className="border-b border-[rgba(0,240,255,0.05)]">
                    <TableCell className="text-[#666] text-sm">{c.id}</TableCell>
                    <TableCell className="text-white">{c.name}</TableCell>
                    <TableCell className="text-[#888]">{c.brand}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-[#00f0ff] text-[#00f0ff]">
                        {categoryLabels[c.category] || c.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#00f0ff]">¥{c.price}</TableCell>
                    <TableCell>
                      <span className="text-sm text-[#888]">
                        {levelLabels[c.level] || c.level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${
                          c.origin === 'domestic' 
                            ? 'border-[#ff3333] text-[#ff3333]' 
                            : 'border-[#00aaff] text-[#00aaff]'
                        }`}
                      >
                        {c.origin === 'domestic' ? '国产' : '国际'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#ff3333] text-[#ff3333]"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-[rgba(0,240,255,0.2)] text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-[#888]">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-[rgba(0,240,255,0.2)] text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
