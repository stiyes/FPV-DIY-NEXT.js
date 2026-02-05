import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FPVComponent } from "@/types/fpv"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 品牌展示统一：优先显示「中文 / 英文」，否则回退到已有字段
export function formatBrand(
  component: Pick<FPVComponent, "brand"> & {
    brand_cn?: string
    brand_en?: string
  },
) {
  const cn = component.brand_cn
  const en = component.brand_en || component.brand

  if (cn && en && cn !== en) {
    return `${cn} / ${en}`
  }
  if (cn) return cn
  if (en) return en
  return component.brand
}
