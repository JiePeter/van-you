import {defineType, defineField} from 'sanity'

// 多语言字符串：en / zh / zh-Hant / fr，缺失语种时前端按回退链处理
export default defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
    defineField({
      name: 'zh',
      title: '简体中文',
      type: 'string',
    }),
    defineField({
      name: 'zhHant',
      title: '繁體中文',
      type: 'string',
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
    }),
  ],
})
