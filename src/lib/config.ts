// 配置管理模块
import appConfig from './data/config.json';
import { AppConfig, FPVComponent, ComponentCategory, SkillLevel, Origin } from '@/types/fpv';

// 导出配置
export const config: AppConfig = appConfig as AppConfig;

// 获取应用信息
export function getAppInfo() {
  return config.app;
}

// 获取主题配置
export function getThemeConfig() {
  return config.app.theme;
}

// 获取数据源配置
export function getDataConfig() {
  return config.data;
}

// 获取功能开关
export function getFeatures() {
  return config.features;
}

// 获取分类配置
export function getCategoryConfig(category: ComponentCategory) {
  return config.categories[category];
}

// 获取所有分类
export function getAllCategories() {
  return Object.entries(config.categories).map(([key, value]) => ({
    id: key as ComponentCategory,
    ...value
  }));
}

// 获取级别配置
export function getSkillLevelConfig(level: SkillLevel) {
  return config.skillLevels[level];
}

// 获取产地配置
export function getOriginConfig(origin: Origin) {
  return config.origins[origin];
}

// 获取场景列表
export function getScenes() {
  return config.scenes;
}

// 获取价格区间
export function getPriceRanges() {
  return config.filters.priceRanges;
}

// 动态获取数据路径
export function getDataPath() {
  const dataConfig = getDataConfig();
  if (dataConfig.source === 'json' && dataConfig.jsonPath) {
    return dataConfig.jsonPath;
  }
  return null;
}

// 检查功能是否启用
export function isFeatureEnabled(feature: keyof typeof config.features) {
  return config.features[feature];
}
