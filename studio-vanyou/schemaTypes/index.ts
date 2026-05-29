// --- Localized Field Types ---
import localizedString from './objects/localizedString'
import localizedText from './objects/localizedText'
import localizedRichText from './objects/localizedRichText'

// --- Shared Primitives ---
import localizedImage from './objects/localizedImage'
import link from './objects/link'
import portableText from './objects/portableText'
import seo from './objects/seo'
import menuItem from './objects/menuItem'
import menuGroup from './objects/menuGroup'

// --- Section Types (VANYOU 单页) ---
import hero from './sections/hero'
import services from './sections/services'
import aboutBio from './sections/aboutBio'
import contactBooking from './sections/contactBooking'

// --- Document Types ---
import siteSettings from './documents/siteSettings'
import navigation from './documents/navigation'
import landingPage from './documents/landingPage'
import modalContent from './documents/modalContent'

// 注册顺序：localized types → primitives → sections → documents
export const schemaTypes = [
  // Localized field types（被其他所有 schema 引用）
  localizedString,
  localizedText,
  localizedRichText,

  // Shared primitives
  localizedImage,
  link,
  portableText,
  seo,
  menuItem,
  menuGroup,

  // Section types（VANYOU landing page）
  hero,
  services,
  aboutBio,
  contactBooking,

  // Document types
  siteSettings,
  navigation,
  landingPage,
  modalContent,
]
