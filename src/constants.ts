import type { Props } from "astro";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconRss from "@/assets/icons/IconRss.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/qimuai/blog.qimuai.cn",
    linkTitle: `${SITE.title} GitHub 仓库`,
    icon: IconGitHub,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `${SITE.title} RSS 订阅`,
    icon: IconRss,
  },
] as const;

export const SHARE_LINKS: Social[] = [];
