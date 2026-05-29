import {defineType, defineField} from 'sanity'

// VANYOU 首页 Hero：标题 + 副标题 + 主/次 CTA + 背景图 + 信任文案
export default defineType({
  name: 'hero',
  title: 'Hero',
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
    defineField({name: 'kicker', title: 'Kicker (eyebrow)', type: 'localizedString'}),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'subheadline', title: 'Subheadline', type: 'localizedString'}),
    defineField({
      name: 'primaryCTA',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'localizedString'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({
      name: 'secondaryCTA',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'localizedString'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({name: 'heroImage', title: 'Hero Image', type: 'localizedImage'}),
    defineField({name: 'trustLine', title: 'Trust Line', type: 'localizedString'}),
  ],
  preview: {
    select: {title: 'headline.en'},
    prepare({title}) {
      return {title: `Hero: ${title || 'Untitled'}`}
    },
  },
})
