const shellElement = document.getElementById("shell");
const postListElement = document.getElementById("post-list");
const listMetaElement = document.getElementById("list-meta");
const editorTitleElement = document.getElementById("editor-title");
const editorMetaElement = document.getElementById("editor-meta");
const draftSyncIndicatorElement = document.getElementById("draft-sync-indicator");
const statusBannerElement = document.getElementById("status-banner");
const searchInputElement = document.getElementById("search-input");
const refreshButtonElement = document.getElementById("refresh-button");
const createButtonElement = document.getElementById("create-button");
const saveButtonElement = document.getElementById("save-button");
const previewButtonElement = document.getElementById("preview-button");
const previewWindowButtonElement = document.getElementById("preview-window-button");
const sidebarToggleButtonElement = document.getElementById("sidebar-toggle-button");
const focusModeButtonElement = document.getElementById("focus-mode-button");
const editorTextareaElement = document.getElementById("editor-textarea");
const openPostLinkElement = document.getElementById("open-post-link");
const metaTitleElement = document.getElementById("meta-title");
const metaAuthorElement = document.getElementById("meta-author");
const metaPubDatetimeElement = document.getElementById("meta-pub-datetime");
const metaTagsElement = document.getElementById("meta-tags");
const metaDescriptionElement = document.getElementById("meta-description");
const metaDraftElement = document.getElementById("meta-draft");
const metaSlugElement = document.getElementById("meta-slug");
const bodyPanelElement = document.getElementById("body-panel");
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
const toolbarButtonElements = Array.from(document.querySelectorAll("[data-md-action]"));

const apiBasePath = "/admin/api/posts";
const previewStoragePrefix = "blog-admin:preview:";
const localDraftPrefix = "blog-admin:draft:";
const lastSelectedPostKey = "blog-admin:last-selected-post";
const uiPreferencesKey = "blog-admin:ui";
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
let sidebarCollapsed = false;
let focusMode = false;
let sidebarBeforeFocusMode = false;
let draftSaveTimer = null;

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

function getUiPreferences() {
  try {
    return JSON.parse(localStorage.getItem(uiPreferencesKey) || "{}");
  } catch {
    return {};
  }
}

function saveUiPreferences() {
  localStorage.setItem(
    uiPreferencesKey,
    JSON.stringify({
      sidebarCollapsed,
    })
  );
}

function applyShellState() {
  shellElement.classList.toggle("sidebar-collapsed", sidebarCollapsed);
  shellElement.classList.toggle("focus-mode", focusMode);
  sidebarToggleButtonElement.textContent = sidebarCollapsed ? "显示文章列表" : "隐藏文章列表";
  focusModeButtonElement.textContent = focusMode ? "退出全屏" : "全屏编辑";
  focusModeButtonElement.classList.toggle("is-active", focusMode);
  sidebarToggleButtonElement.disabled = focusMode;
  sidebarToggleButtonElement.setAttribute("aria-pressed", sidebarCollapsed ? "true" : "false");
  focusModeButtonElement.setAttribute("aria-pressed", focusMode ? "true" : "false");
}

function setSidebarCollapsed(nextValue, { persist = true } = {}) {
  sidebarCollapsed = Boolean(nextValue);
  applyShellState();

  if (persist) {
    saveUiPreferences();
  }
}

async function setFocusMode(nextValue) {
  const targetValue = Boolean(nextValue);
  if (focusMode === targetValue) return;

  focusMode = targetValue;

  if (focusMode) {
    sidebarBeforeFocusMode = sidebarCollapsed;
    setSidebarCollapsed(true, { persist: false });
    applyShellState();

    if (bodyPanelElement.requestFullscreen && !document.fullscreenElement) {
      try {
        await bodyPanelElement.requestFullscreen();
      } catch {
        /* 浏览器不支持或拒绝时，仍然保留页面内的专注模式 */
      }
    }

    editorTextareaElement.focus();
    return;
  }

  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  }

  setSidebarCollapsed(sidebarBeforeFocusMode, { persist: false });
  sidebarBeforeFocusMode = sidebarCollapsed;
  applyShellState();
}

function updateDraftSyncIndicator(message = "本地草稿会自动保存在浏览器。", tone = "") {
  draftSyncIndicatorElement.textContent = message;
  draftSyncIndicatorElement.className = `draft-sync-indicator${tone ? ` ${tone}` : ""}`;
}

function formatAutosaveTime(timestamp) {
  try {
    return new Date(timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

function getCurrentEditorSnapshot() {
  if (!selectedPost) return null;

  return {
    sourceSlug: selectedPost.slug,
    title: metaTitleElement.value.trim(),
    author: metaAuthorElement.value.trim(),
    pubDatetime: getCurrentPubDatetime(),
    tags: metaTagsElement.value.trim(),
    description: metaDescriptionElement.value.trim(),
    draft: metaDraftElement.checked,
    slug: getCurrentSlug(),
    body: editorTextareaElement.value,
  };
}

function getPostSnapshot(post) {
  const { body } = splitRawContent(post.rawContent);

  return {
    sourceSlug: post.slug,
    title: post.title || "",
    author: post.author || "",
    pubDatetime: post.pubDatetime || "",
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    description: post.description || "",
    draft: Boolean(post.draft),
    slug: post.slug,
    body,
  };
}

function normalizeSnapshot(snapshot) {
  return JSON.stringify({
    title: snapshot?.title || "",
    author: snapshot?.author || "",
    pubDatetime: snapshot?.pubDatetime || "",
    tags: snapshot?.tags || "",
    description: snapshot?.description || "",
    draft: Boolean(snapshot?.draft),
    slug: snapshot?.slug || "",
    body: snapshot?.body || "",
  });
}

function getLocalDraftKey(sourceSlug) {
  return `${localDraftPrefix}${sourceSlug}`;
}

function readLocalDraft(sourceSlug) {
  if (!sourceSlug) return null;

  try {
    return JSON.parse(localStorage.getItem(getLocalDraftKey(sourceSlug)) || "null");
  } catch {
    return null;
  }
}

function clearLocalDraft(...sourceSlugs) {
  sourceSlugs.filter(Boolean).forEach(sourceSlug => {
    localStorage.removeItem(getLocalDraftKey(sourceSlug));
  });
}

function persistLocalDraft() {
  if (!selectedPost) return;

  const currentSnapshot = getCurrentEditorSnapshot();
  const serverSnapshot = getPostSnapshot(selectedPost);

  if (normalizeSnapshot(currentSnapshot) === normalizeSnapshot(serverSnapshot)) {
    clearLocalDraft(selectedPost.slug);
    updateDraftSyncIndicator();
    return;
  }

  const payload = {
    ...currentSnapshot,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(getLocalDraftKey(selectedPost.slug), JSON.stringify(payload));
  localStorage.setItem(lastSelectedPostKey, selectedPost.slug);
  updateDraftSyncIndicator(`本地草稿已自动保存 ${formatAutosaveTime(payload.savedAt)}`, "saved");
}

function scheduleLocalDraftSave() {
  if (!selectedPost) return;

  window.clearTimeout(draftSaveTimer);
  draftSaveTimer = window.setTimeout(() => {
    persistLocalDraft();
  }, 450);
}

function restoreLocalDraftIfNeeded(post) {
  const savedDraft = readLocalDraft(post.slug);
  if (!savedDraft) {
    updateDraftSyncIndicator();
    return false;
  }

  if (normalizeSnapshot(savedDraft) === normalizeSnapshot(getPostSnapshot(post))) {
    clearLocalDraft(post.slug);
    updateDraftSyncIndicator();
    return false;
  }

  metaTitleElement.value = savedDraft.title || "";
  metaAuthorElement.value = savedDraft.author || "";
  metaPubDatetimeElement.value = savedDraft.pubDatetime || "";
  metaTagsElement.value = savedDraft.tags || "";
  metaDescriptionElement.value = savedDraft.description || "";
  metaDraftElement.checked = Boolean(savedDraft.draft);
  metaSlugElement.value = savedDraft.slug || post.slug;
  editorTextareaElement.value = savedDraft.body || "";
  updateDraftSyncIndicator(
    `已恢复浏览器里的本地草稿 ${formatAutosaveTime(savedDraft.savedAt)}`,
    "restored"
  );
  setStatus("已恢复浏览器里的本地草稿，你可以继续编辑。", "info");
  return true;
}

function updateEditorMetaLine() {
  if (!selectedPost) {
    editorMetaElement.textContent = "支持快捷键 Ctrl/Cmd + S 保存。";
    return;
  }

  editorMetaElement.textContent = [
    getCurrentSlug() || selectedPost.slug,
    metaPubDatetimeElement.value.trim() || "未填写发布时间",
    metaDraftElement.checked ? "当前是草稿" : "已发布文章",
  ].join(" | ");
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
  focusModeButtonElement.disabled = !enabled;
  toolbarButtonElements.forEach(button => {
    button.disabled = !enabled;
  });
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
  window.clearTimeout(draftSaveTimer);
  editorTitleElement.textContent = "选择左侧文章开始编辑";
  updateEditorMetaLine();
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
  updateDraftSyncIndicator();
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
  focusModeButtonElement.disabled = !selectedPost;
  updateEditorMetaLine();
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

function updateTextareaSelection(nextValue, selectionStart, selectionEnd = selectionStart) {
  editorTextareaElement.value = nextValue;
  editorTextareaElement.focus();
  editorTextareaElement.setSelectionRange(selectionStart, selectionEnd);
  editorTextareaElement.dispatchEvent(new Event("input", { bubbles: true }));
}

function wrapSelection(prefix, suffix = "", placeholder = "内容") {
  const value = editorTextareaElement.value;
  const selectionStart = editorTextareaElement.selectionStart;
  const selectionEnd = editorTextareaElement.selectionEnd;
  const selectedText = value.slice(selectionStart, selectionEnd) || placeholder;
  const nextValue = `${value.slice(0, selectionStart)}${prefix}${selectedText}${suffix}${value.slice(selectionEnd)}`;
  const cursorStart = selectionStart + prefix.length;
  const cursorEnd = cursorStart + selectedText.length;

  updateTextareaSelection(nextValue, cursorStart, cursorEnd);
}

function prefixSelectedLines(prefix) {
  const value = editorTextareaElement.value;
  const selectionStart = editorTextareaElement.selectionStart;
  const selectionEnd = editorTextareaElement.selectionEnd;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const lineEndIndex = value.indexOf("\n", selectionEnd);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const selectedBlock = value.slice(lineStart, lineEnd) || "内容";
  const nextBlock = selectedBlock
    .split("\n")
    .map(line => `${prefix}${line.replace(new RegExp(`^${prefix}`), "")}`)
    .join("\n");
  const nextValue = `${value.slice(0, lineStart)}${nextBlock}${value.slice(lineEnd)}`;

  updateTextareaSelection(nextValue, lineStart, lineStart + nextBlock.length);
}

function insertBlock(block, placeholder = "") {
  const value = editorTextareaElement.value;
  const selectionStart = editorTextareaElement.selectionStart;
  const selectionEnd = editorTextareaElement.selectionEnd;
  const selectedText = value.slice(selectionStart, selectionEnd).trim() || placeholder;
  const prefix = selectionStart > 0 && value[selectionStart - 1] !== "\n" ? "\n" : "";
  const suffix = selectionEnd < value.length && value[selectionEnd] !== "\n" ? "\n" : "";
  const renderedBlock = block.replace("__CONTENT__", selectedText);
  const nextValue = `${value.slice(0, selectionStart)}${prefix}${renderedBlock}${suffix}${value.slice(selectionEnd)}`;
  const cursorPosition = selectionStart + prefix.length + renderedBlock.length;

  updateTextareaSelection(nextValue, cursorPosition, cursorPosition);
}

function handleMarkdownAction(action) {
  if (editorTextareaElement.disabled) return;

  switch (action) {
    case "bold":
      wrapSelection("**", "**", "加粗内容");
      break;
    case "italic":
      wrapSelection("*", "*", "斜体内容");
      break;
    case "code":
      wrapSelection("`", "`", "代码");
      break;
    case "link":
      wrapSelection("[", "](https://)", "链接文字");
      break;
    case "image":
      wrapSelection("![", "](https://)", "图片说明");
      break;
    case "h2":
      prefixSelectedLines("## ");
      break;
    case "h3":
      prefixSelectedLines("### ");
      break;
    case "quote":
      prefixSelectedLines("> ");
      break;
    case "ul":
      prefixSelectedLines("- ");
      break;
    case "ol":
      prefixSelectedLines("1. ");
      break;
    case "codeblock":
      insertBlock("```text\n__CONTENT__\n```", "把代码放在这里");
      break;
    case "divider":
      insertBlock("---", "---");
      break;
    default:
      break;
  }
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
  setEditorEnabled(true);
  localStorage.setItem(lastSelectedPostKey, post.slug);
  lastSerializedContent = serializeCurrentPost();
  const restoredDraft = restoreLocalDraftIfNeeded(post);
  updateEditorMetaLine();
  updateDirtyState();
  renderPostList();
  return restoredDraft;
}

async function loadPosts(selectSlug) {
  setStatus("正在刷新文章列表…", "info");
  const data = await apiFetch(apiBasePath);
  posts = data.posts || [];
  renderPostList();
  const rememberedSlug =
    !selectSlug && !selectedPost ? localStorage.getItem(lastSelectedPostKey) : "";
  const nextSlug = selectSlug || rememberedSlug;

  if (nextSlug) {
    const rememberedPost = posts.find(post => post.slug === nextSlug);
    if (rememberedPost) {
      await loadPost(rememberedPost.slug);
    }
  } else if (selectedPost) {
    const stillExists = posts.find(post => post.slug === selectedPost.slug);
    if (stillExists) {
      await loadPost(stillExists.slug);
    }
  }

  setStatus("文章列表已刷新。", "success");
}

async function loadPost(slug) {
  if (selectedPost) {
    persistLocalDraft();
  }

  setStatus("正在载入文章内容…", "info");
  const data = await apiFetch(`${apiBasePath}/${encodeURIComponent(slug)}`);
  const restoredDraft = populateEditor(data.post);
  setStatus(
    restoredDraft
      ? `已载入《${data.post.title}》，并恢复了浏览器里的本地草稿。`
      : `已载入《${data.post.title}》。`,
    "success"
  );
}

async function saveCurrentPost() {
  if (!selectedPost) return;

  const previousSourceSlug = selectedPost.slug;
  saveButtonElement.disabled = true;
  setStatus("正在保存并推送到 GitHub…", "info");

  try {
    const rawContent = serializeCurrentPost({ validate: true });
    const nextSlug = getCurrentSlug({ validate: true });
    const data = await apiFetch(`${apiBasePath}/${encodeURIComponent(selectedPost.slug)}`, {
      method: "POST",
      body: JSON.stringify({ rawContent, nextSlug }),
    });

    clearLocalDraft(previousSourceSlug, data.post.slug);
    updateDraftSyncIndicator();
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
sidebarToggleButtonElement.addEventListener("click", () => {
  setSidebarCollapsed(!sidebarCollapsed);
});
focusModeButtonElement.addEventListener("click", () => {
  setFocusMode(!focusMode);
});
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

toolbarButtonElements.forEach(button => {
  button.addEventListener("click", () => {
    handleMarkdownAction(button.dataset.mdAction);
  });
});

formElements.forEach(element => {
  const eventName = element.type === "checkbox" ? "change" : "input";
  element.addEventListener(eventName, () => {
    updateDirtyState();
    scheduleLocalDraftSave();
  });
});

document.addEventListener("keydown", event => {
  const saveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
  if (!saveShortcut) return;
  event.preventDefault();
  if (!saveButtonElement.disabled) {
    saveCurrentPost();
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && focusMode) {
    focusMode = false;
    setSidebarCollapsed(sidebarBeforeFocusMode, { persist: false });
    sidebarBeforeFocusMode = sidebarCollapsed;
    applyShellState();
  }
});

window.addEventListener("beforeunload", () => {
  persistLocalDraft();
});

const uiPreferences = getUiPreferences();
sidebarCollapsed = Boolean(uiPreferences.sidebarCollapsed);
applyShellState();
resetEditor();
loadPosts().catch(error => {
  resetEditor();
  setStatus(error.message || "后台初始化失败", "error");
});
