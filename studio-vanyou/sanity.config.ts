import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import type {StructureBuilder} from 'sanity/structure'
import {projectId, dataset} from './env'

// Singleton 文档类型：只允许创建一份
const singletonTypes = new Set([
  'siteSettings',
  'navigation',
  'landingPage',
])

// Singleton 列表项：直接指向文档编辑器而非列表
function singletonListItem(S: StructureBuilder, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))
}

export default defineConfig({
  name: 'default',
  title: 'VANYOU Cargo Solutions',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // 全局设置分组
            S.listItem()
              .title('Global')
              .child(
                S.list()
                  .title('Global Settings')
                  .items([
                    singletonListItem(S, 'siteSettings', 'Site Settings'),
                    singletonListItem(S, 'navigation', 'Navigation'),
                  ]),
              ),

            S.divider(),

            // 页面
            singletonListItem(S, 'landingPage', 'Landing Page'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // 阻止 Singleton 类型出现在"新建文档"菜单中
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    // 阻止 Singleton 文档的删除/复制操作
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
