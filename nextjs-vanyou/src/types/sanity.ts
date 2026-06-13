// ==================== 基础本地化类型 ====================

export interface LocalizedString {
  en?: string;
  zh?: string;
  zhHant?: string;
  fr?: string;
}

export interface LocalizedText {
  en?: string;
  zh?: string;
  zhHant?: string;
  fr?: string;
}

// Portable Text block 简化表示
export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{ _type: string; _key: string; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _type: string; _key: string; href?: string }>;
  listItem?: string;
  level?: number;
}

export interface LocalizedRichText {
  en?: PortableTextBlock[];
  zh?: PortableTextBlock[];
  zhHant?: PortableTextBlock[];
  fr?: PortableTextBlock[];
}

// ==================== 共享对象类型 ====================

export interface LocalizedImage {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  /** 本地/静态直链（mock 数据用，如 /brand/x.png）；接入 Sanity 后用 asset */
  src?: string;
  alt?: LocalizedString;
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface Link {
  type?: "internal" | "external" | "modal";
  internalRef?: { _ref: string; _type: "reference" };
  url?: string;
  modalRef?: { _ref: string; _type: "reference" };
  /** type=modal 时的内联弹窗正文（纯文本，按空行分段）；用于隐私政策 / 使用条款等 */
  modalBody?: LocalizedString;
  openInNewTab?: boolean;
  anchor?: string;
}

export interface SEO {
  title?: LocalizedString;
  description?: LocalizedText;
  ogImage?: LocalizedImage;
}

export interface MenuItem {
  _key: string;
  label: LocalizedString;
  link?: Link;
  children?: MenuItem[];
}

export interface MenuGroup {
  _key: string;
  title: LocalizedString;
  items?: MenuItem[];
}

// ==================== Section 公共字段 ====================

interface SectionBase {
  _type: string;
  _key: string;
  anchorId?: string;
  visibleInLocales?: string[];
}

// ==================== VANYOU 单页 Section 类型 ====================

export interface HeroSection extends SectionBase {
  _type: "hero";
  kicker?: LocalizedString;
  headline: LocalizedString;
  subheadline: LocalizedString;
  primaryCTA: { label: LocalizedString; link?: Link };
  secondaryCTA?: { label: LocalizedString; link?: Link };
  heroImage?: LocalizedImage;
  trustLine?: LocalizedString;
}

export interface FAQSection extends SectionBase {
  _type: "faq";
  title?: LocalizedString;
  items: Array<{
    _key: string;
    question: LocalizedString;
    answer: LocalizedText;
  }>;
}

export interface AboutBioSection extends SectionBase {
  _type: "aboutBio";
  title?: LocalizedString;
  /** VANYOU：文友公司印章（显示在文案栏顶部） */
  seal?: LocalizedImage;
  image?: LocalizedImage;
  bio: LocalizedText; // 简化为纯文本，不使用 PortableText
  ctaLabel?: LocalizedString;
  ctaLink?: Link;
  /** VANYOU：公司优势统计（Hands-on / Local / Clear 等） */
  stats?: Array<{ _key: string; value: LocalizedString; label: LocalizedString }>;
}

// VANYOU 服务区块：标题 + 品牌横幅 + 服务卡片网格（含 wide 变体）
export interface ServicesSection extends SectionBase {
  _type: "services";
  kicker?: LocalizedString;
  title: LocalizedString;
  brandStrip?: {
    image?: LocalizedImage;
    label?: LocalizedString;
    text?: LocalizedString;
  };
  items: Array<{
    _key: string;
    /** lucide 图标键（warehouse/container/truck/crossdock/inventory/boxes） */
    icon?: string;
    image?: LocalizedImage;
    title: LocalizedString;
    description: LocalizedString;
    wide?: boolean;
    /** wide 卡片右侧补充图（如品牌图，裁切填充） */
    sideImage?: LocalizedImage;
  }>;
}

export interface ContactBookingSection extends SectionBase {
  _type: "contactBooking";
  kicker?: LocalizedString;
  title?: LocalizedString;
  description?: LocalizedText;
  fields: Array<{
    _key: string;
    name: string;
    type: "text" | "email" | "phone" | "textarea" | "select";
    label: LocalizedString;
    placeholder?: LocalizedString;
    required?: boolean;
    options?: Array<{ _key: string; label: LocalizedString; value: string }>;
  }>;
  submitLabel: LocalizedString;
  successMessage: LocalizedString;
  secondaryContact?: {
    email?: string;
    phone?: string;
  };
  /** VANYOU：表单右侧联系信息栏（名片/服务区域/地图） */
  contactInfo?: {
    email?: string;
    phones?: string[];
    areaLabel?: LocalizedString;
    areaText?: LocalizedString;
    /** 地图位置改为纯图片占位（不内嵌 iframe / 不吃外链）；留空回退品牌占位图 */
    mapImageUrl?: string;
    sideImage?: LocalizedImage;
    /** 页面渲染的"名片"（替代静态名片图） */
    card?: {
      /** 是否展示名片；默认隐藏（false） */
      visible?: boolean;
      name?: string;
      title?: LocalizedString;
      company?: string;
      website?: string;
      seal?: LocalizedImage;
    };
  };
  privacyNote?: LocalizedText;
}

// Section 联合类型（VANYOU 单页使用 hero/services/aboutBio/contactBooking；其余保留为组件库）
export type VanyouSection =
  | HeroSection
  | ServicesSection
  | FAQSection
  | AboutBioSection
  | ContactBookingSection;

// ==================== 旧 Section 类型（组件库保留） ====================

export interface HeroCarouselSection extends SectionBase {
  _type: "heroCarousel";
  slides: Array<{
    _key: string;
    bgImage?: LocalizedImage;
    title: LocalizedString;
    subtitle?: LocalizedText;
    ctaLabel: LocalizedString;
    ctaLink?: Link;
  }>;
}

export interface HeroSimpleSection extends SectionBase {
  _type: "heroSimple";
  bgImage?: LocalizedImage;
  title: LocalizedString;
  body?: LocalizedText;
  primaryCTA?: { label: LocalizedString; link?: Link };
  secondaryCTA?: { label: LocalizedString; link?: Link };
}

export interface PromoMediaSplitSection extends SectionBase {
  _type: "promoMediaSplit";
  heading: LocalizedString;
  body?: LocalizedRichText;
  media?: LocalizedImage[];
  ctaLabel?: LocalizedString;
  ctaLink?: Link;
}

export interface FeatureCardsSection extends SectionBase {
  _type: "featureCards";
  title?: LocalizedString;
  items: Array<{
    _key: string;
    icon?: string;
    title: LocalizedString;
    description: LocalizedText;
  }>;
}

export interface ServicesGridSection extends SectionBase {
  _type: "servicesGrid";
  title: LocalizedString;
  intro?: LocalizedText;
  items: Array<{
    _key: string;
    image?: LocalizedImage;
    name: LocalizedString;
    description: LocalizedString;
    bullets?: Array<{ _key: string; text: LocalizedString }>;
    ctaLabel?: LocalizedString;
    ctaLink?: Link;
  }>;
}

export interface SatisfactionBlockSection extends SectionBase {
  _type: "satisfactionBlock";
  title: LocalizedString;
  body: LocalizedText;
  images?: LocalizedImage[];
  ctaLabel?: LocalizedString;
  ctaLink?: Link;
}

export interface CtaBannerFullSection extends SectionBase {
  _type: "ctaBannerFull";
  variant?: "full" | "split";
  backgroundImage?: LocalizedImage;
  title: LocalizedString;
  subtitle?: LocalizedText;
  ctaLabel: LocalizedString;
  ctaLink?: Link;
}

export interface TestimonialsCarouselSection extends SectionBase {
  _type: "testimonialsCarousel";
  title?: LocalizedString;
  items: Array<{
    _key: string;
    quote: LocalizedText;
    name: LocalizedString;
    avatar?: LocalizedImage;
    meta?: LocalizedString;
  }>;
}

export interface RichTextSectionData extends SectionBase {
  _type: "richTextSection";
  title?: LocalizedString;
  body: LocalizedRichText;
  media?: LocalizedImage;
}

export interface ContactFormBlockSection extends SectionBase {
  _type: "contactFormBlock";
  title: LocalizedString;
  description?: LocalizedText;
  fields: Array<{
    _key: string;
    name: string;
    type: "text" | "email" | "phone" | "textarea" | "file";
    label: LocalizedString;
    placeholder?: LocalizedString;
    required?: boolean;
  }>;
  submitLabel: LocalizedString;
  successMessage: LocalizedString;
}

export interface ContactInfoBlockSection extends SectionBase {
  _type: "contactInfoBlock";
  title?: LocalizedString;
  phoneLabel?: LocalizedString;
  emailLabel?: LocalizedString;
  addressLabel?: LocalizedString;
  showServiceAreas?: boolean;
}

// 全部 Section 联合类型
export type AnySection = VanyouSection
  | HeroCarouselSection
  | HeroSimpleSection
  | PromoMediaSplitSection
  | FeatureCardsSection
  | ServicesGridSection
  | SatisfactionBlockSection
  | CtaBannerFullSection
  | TestimonialsCarouselSection
  | RichTextSectionData
  | ContactFormBlockSection
  | ContactInfoBlockSection;

// ==================== 文档类型 ====================

export interface SiteSettings {
  _type: "siteSettings";
  siteName: LocalizedString;
  /** 导航/抽屉用的可配置简称，默认 "VANYOU"；长名 siteName 留给 SEO / 页脚 */
  siteShortName?: LocalizedString;
  logo?: LocalizedImage;
  logoRounded?: boolean;
  enabledLocales?: string[];
  contact?: {
    phone?: string;
    email?: string;
    addressText?: LocalizedString;
    addressMapUrl?: string;
  };
  socialLinks?: Array<{
    _key: string;
    label: string;
    url: string;
  }>;
  splashQuotes?: Array<{
    _key: string;
    text: LocalizedString;
  }>;
  seoDefault?: {
    title?: LocalizedString;
    description?: LocalizedText;
  };
}

export interface Navigation {
  _type: "navigation";
  headerMenu?: MenuItem[];
  footerGroups?: MenuGroup[];
}

export interface LandingPage {
  _type: "landingPage";
  seo?: SEO;
  sections: VanyouSection[];
}

export interface ConsultRequest {
  _type: "consultRequest";
  fullName: string;
  email: string;
  phone?: string;
  goal?: string;
  message?: string;
  calculatorInputs?: {
    height: number;
    weight: number;
    age: number;
    sex: "male" | "female";
    activityLevel: string;
    goal: string;
  };
  calculatorOutputs?: {
    bmi: number;
    tdee: number;
    targetCalories: number;
    formulaVersion: string;
  };
  consentTimestamp?: string;
  locale?: string;
  status?: "new" | "in-progress" | "completed" | "spam";
  submittedAt?: string;
}

// ==================== Mock 数据 docType 映射 ====================

export type MockDocType = "siteSettings" | "navigation" | "landingPage";
