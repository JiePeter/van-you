import {defineType, defineField} from 'sanity'

// SEO 元数据：多语言标题 / 描述 + OG 图片
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'localizedText',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'localizedImage',
    }),
  ],
})
