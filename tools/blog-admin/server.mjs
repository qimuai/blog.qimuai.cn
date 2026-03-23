import { createServer } from "node:http";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const repoDir = process.env.BLOG_ADMIN_REPO_DIR || path.resolve(__dirname, "../..");
const postsDir = path.join(repoDir, "src", "data", "blog");
const branch = process.env.BLOG_ADMIN_BRANCH || "main";
const remote = process.env.BLOG_ADMIN_REMOTE || "origin";
const port = Number(process.env.BLOG_ADMIN_PORT || 4321);
const host = process.env.BLOG_ADMIN_HOST || "127.0.0.1";
const siteBaseUrl = process.env.BLOG_ADMIN_SITE_URL || "https://blog.qimuai.cn";
const siteAuthor = process.env.BLOG_ADMIN_DEFAULT_AUTHOR || "Aaron";
const gitAuthorName = process.env.BLOG_ADMIN_GIT_AUTHOR_NAME || siteAuthor;
const gitAuthorEmail =
  process.env.BLOG_ADMIN_GIT_AUTHOR_EMAIL || "blog-admin@qimuai.cn";

function getGitEnv() {
  return {
    ...process.env,
    GIT_AUTHOR_NAME: gitAuthorName,
    GIT_AUTHOR_EMAIL: gitAuthorEmail,
    GIT_COMMITTER_NAME: process.env.BLOG_ADMIN_GIT_COMMITTER_NAME || gitAuthorName,
    GIT_COMMITTER_EMAIL:
      process.env.BLOG_ADMIN_GIT_COMMITTER_EMAIL || gitAuthorEmail,
  };
}

const CONTENT_TYPE = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const saveState = {
  inProgress: false,
};

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function logInfo(message) {
  process.stdout.write(`${message}\n`);
}

function logError(message) {
  process.stderr.write(`${message}\n`);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": CONTENT_TYPE[".json"],
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(message);
}

async function readRequestBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) {
      throw new Error("请求内容过大");
    }
    chunks.push(chunk);
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function getSafeSlug(rawSlug) {
  if (typeof rawSlug !== "string") return null;
  const slug = rawSlug.trim().replace(/\.md$/i, "");
  if (!slug) return null;
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  return slug;
}

function getPostFilePath(slug) {
  return path.join(postsDir, `${slug}.md`);
}

function getPublicPostUrl(slug) {
  return `${siteBaseUrl.replace(/\/$/, "")}/posts/${slug}/`;
}

function extractFrontmatterBlock(rawContent) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n?/);
  return match?.[1] ?? "";
}

function extractField(frontmatter, fieldName) {
  const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatter.match(
    new RegExp(`^${escapedField}:\\s*(.+)$`, "m")
  );

  if (!match) return "";

  return match[1]
    .trim()
    .replace(/^['"]/, "")
    .replace(/['"]$/, "");
}

function extractTags(frontmatter) {
  const inlineMatch = frontmatter.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (inlineMatch) {
    return inlineMatch[1]
      .split(",")
      .map(tag => tag.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  const blockMatch = frontmatter.match(/^tags:\s*\n((?:\s*-\s*.+\n?)*)/m);
  if (!blockMatch) return [];

  return blockMatch[1]
    .split("\n")
    .map(line => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
    .map(tag => tag.replace(/^['"]|['"]$/g, ""));
}

async function readPostFile(slug) {
  const filePath = getPostFilePath(slug);
  const rawContent = await readFile(filePath, "utf8");
  const frontmatter = extractFrontmatterBlock(rawContent);

  return {
    slug,
    filePath,
    rawContent,
    title: extractField(frontmatter, "title") || slug,
    description: extractField(frontmatter, "description"),
    pubDatetime: extractField(frontmatter, "pubDatetime"),
    author: extractField(frontmatter, "author") || siteAuthor,
    draft: extractField(frontmatter, "draft") === "true",
    tags: extractTags(frontmatter),
    updatedAt: (await stat(filePath)).mtime.toISOString(),
    publicUrl: getPublicPostUrl(slug),
  };
}

async function listPosts() {
  const entries = await readdir(postsDir, { withFileTypes: true });
  const posts = await Promise.all(
    entries
      .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
      .map(async entry => {
        const slug = entry.name.replace(/\.md$/, "");
        const post = await readPostFile(slug);
        return {
          slug,
          title: post.title,
          pubDatetime: post.pubDatetime,
          updatedAt: post.updatedAt,
          draft: post.draft,
          tags: post.tags,
          publicUrl: post.publicUrl,
        };
      })
  );

  return posts.sort((a, b) => {
    const aTime = a.pubDatetime ? new Date(a.pubDatetime).getTime() : 0;
    const bTime = b.pubDatetime ? new Date(b.pubDatetime).getTime() : 0;
    return bTime - aTime || a.slug.localeCompare(b.slug);
  });
}

async function runGit(args) {
  const { stdout, stderr } = await execFileAsync("git", ["-C", repoDir, ...args], {
    encoding: "utf8",
    env: getGitEnv(),
  });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

async function hasStagedChanges(fileRelativePath) {
  try {
    await execFileAsync(
      "git",
      ["-C", repoDir, "diff", "--cached", "--quiet", "--", fileRelativePath],
      {
        env: getGitEnv(),
      }
    );
    return false;
  } catch (error) {
    if (error.code === 1) {
      return true;
    }
    throw error;
  }
}

async function syncRepo() {
  await runGit(["pull", "--ff-only", remote, branch]);
}

async function commitAndPush(fileRelativePath, commitMessage) {
  await runGit(["add", fileRelativePath]);
  if (!(await hasStagedChanges(fileRelativePath))) {
    const { stdout } = await runGit(["rev-parse", "--short", "HEAD"]);
    return { changed: false, commitSha: stdout };
  }

  try {
    await runGit(["commit", "-m", commitMessage]);
  } catch (error) {
    const message = `${error.stdout || ""}\n${error.stderr || ""}`.trim();
    if (message.includes("nothing to commit")) {
      const { stdout } = await runGit(["rev-parse", "--short", "HEAD"]);
      return { changed: false, commitSha: stdout };
    }
    throw error;
  }

  await runGit(["push", remote, branch]);
  const { stdout } = await runGit(["rev-parse", "--short", "HEAD"]);
  return { changed: true, commitSha: stdout };
}

function buildDraftTemplate({ title }) {
  const now = new Date().toISOString();

  return `---
title: ${yamlString(title)}
author: ${yamlString(siteAuthor)}
pubDatetime: ${now}
description: ""
tags: []
draft: true
---

在这里开始写正文。
`;
}

async function handleListPosts(res) {
  const posts = await listPosts();
  sendJson(res, 200, { posts });
}

async function handleGetPost(res, slug) {
  try {
    const post = await readPostFile(slug);
    sendJson(res, 200, { post });
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(res, 404, { error: "文章不存在" });
      return;
    }

    throw error;
  }
}

async function handleCreatePost(req, res) {
  const body = await readRequestBody(req);
  const slug = getSafeSlug(body.slug);
  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!slug || !title) {
    sendJson(res, 400, { error: "请提供合法的 slug 和标题" });
    return;
  }

  await syncRepo();

  const filePath = getPostFilePath(slug);

  try {
    await stat(filePath);
    sendJson(res, 409, { error: "同名文章已存在" });
    return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const fileRelativePath = path.relative(repoDir, filePath);
  const rawContent = buildDraftTemplate({ title });

  await writeFile(filePath, rawContent, "utf8");
  const result = await commitAndPush(fileRelativePath, `docs: create draft article ${slug}`);
  const post = await readPostFile(slug);

  sendJson(res, 201, { post, ...result });
}

async function handleSavePost(req, res, slug) {
  const body = await readRequestBody(req);
  const rawContent = typeof body.rawContent === "string" ? body.rawContent : "";

  if (!rawContent.trim().startsWith("---")) {
    sendJson(res, 400, { error: "文章内容需要保留 frontmatter 开头的 ---" });
    return;
  }

  if (saveState.inProgress) {
    sendJson(res, 409, { error: "当前有一次发布正在进行，请稍后重试" });
    return;
  }

  const filePath = getPostFilePath(slug);
  const fileRelativePath = path.relative(repoDir, filePath);

  saveState.inProgress = true;

  try {
    await syncRepo();
    await writeFile(filePath, rawContent, "utf8");
    const result = await commitAndPush(
      fileRelativePath,
      `docs: update article ${slug}`
    );
    const post = await readPostFile(slug);

    sendJson(res, 200, { post, ...result });
  } finally {
    saveState.inProgress = false;
  }
}

async function serveStaticFile(res, filePath) {
  const fileExt = path.extname(filePath);
  const contentType = CONTENT_TYPE[fileExt] || "application/octet-stream";

  try {
    await stat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendText(res, 404, "Not Found");
      return;
    }
    throw error;
  }

  res.writeHead(200, {
    "content-type": contentType,
    "cache-control": "no-store",
  });
  createReadStream(filePath).pipe(res);
}

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || host}`);
  const pathname = requestUrl.pathname
    .replace(/^\/admin(?=\/|$)/, "")
    .replace(/^$/, "/");

  try {
    if (req.method === "GET" && pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        repoDir,
        postsDir,
        branch,
        remote,
      });
      return;
    }

    if (req.method === "GET" && pathname === "/favicon.ico") {
      res.writeHead(204, {
        "cache-control": "public, max-age=86400",
      });
      res.end();
      return;
    }

    if (req.method === "GET" && pathname === "/api/posts") {
      await handleListPosts(res);
      return;
    }

    if (req.method === "POST" && pathname === "/api/posts") {
      await handleCreatePost(req, res);
      return;
    }

    if (pathname.startsWith("/api/posts/")) {
      const slug = getSafeSlug(pathname.slice("/api/posts/".length));

      if (!slug) {
        sendJson(res, 400, { error: "文章标识不合法" });
        return;
      }

      if (req.method === "GET") {
        await handleGetPost(res, slug);
        return;
      }

      if (req.method === "POST") {
        await handleSavePost(req, res, slug);
        return;
      }
    }

    const normalizedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const staticPath = path.resolve(publicDir, normalizedPath);

    if (!staticPath.startsWith(publicDir)) {
      sendText(res, 403, "Forbidden");
      return;
    }

    await serveStaticFile(res, staticPath);
  } catch (error) {
    logError(`[blog-admin] request failed: ${error.stderr || error.message || String(error)}`);
    sendJson(res, 500, {
      error: "后台处理失败",
      details: error.stderr || error.message || String(error),
    });
  }
}

createServer(handleRequest).listen(port, host, () => {
  logInfo(`[blog-admin] listening on http://${host}:${port}`);
  logInfo(`[blog-admin] repo: ${repoDir}`);
});
