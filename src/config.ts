export const SITE = {
  website: "https://blog.qimuai.cn/",
  author: "Aaron",
  profile: "https://github.com/qimuai",
  desc: "记录 AI 应用、自动化流程与工程实践。",
  title: "Qimuai Blog",
  ogImage: "qimuai-blog-og.svg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "改进这篇文章",
    url: "https://github.com/qimuai/blog.qimuai.cn/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  comments: {
    enabled: true,
    provider: "giscus",
    repo: "qimuai/blog.qimuai.cn",
    repoId: "R_kgDORuRW0A",
    category: "General",
    categoryId: "DIC_kwDORuRW0M4C5FAJ",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    lang: "zh-CN",
  },
  analytics: {
    enabled: true,
    provider: "busuanzi",
    showSiteStats: true,
    showPageStats: true,
  },
} as const;
