import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import type { APIContext } from "astro";

export async function getStaticPaths() {
  return SUPPORTED_LOCALES.map(lang => ({
    params: { lang },
  }));
}

export async function GET(context: APIContext) {
  const { lang } = context.params as { lang: Locale };

  const allPosts = await getCollection("blog");
  const posts = allPosts.filter(post => post.data.lang === lang);
  const sortedPosts = getSortedPosts(posts);

  const feedTitle = lang === "es" ? `${SITE.title} - Artículos` : `${SITE.title} - Posts`;
  const feedDescription =
    lang === "es"
      ? "Artículos sobre tecnología, fe y trabajo con propósito"
      : SITE.desc;

  return rss({
    title: feedTitle,
    description: feedDescription,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: `${SITE.website}/${lang}${getPath(id, filePath)}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
