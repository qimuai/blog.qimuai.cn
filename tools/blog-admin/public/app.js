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

let posts = [];
let selectedPost = null;
let lastLoadedContent = "";

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
  editorTextareaElement.disabled = !enabled;
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
  const dirty = selectedPost && editorTextareaElement.value !== lastLoadedContent;
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

async function loadPosts(selectSlug) {
  setStatus("正在刷新文章列表…", "info");
  const data = await apiFetch("./api/posts");
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
  const data = await apiFetch(`./api/posts/${slug}`);
  selectedPost = data.post;
  lastLoadedContent = data.post.rawContent;

  editorTitleElement.textContent = data.post.title;
  editorMetaElement.textContent = [
    data.post.slug,
    data.post.pubDatetime || "未填写发布时间",
    data.post.draft ? "当前是草稿" : "已发布文章",
  ].join(" | ");
  editorTextareaElement.value = data.post.rawContent;
  openPostLinkElement.href = data.post.publicUrl;
  setEditorEnabled(true);
  updateDirtyState();
  renderPostList();
  setStatus(`已载入《${data.post.title}》。`, "success");
}

async function saveCurrentPost() {
  if (!selectedPost) return;

  const rawContent = editorTextareaElement.value;
  saveButtonElement.disabled = true;
  setStatus("正在保存并推送到 GitHub…", "info");

  try {
    const data = await apiFetch(`./api/posts/${selectedPost.slug}`, {
      method: "POST",
      body: JSON.stringify({ rawContent }),
    });

    selectedPost = data.post;
    lastLoadedContent = data.post.rawContent;
    editorTitleElement.textContent = data.post.title;
    editorMetaElement.textContent = [
      data.post.slug,
      data.post.pubDatetime || "未填写发布时间",
      data.post.draft ? "当前是草稿" : "已发布文章",
    ].join(" | ");
    openPostLinkElement.href = data.post.publicUrl;
    await loadPosts(selectedPost.slug);
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
    const data = await apiFetch("./api/posts", {
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
editorTextareaElement.addEventListener("input", updateDirtyState);

document.addEventListener("keydown", event => {
  const saveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
  if (!saveShortcut) return;
  event.preventDefault();
  if (!saveButtonElement.disabled) {
    saveCurrentPost();
  }
});

loadPosts().catch(error => {
  setStatus(error.message || "后台初始化失败", "error");
});
