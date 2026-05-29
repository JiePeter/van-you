import {defineType, defineField} from 'sanity'

// 多语言多行文本：en / zh / zh-Hant / fr
export default defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'zh',
      title: '简体中文',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'zhHant',
      title: '繁體中文',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 4,
    }),
  ],
})
