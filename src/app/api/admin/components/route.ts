import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { Component } from '@/lib/db/models';

// 静态导出配置
export const dynamic = 'force-static';

// GET /api/admin/components - 获取所有部件（管理后台）
export async function GET() {
  try {
    await connectDB();
    
    const components = await Component.find().sort({ updatedAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: components,
    });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}
