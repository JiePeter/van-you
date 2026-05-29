import {defineType, defineField} from 'sanity'

// Footer 菜单分组：标题 + 菜单项列表
export default defineType({
  name: 'menuGroup',
  title: 'Menu Group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Group Title',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'menuItem'}],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
  },
})
