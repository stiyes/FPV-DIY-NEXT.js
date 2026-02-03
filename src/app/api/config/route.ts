import { NextResponse } from 'next/server';
import { config, getAppInfo, getThemeConfig, getFeatures, getAllCategories, getPriceRanges } from '@/lib/config';

// Force static generation for export
export const dynamic = 'force-static';
export const revalidate = 3600;

// GET /api/config - 获取应用配置
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        app: getAppInfo(),
        theme: getThemeConfig(),
        features: getFeatures(),
        categories: getAllCategories(),
        priceRanges: getPriceRanges(),
        skillLevels: config.skillLevels,
        origins: config.origins,
        scenes: config.scenes
      }
    });
  } catch (error) {
    console.error('Config API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}
