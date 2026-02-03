import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { Build } from '@/lib/db/models';

// 静态导出配置
export const dynamic = 'force-static';

// GET /api/builds - 获取所有装机配置
export async function GET() {
  try {
    await connectDB();
    
    const builds = await Build.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: builds,
    });
  } catch (error) {
    console.error('Builds API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}
