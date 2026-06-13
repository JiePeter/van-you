// VANYOU GROQ 查询

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const navigationQuery = `*[_type == "navigation"][0]{
  headerMenu[]{
    _key, label, link{ type, url, anchor, openInNewTab }
  },
  footerGroups[]{
    _key, title,
    items[]{
      _key, label,
      link{ type, url, anchor, openInNewTab, modalBody, modalRef->{ title, slug, body } }
    }
  }
}`;

export const landingPageQuery = `*[_type == "landingPage"][0]{
  seo,
  sections[]
}`;
