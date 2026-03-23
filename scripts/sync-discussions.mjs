import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import kebabcase from "lodash.kebabcase";
import slugify from "slugify";

const REPO = process.env.BLOG_DISCUSSIONS_REPO ?? "qimuai/blog.qimuai.cn";
const CATEGORY_NAME = process.env.BLOG_DISCUSSIONS_CATEGORY ?? "General";
const SITE_URL = (process.env.BLOG_SITE_URL ?? "https://blog.qimuai.cn").replace(
  /\/$/,
  ""
);
const POSTS_DIR = path.join(process.cwd(), "src/data/blog");
const OUTPUT_FILE = path.join(process.cwd(), "src/data/discussions.json");

const hasNonLatin = str => /[^\x00-\x7F]/.test(str);
const slugifyStr = str =>
  hasNonLatin(str) ? kebabcase(str) : slugify(str, { lower: true });

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  return execSync("gh auth token", { encoding: "utf8" }).trim();
}

async function graphql(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      "User-Agent": "blog.qimuai.cn-sync-discussions",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  }

  return json.data;
}

function collectPosts(dir, parentSegments = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const posts = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      posts.push(
        ...collectPosts(fullPath, [...parentSegments, slugifyStr(entry.name)])
      );
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const fileContent = readFileSync(fullPath, "utf8");
    const titleMatch = fileContent.match(/^title:\s*(.+)$/m);
    const rawTitle = titleMatch?.[1]?.trim().replace(/^['"]|['"]$/g, "");
    const legacyPathsBlock = fileContent.match(
      /^legacyPaths:\n((?:\s+-\s+.+\n?)*)/m
    );
    const legacyPaths = legacyPathsBlock
      ? legacyPathsBlock[1]
          .split("\n")
          .map(line => line.match(/^\s+-\s+(.+)$/)?.[1] ?? "")
          .map(path => path.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean)
      : [];
    const slug = slugifyStr(entry.name.replace(/\.md$/, ""));
    const pagePath = ["/posts", ...parentSegments, slug].join("/");

    posts.push({
      pagePath,
      legacyPaths,
      title: rawTitle ?? slug,
      url: `${SITE_URL}${pagePath}/`,
    });
  }

  return posts.sort((a, b) => a.pagePath.localeCompare(b.pagePath));
}

function parseDiscussionPath(title) {
  const match = title.match(/^\[\s*(\/posts\/[^\]]+?)\s*\]/);
  return match?.[1];
}

const [owner, name] = REPO.split("/");
const posts = collectPosts(POSTS_DIR);

const data = await graphql(
  `
    query RepoDiscussionData($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        discussionCategories(first: 20) {
          nodes {
            id
            name
          }
        }
        discussions(first: 100) {
          nodes {
            id
            number
            title
            url
          }
        }
      }
    }
  `,
  { owner, name }
);

const repository = data.repository;
const category = repository.discussionCategories.nodes.find(
  item => item.name === CATEGORY_NAME
);

if (!category) {
  throw new Error(`Discussion category "${CATEGORY_NAME}" not found.`);
}

const existing = new Map();
for (const discussion of repository.discussions.nodes) {
  const discussionPath = parseDiscussionPath(discussion.title);
  if (!discussionPath) continue;
  existing.set(discussionPath, discussion);
}

const mapping = {};

for (const post of posts) {
  let discussion = existing.get(post.pagePath);
  const legacyDiscussion =
    discussion ??
    post.legacyPaths.map(path => existing.get(path)).find(Boolean);

  if (!discussion && legacyDiscussion) {
    const nextTitle = `[ ${post.pagePath} ] ${post.title}`;
    const nextBody = `文章地址: ${post.url}\n\n这是文章对应的 Discussion，欢迎继续补充案例、问题、勘误和后续实践。`;

    const updated = await graphql(
      `
        mutation UpdateDiscussion(
          $discussionId: ID!
          $title: String!
          $body: String!
        ) {
          updateDiscussion(
            input: { discussionId: $discussionId, title: $title, body: $body }
          ) {
            discussion {
              id
              number
              title
              url
            }
          }
        }
      `,
      {
        discussionId: legacyDiscussion.id,
        title: nextTitle,
        body: nextBody,
      }
    );

    discussion = updated.updateDiscussion.discussion;
    existing.set(post.pagePath, discussion);
  }

  if (!discussion) {
    const created = await graphql(
      `
        mutation CreateDiscussion(
          $repositoryId: ID!
          $categoryId: ID!
          $title: String!
          $body: String!
        ) {
          createDiscussion(
            input: {
              repositoryId: $repositoryId
              categoryId: $categoryId
              title: $title
              body: $body
            }
          ) {
            discussion {
              id
              number
              title
              url
            }
          }
        }
      `,
      {
        repositoryId: repository.id,
        categoryId: category.id,
        title: `[ ${post.pagePath} ] ${post.title}`,
        body: `文章地址: ${post.url}\n\n这是文章对应的 Discussion，欢迎继续补充案例、问题、勘误和后续实践。`,
      }
    );

    discussion = created.createDiscussion.discussion;
  }

  mapping[post.pagePath] = {
    number: discussion.number,
    title: discussion.title,
    url: discussion.url,
  };
}

writeFileSync(`${OUTPUT_FILE}`, `${JSON.stringify(mapping, null, 2)}\n`);
process.stdout.write(
  `Synced ${Object.keys(mapping).length} article discussions to ${OUTPUT_FILE}\n`
);
