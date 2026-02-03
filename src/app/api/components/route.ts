import { NextResponse } from 'next/server';
import { loadComponents } from '@/lib/data';

// 静态导出模式：只返回所有组件数据
// 客户端筛选逻辑在ClientPage中处理
export const dynamic = 'force-static';

// GET /api/components - 返回所有组件数据（静态）
export async function GET() {
  try {
    const components = await loadComponents();
    
    return NextResponse.json({
      success: true,
      data: components,
      meta: {
        total: components.length,
        page: 1,
        pageSize: components.length,
        totalPages: 1
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 重新验证缓存
export const revalidate = 3600; // 1小时重新验证
