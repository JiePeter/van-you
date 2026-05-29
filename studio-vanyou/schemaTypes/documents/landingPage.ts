import {defineType, defineField} from 'sanity'

// VANYOU 落地页（Singleton）：SEO + hero/services/aboutBio/contactBooking 组成的单页
export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'services'},
        {type: 'aboutBio'},
        {type: 'contactBooking'},
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Landing Page'}
    },
  },
})
