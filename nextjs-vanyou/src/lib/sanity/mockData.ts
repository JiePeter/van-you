import type {
  SiteSettings,
  Navigation,
  LandingPage,
  MockDocType,
} from "@/types/sanity";

// ==================== SiteSettings ====================

const siteSettings: SiteSettings = {
  _type: "siteSettings",
  siteName: { en: "VANYOU Cargo Solutions Inc." },
  logo: {
    src: "/brand/vanyou-seal.png",
    alt: {
      en: "VANYOU 文友 company seal",
      zh: "VANYOU 文友 公司印章",
      zhHant: "VANYOU 文友 公司印章",
      fr: "Sceau de la société VANYOU 文友",
    },
  },
  logoRounded: false,
  enabledLocales: ["en", "zh", "zh-Hant", "fr"],
  contact: {
    phone: "+1 778 868 7899",
    email: "Tony.chiu@vanyoucargo.com",
  },
  socialLinks: [],
  splashQuotes: [
    {
      _key: "q1",
      text: { en: "From the warehouse floor to your delivery dock — handled cleanly." },
    },
    {
      _key: "q2",
      text: { en: "Precise handling, clear communication, no unnecessary noise." },
    },
  ],
  seoDefault: {
    title: {
      en: "VANYOU Cargo Solutions Inc. — Vancouver Logistics",
      zh: "VANYOU 文友货运有限公司 — 温哥华物流",
      zhHant: "VANYOU 文友貨運有限公司 — 溫哥華物流",
      fr: "VANYOU Cargo Solutions Inc. — Logistique Vancouver",
    },
    description: {
      en: "Warehouse, local logistics, and cargo support for companies that need precise handling in the Vancouver area.",
      zh: "为需要精准操作的企业提供温哥华地区的仓储、本地物流及货运支持服务。",
      zhHant: "為需要精準操作的企業提供溫哥華地區的倉儲、本地物流及貨運支援服務。",
      fr: "Entreposage, logistique locale et soutien au fret pour les entreprises qui ont besoin d'une manutention précise dans la région de Vancouver.",
    },
  },
};

// ==================== Navigation ====================

const navigation: Navigation = {
  _type: "navigation",
  headerMenu: [
    {
      _key: "home",
      label: {
        en: "Home",
        zh: "首页",
        zhHant: "首頁",
        fr: "Accueil",
      },
      link: { type: "internal", anchor: "home" },
    },
    {
      _key: "services",
      label: {
        en: "Services",
        zh: "服务",
        zhHant: "服務",
        fr: "Services",
      },
      link: { type: "internal", anchor: "services" },
    },
    {
      _key: "about",
      label: {
        en: "About",
        zh: "关于我们",
        zhHant: "關於我們",
        fr: "À propos",
      },
      link: { type: "internal", anchor: "about" },
    },
    {
      _key: "contact",
      label: {
        en: "Contact",
        zh: "联系我们",
        zhHant: "聯絡我們",
        fr: "Contact",
      },
      link: { type: "internal", anchor: "contact" },
    },
  ],
  footerGroups: [
    {
      _key: "legal",
      title: {
        en: "Legal",
        zh: "法律信息",
        zhHant: "法律資訊",
        fr: "Mentions légales",
      },
      items: [
        {
          _key: "l1",
          label: {
            en: "Privacy Policy",
            zh: "隐私政策",
            zhHant: "隱私政策",
            fr: "Politique de confidentialité",
          },
          link: { type: "modal" },
        },
        {
          _key: "l2",
          label: {
            en: "Terms of Service",
            zh: "使用条款",
            zhHant: "使用條款",
            fr: "Conditions d'utilisation",
          },
          link: { type: "modal" },
        },
      ],
    },
  ],
};

// ==================== Landing Page ====================

const landingPage: LandingPage = {
  _type: "landingPage",
  seo: {
    title: {
      en: "VANYOU Cargo Solutions Inc. — Vancouver Logistics",
      zh: "VANYOU 文友货运有限公司 — 温哥华物流",
      zhHant: "VANYOU 文友貨運有限公司 — 溫哥華物流",
      fr: "VANYOU Cargo Solutions Inc. — Logistique Vancouver",
    },
    description: {
      en: "Warehouse, drayage, cross-dock, and inventory support in the Lower Mainland.",
      zh: "为大温地区企业提供仓储、短途运输、越库作业及库存管理支持。",
      zhHant: "為大溫地區企業提供倉儲、短途運輸、越庫作業及庫存管理支援。",
      fr: "Entreposage, transport de proximité, cross-dock et gestion des stocks dans le Lower Mainland.",
    },
  },
  sections: [
    // ── 1. Hero ──
    {
      _type: "hero",
      _key: "hero",
      anchorId: "home",
      kicker: {
        en: "From Vancouver to your destination",
        zh: "从温哥华直达您的目的地",
        zhHant: "從溫哥華直達您的目的地",
        fr: "De Vancouver à votre destination",
      },
      headline: {
        en: "Cargo, warehousing & logistics — handled cleanly.",
        zh: "货运、仓储与物流——专业高效，一步到位。",
        zhHant: "貨運、倉儲與物流——專業高效，一步到位。",
        fr: "Fret, entreposage et logistique — traités avec rigueur.",
      },
      subheadline: {
        en: "Warehouse, local logistics, and cargo support for companies that need precise handling without unnecessary noise.",
        zh: "为需要精准作业、无繁琐流程的企业提供仓储、本地物流及货运支持。",
        zhHant: "為需要精準作業、無繁瑣流程的企業提供倉儲、本地物流及貨運支援。",
        fr: "Entreposage, logistique locale et soutien au fret pour les entreprises qui exigent une manutention précise et sans friction inutile.",
      },
      primaryCTA: {
        label: {
          en: "Request a Quote",
          zh: "申请报价",
          zhHant: "申請報價",
          fr: "Demander un devis",
        },
        link: { type: "internal", anchor: "contact" },
      },
      secondaryCTA: {
        label: {
          en: "View Services",
          zh: "查看服务",
          zhHant: "查看服務",
          fr: "Voir nos services",
        },
        link: { type: "internal", anchor: "services" },
      },
      heroImage: {
        src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80",
        alt: {
          en: "Container terminal aerial view",
          zh: "集装箱码头鸟瞰图",
          zhHant: "貨櫃碼頭鳥瞰圖",
          fr: "Vue aérienne d'un terminal à conteneurs",
        },
      },
      trustLine: {
        en: "Warehousing · Container Destuffing · Drayage · Cross Dock · Inventory",
        zh: "仓储 · 卸箱分拣 · 短途运输 · 越库作业 · 库存管理",
        zhHant: "倉儲 · 卸櫃分揀 · 短途運輸 · 越庫作業 · 庫存管理",
        fr: "Entreposage · Dévannage de conteneurs · Transport de proximité · Cross Dock · Inventaire",
      },
    },

    // ── 2. Services ──
    {
      _type: "services",
      _key: "services",
      anchorId: "services",
      kicker: {
        en: "Services",
        zh: "服务项目",
        zhHant: "服務項目",
        fr: "Services",
      },
      title: {
        en: "Focused logistics support,\nhandled cleanly.",
        zh: "专注物流支持，\n专业精准执行。",
        zhHant: "專注物流支援，\n專業精準執行。",
        fr: "Un soutien logistique ciblé,\nexécuté avec rigueur.",
      },
      brandStrip: {
        label: {
          en: "VANYOU service standard",
          zh: "VANYOU 服务标准",
          zhHant: "VANYOU 服務標準",
          fr: "Standard de service VANYOU",
        },
        text: {
          en: "Short lead times, clear handling, and practical coordination from warehouse floor to delivery dock.",
          zh: "短交期、规范操作，从仓库到交货站台全程实务协调。",
          zhHant: "短交期、規範操作，從倉庫到交貨站台全程實務協調。",
          fr: "Délais courts, manutention claire et coordination pratique du plancher d'entrepôt au quai de livraison.",
        },
      },
      items: [
        {
          _key: "svc1",
          image: {
            src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
            alt: {
              en: "Warehouse storage facility",
              zh: "仓储设施",
              zhHant: "倉儲設施",
              fr: "Entrepôt de stockage",
            },
          },
          title: {
            en: "Warehousing",
            zh: "仓储服务",
            zhHant: "倉儲服務",
            fr: "Entreposage",
          },
          description: {
            en: "Secure short-term and ongoing storage with practical warehouse oversight.",
            zh: "安全可靠的短期及长期仓储，配备专业仓库监管。",
            zhHant: "安全可靠的短期及長期倉儲，配備專業倉庫監管。",
            fr: "Stockage sécurisé à court et long terme avec une gestion d'entrepôt rigoureuse.",
          },
        },
        {
          _key: "svc2",
          image: {
            src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=900&q=80",
            alt: {
              en: "Container destuffing and cargo sorting",
              zh: "集装箱卸箱与货物分拣",
              zhHant: "貨櫃卸櫃與貨物分揀",
              fr: "Dévannage de conteneurs et tri des marchandises",
            },
          },
          title: {
            en: "Container Destuffing",
            zh: "集装箱卸箱",
            zhHant: "貨櫃卸櫃",
            fr: "Dévannage de conteneurs",
          },
          description: {
            en: "Careful unloading, sorting, palletizing, and preparation for the next move.",
            zh: "细心卸货、分拣、码盘，为下一环节做好准备。",
            zhHant: "細心卸貨、分揀、棧板整理，為下一環節做好準備。",
            fr: "Déchargement soigné, tri, palettisation et préparation pour l'étape suivante.",
          },
        },
        {
          _key: "svc3",
          image: {
            src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
            alt: {
              en: "Drayage truck at container terminal",
              zh: "短途运输卡车在集装箱码头",
              zhHant: "短途運輸卡車在貨櫃碼頭",
              fr: "Camion de transport de proximité au terminal à conteneurs",
            },
          },
          title: {
            en: "Drayage",
            zh: "短途运输",
            zhHant: "短途運輸",
            fr: "Transport de proximité",
          },
          description: {
            en: "Local container movement coordinated for timing, access, and receiving needs.",
            zh: "本地集装箱调运，统筹时效、进出场地及收货需求。",
            zhHant: "本地貨櫃調運，統籌時效、進出場地及收貨需求。",
            fr: "Déplacement local de conteneurs coordonné selon les délais, les accès et les besoins de réception.",
          },
        },
        {
          _key: "svc4",
          image: {
            src: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=900&q=80",
            alt: {
              en: "Cross dock freight transfer operation",
              zh: "越库货物转运作业",
              zhHant: "越庫貨物轉運作業",
              fr: "Opération de transfert de fret en cross dock",
            },
          },
          title: {
            en: "Cross Dock",
            zh: "越库作业",
            zhHant: "越庫作業",
            fr: "Cross Dock",
          },
          description: {
            en: "Fast transfer from inbound freight to outbound delivery with minimal dwell time.",
            zh: "快速将进港货物转至出港配送，最大限度缩短滞留时间。",
            zhHant: "快速將進港貨物轉至出港配送，最大限度縮短滯留時間。",
            fr: "Transfert rapide du fret entrant vers la livraison sortante avec un temps de séjour minimal.",
          },
        },
        {
          _key: "svc5",
          image: {
            src: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
            alt: {
              en: "Inventory management and stock checking",
              zh: "库存管理与库存盘点",
              zhHant: "庫存管理與庫存盤點",
              fr: "Gestion des stocks et vérification des inventaires",
            },
          },
          title: {
            en: "Inventory Support",
            zh: "库存管理支持",
            zhHant: "庫存管理支援",
            fr: "Gestion des stocks",
          },
          description: {
            en: "Receiving, stock checks, order preparation, and reporting support for growing operations.",
            zh: "为成长型企业提供收货、库存盘点、备单及报告支持。",
            zhHant: "為成長型企業提供收貨、庫存盤點、備單及報告支援。",
            fr: "Réception, vérification des stocks, préparation des commandes et soutien aux rapports pour les opérations en croissance.",
          },
          wide: true,
        },
      ],
    },

    // ── 3. About Bio ──
    {
      _type: "aboutBio",
      _key: "about",
      anchorId: "about",
      title: {
        en: "Built by professionals with hands-on warehouse and logistics operations experience.",
        zh: "由具备仓储与物流实操经验的专业人士创立。",
        zhHant: "由具備倉儲與物流實務經驗的專業人士創立。",
        fr: "Fondée par des professionnels ayant une expérience concrète des opérations d'entrepôt et de logistique.",
      },
      seal: {
        src: "/brand/vanyou-seal.png",
        alt: {
          en: "VANYOU 文友 company seal",
          zh: "VANYOU 文友 公司印章",
          zhHant: "VANYOU 文友 公司印章",
          fr: "Sceau de la société VANYOU 文友",
        },
      },
      image: {
        src: "/brand/vanyou-truck.png",
        alt: {
          en: "VANYOU truck and cargo terminal artwork",
          zh: "VANYOU 卡车与货运站插画",
          zhHant: "VANYOU 卡車與貨運站插畫",
          fr: "Illustration du camion et du terminal de fret VANYOU",
        },
      },
      bio: {
        en: "VANYOU Cargo Solutions Inc. supports businesses that need dependable warehouse handling, local freight coordination, and practical logistics execution in the Vancouver area.\n\nWe keep communication direct, operations organized, and every job grounded in real warehouse floor experience.",
        zh: "VANYOU 文友货运有限公司为温哥华地区需要可靠仓储作业、本地货运协调及实务物流执行的企业提供专业支持。\n\n我们坚持直接沟通、有序运营，每一项工作都植根于真实的仓库一线经验。",
        zhHant: "VANYOU 文友貨運有限公司為溫哥華地區需要可靠倉儲作業、本地貨運協調及實務物流執行的企業提供專業支援。\n\n我們堅持直接溝通、有序運營，每一項工作都植根於真實的倉庫一線經驗。",
        fr: "VANYOU Cargo Solutions Inc. accompagne les entreprises qui ont besoin d'une manutention fiable en entrepôt, d'une coordination locale du fret et d'une exécution logistique pratique dans la région de Vancouver.\n\nNous privilégions une communication directe, des opérations bien organisées et une expertise ancrée dans l'expérience réelle du terrain.",
      },
      ctaLabel: {
        en: "Request a Quote",
        zh: "申请报价",
        zhHant: "申請報價",
        fr: "Demander un devis",
      },
      ctaLink: { type: "internal", anchor: "contact" },
      stats: [
        {
          _key: "s1",
          value: {
            en: "Hands-on",
            zh: "实战",
            zhHant: "實戰",
            fr: "Terrain",
          },
          label: {
            en: "Operations experience",
            zh: "运营经验",
            zhHant: "營運經驗",
            fr: "Expérience opérationnelle",
          },
        },
        {
          _key: "s2",
          value: {
            en: "Local",
            zh: "本地",
            zhHant: "本地",
            fr: "Local",
          },
          label: {
            en: "Vancouver logistics support",
            zh: "温哥华物流支持",
            zhHant: "溫哥華物流支援",
            fr: "Soutien logistique à Vancouver",
          },
        },
        {
          _key: "s3",
          value: {
            en: "Clear",
            zh: "清晰",
            zhHant: "清晰",
            fr: "Clair",
          },
          label: {
            en: "Simple communication",
            zh: "简洁沟通",
            zhHant: "簡潔溝通",
            fr: "Communication simple",
          },
        },
      ],
    },

    // ── 4. Contact / Booking ──
    {
      _type: "contactBooking",
      _key: "contact",
      anchorId: "contact",
      title: {
        en: "Tell us what you need moved, stored, or handled.",
        zh: "告诉我们您需要运输、仓储或处理的货物。",
        zhHant: "告訴我們您需要運輸、倉儲或處理的貨物。",
        fr: "Dites-nous ce que vous devez transporter, stocker ou gérer.",
      },
      description: {
        en: "Send us the details and we'll get back to you.",
        zh: "请发送详情，我们将尽快与您联系。",
        zhHant: "請發送詳情，我們將盡快與您聯繫。",
        fr: "Envoyez-nous les détails et nous vous répondrons rapidement.",
      },
      fields: [
        {
          _key: "fname",
          name: "fullName",
          type: "text",
          label: {
            en: "Name",
            zh: "姓名",
            zhHant: "姓名",
            fr: "Nom",
          },
          placeholder: {
            en: "Your name",
            zh: "您的姓名",
            zhHant: "您的姓名",
            fr: "Votre nom",
          },
          required: true,
        },
        {
          _key: "fcompany",
          name: "company",
          type: "text",
          label: {
            en: "Company",
            zh: "公司",
            zhHant: "公司",
            fr: "Entreprise",
          },
          placeholder: {
            en: "Company name",
            zh: "公司名称",
            zhHant: "公司名稱",
            fr: "Nom de l'entreprise",
          },
          required: false,
        },
        {
          _key: "femail",
          name: "email",
          type: "email",
          label: {
            en: "Email",
            zh: "电子邮件",
            zhHant: "電子郵件",
            fr: "Courriel",
          },
          placeholder: {
            en: "you@company.com",
            zh: "you@company.com",
            zhHant: "you@company.com",
            fr: "vous@entreprise.com",
          },
          required: true,
        },
        {
          _key: "fphone",
          name: "phone",
          type: "text",
          label: {
            en: "Phone",
            zh: "电话",
            zhHant: "電話",
            fr: "Téléphone",
          },
          placeholder: {
            en: "Optional",
            zh: "选填",
            zhHant: "選填",
            fr: "Facultatif",
          },
          required: false,
        },
        {
          _key: "fmsg",
          name: "message",
          type: "textarea",
          label: {
            en: "Inquiry",
            zh: "询问内容",
            zhHant: "詢問內容",
            fr: "Demande",
          },
          placeholder: {
            en: "Warehousing, destuffing, drayage, cross dock, inventory support...",
            zh: "仓储、卸箱分拣、短途运输、越库作业、库存管理支持……",
            zhHant: "倉儲、卸櫃分揀、短途運輸、越庫作業、庫存管理支援……",
            fr: "Entreposage, dévannage, transport de proximité, cross dock, gestion des stocks…",
          },
          required: true,
        },
      ],
      submitLabel: {
        en: "Send Inquiry",
        zh: "发送询问",
        zhHant: "發送詢問",
        fr: "Envoyer la demande",
      },
      successMessage: {
        en: "Thanks — we received your inquiry and will reply shortly.",
        zh: "感谢您的询问，我们已收到并将尽快回复。",
        zhHant: "感謝您的詢問，我們已收到並將盡快回覆。",
        fr: "Merci — nous avons bien reçu votre demande et vous répondrons sous peu.",
      },
      contactInfo: {
        email: "Tony.chiu@vanyoucargo.com",
        phones: ["1-672-667-2558", "+1 778 868 7899"],
        areaLabel: {
          en: "Operating Area",
          zh: "服务区域",
          zhHant: "服務區域",
          fr: "Zone d'opération",
        },
        areaText: {
          en: "Vancouver, Richmond, Burnaby, Delta, Surrey, and the Lower Mainland.",
          zh: "温哥华、列治文、本拿比、三角洲、素里及大温地区。",
          zhHant: "溫哥華、列治文、本拿比、三角洲、素里及大溫地區。",
          fr: "Vancouver, Richmond, Burnaby, Delta, Surrey et le Lower Mainland.",
        },
        mapEmbedUrl: "https://www.google.com/maps?q=Vancouver%20BC&output=embed",
        card: {
          name: "Tony Chiu",
          title: {
            en: "Founder & President",
            zh: "创始人兼总裁",
            zhHant: "創辦人兼總裁",
            fr: "Fondateur et président",
          },
          company: "Vanyou Cargo Solutions Inc.",
          website: "www.vanyoucargo.com",
          seal: {
            src: "/brand/vanyou-seal.png",
            alt: {
              en: "VANYOU 文友 company seal",
              zh: "VANYOU 文友 公司印章",
              zhHant: "VANYOU 文友 公司印章",
              fr: "Sceau de la société VANYOU 文友",
            },
          },
        },
      },
      privacyNote: {
        en: "Your details are used only to respond to your inquiry.",
        zh: "您的信息仅用于回复您的询问。",
        zhHant: "您的資料僅用於回覆您的詢問。",
        fr: "Vos coordonnées sont utilisées uniquement pour répondre à votre demande.",
      },
    },
  ],
};

// ==================== 导出 ====================

export const mockData: Record<MockDocType, unknown> = {
  siteSettings,
  navigation,
  landingPage,
};
