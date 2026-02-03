import { Header } from '@/components/fpv/Header';
import { loadComponents } from '@/lib/data';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bell, 
  Search,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// 模拟价格历史数据
const generatePriceHistory = (basePrice: number) => {
  const history = [];
  let currentPrice = basePrice;
  for (let i = 30; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 0.1;
    currentPrice = Math.max(currentPrice * (1 + change), basePrice * 0.8);
    history.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Math.round(currentPrice),
    });
  }
  return history;
};

// 获取热门部件并生成价格数据
async function getPriceData() {
  const components = await loadComponents();
  
  // 选择价格较高的部件作为热门监控对象
  const hotItems = components
    .filter(c => c.price > 100)
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 12)
    .map(c => {
      const history = generatePriceHistory(c.price);
      const minPrice = Math.min(...history.map(h => h.price));
      const maxPrice = Math.max(...history.map(h => h.price));
      const avgPrice = Math.round(history.reduce((sum, h) => sum + h.price, 0) / history.length);
      const priceChange = history[history.length - 1].price - history[0].price;
      const changePercent = ((priceChange / history[0].price) * 100).toFixed(1);
      
      return {
        ...c,
        history,
        minPrice,
        maxPrice,
        avgPrice,
        priceChange,
        changePercent: parseFloat(changePercent),
      };
    });
  
  return hotItems;
}

// 价格趋势图表组件（简化版）
function PriceSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default async function PricesPage() {
  const priceData = await getPriceData();
  
  // 计算统计数据
  const totalUp = priceData.filter(p => p.priceChange > 0).length;
  const totalDown = priceData.filter(p => p.priceChange < 0).length;
  const totalFlat = priceData.filter(p => p.priceChange === 0).length;
  
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#00f0ff]" />
            价格监控
          </h1>
          <p className="text-[#888]">
            实时监控FPV部件价格变动，把握最佳购买时机
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#00ff88]">{totalUp}</p>
                <p className="text-xs text-[#888]">价格上涨</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,255,136,0.2)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00ff88]" />
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#ff3333]">{totalDown}</p>
                <p className="text-xs text-[#888]">价格下跌</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(255,51,51,0.2)] flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#ff3333]" />
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#888]">{totalFlat}</p>
                <p className="text-xs text-[#888]">价格持平</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(136,136,136,0.2)] flex items-center justify-center">
                <Minus className="w-5 h-5 text-[#888]" />
              </div>
            </div>
          </Card>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#00f0ff]">{priceData.length}</p>
                <p className="text-xs text-[#888]">监控中</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#00f0ff]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888]" />
            <Input
              placeholder="搜索部件名称、品牌..."
              className="pl-10 bg-[#12121a] border-[rgba(0,240,255,0.2)] text-white placeholder:text-[#666]"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888]">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            <Button variant="outline" className="border-[rgba(0,240,255,0.2)] text-[#888]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              排序
            </Button>
          </div>
        </div>

        {/* Price Table */}
        <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(0,240,255,0.1)]">
                  <th className="text-left p-4 text-sm font-medium text-[#888]">部件</th>
                  <th className="text-left p-4 text-sm font-medium text-[#888]">品牌</th>
                  <th className="text-right p-4 text-sm font-medium text-[#888]">当前价格</th>
                  <th className="text-right p-4 text-sm font-medium text-[#888]">30天趋势</th>
                  <th className="text-right p-4 text-sm font-medium text-[#888]">涨跌</th>
                  <th className="text-center p-4 text-sm font-medium text-[#888]">价格区间</th>
                  <th className="text-center p-4 text-sm font-medium text-[#888]">操作</th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((item) => (
                  <tr key={item.id} className="border-b border-[rgba(0,240,255,0.05)] hover:bg-[rgba(0,240,255,0.02)]">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-xs text-[#666]">{item.sku}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-[10px] border-[rgba(0,240,255,0.3)] text-[#888]">
                        {item.brand}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-lg font-bold text-[#00f0ff]">¥{item.price}</p>
                      <p className="text-xs text-[#666]">均价 ¥{item.avgPrice}</p>
                    </td>
                    <td className="p-4">
                      <div className="w-24">
                        <PriceSparkline 
                          data={item.history.map(h => h.price)} 
                          color={item.priceChange >= 0 ? '#00ff88' : '#ff3333'}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${item.priceChange >= 0 ? 'text-[#00ff88]' : 'text-[#ff3333]'}`}>
                        {item.priceChange > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : item.priceChange < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {item.priceChange >= 0 ? '+' : ''}{item.changePercent}%
                        </span>
                      </div>
                      <p className="text-xs text-[#666]">
                        {item.priceChange >= 0 ? '+' : ''}¥{item.priceChange}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-xs text-[#888]">
                        <span className="text-[#00ff88]">¥{item.minPrice}</span>
                        {' ~ '}
                        <span className="text-[#ff3333]">¥{item.maxPrice}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" className="border-[#00f0ff] text-[#00f0ff]">
                          <Bell className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-[#888] text-[#888]">
                          <ShoppingCart className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-[#888] text-[#888]">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Price Alert Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#ff00a0]" />
            价格提醒
          </h2>
          <Card className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[rgba(255,0,160,0.1)] flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-[#ff00a0]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">设置价格提醒</h3>
              <p className="text-[#888] mb-4">当部件价格达到你设定的目标时，我们会通知你</p>
              <Button className="bg-[#ff00a0] text-white hover:bg-[#dd0088]">
                添加提醒
              </Button>
            </div>
          </Card>
        </div>

        {/* Platform Prices */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">多平台比价</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['淘宝', '京东', '拼多多'].map((platform) => (
              <Card key={platform} className="bg-[#12121a] border-[rgba(0,240,255,0.15)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{platform}</h3>
                  <Badge variant="outline" className="text-[10px] border-[#00ff88] text-[#00ff88]">
                    最低
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#00f0ff]">¥{(Math.random() * 500 + 100).toFixed(0)}</p>
                <p className="text-xs text-[#888]">平均价格</p>
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
