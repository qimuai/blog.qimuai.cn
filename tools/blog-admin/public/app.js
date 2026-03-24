const postListElement = document.getElementById("post-list");
const listMetaElement = document.getElementById("list-meta");
const editorTitleElement = document.getElementById("editor-title");
const editorMetaElement = document.getElementById("editor-meta");
const statusBannerElement = document.getElementById("status-banner");
const searchInputElement = document.getElementById("search-input");
const refreshButtonElement = document.getElementById("refresh-button");
const createButtonElement = document.getElementById("create-button");
const saveButtonElement = document.getElementById("save-button");
const previewButtonElement = document.getElementById("preview-button");
const previewWindowButtonElement = document.getElementById("preview-window-button");
const editorTextareaElement = document.getElementById("editor-textarea");
const openPostLinkElement = document.getElementById("open-post-link");
const metaTitleElement = document.getElementById("meta-title");
const metaAuthorElement = document.getElementById("meta-author");
const metaPubDatetimeElement = document.getElementById("meta-pub-datetime");
const metaTagsElement = document.getElementById("meta-tags");
const metaDescriptionElement = document.getElementById("meta-description");
const metaDraftElement = document.getElementById("meta-draft");
const metaSlugElement = document.getElementById("meta-slug");
const previewPanelElement = document.getElementById("preview-panel");
const previewCloseButtonElement = document.getElementById("preview-close-button");
const previewTitleElement = document.getElementById("preview-title");
const previewMetaElement = document.getElementById("preview-meta");
const previewDescriptionElement = document.getElementById("preview-description");
const previewContentElement = document.getElementById("preview-content");
const previewKickerElement = document.getElementById("preview-kicker");
const draftModalElement = document.getElementById("draft-modal");
const draftTitleInputElement = document.getElementById("draft-title-input");
const draftSlugInputElement = document.getElementById("draft-slug-input");
const draftStatusElement = document.getElementById("draft-modal-status");
const draftCancelButtonElement = document.getElementById("draft-cancel-button");
const draftConfirmButtonElement = document.getElementById("draft-confirm-button");

const apiBasePath = "/admin/api/posts";
const previewStoragePrefix = "blog-admin:preview:";
const managedFrontmatterFields = ["title", "author", "pubDatetime", "description", "draft"];
const formElements = [
  metaTitleElement,
  metaAuthorElement,
  metaPubDatetimeElement,
  metaTagsElement,
  metaDescriptionElement,
  metaDraftElement,
  metaSlugElement,
  editorTextareaElement,
];

let posts = [];
let selectedPost = null;
let lastSerializedContent = "";
let preservedFrontmatter = "";
let previewOpen = false;
let slugTouched = false;

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function slugifyTitle(title) {
  const normalizedSlug = title
    .normalize("NFKC")
    .replace(/[’'`"]/g, "")
    .replace(/[。！？、，：；（）【】《》〈〉「」『』]/g, " ")
    .replace(/[^\p{Letter}\p{Number}\s-]+/gu, " ")
    .trim()
    .replace(/[A-Z]/g, letter => letter.toLowerCase())
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalizedSlug) return normalizedSlug;

  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `draft-${timestamp}`;
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

function getCurrentPubDatetime({ validate = false } = {}) {
  const pubDatetime =
    metaPubDatetimeElement.value.trim() ||
    selectedPost?.pubDatetime ||
    new Date().toISOString();

  if (!validate) {
    return pubDatetime;
  }

  if (!Number.isNaN(Date.parse(pubDatetime))) {
    return pubDatetime;
  }

  throw new Error("发布时间格式不正确，请使用 2026-03-24T10:00:00+08:00 这样的格式");
}

function getCurrentSlug({ validate = false } = {}) {
  const rawSlug = metaSlugElement.value.trim() || selectedPost?.slug || "";
  const normalizedSlug = slugifyTitle(rawSlug);

  if (normalizedSlug) {
    return normalizedSlug;
  }

  if (validate) {
    throw new Error("请填写有效的 slug");
  }

  return "";
}

function getPublicPostUrl(slug) {
  return `https://blog.qimuai.cn/posts/${encodeURIComponent(slug)}/`;
}

function serializeCurrentPost({ validate = false } = {}) {
  const title = metaTitleElement.value.trim() || selectedPost?.title || "";
  const author = metaAuthorElement.value.trim() || selectedPost?.author || "Aaron";
  const pubDatetime = getCurrentPubDatetime({ validate });
  const description = metaDescriptionElement.value.trim();
  const tags = parseTagsInput(metaTagsElement.value);
  const draft = metaDraftElement.checked;
  const body = editorTextareaElement.value.replace(/^\n+/, "");
  const managedFrontmatter = [
    `title: ${yamlString(title)}`,
    `author: ${yamlString(author)}`,
    `pubDatetime: ${pubDatetime}`,
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
  previewButtonElement.disabled = !enabled;
  previewWindowButtonElement.disabled = !enabled;
}

function updateOpenPostLinkState() {
  if (!selectedPost) {
    openPostLinkElement.href = "https://blog.qimuai.cn";
    openPostLinkElement.textContent = "打开线上文章";
    openPostLinkElement.removeAttribute("aria-disabled");
    return;
  }

  const draft = metaDraftElement.checked;
  const currentSlug = getCurrentSlug();

  if (draft) {
    openPostLinkElement.href = "#";
    openPostLinkElement.textContent = "草稿未公开";
    openPostLinkElement.setAttribute("aria-disabled", "true");
    return;
  }

  if (!currentSlug) {
    openPostLinkElement.href = "#";
    openPostLinkElement.textContent = "请填写 slug";
    openPostLinkElement.setAttribute("aria-disabled", "true");
    return;
  }

  if (currentSlug !== selectedPost.slug) {
    openPostLinkElement.href = "#";
    openPostLinkElement.textContent = "保存后新地址生效";
    openPostLinkElement.setAttribute("aria-disabled", "true");
    return;
  }

  openPostLinkElement.href = getPublicPostUrl(currentSlug);
  openPostLinkElement.textContent = "打开线上文章";
  openPostLinkElement.removeAttribute("aria-disabled");
}

function buildPreviewPayload({ validate = false } = {}) {
  if (!selectedPost) return null;

  const slug = getCurrentSlug({ validate });
  const title = metaTitleElement.value.trim() || "未命名文章";
  const author = metaAuthorElement.value.trim() || "Aaron";
  const pubDatetime = getCurrentPubDatetime({ validate });
  const tags = parseTagsInput(metaTagsElement.value);
  const draft = metaDraftElement.checked;
  const metadataBits = [author, pubDatetime];

  if (tags.length) {
    metadataBits.push(tags.join(" · "));
  }

  return {
    slug,
    title,
    kicker: draft ? "草稿预览" : "文章预览",
    meta: metadataBits.join(" · "),
    description: metaDescriptionElement.value.trim(),
    html: renderMarkdownToHtml(editorTextareaElement.value.trim()),
    draft,
    publicUrl:
      draft || slug !== selectedPost.slug ? "" : getPublicPostUrl(slug),
  };
}

function prunePreviewStorage(limit = 8) {
  const previewKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(previewStoragePrefix))
    .sort();

  const removableKeys = previewKeys.slice(0, Math.max(0, previewKeys.length - limit));
  removableKeys.forEach(key => localStorage.removeItem(key));
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
  metaSlugElement.value = "";
  editorTextareaElement.value = "";
  setEditorEnabled(false);
  updateOpenPostLinkState();
  closePreview();
  updateDirtyState();
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
  const slugDirty = selectedPost && getCurrentSlug() !== selectedPost.slug;
  const dirty = selectedPost && (serializeCurrentPost() !== lastSerializedContent || slugDirty);
  saveButtonElement.textContent = dirty ? "保存并发布" : "已同步";
  saveButtonElement.disabled = !selectedPost || !dirty;
  previewButtonElement.disabled = !selectedPost;
  previewWindowButtonElement.disabled = !selectedPost;
  updateOpenPostLinkState();

  if (previewOpen) {
    renderPreview();
  }
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

function renderInlineMarkdown(value) {
  const codeTokens = [];
  let output = escapeHtml(value).replace(/`([^`]+)`/g, (_, code) => {
    const token = `__CODE_${codeTokens.length}__`;
    codeTokens.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, text, url) => {
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`;
  });
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  codeTokens.forEach((html, index) => {
    output = output.replace(`__CODE_${index}__`, html);
  });

  return output;
}

function renderMarkdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let listType = "";
  let quoteLines = [];
  let codeLines = [];
  let codeLanguage = "";
  let inCodeBlock = false;

  function flushParagraph() {
    if (!paragraphLines.length) return;
    blocks.push(`<p>${renderInlineMarkdown(paragraphLines.join(" "))}</p>`);
    paragraphLines = [];
  }

  function flushList() {
    if (!listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    blocks.push(`<${tag}>${listItems.join("")}</${tag}>`);
    listItems = [];
    listType = "";
  }

  function flushQuote() {
    if (!quoteLines.length) return;
    blocks.push(`<blockquote><p>${renderInlineMarkdown(quoteLines.join(" "))}</p></blockquote>`);
    quoteLines = [];
  }

  function flushCode() {
    if (!inCodeBlock) return;
    const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : "";
    blocks.push(
      `<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`
    );
    codeLines = [];
    codeLanguage = "";
    inCodeBlock = false;
  }

  function flushAllTextBlocks() {
    flushParagraph();
    flushList();
    flushQuote();
  }

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushAllTextBlocks();
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushAllTextBlocks();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushAllTextBlocks();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    if (/^---+$/.test(trimmed) || /^___+$/.test(trimmed)) {
      flushAllTextBlocks();
      blocks.push("<hr />");
      return;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      return;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(`<li>${renderInlineMarkdown(orderedMatch[1])}</li>`);
      return;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(`<li>${renderInlineMarkdown(unorderedMatch[1])}</li>`);
      return;
    }

    flushList();
    flushQuote();
    paragraphLines.push(trimmed);
  });

  flushAllTextBlocks();
  flushCode();

  return blocks.join("\n");
}

function renderPreview() {
  const payload = buildPreviewPayload();
  if (!payload) return;

  previewKickerElement.textContent = payload.kicker;
  previewTitleElement.textContent = payload.title;
  previewMetaElement.textContent = payload.meta;
  previewDescriptionElement.textContent = payload.description;
  previewDescriptionElement.hidden = !payload.description;
  previewContentElement.innerHTML = payload.html;
}

function openPreview() {
  if (!selectedPost) return;
  previewOpen = true;
  previewPanelElement.hidden = false;
  previewButtonElement.textContent = "刷新预览";
  renderPreview();
  previewPanelElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closePreview() {
  previewOpen = false;
  previewPanelElement.hidden = true;
  previewButtonElement.textContent = "预览效果";
}

function openPreviewWindow() {
  if (!selectedPost) return;

  try {
    const payload = buildPreviewPayload({ validate: true });
    const previewId = `${Date.now()}-${payload.slug}`;
    prunePreviewStorage();
    localStorage.setItem(`${previewStoragePrefix}${previewId}`, JSON.stringify(payload));
    const previewUrl = `/admin/preview.html?preview=${encodeURIComponent(previewId)}`;
    const previewWindow = window.open(previewUrl, "_blank");

    if (!previewWindow) {
      setStatus("浏览器拦住了新窗口，请允许弹窗后再试。", "error");
      return;
    }

    previewWindow.opener = null;

    setStatus("已在新标签打开预览页。", "success");
  } catch (error) {
    setStatus(error.message || "打开预览页失败", "error");
  }
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
  metaSlugElement.value = post.slug;
  editorTextareaElement.value = body;
  editorTitleElement.textContent = post.title;
  editorMetaElement.textContent = [
    post.slug,
    post.pubDatetime || "未填写发布时间",
    post.draft ? "当前是草稿" : "已发布文章",
  ].join(" | ");
  setEditorEnabled(true);
  updateOpenPostLinkState();
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
  const data = await apiFetch(`${apiBasePath}/${encodeURIComponent(slug)}`);
  populateEditor(data.post);
  setStatus(`已载入《${data.post.title}》。`, "success");
}

async function saveCurrentPost() {
  if (!selectedPost) return;

  saveButtonElement.disabled = true;
  setStatus("正在保存并推送到 GitHub…", "info");

  try {
    const rawContent = serializeCurrentPost({ validate: true });
    const nextSlug = getCurrentSlug({ validate: true });
    const data = await apiFetch(`${apiBasePath}/${encodeURIComponent(selectedPost.slug)}`, {
      method: "POST",
      body: JSON.stringify({ rawContent, nextSlug }),
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

function openDraftModal() {
  draftModalElement.hidden = false;
  draftTitleInputElement.value = "";
  draftSlugInputElement.value = "";
  draftStatusElement.textContent = "";
  slugTouched = false;
  draftTitleInputElement.focus();
}

function closeDraftModal() {
  draftModalElement.hidden = true;
  draftStatusElement.textContent = "";
}

async function createDraftPost() {
  const slug = draftSlugInputElement.value.trim();
  const title = draftTitleInputElement.value.trim();

  if (!title) {
    draftStatusElement.textContent = "先写标题，再创建草稿。";
    draftTitleInputElement.focus();
    return;
  }

  if (!slug) {
    draftStatusElement.textContent = "请确认 slug。";
    draftSlugInputElement.focus();
    return;
  }

  draftConfirmButtonElement.disabled = true;
  draftStatusElement.textContent = "正在创建草稿…";
  setStatus("正在创建草稿文章…", "info");

  try {
    const data = await apiFetch(apiBasePath, {
      method: "POST",
      body: JSON.stringify({ slug, title }),
    });

    closeDraftModal();
    await loadPosts(data.post.slug);
    setStatus(
      `草稿已创建并推送，提交号 ${data.commitSha}。你现在可以直接编辑它。`,
      "success"
    );
  } catch (error) {
    draftStatusElement.textContent = error.message || "创建草稿失败";
    setStatus(error.message || "创建草稿失败", "error");
  } finally {
    draftConfirmButtonElement.disabled = false;
  }
}

searchInputElement.addEventListener("input", renderPostList);
refreshButtonElement.addEventListener("click", () => loadPosts(selectedPost?.slug));
createButtonElement.addEventListener("click", openDraftModal);
saveButtonElement.addEventListener("click", saveCurrentPost);
previewButtonElement.addEventListener("click", openPreview);
previewWindowButtonElement.addEventListener("click", openPreviewWindow);
previewCloseButtonElement.addEventListener("click", closePreview);
draftCancelButtonElement.addEventListener("click", closeDraftModal);
draftConfirmButtonElement.addEventListener("click", createDraftPost);
draftModalElement.addEventListener("click", event => {
  if (event.target?.dataset?.closeModal === "true") {
    closeDraftModal();
  }
});

draftTitleInputElement.addEventListener("input", () => {
  if (!slugTouched) {
    draftSlugInputElement.value = slugifyTitle(draftTitleInputElement.value);
  }
});

draftSlugInputElement.addEventListener("input", () => {
  slugTouched = true;
});

metaSlugElement.addEventListener("input", () => {
  const normalizedSlug = slugifyTitle(metaSlugElement.value);
  if (metaSlugElement.value !== normalizedSlug) {
    metaSlugElement.value = normalizedSlug;
  }
});

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
