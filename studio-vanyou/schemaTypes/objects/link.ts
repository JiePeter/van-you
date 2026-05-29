import {defineType, defineField} from 'sanity'

// 通用链接：支持内部页面引用、外部 URL、锚点
export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal Page', value: 'internal'},
          {title: 'External URL', value: 'external'},
          {title: 'Modal (Popup Content)', value: 'modal'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalRef',
      title: 'Internal Page',
      type: 'reference',
      to: [{type: 'landingPage'}],
      hidden: ({parent}) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
      hidden: ({parent}) => parent?.type !== 'external',
    }),
    defineField({
      name: 'modalRef',
      title: 'Modal Content',
      type: 'reference',
      to: [{type: 'modalContent'}],
      hidden: ({parent}) => parent?.type !== 'modal',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor',
      type: 'string',
      description: 'Section anchor ID (e.g. "services")',
    }),
  ],
})
