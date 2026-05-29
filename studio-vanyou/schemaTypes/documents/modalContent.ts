import {defineType, defineField} from 'sanity'

// 弹窗富文本内容：用于 link type=modal 触发的 Modal 展示（如政策文档、详细说明等）
export default defineType({
  name: 'modalContent',
  title: 'Modal Content',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localizedRichText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'slug.current'},
  },
})
