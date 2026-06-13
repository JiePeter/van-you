import {defineType, defineField} from 'sanity'

// VANYOU 服务区块：kicker + 标题 + 品牌横幅 + 服务卡片网格（含 wide 变体）
export default defineType({
  name: 'services',
  title: 'Services',
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
    defineField({name: 'kicker', title: 'Kicker', type: 'localizedString'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brandStrip',
      title: 'Brand Strip',
      type: 'object',
      fields: [
        defineField({name: 'image', title: 'Image', type: 'localizedImage'}),
        defineField({name: 'label', title: 'Label', type: 'localizedString'}),
        defineField({name: 'text', title: 'Text', type: 'localizedText'}),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Service Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'lucide 图标键：warehouse / container / truck / crossdock / inventory / boxes',
              options: {
                list: [
                  {title: 'Warehouse', value: 'warehouse'},
                  {title: 'Container', value: 'container'},
                  {title: 'Truck', value: 'truck'},
                  {title: 'Cross Dock', value: 'crossdock'},
                  {title: 'Inventory', value: 'inventory'},
                  {title: 'Boxes', value: 'boxes'},
                ],
              },
            }),
            defineField({name: 'image', title: 'Image', type: 'localizedImage'}),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'description', title: 'Description', type: 'localizedText'}),
            defineField({
              name: 'wide',
              title: 'Wide (span 2 columns)',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'sideImage',
              title: 'Side Image (wide card right side)',
              type: 'localizedImage',
              description: '仅 wide 卡片使用，显示在右侧并裁切填充',
            }),
          ],
          preview: {
            select: {title: 'title.en'},
            prepare({title}) {
              return {title: title || 'Service'}
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title.en'},
    prepare({title}) {
      return {title: `Services: ${title || 'Untitled'}`}
    },
  },
})
