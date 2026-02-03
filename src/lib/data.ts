// 数据获取模块 - 支持动态数据源
import { FPVComponent, ComponentCategory, SkillLevel, Origin, FilterOptions, SortOption } from '@/types/fpv';
import { getDataConfig, getDataPath } from './config';

// 缓存数据
let componentsCache: FPVComponent[] | null = null;
let cacheTimestamp: number = 0;

// 获取数据刷新间隔
const REFRESH_INTERVAL = getDataConfig().refreshInterval || 3600000;

// 加载组件数据
export async function loadComponents(): Promise<FPVComponent[]> {
  const dataConfig = getDataConfig();
  
  // 检查缓存是否有效
  const now = Date.now();
  if (componentsCache && (now - cacheTimestamp) < REFRESH_INTERVAL) {
    return componentsCache;
  }
  
  try {
    let data: FPVComponent[] = [];
    
    switch (dataConfig.source) {
      case 'json':
        data = await loadFromJson();
        break;
      case 'api':
        data = await loadFromApi();
        break;
      case 'database':
        data = await loadFromDatabase();
        break;
      default:
        data = await loadFromJson();
    }
    
    // 更新缓存
    componentsCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Failed to load components:', error);
    // 如果缓存存在，返回缓存数据
    if (componentsCache) {
      return componentsCache;
    }
    throw error;
  }
}

// 从JSON文件加载
async function loadFromJson(): Promise<FPVComponent[]> {
  try {
    // 在服务端使用fs读取
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'src/lib/data/components.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } else {
      // 客户端通过API获取
      const response = await fetch('/api/components');
      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Error loading from JSON:', error);
    throw error;
  }
}

// 从API加载
async function loadFromApi(): Promise<FPVComponent[]> {
  const dataConfig = getDataConfig();
  if (!dataConfig.apiUrl) {
    throw new Error('API URL not configured');
  }
  
  const response = await fetch(dataConfig.apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch from API');
  }
  return await response.json();
}

// 从数据库加载（预留接口）
async function loadFromDatabase(): Promise<FPVComponent[]> {
  // 这里可以实现数据库连接逻辑
  // 例如使用 Prisma 或 Drizzle ORM
  throw new Error('Database source not implemented yet');
}

// 根据ID获取组件
export async function getComponentById(id: string): Promise<FPVComponent | undefined> {
  const components = await loadComponents();
  return components.find(c => c.id === id);
}

// 根据SKU获取组件
export async function getComponentBySku(sku: string): Promise<FPVComponent | undefined> {
  const components = await loadComponents();
  return components.find(c => c.sku === sku);
}

// 筛选组件
export async function filterComponents(
  filters: Partial<FilterOptions>,
  sort?: SortOption,
  page: number = 1,
  pageSize: number = 20
): Promise<{ components: FPVComponent[]; total: number }> {
  let components = await loadComponents();
  
  // 应用筛选
  if (filters.categories && filters.categories.length > 0) {
    components = components.filter(c => filters.categories!.includes(c.category));
  }
  
  if (filters.brands && filters.brands.length > 0) {
    components = components.filter(c => filters.brands!.includes(c.brand));
  }
  
  if (filters.skillLevels && filters.skillLevels.length > 0) {
    components = components.filter(c => filters.skillLevels!.includes(c.level));
  }
  
  if (filters.origins && filters.origins.length > 0) {
    components = components.filter(c => filters.origins!.includes(c.origin));
  }
  
  if (filters.priceRange) {
    components = components.filter(c => 
      c.price >= filters.priceRange!.min && c.price <= filters.priceRange!.max
    );
  }
  
  if (filters.inStockOnly) {
    components = components.filter(c => c.inStock !== false);
  }
  
  // 应用排序
  if (sort) {
    components = sortComponents(components, sort);
  }
  
  const total = components.length;
  
  // 分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedComponents = components.slice(start, end);
  
  return { components: paginatedComponents, total };
}

// 排序组件
function sortComponents(components: FPVComponent[], sort: SortOption): FPVComponent[] {
  const sorted = [...components];
  
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'newest':
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case 'popular':
      sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      break;
  }
  
  return sorted;
}

// 获取所有品牌
export async function getAllBrands(): Promise<string[]> {
  const components = await loadComponents();
  const brands = new Set(components.map(c => c.brand));
  return Array.from(brands).sort();
}

// 获取所有场景
export async function getAllScenes(): Promise<string[]> {
  const components = await loadComponents();
  const scenes = new Set<string>();
  components.forEach(c => {
    c.scenes?.forEach(s => scenes.add(s));
  });
  return Array.from(scenes).sort();
}

// 按分类获取组件
export async function getComponentsByCategory(category: ComponentCategory): Promise<FPVComponent[]> {
  const components = await loadComponents();
  return components.filter(c => c.category === category);
}

// 搜索组件
export async function searchComponents(query: string): Promise<FPVComponent[]> {
  const components = await loadComponents();
  const lowerQuery = query.toLowerCase();
  
  return components.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.brand.toLowerCase().includes(lowerQuery) ||
    c.sku.toLowerCase().includes(lowerQuery) ||
    c.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 清除缓存
export function clearCache() {
  componentsCache = null;
  cacheTimestamp = 0;
}
