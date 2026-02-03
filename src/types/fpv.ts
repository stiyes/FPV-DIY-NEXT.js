// FPV组件类型定义

export type ComponentCategory = 
  | 'frame' 
  | 'motor' 
  | 'propeller' 
  | 'esc' 
  | 'fc' 
  | 'flight_controller'
  | 'camera' 
  | 'vtx' 
  | 'antenna' 
  | 'receiver' 
  | 'battery' 
  | 'goggle' 
  | 'goggles'
  | 'radio' 
  | 'charger' 
  | 'accessory'
  | 'gps'
  | 'tool';

export type SkillLevel = 'entry' | 'intermediate' | 'advanced' | 'professional';

export type Origin = 'domestic' | 'international';

export interface ComponentSpecs {
  [key: string]: string | number | boolean;
}

export interface FPVComponent {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  subCategory?: string;
  price: number;
  currency?: string;
  level: SkillLevel;
  weight?: number;
  rating?: number;
  reviewCount?: number;
  specs: ComponentSpecs;
  origin: Origin;
  source?: string;
  scenes?: string[];
  material?: string;
  mounting?: string;
  remarks?: string;
  imageUrl?: string;
  inStock?: boolean;
  compatibleWith?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// 装机配置类型
export interface BuildConfiguration {
  id: string;
  name: string;
  description?: string;
  components: {
    frame?: FPVComponent;
    motors?: FPVComponent[];
    propellers?: FPVComponent;
    esc?: FPVComponent;
    fc?: FPVComponent;
    camera?: FPVComponent;
    vtx?: FPVComponent;
    antenna?: FPVComponent;
    receiver?: FPVComponent;
    battery?: FPVComponent;
    goggles?: FPVComponent;
    radio?: FPVComponent;
    charger?: FPVComponent;
    accessories?: FPVComponent[];
  };
  totalPrice: number;
  totalWeight: number;
  estimatedFlightTime?: number;
  skillLevel: SkillLevel;
  tags: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  likes: number;
  views: number;
}

// 社区分享配置
export interface CommunityBuild {
  id: string;
  configuration: BuildConfiguration;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  description: string;
  images: string[];
  videos?: string[];
  comments: Comment[];
  likes: number;
  shares: number;
  createdAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

// 价格监控
export interface PriceHistory {
  componentId: string;
  prices: {
    date: string;
    price: number;
    platform: string;
  }[];
}

// 筛选选项
export interface FilterOptions {
  categories: ComponentCategory[];
  brands: string[];
  priceRange: { min: number; max: number };
  skillLevels: SkillLevel[];
  origins: Origin[];
  scenes: string[];
  inStockOnly: boolean;
}

// 排序选项
export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc' 
  | 'newest' 
  | 'popular';

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// 配置类型
export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    theme: {
      primaryColor: string;
      accentColor: string;
      backgroundColor: string;
      cardBackground: string;
      textColor: string;
      mutedTextColor: string;
    };
  };
  data: {
    source: 'json' | 'database' | 'api';
    jsonPath?: string;
    apiUrl?: string;
    refreshInterval: number;
  };
  features: {
    priceMonitor: boolean;
    communityBuilds: boolean;
    buildConfigurator: boolean;
    tutorials: boolean;
    comparison: boolean;
  };
  filters: {
    defaultSkillLevel: SkillLevel[];
    defaultOrigins: Origin[];
    priceRanges: { label: string; min: number; max: number }[];
  };
  categories: Record<ComponentCategory, {
    label: string;
    icon: string;
    description: string;
    color: string;
  }>;
  skillLevels: Record<SkillLevel, {
    label: string;
    description: string;
    color: string;
  }>;
  origins: Record<Origin, {
    label: string;
    description: string;
    color: string;
  }>;
  scenes: string[];
}
