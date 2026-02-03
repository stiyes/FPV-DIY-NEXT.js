import { Header } from '@/components/fpv/Header';
import { BookOpen, Play, Clock, Eye, ChevronRight, Star, Wrench, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// 教程数据
const tutorials = [
  {
    id: 'tut-001',
    title: 'FPV穿越机入门指南',
    description: '从零开始了解FPV穿越机，包含基础概念、设备介绍和安全须知',
    level: 'entry',
    duration: '45分钟',
    views: 12560,
    rating: 4.9,
    steps: 8,
    completedSteps: 0,
    category: '入门',
    image: '📚',
  },
  {
    id: 'tut-002',
    title: '5寸机完整装机教程',
    description: '手把手教你组装一台5寸穿越机，从机架到飞控的完整流程',
    level: 'intermediate',
    duration: '2小时',
    views: 8932,
    rating: 4.8,
    steps: 15,
    completedSteps: 0,
    category: '装机',
    image: '🔧',
  },
  {
    id: 'tut-003',
    title: 'Betaflight调参详解',
    description: '深入了解Betaflight配置，PID调节和滤波器设置',
    level: 'advanced',
    duration: '1.5小时',
    views: 6543,
    rating: 4.7,
    steps: 12,
    completedSteps: 0,
    category: '调参',
    image: '⚙️',
  },
  {
    id: 'tut-004',
    title: '花飞技巧入门',
    description: '学习基础花飞动作：翻滚、俯冲、动力回环',
    level: 'intermediate',
    duration: '1小时',
    views: 10234,
    rating: 4.8,
    steps: 10,
    completedSteps: 0,
    category: '飞行',
    image: '🚁',
  },
  {
    id: 'tut-005',
    title: '电池安全与保养',
    description: '锂电池安全使用指南，充电、存储和运输注意事项',
    level: 'entry',
    duration: '30分钟',
    views: 15678,
    rating: 4.9,
    steps: 6,
    completedSteps: 0,
    category: '安全',
    image: '🔋',
  },
  {
    id: 'tut-006',
    title: '图传系统搭建',
    description: '模拟图传和数字图传的选择与安装配置',
    level: 'intermediate',
    duration: '50分钟',
    views: 5432,
    rating: 4.6,
    steps: 8,
    completedSteps: 0,
    category: '装机',
    image: '📡',
  },
];

// 快速入门步骤
const quickStartSteps = [
  { title: '了解基础知识', icon: BookOpen, description: '学习FPV基本概念和术语' },
  { title: '选择设备', icon: Cpu, description: '根据预算和需求选择合适配置' },
  { title: '组装调试', icon: Wrench, description: '按照教程完成装机和调参' },
  { title: '模拟器练习', icon: Play, description: '在模拟器中熟悉操控' },
  { title: '首飞准备', icon: Zap, description: '检查设备和飞行环境' },
];

const levelLabels: Record<string, { label: string; color: string }> = {
  entry: { label: '入门', color: '#00ff88' },
  intermediate: { label: '进阶', color: '#ffaa00' },
  advanced: { label: '高级', color: '#ff5500' },
  professional: { label: '专业', color: '#ff00a0' },
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#00f0ff]" />
            装机教程
          </h1>
          <p className="text-[#888]">
            从入门到精通，系统学习FPV穿越机的装机和飞行技巧
          </p>
        </div>

        {/* Quick Start */}
        <Card className="bg-gradient-to-r from-[rgba(0,240,255,0.1)] to-[rgba(255,0,160,0.1)] border-[rgba(0,240,255,0.2)] p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">快速入门指南</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickStartSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,240,255,0.2)] flex items-center justify-center mb-2">
                    <step.icon className="w-6 h-6 text-[#00f0ff]" />
                  </div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-[#888]">{step.description}</p>
                </div>
                {i < quickStartSteps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-6 -right-2 w-4 h-4 text-[#666]" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Safety Warning */}
        <Card className="bg-[rgba(255,51,51,0.1)] border-[rgba(255,51,51,0.3)] p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#ff3333] flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#ff3333]">安全提醒</h3>
              <p className="text-sm text-[#888]">
                FPV穿越机属于高速旋转设备，操作时请务必注意安全。请在开阔场地飞行，远离人群和建筑物。
                首次飞行建议在模拟器中练习，熟悉操控后再进行实飞。
              </p>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] bg-[rgba(0,240,255,0.1)]">
            全部教程
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            入门
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            装机
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            调参
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            飞行
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            安全
          </Button>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const levelInfo = levelLabels[tutorial.level];
            return (
              <Card key={tutorial.id} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] overflow-hidden group hover:border-[rgba(0,240,255,0.4)] transition-all">
                {/* Image Placeholder */}
                <div className="h-32 bg-gradient-to-br from-[rgba(0,240,255,0.1)] to-[rgba(255,0,160,0.1)] flex items-center justify-center text-4xl">
                  {tutorial.image}
                </div>
                
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className="text-[10px]"
                      style={{ borderColor: levelInfo.color + '40', color: levelInfo.color }}
                    >
                      {levelInfo.label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-[rgba(0,240,255,0.3)] text-[#00f0ff]">
                      {tutorial.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#00f0ff] transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-[#888] mb-3 line-clamp-2">{tutorial.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-[#666] mb-1">
                      <span>进度</span>
                      <span>{tutorial.completedSteps}/{tutorial.steps} 步骤</span>
                    </div>
                    <Progress 
                      value={(tutorial.completedSteps / tutorial.steps) * 100} 
                      className="h-1 bg-[#0a0a0f]"
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-[#888]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {tutorial.views.toLocaleString()}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[#ffaa00]">
                      <Star className="w-4 h-4" />
                      {tutorial.rating}
                    </span>
                  </div>
                </div>
                
                {/* Action */}
                <div className="px-4 py-3 border-t border-[rgba(0,240,255,0.1)]">
                  <Button className="w-full bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]">
                    <Play className="w-4 h-4 mr-2" />
                    开始学习
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Video Tutorials Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Play className="w-6 h-6 text-[#ff00a0]" />
            视频教程
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4 flex gap-4">
              <div className="w-32 h-20 bg-[#0a0a0f] rounded flex items-center justify-center text-2xl">
                🎬
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">电机焊接技巧</h3>
                <p className="text-sm text-[#888]">如何正确焊接电机线，避免虚焊和短路</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">12分钟</Badge>
                  <span className="text-xs text-[#666]">3.2K 播放</span>
                </div>
              </div>
            </Card>
            <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4 flex gap-4">
              <div className="w-32 h-20 bg-[#0a0a0f] rounded flex items-center justify-center text-2xl">
                🎬
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">PID调节实战</h3>
                <p className="text-sm text-[#888]">从理论到实践，手把手教你调PID</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">25分钟</Badge>
                  <span className="text-xs text-[#666]">5.6K 播放</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
