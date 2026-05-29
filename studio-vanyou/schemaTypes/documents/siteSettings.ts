import {defineType, defineField} from 'sanity'

// 全局站点设置（Singleton）：站名 / Logo / 联系方式 / 社交链接 / PromoBar / SEO 默认值
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'localizedImage',
    }),
    defineField({
      name: 'logoRounded',
      title: 'Rounded Logo',
      description: '启用后 Logo 将裁剪为圆形显示',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'enabledLocales',
      title: 'Enabled Languages',
      description: '选择前台展示的语种，未勾选的语种 URL 仍可访问但语言切换器中不会显示',
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
      initialValue: ['en', 'zh', 'zh-Hant', 'fr'],
      validation: (rule) => rule.min(1).error('至少启用一种语言'),
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (rule) => rule.email(),
        }),
        defineField({name: 'addressText', title: 'Address', type: 'localizedString'}),
        defineField({name: 'addressMapUrl', title: 'Google Maps URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{type: 'localizedString'}],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        },
      ],
    }),
    defineField({
      name: 'splashQuotes',
      title: 'Splash Quotes',
      description: '启动页/闪屏随机展示的文案（多语言）',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [defineField({name: 'text', title: 'Text', type: 'localizedString'})],
          preview: {select: {title: 'text.en'}, prepare: ({title}: {title?: string}) => ({title: title || 'Quote'})},
        },
      ],
    }),
    defineField({
      name: 'promoBar',
      title: 'Promo Bar',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enabled',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({name: 'text', title: 'Text', type: 'localizedString'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({
      name: 'seoDefault',
      title: 'Default SEO',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Default Title', type: 'localizedString'}),
        defineField({name: 'description', title: 'Default Description', type: 'localizedText'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'siteName.en', media: 'logo.asset'},
    prepare({title, media}) {
      return {title: title || 'Site Settings', media}
    },
  },
})
