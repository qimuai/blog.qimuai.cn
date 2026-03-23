const postListElement = document.getElementById("post-list");
const listMetaElement = document.getElementById("list-meta");
const editorTitleElement = document.getElementById("editor-title");
const editorMetaElement = document.getElementById("editor-meta");
const statusBannerElement = document.getElementById("status-banner");
const searchInputElement = document.getElementById("search-input");
const refreshButtonElement = document.getElementById("refresh-button");
const createButtonElement = document.getElementById("create-button");
const saveButtonElement = document.getElementById("save-button");
const editorTextareaElement = document.getElementById("editor-textarea");
const openPostLinkElement = document.getElementById("open-post-link");
const metaTitleElement = document.getElementById("meta-title");
const metaAuthorElement = document.getElementById("meta-author");
const metaPubDatetimeElement = document.getElementById("meta-pub-datetime");
const metaTagsElement = document.getElementById("meta-tags");
const metaDescriptionElement = document.getElementById("meta-description");
const metaDraftElement = document.getElementById("meta-draft");
const metaSlugElement = document.getElementById("meta-slug");

const apiBasePath = "/admin/api/posts";
const managedFrontmatterFields = ["title", "author", "pubDatetime", "description", "draft"];
const formElements = [
  metaTitleElement,
  metaAuthorElement,
  metaPubDatetimeElement,
  metaTagsElement,
  metaDescriptionElement,
  metaDraftElement,
  editorTextareaElement,
];

let posts = [];
let selectedPost = null;
let lastSerializedContent = "";
let preservedFrontmatter = "";

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function splitRawContent(rawContent) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { frontmatter: "", body: rawContent };
  }

  return {
    frontmatter: match[1],
    body: rawContent.slice(match[0].length),
  };
}

function removeManagedFields(frontmatter) {
  let sanitized = frontmatter;

  managedFrontmatterFields.forEach(fieldName => {
    const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    sanitized = sanitized.replace(new RegExp(`^${escapedField}:\\s*.*\\n?`, "m"), "");
  });

  sanitized = sanitized.replace(/^tags:\s*\[(.*)\]\s*\n?/m, "");
  sanitized = sanitized.replace(/^tags:\s*\n(?:\s*-\s*.*\n?)*/m, "");

  return sanitized.trim();
}

function parseTagsInput(value) {
  return value
    .replaceAll("，", ",")
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);
}

function buildTagsFrontmatter(tags) {
  if (!tags.length) {
    return "tags: []";
  }

  return ["tags:", ...tags.map(tag => `  - ${yamlString(tag)}`)].join("\n");
}

function serializeCurrentPost() {
  const title = metaTitleElement.value.trim() || selectedPost?.title || "";
  const author = metaAuthorElement.value.trim() || selectedPost?.author || "Aaron";
  const pubDatetime =
    metaPubDatetimeElement.value.trim() ||
    selectedPost?.pubDatetime ||
    new Date().toISOString();
  const description = metaDescriptionElement.value.trim();
  const tags = parseTagsInput(metaTagsElement.value);
  const draft = metaDraftElement.checked;
  const body = editorTextareaElement.value.replace(/^\n+/, "");
  const managedFrontmatter = [
    `title: ${yamlString(title)}`,
    `author: ${yamlString(author)}`,
    `pubDatetime: ${yamlString(pubDatetime)}`,
    `description: ${yamlString(description)}`,
    buildTagsFrontmatter(tags),
    `draft: ${draft ? "true" : "false"}`,
  ];
  const fullFrontmatter = preservedFrontmatter
    ? [...managedFrontmatter, preservedFrontmatter].join("\n")
    : managedFrontmatter.join("\n");

  return body
    ? `---\n${fullFrontmatter}\n---\n\n${body}`
    : `---\n${fullFrontmatter}\n---\n`;
}

function resetEditor() {
  selectedPost = null;
  preservedFrontmatter = "";
  lastSerializedContent = "";
  editorTitleElement.textContent = "选择左侧文章开始编辑";
  editorMetaElement.textContent = "支持快捷键 Ctrl/Cmd + S 保存。";
  openPostLinkElement.href = "https://blog.qimuai.cn";
  metaTitleElement.value = "";
  metaAuthorElement.value = "";
  metaPubDatetimeElement.value = "";
  metaTagsElement.value = "";
  metaDescriptionElement.value = "";
  metaDraftElement.checked = false;
  metaSlugElement.textContent = "-";
  editorTextareaElement.value = "";
  setEditorEnabled(false);
  updateDirtyState();
}

function setStatus(message, tone = "info") {
  if (!message) {
    statusBannerElement.hidden = true;
    statusBannerElement.textContent = "";
    statusBannerElement.className = "status-banner";
    return;
  }

  statusBannerElement.hidden = false;
  statusBannerElement.textContent = message;
  statusBannerElement.className = `status-banner ${tone}`;
}

function setEditorEnabled(enabled) {
  formElements.forEach(element => {
    element.disabled = !enabled;
  });
  saveButtonElement.disabled = !enabled;
}

function formatPostMeta(post) {
  const items = [];
  if (post.pubDatetime) items.push(post.pubDatetime);
  if (post.draft) items.push("草稿");
  if (Array.isArray(post.tags) && post.tags.length) items.push(post.tags.join(" · "));
  return items.join(" | ");
}

function getFilteredPosts() {
  const keyword = searchInputElement.value.trim().toLowerCase();
  if (!keyword) return posts;

  return posts.filter(post => {
    const haystack = [post.title, post.slug, ...(post.tags || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}

function updateDirtyState() {
  const dirty = selectedPost && serializeCurrentPost() !== lastSerializedContent;
  saveButtonElement.textContent = dirty ? "保存并发布" : "已同步";
  saveButtonElement.disabled = !selectedPost || !dirty;
}

function renderPostList() {
  const filteredPosts = getFilteredPosts();

  listMetaElement.textContent = `共 ${posts.length} 篇，当前显示 ${filteredPosts.length} 篇`;

  if (!filteredPosts.length) {
    postListElement.innerHTML = '<div class="post-summary">没有匹配的文章。</div>';
    return;
  }

  postListElement.innerHTML = "";

  filteredPosts.forEach(post => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `post-card${selectedPost?.slug === post.slug ? " active" : ""}`;
    button.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-meta">${formatPostMeta(post)}</div>
      <div class="post-summary">${post.slug}</div>
    `;
    button.addEventListener("click", () => loadPost(post.slug));
    postListElement.appendChild(button);
  });
}

async function apiFetch(pathname, options = {}) {
  const response = await fetch(pathname, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "请求失败");
  }

  return data;
}

function populateEditor(post) {
  const { frontmatter, body } = splitRawContent(post.rawContent);

  selectedPost = post;
  preservedFrontmatter = removeManagedFields(frontmatter);
  metaTitleElement.value = post.title || "";
  metaAuthorElement.value = post.author || "";
  metaPubDatetimeElement.value = post.pubDatetime || "";
  metaTagsElement.value = Array.isArray(post.tags) ? post.tags.join(", ") : "";
  metaDescriptionElement.value = post.description || "";
  metaDraftElement.checked = Boolean(post.draft);
  metaSlugElement.textContent = post.slug;
  editorTextareaElement.value = body;
  editorTitleElement.textContent = post.title;
  editorMetaElement.textContent = [
    post.slug,
    post.pubDatetime || "未填写发布时间",
    post.draft ? "当前是草稿" : "已发布文章",
  ].join(" | ");
  openPostLinkElement.href = post.publicUrl;
  setEditorEnabled(true);
  lastSerializedContent = serializeCurrentPost();
  updateDirtyState();
  renderPostList();
}

async function loadPosts(selectSlug) {
  setStatus("正在刷新文章列表…", "info");
  const data = await apiFetch(apiBasePath);
  posts = data.posts || [];
  renderPostList();

  if (selectSlug) {
    await loadPost(selectSlug);
  } else if (selectedPost) {
    const stillExists = posts.find(post => post.slug === selectedPost.slug);
    if (stillExists) {
      await loadPost(stillExists.slug);
    }
  }

  setStatus("文章列表已刷新。", "success");
}

async function loadPost(slug) {
  setStatus("正在载入文章内容…", "info");
  const data = await apiFetch(`${apiBasePath}/${slug}`);
  populateEditor(data.post);
  setStatus(`已载入《${data.post.title}》。`, "success");
}

async function saveCurrentPost() {
  if (!selectedPost) return;

  const rawContent = serializeCurrentPost();
  saveButtonElement.disabled = true;
  setStatus("正在保存并推送到 GitHub…", "info");

  try {
    const data = await apiFetch(`${apiBasePath}/${selectedPost.slug}`, {
      method: "POST",
      body: JSON.stringify({ rawContent }),
    });

    populateEditor(data.post);
    await loadPosts(data.post.slug);
    setStatus(
      data.changed
        ? `已提交并推送，提交号 ${data.commitSha}。几分钟后博客会自动更新。`
        : `内容没有变化，当前版本是 ${data.commitSha}。`,
      "success"
    );
  } catch (error) {
    setStatus(error.message || "保存失败", "error");
  } finally {
    updateDirtyState();
  }
}

async function createDraftPost() {
  const slug = window.prompt("请输入新文章的 slug（只用英文、数字和短横线）");
  if (!slug) return;

  const title = window.prompt("请输入文章标题");
  if (!title) return;

  createButtonElement.disabled = true;
  setStatus("正在创建草稿文章…", "info");

  try {
    const data = await apiFetch(apiBasePath, {
      method: "POST",
      body: JSON.stringify({ slug, title }),
    });

    await loadPosts(data.post.slug);
    setStatus(
      `草稿已创建并推送，提交号 ${data.commitSha}。你现在可以直接编辑它。`,
      "success"
    );
  } catch (error) {
    setStatus(error.message || "创建草稿失败", "error");
  } finally {
    createButtonElement.disabled = false;
  }
}

searchInputElement.addEventListener("input", renderPostList);
refreshButtonElement.addEventListener("click", () => loadPosts(selectedPost?.slug));
createButtonElement.addEventListener("click", createDraftPost);
saveButtonElement.addEventListener("click", saveCurrentPost);
formElements.forEach(element => {
  const eventName = element.type === "checkbox" ? "change" : "input";
  element.addEventListener(eventName, updateDirtyState);
});

document.addEventListener("keydown", event => {
  const saveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
  if (!saveShortcut) return;
  event.preventDefault();
  if (!saveButtonElement.disabled) {
    saveCurrentPost();
  }
});

resetEditor();
loadPosts().catch(error => {
  resetEditor();
  setStatus(error.message || "后台初始化失败", "error");
});
