#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const sourceDir = path.join(projectRoot, "history-articles");
const targetDir = path.join(projectRoot, "src", "data", "blog");

const ARTICLE_SPECS = {
  "3分钟搞定微信客服DeepSeek满血版小白也能轻松上手": {
    slug: "deepseek-wechat-customer-service",
    tags: ["AI应用", "deepseek", "微信", "腾讯云", "教程"],
  },
  AI编程新手如何选择六大平台对比CursorWindSurfv0Bolt通义灵码以及豆包MarsCo: {
    slug: "how-beginners-choose-ai-coding-platforms",
    tags: ["AI编程", "工具对比", "cursor", "windsurf", "bolt"],
  },
  Cursor安装与基础配置手把手教你让AI自动写代码: {
    slug: "cursor-install-and-basic-setup",
    tags: ["AI编程", "cursor", "教程", "开发环境"],
  },
  "一站式解决ComfyUI安装调试和界面操作附安装包C001 (1)": {
    slug: "comfyui-install-debug-and-ui-guide",
    title: "一站式解决 ComfyUI 安装、调试和界面操作，附安装包 C001",
    tags: ["AI绘图", "comfyui", "教程", "本地部署"],
  },
  全流程公开没有写一行代码我开发了人生中第一个商用网页: {
    slug: "my-first-commercial-webpage-without-coding",
    tags: ["建站", "零代码", "web", "实战"],
  },
  国内无痛调用GPT5Claude45的官方API绝对不会封号官方都拿你没办法: {
    slug: "use-gpt5-and-claude45-official-api-in-china",
    tags: ["API", "gpt-5", "claude", "开发者"],
  },
  大白话解释DeepSeekR1究竟厉害在什么地方: {
    slug: "why-deepseek-r1-is-so-powerful",
    tags: ["AI模型", "deepseek", "大模型", "科普"],
  },
  打开方式不对原来Kimi强大的总结能力是这么用的: {
    slug: "how-to-use-kimi-for-summaries",
    tags: ["AI工具", "kimi", "效率", "总结"],
  },
  深夜突发ClaudeSonnet45发布编程的王又升级了: {
    slug: "claude-sonnet-4-5-for-coding",
    title: "深夜突发：Claude Sonnet 4.5 发布，编程的王又升级了",
    tags: ["AI编程", "claude", "模型更新", "开发工具"],
  },
  颠覆传统搜索146k星标AI搜索引擎手把手教你部署: {
    slug: "deploy-a-146k-star-ai-search-engine",
    tags: ["开源项目", "AI搜索", "perplexica", "部署"],
  },
};

function escapeYamlString(value) {
  return JSON.stringify(value);
}

function formatYamlStringArray(key, values) {
  if (!values.length) {
    return `${key}: []`;
  }

  return `${key}:\n${values.map(value => `  - ${escapeYamlString(value)}`).join("\n")}`;
}

function cleanDescription(content) {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const chars = Array.from(text);
  return chars.length > 120 ? `${chars.slice(0, 120).join("").trim()}...` : text;
}

function demoteHeadings(markdown) {
  const lines = markdown.split("\n");
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

  return lines
    .map(line => {
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
        return line;
      }

      if (!inFence && /^(#{1,5})(\s+.+)$/.test(line)) {
        return `#${line}`;
      }

      return line;
    })
    .join("\n");
}

function normalizeEscapedLists(markdown) {
  return markdown
    .replace(/^\\-\s+/gm, "- ")
    .replace(/^(\d+)\\\.\s+/gm, "$1. ");
}

function parseDate(rawDate) {
  const match = rawDate.match(
    /(\d{4})年(\d{2})月(\d{2})日\s+(\d{2}):(\d{2})/
  );
  if (!match) {
    throw new Error(`无法解析日期：${rawDate}`);
  }

  const [, year, month, day, hour, minute] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:00+08:00`;
}

function parseArticle(filePath) {
  const stem = path.basename(filePath, ".md");
  const spec = ARTICLE_SPECS[stem];

  if (!spec) {
    throw new Error(`未配置 slug：${stem}`);
  }

  const raw = readFileSync(filePath, "utf8").replace(/\r\n?/g, "\n");
  const lines = raw.split("\n");
  const authorIndex = lines.findIndex(line => /^原创\s+.+$/.test(line.trim()));
  if (authorIndex < 0) {
    throw new Error(`未找到作者：${filePath}`);
  }

  const authorLine = lines[authorIndex].trim();
  const authorMatch = authorLine.match(/^原创\s+(.+)$/);
  if (!authorMatch) {
    throw new Error(`未找到作者：${filePath}`);
  }

  const author = authorMatch[1].trim();
  let dateIndex = authorIndex + 1;

  while (dateIndex < lines.length && lines[dateIndex].trim() === "") {
    dateIndex += 1;
  }

  const rawDate = lines[dateIndex]?.trim() ?? "";
  const pubDatetime = parseDate(rawDate);
  let bodyIndex = dateIndex + 1;

  while (bodyIndex < lines.length && lines[bodyIndex].trim() === "") {
    bodyIndex += 1;
  }

  const leadingContent = lines.slice(0, authorIndex).join("\n").trim();
  const trailingContent = lines.slice(bodyIndex).join("\n").trim();
  const mergedContent = [leadingContent, trailingContent]
    .filter(Boolean)
    .join("\n\n");
  const content = normalizeEscapedLists(demoteHeadings(mergedContent));
  const title = spec.title ?? stem.replace(/\s+\(\d+\)$/, "");

  return {
    slug: spec.slug,
    title,
    author,
    pubDatetime,
    tags: spec.tags ?? [],
    content,
    description: cleanDescription(content),
  };
}

function buildMarkdown(article) {
  return `---
author: ${escapeYamlString(article.author)}
pubDatetime: ${article.pubDatetime}
title: ${escapeYamlString(article.title)}
draft: false
${formatYamlStringArray("tags", article.tags)}
description: ${escapeYamlString(article.description)}
---

${article.content}
`;
}

mkdirSync(targetDir, { recursive: true });

const sourceFiles = readdirSync(sourceDir)
  .filter(file => file.endsWith(".md"))
  .sort();

for (const file of sourceFiles) {
  const article = parseArticle(path.join(sourceDir, file));
  const targetPath = path.join(targetDir, `${article.slug}.md`);
  writeFileSync(targetPath, buildMarkdown(article), "utf8");
  process.stdout.write(`written ${targetPath}\n`);
}
