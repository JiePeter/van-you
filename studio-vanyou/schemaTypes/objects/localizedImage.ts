import {defineType, defineField} from 'sanity'

// 图片 + 多语言 alt 文本
export default defineType({
  name: 'localizedImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: {
      title: 'alt.en',
      media: 'asset',
    },
  },
})
