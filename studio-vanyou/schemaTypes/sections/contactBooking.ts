import {defineType, defineField} from 'sanity'

// VANYOU 联系/询价区块：标题 + 动态字段 + 提交/成功文案 + 联系信息栏 + 隐私说明
export default defineType({
  name: 'contactBooking',
  title: 'Contact Booking',
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
    defineField({name: 'description', title: 'Description', type: 'localizedText'}),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Field Name', type: 'string'}),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Text', value: 'text'},
                  {title: 'Email', value: 'email'},
                  {title: 'Phone', value: 'phone'},
                  {title: 'Textarea', value: 'textarea'},
                  {title: 'Select', value: 'select'},
                ],
              },
            }),
            defineField({name: 'label', title: 'Label', type: 'localizedString'}),
            defineField({name: 'placeholder', title: 'Placeholder', type: 'localizedString'}),
            defineField({name: 'required', title: 'Required', type: 'boolean', initialValue: false}),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'localizedString'}),
                    defineField({name: 'value', title: 'Value', type: 'string'}),
                  ],
                },
              ],
              hidden: ({parent}) => parent?.type !== 'select',
            }),
          ],
          preview: {select: {title: 'name'}, prepare: ({title}: {title?: string}) => ({title: title || 'Field'})},
        },
      ],
    }),
    defineField({name: 'submitLabel', title: 'Submit Label', type: 'localizedString'}),
    defineField({name: 'successMessage', title: 'Success Message', type: 'localizedString'}),
    defineField({
      name: 'secondaryContact',
      title: 'Secondary Contact',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Info (side panel)',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({
          name: 'phones',
          title: 'Phones',
          type: 'array',
          of: [{type: 'string'}],
        }),
        defineField({name: 'areaLabel', title: 'Area Label', type: 'localizedString'}),
        defineField({name: 'areaText', title: 'Area Text', type: 'localizedText'}),
        defineField({
          name: 'mapImageUrl',
          title: 'Map Image URL',
          description: '地图位置用的静态图片路径（如 /brand/vanyou-map.png）；留空回退品牌占位图',
          type: 'string',
        }),
        defineField({
          name: 'card',
          title: 'Business Card (rendered)',
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'localizedString'}),
            defineField({name: 'company', title: 'Company', type: 'string'}),
            defineField({name: 'website', title: 'Website', type: 'string'}),
            defineField({name: 'seal', title: 'Seal (文友 印章)', type: 'localizedImage'}),
          ],
        }),
      ],
    }),
    defineField({name: 'privacyNote', title: 'Privacy Note', type: 'localizedText'}),
  ],
  preview: {
    prepare() {
      return {title: 'Contact Booking'}
    },
  },
})
