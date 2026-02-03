import { Header } from '@/components/fpv/Header';
import { loadComponents } from '@/lib/data';
import { Users, Heart, Eye, Share2, MessageCircle, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// 模拟社区配置数据
const mockCommunityBuilds = [
  {
    id: 'build-001',
    name: '入门级5寸花飞配置',
    author: { name: 'FPV新手', avatar: '' },
    description: '适合新手的性价比配置，耐炸好修',
    components: ['Mark4机架', '2207电机', 'F4飞控', 'Caddx摄像头'],
    totalPrice: 2500,
    totalWeight: 450,
    likes: 328,
    views: 2156,
    comments: 45,
    tags: ['入门', '花飞', '性价比'],
    createdAt: '2024-01-15',
  },
  {
    id: 'build-002',
    name: '竞速专用轻量化配置',
    author: { name: 'SpeedDemon', avatar: '' },
    description: '极致轻量化设计，专为竞速打造',
    components: ['Evoque F5D', 'XING2电机', 'F7飞控', 'DJI O3'],
    totalPrice: 6800,
    totalWeight: 380,
    likes: 892,
    views: 5632,
    comments: 128,
    tags: ['竞速', '轻量化', '高端'],
    createdAt: '2024-01-10',
  },
  {
    id: 'build-003',
    name: '7寸远航拍摄配置',
    author: { name: 'CinePilot', avatar: '' },
    description: '长续航7寸机，适合拍摄和远航',
    components: ['Recon7机架', '2807电机', 'F7飞控', 'GoPro挂载'],
    totalPrice: 4200,
    totalWeight: 850,
    likes: 567,
    views: 3421,
    comments: 89,
    tags: ['远航', '拍摄', '7寸'],
    createdAt: '2024-01-08',
  },
  {
    id: 'build-004',
    name: '室内3寸Cinewhoop',
    author: { name: 'IndoorFlyer', avatar: '' },
    description: '静音设计，适合室内拍摄',
    components: ['CineLog机架', '1404电机', 'F4飞控', '裸狗挂载'],
    totalPrice: 1800,
    totalWeight: 180,
    likes: 423,
    views: 2890,
    comments: 56,
    tags: ['室内', '3寸', '静音'],
    createdAt: '2024-01-05',
  },
  {
    id: 'build-005',
    name: '专业竞速赛级配置',
    author: { name: 'RacePro', avatar: '' },
    description: '赛级配置，多次比赛验证',
    components: ['TBS Source', 'F80电机', 'F7飞控', 'TBS图传'],
    totalPrice: 8500,
    totalWeight: 365,
    likes: 1245,
    views: 8901,
    comments: 234,
    tags: ['竞速', '赛级', '专业'],
    createdAt: '2024-01-01',
  },
  {
    id: 'build-006',
    name: '新手入门套装推荐',
    author: { name: 'DroneTeacher', avatar: '' },
    description: '完整套装，到手即飞',
    components: ['TinyHawk', '自带电机', 'AIO飞控', '模拟图传'],
    totalPrice: 1200,
    totalWeight: 45,
    likes: 2156,
    views: 12345,
    comments: 456,
    tags: ['入门', '套装', '到手飞'],
    createdAt: '2023-12-28',
  },
];

const sortOptions = [
  { value: 'popular', label: '最受欢迎', icon: TrendingUp },
  { value: 'newest', label: '最新发布', icon: Clock },
  { value: 'liked', label: '最多点赞', icon: Heart },
];

import { Clock } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#00f0ff]" />
                社区配置库
              </h1>
              <p className="text-[#888]">
                发现和分享优秀的装机方案，与飞友交流心得
              </p>
            </div>
            <Button className="bg-[#00f0ff] text-[#0a0a0f] hover:bg-[#00d0dd]">
              <Share2 className="w-4 h-4 mr-2" />
              分享我的配置
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#00f0ff]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-xs text-[#888]">分享配置</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,0,160,0.2)] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#ff00a0]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">56.7K</p>
                <p className="text-xs text-[#888]">总点赞</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,255,136,0.2)] flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">234K</p>
                <p className="text-xs text-[#888]">总浏览</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,170,0,0.2)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#ffaa00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">8,901</p>
                <p className="text-xs text-[#888]">活跃用户</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] bg-[rgba(0,240,255,0.1)]">
            全部
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            入门
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            竞速
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            花飞
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            远航
          </Button>
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            拍摄
          </Button>
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunityBuilds.map((build) => (
            <Card key={build.id} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] overflow-hidden group hover:border-[rgba(0,240,255,0.4)] transition-all">
              {/* Header */}
              <div className="p-4 border-b border-[rgba(0,240,255,0.1)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 bg-[rgba(0,240,255,0.2)]">
                      <AvatarFallback className="text-[#00f0ff] text-xs">
                        {build.author.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-[#888]">{build.author.name}</span>
                  </div>
                  <span className="text-xs text-[#666]">{build.createdAt}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
                  {build.name}
                </h3>
                <p className="text-sm text-[#888] mt-1 line-clamp-2">{build.description}</p>
              </div>

              {/* Components */}
              <div className="p-4">
                <p className="text-xs text-[#666] mb-2">主要部件</p>
                <div className="flex flex-wrap gap-1">
                  {build.components.map((comp, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-[#0a0a0f] text-[#888]">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 bg-[#0a0a0f] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-[#888]">
                    <Heart className="w-4 h-4 text-[#ff00a0]" />
                    {build.likes}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[#888]">
                    <Eye className="w-4 h-4 text-[#00ff88]" />
                    {build.views}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[#888]">
                    <MessageCircle className="w-4 h-4 text-[#00aaff]" />
                    {build.comments}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00f0ff]">¥{build.totalPrice}</p>
                  <p className="text-xs text-[#888]">{build.totalWeight}g</p>
                </div>
              </div>

              {/* Tags */}
              <div className="px-4 py-2 border-t border-[rgba(0,240,255,0.1)]">
                <div className="flex flex-wrap gap-1">
                  {build.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-[rgba(0,240,255,0.3)] text-[#00f0ff]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888] hover:text-[#00f0ff]">
            加载更多
          </Button>
        </div>

        {/* Top Contributors */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#ffaa00]" />
            贡献榜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['SpeedDemon', 'CinePilot', 'DroneTeacher', 'RacePro', 'FPV新手'].map((name, i) => (
              <Card key={name} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4 text-center">
                <Avatar className="w-12 h-12 mx-auto mb-2 bg-[rgba(0,240,255,0.2)]">
                  <AvatarFallback className="text-[#00f0ff]">{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-white font-medium">{name}</p>
                <p className="text-xs text-[#888]">{(5 - i) * 12} 个配置</p>
              </Card>
            ))}
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
