#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_POST_IDS = [
  478, 476, 405, 214, 213, 212, 37, 3, 502, 500, 1372, 406,
];

const POST_SPECS = {
  3: {
    slug: "welcome-to-ai-creative-writing",
  },
  37: {
    slug: "obsidian-00-official-guide-notes",
  },
  212: {
    slug: "obsidian-01-more-than-a-note-app",
  },
  213: {
    slug: "obsidian-02-image-management-guide",
  },
  214: {
    slug: "obsidian-03-web-viewer-guide",
  },
  405: {
    slug: "why-most-ai-agents-are-workflows",
  },
  406: {
    slug: "crawl-a-whole-site-with-claude-code",
  },
  476: {
    slug: "automate-epub-to-markdown",
  },
  478: {
    slug: "quit-short-video-addiction",
  },
  500: {
    slug: "n8n-01-self-hosting-and-updates",
  },
  502: {
    slug: "n8n-02-why-you-should-use-n8n",
  },
  1372: {
    slug: "lovable-ai-programming-guide",
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const blogDir = join(projectRoot, "src", "data", "blog");
const oldSiteBaseUrl = "https://news.qimuai.cn";

const postIds = process.argv
  .slice(2)
  .map(value => Number.parseInt(value, 10))
  .filter(Number.isInteger);

const importIds = postIds.length > 0 ? postIds : DEFAULT_POST_IDS;
const postPathMap = new Map(
  importIds.map(id => [id, `/posts/${POST_SPECS[id]?.slug ?? `news-${id}`}`])
);

const sql = `
SELECT
  CONCAT_WS(
    CHAR(9),
    b.gid,
    HEX(CAST(b.title AS BINARY)),
    HEX(CAST(COALESCE(b.alias, '') AS BINARY)),
    FROM_UNIXTIME(b.date, '%Y-%m-%dT%H:%i:%sZ'),
    HEX(CAST(COALESCE(NULLIF(b.excerpt, ''), '') AS BINARY)),
    HEX(CAST(b.content AS BINARY)),
    HEX(
      CAST(
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(t.tagname)
            FROM emlog_tag t
            WHERE FIND_IN_SET(b.gid, t.gid)
          ),
          JSON_ARRAY()
        ) AS BINARY
      )
    )
  )
FROM emlog_blog b
WHERE b.type = 'blog'
  AND b.gid IN (${importIds.join(",")})
ORDER BY FIELD(b.gid, ${importIds.join(",")});
`.trim();

function runMysqlExport(query) {
  return execFileSync(
    "ssh",
    [
      "tencent02",
      "mysql",
      "-N",
      "-B",
      "--default-character-set=utf8mb4",
      "-uqimuai_cn",
      "-pKnipDbfDfN",
      "-D",
      "qimuai_cn",
    ],
    {
      input: `${query}\n`,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["pipe", "pipe", "pipe"],
    }
  );
}

function decodeHex(value) {
  if (!value) return "";
  return Buffer.from(value, "hex").toString("utf8");
}

function escapeYamlString(value) {
  return JSON.stringify(value);
}

function cleanDescription(excerpt, content) {
  const source = excerpt || content;
  const text = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const chars = Array.from(text);
  return chars.length > 120 ? `${chars.slice(0, 120).join("").trim()}...` : text;
}

function demoteHeadings(markdown) {
  const lines = markdown.split("\n");
  const result = [];
  let inFence = false;
  let fenceMarker = "";
  let minimumHeadingLevel = Number.POSITIVE_INFINITY;

  for (const line of lines) {
    const trimmed = line.trimStart();
    const fenceMatch = trimmed.match(/^(```+|~~~+)/);

    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        inFence = false;
        fenceMarker = "";
      }
      continue;
    }

    if (!inFence) {
      const headingMatch = line.match(/^(#{1,6})\s+/);
      if (headingMatch) {
        minimumHeadingLevel = Math.min(
          minimumHeadingLevel,
          headingMatch[1].length
        );
      }
    }
  }

  if (minimumHeadingLevel > 1 || minimumHeadingLevel === Number.POSITIVE_INFINITY) {
    return markdown;
  }

  inFence = false;
  fenceMarker = "";

  for (const line of lines) {
    const trimmed = line.trimStart();
    const fenceMatch = trimmed.match(/^(```+|~~~+)/);

    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        inFence = false;
        fenceMarker = "";
      }
      result.push(line);
      continue;
    }

    if (!inFence) {
      const headingMatch = line.match(/^(#{1,5})(\s+.+)$/);
      if (headingMatch) {
        result.push(`#${line}`);
        continue;
      }
    }

    result.push(line);
  }

  return result.join("\n");
}

function absolutizeUrls(markdown) {
  return markdown
    .replace(/\]\((\/(?!\/)[^)]+)\)/g, `](${oldSiteBaseUrl}$1)`)
    .replace(
      /\b(src|href)=["']\/(?!\/)([^"']+)["']/g,
      (_, attr, path) => `${attr}="${oldSiteBaseUrl}/${path}"`
    );
}

function rewriteImportedLinks(markdown) {
  let result = markdown;

  for (const [postId, path] of postPathMap) {
    const patterns = [
      new RegExp(`https?:\\/\\/news\\.qimuai\\.cn\\/\\?post=${postId}\\b`, "g"),
      new RegExp(`https?:\\/\\/news\\.qimuai\\.cn\\/index\\.php\\?post=${postId}\\b`, "g"),
      new RegExp(`(?<![\\w/])\\/\\?post=${postId}\\b`, "g"),
    ];

    for (const pattern of patterns) {
      result = result.replace(pattern, path);
    }
  }

  return result;
}

function normalizeTags(tags) {
  return [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];
}

function normalizeContent(content) {
  return rewriteImportedLinks(
    absolutizeUrls(demoteHeadings(content.replace(/\r\n?/g, "\n").trim()))
  );
}

function buildFrontmatter(post) {
  const tagLines =
    post.tags.length > 0
      ? ["tags:", ...post.tags.map(tag => `  - ${escapeYamlString(tag)}`)]
      : ["tags: []"];
  const legacyPathLines =
    post.legacyPaths.length > 0
      ? [
          "legacyPaths:",
          ...post.legacyPaths.map(path => `  - ${escapeYamlString(path)}`),
        ]
      : [];

  return [
    "---",
    `author: ${escapeYamlString("Aaron")}`,
    `pubDatetime: ${post.date}`,
    `title: ${escapeYamlString(post.title)}`,
    "draft: false",
    ...tagLines,
    ...legacyPathLines,
    `description: ${escapeYamlString(post.description)}`,
    "---",
    "",
  ].join("\n");
}

function buildFileContent(post) {
  return `${buildFrontmatter(post)}${post.content}\n`;
}

function ensureExpectedCount(rows) {
  if (rows.length !== importIds.length) {
    const foundIds = new Set(rows.map(row => row.gid));
    const missingIds = importIds.filter(id => !foundIds.has(id));
    throw new Error(`缺少文章：${missingIds.join(", ")}`);
  }
}

const output = runMysqlExport(sql);

const rows = output
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean)
  .map(line => {
    const [gid, titleHex, aliasHex, date, excerptHex, contentHex, tagsHex] =
      line.split("\\t");

    const title = decodeHex(titleHex);
    const excerpt = decodeHex(excerptHex);
    const content = normalizeContent(decodeHex(contentHex));
    const tags = normalizeTags(JSON.parse(decodeHex(tagsHex) || "[]"));
    const alias = decodeHex(aliasHex);

    return {
      gid: Number.parseInt(gid, 10),
      alias,
      date,
      title,
      tags,
      content,
      legacyPaths: [`/posts/news-${gid}`],
      description: cleanDescription(excerpt, content),
    };
  });

ensureExpectedCount(rows);
mkdirSync(blogDir, { recursive: true });

for (const row of rows) {
  const slug = POST_SPECS[row.gid]?.slug ?? `news-${row.gid}`;
  const filePath = join(blogDir, `${slug}.md`);
  const legacyFilePath = join(blogDir, `news-${row.gid}.md`);
  writeFileSync(filePath, buildFileContent(row), "utf8");
  if (legacyFilePath !== filePath && existsSync(legacyFilePath)) {
    rmSync(legacyFilePath);
  }
  process.stdout.write(`written ${filePath}\n`);
}
