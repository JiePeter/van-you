/**
 * 将 mockData 转为 Sanity 可导入的 NDJSON，输出到仓库根目录 seed.ndjson。
 * 运行：pnpm export-ndjson（在 nextjs-fitboss 目录）
 */
import {mockData} from '../src/lib/sanity/mockData'
import * as fs from 'fs'
import * as path from 'path'

/** 递归移除 null/undefined，便于 Sanity 导入时不写入空引用 */
function omitNullish(value: unknown): unknown {
  if (value === null || value === undefined) return undefined
  if (Array.isArray(value)) return value.map(omitNullish).filter((x) => x !== undefined)
  if (typeof value === 'object' && value !== null) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      const cleaned = omitNullish(v)
      if (cleaned !== undefined) out[k] = cleaned
    }
    return out
  }
  return value
}

const now = new Date().toISOString()
const singletonId = (type: string) => type

const docs = [
  {
    _id: singletonId('siteSettings'),
    _type: 'siteSettings',
    _createdAt: now,
    _updatedAt: now,
    ...(mockData.siteSettings as object),
  },
  {
    _id: singletonId('navigation'),
    _type: 'navigation',
    _createdAt: now,
    _updatedAt: now,
    ...(mockData.navigation as object),
  },
  {
    _id: singletonId('landingPage'),
    _type: 'landingPage',
    _createdAt: now,
    _updatedAt: now,
    ...(mockData.landingPage as object),
  },
]

const cleaned = docs.map((d) => omitNullish(d)) as object[]
// 从 nextjs-fitboss 运行时输出到仓库根目录 seed.ndjson
const outPath = path.join(process.cwd(), process.cwd().endsWith('nextjs-fitboss') ? '..' : '.', 'seed.ndjson')
fs.writeFileSync(outPath, cleaned.map((d) => JSON.stringify(d)).join('\n'), 'utf8')
console.log('Wrote', outPath)
