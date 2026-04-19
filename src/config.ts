export const SITE = {
  website: "https://www.cppbetterexplained.com/", // canonical www domain // replace this with your deployed domain
  author: "Sahil Bora",
  profile: "https://sahilbora.com",
  desc: "Free step-by-step C++ tutorials for beginners. Master pointers, OOP, STL, and more — then go deeper with the C++ Better Explained Ebook for just $19.",
  title: "C++ Better Explained",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
