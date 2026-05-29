import {defineType, defineField} from 'sanity'

// VANYOU 关于区块：标题 + 视觉图 + 纯文本简介 + CTA + 统计
export default defineType({
  name: 'aboutBio',
  title: 'About Bio',
  type: 'object',
  fields: [
    defineField({name: 'anchorId', title: 'Anchor ID', type: 'string'}),
    defineField({
      name: 'visibleInLocales',
      title: 'Visible In Locales',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: '简体中文', value: 'zh'},
          {title: '繁體中文', value: 'zh-Hant'},
          {title: 'Français', value: 'fr'},
        ],
      },
      description: '留空则在所有语言版本中显示',
    }),
    defineField({name: 'title', title: 'Title', type: 'localizedString'}),
    defineField({name: 'seal', title: 'Seal (文友 印章)', type: 'localizedImage'}),
    defineField({name: 'image', title: 'Image', type: 'localizedImage'}),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'localizedText',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'ctaLabel', title: 'CTA Label', type: 'localizedString'}),
    defineField({name: 'ctaLink', title: 'CTA Link', type: 'link'}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'localizedString'}),
            defineField({name: 'label', title: 'Label', type: 'localizedString'}),
          ],
          preview: {
            select: {title: 'value.en', subtitle: 'label.en'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title.en'},
    prepare({title}) {
      return {title: `About Bio: ${title || 'Untitled'}`}
    },
  },
})
