// FPV 相关的前端样式常量（等级 / 产地等）

export const LEVEL_STYLES: Record<
  string,
  {
    label: string
    color: string
  }
> = {
  entry: { label: "入门", color: "#00ff88" },
  intermediate: { label: "进阶", color: "#ffaa00" },
  advanced: { label: "高级", color: "#ff5500" },
  professional: { label: "专业", color: "#ff00a0" },
}

export const ORIGIN_STYLES: Record<
  string,
  {
    label: string
    color: string
  }
> = {
  domestic: { label: "国产", color: "#ff3333" },
  international: { label: "国际", color: "#00aaff" },
}

