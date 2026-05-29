import {defineType, defineField} from 'sanity'

// 多语言富文本：每种语言独立的 portableText 编辑区
export default defineType({
  name: 'localizedRichText',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'portableText',
    }),
    defineField({
      name: 'zh',
      title: '简体中文',
      type: 'portableText',
    }),
    defineField({
      name: 'zhHant',
      title: '繁體中文',
      type: 'portableText',
    }),
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'portableText',
    }),
  ],
})
