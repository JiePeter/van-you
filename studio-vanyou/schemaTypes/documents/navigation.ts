import {defineType, defineField} from 'sanity'

// 导航配置（Singleton）：Header 菜单 + Footer 分组菜单
export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'headerMenu',
      title: 'Header Menu',
      type: 'array',
      of: [{type: 'menuItem'}],
    }),
    defineField({
      name: 'footerGroups',
      title: 'Footer Menu Groups',
      type: 'array',
      of: [{type: 'menuGroup'}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
