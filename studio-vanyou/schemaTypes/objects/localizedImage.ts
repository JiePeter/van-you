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
      name: 'src',
      title: 'Static Image Path',
      description:
        '静态/本地图片直链（如 /brand/x.png）。未上传 Sanity 资源时使用；前端 resolveLocalizedImage 会优先读取它，留空则回退上方 asset。',
      type: 'string',
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
