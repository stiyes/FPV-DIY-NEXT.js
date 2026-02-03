// API客户端 - 封装所有API调用
import { FPVComponent, BuildConfiguration, FilterOptions, SortOption } from '@/types/fpv';

const API_BASE = '';

// 通用请求封装
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
}

// ========== 部件API ==========

// 获取所有部件
export async function getComponents(): Promise<FPVComponent[]> {
  const result = await fetchAPI<FPVComponent[]>('/api/components');
  return result.data || [];
}

// 获取单个部件
export async function getComponent(id: string): Promise<FPVComponent | null> {
  const result = await fetchAPI<FPVComponent>(`/api/components?id=${id}`);
  return result.data || null;
}

// 搜索部件
export async function searchComponents(query: string): Promise<FPVComponent[]> {
  const result = await fetchAPI<FPVComponent[]>(`/api/components?search=${encodeURIComponent(query)}`);
  return result.data || [];
}

// ========== 装机配置API ==========

// 获取所有配置
export async function getBuilds(author?: string): Promise<BuildConfiguration[]> {
  const query = author ? `?author=${encodeURIComponent(author)}` : '';
  const result = await fetchAPI<BuildConfiguration[]>(`/api/builds${query}`);
  return result.data || [];
}

// 获取单个配置
export async function getBuild(id: string): Promise<BuildConfiguration | null> {
  const result = await fetchAPI<BuildConfiguration>(`/api/builds/${id}`);
  return result.data || null;
}

// 创建配置
export async function createBuild(build: Partial<BuildConfiguration>): Promise<BuildConfiguration | null> {
  const result = await fetchAPI<BuildConfiguration>('/api/builds', {
    method: 'POST',
    body: JSON.stringify(build),
  });
  return result.data || null;
}

// 更新配置
export async function updateBuild(
  id: string,
  build: Partial<BuildConfiguration>
): Promise<BuildConfiguration | null> {
  const result = await fetchAPI<BuildConfiguration>(`/api/builds/${id}`, {
    method: 'PUT',
    body: JSON.stringify(build),
  });
  return result.data || null;
}

// 删除配置
export async function deleteBuild(id: string): Promise<boolean> {
  const result = await fetchAPI(`/api/builds/${id}`, {
    method: 'DELETE',
  });
  return result.success;
}

// ========== 管理后台API ==========

// 获取所有部件（管理）
export async function adminGetComponents(params?: {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: FPVComponent[]; meta: any }> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.pageSize) query.append('pageSize', params.pageSize.toString());
  
  const result = await fetchAPI<any>(
    `/api/admin/components?${query.toString()}`
  );
  return { data: result.data?.data || result.data || [], meta: result.data?.meta };
}

// 创建部件
export async function adminCreateComponent(component: Partial<FPVComponent>): Promise<FPVComponent | null> {
  const result = await fetchAPI<FPVComponent>('/api/admin/components', {
    method: 'POST',
    body: JSON.stringify(component),
  });
  return result.data || null;
}

// 更新部件
export async function adminUpdateComponent(
  id: string,
  component: Partial<FPVComponent>
): Promise<FPVComponent | null> {
  const result = await fetchAPI<FPVComponent>(`/api/admin/components/${id}`, {
    method: 'PUT',
    body: JSON.stringify(component),
  });
  return result.data || null;
}

// 删除部件
export async function adminDeleteComponent(id: string): Promise<boolean> {
  const result = await fetchAPI(`/api/admin/components/${id}`, {
    method: 'DELETE',
  });
  return result.success;
}
