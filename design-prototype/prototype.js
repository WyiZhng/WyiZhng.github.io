document.documentElement.classList.add("js");

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function readStoredTheme() {
  try {
    return localStorage.getItem("wyizhng-prototype-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("wyizhng-prototype-theme", theme);
  } catch {
    // Local file previews may block storage; the active page can still switch.
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = theme;
  storeTheme(theme);

  document.querySelectorAll("[data-theme-toggle]").forEach(button => {
    button.setAttribute("aria-label", isDark ? "切换浅色模式" : "切换深色模式");
  });

  document.querySelectorAll("[data-theme-icon]").forEach(icon => {
    icon.src = isDark
      ? "../src/assets/icons/IconSunHigh.svg"
      : "../src/assets/icons/IconMoon.svg";
  });
}

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
applyTheme(readStoredTheme() ?? preferredTheme);

document.querySelectorAll("[data-theme-toggle]").forEach(button => {
  button.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
});

const menuButton = document.querySelector("[data-menu-toggle]");
const menuIcon = document.querySelector("[data-menu-icon]");
const navLinks = document.querySelector("#primary-nav");

function setMenu(open) {
  navLinks?.classList.toggle("is-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  if (menuIcon) {
    menuIcon.src = open
      ? "../src/assets/icons/IconX.svg"
      : "../src/assets/icons/IconMenuDeep.svg";
  }
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

navLinks?.addEventListener("click", event => {
  if (event.target.closest("a")) setMenu(false);
});

const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4%" }
  );
  revealItems.forEach(item => revealObserver.observe(item));
}

const navWrap = document.querySelector("[data-nav]");
const heroVisual = document.querySelector("[data-parallax]");
let scrollTicking = false;

function updateScrollEffects() {
  navWrap?.classList.toggle("is-scrolled", window.scrollY > 24);

  if (heroVisual && !reducedMotion.matches) {
    const shift = Math.min(34, window.scrollY * 0.075);
    heroVisual.style.setProperty("--hero-shift", `${shift}px`);
  }

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  },
  { passive: true }
);
updateScrollEffects();

const homeSections = [...document.querySelectorAll("body[data-page='home'] main section[id]")];
const homeLinks = [...document.querySelectorAll("body[data-page='home'] .nav-links a[href^='#']")];

if (homeSections.length > 0 && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      homeLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55%" }
  );
  homeSections.forEach(section => sectionObserver.observe(section));
}

const searchDialog = document.querySelector("[data-search-dialog]");
const globalSearch = document.querySelector("[data-global-search]");
const globalItems = [...document.querySelectorAll("[data-global-item]")];
const globalEmpty = document.querySelector("[data-global-empty]");

function openSearch() {
  if (!searchDialog?.open) searchDialog?.showModal();
  requestAnimationFrame(() => globalSearch?.focus());
}

function closeSearch() {
  searchDialog?.close();
}

document.querySelectorAll("[data-search-open]").forEach(button => {
  button.addEventListener("click", openSearch);
});
document.querySelector("[data-search-close]")?.addEventListener("click", closeSearch);

searchDialog?.addEventListener("click", event => {
  if (event.target === searchDialog) closeSearch();
});

document.addEventListener("keydown", event => {
  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    openSearch();
  }
});

globalSearch?.addEventListener("input", () => {
  const query = globalSearch.value.trim().toLocaleLowerCase("zh-CN");
  let matches = 0;

  globalItems.forEach(item => {
    const visible = item.dataset.globalItem
      .toLocaleLowerCase("zh-CN")
      .includes(query);
    item.hidden = !visible;
    if (visible) matches += 1;
  });

  if (globalEmpty) globalEmpty.hidden = matches > 0;
});

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const blogSearch = document.querySelector("[data-blog-search]");
const blogCards = [...document.querySelectorAll("[data-category]")];
const blogEmpty = document.querySelector("[data-blog-empty]");
const loadMoreButton = document.querySelector("[data-load-more]");
let activeFilter = "all";
let expandedPosts = false;

function updateBlogCards() {
  if (blogCards.length === 0) return;
  const query = blogSearch?.value.trim().toLocaleLowerCase("zh-CN") ?? "";
  const isExploring = activeFilter !== "all" || query.length > 0;
  let visibleCount = 0;

  blogCards.forEach(card => {
    const categoryMatches =
      activeFilter === "all" || card.dataset.category.split(" ").includes(activeFilter);
    const titleMatches = card.dataset.title.toLocaleLowerCase("zh-CN").includes(query);
    const gated = card.classList.contains("is-more") && !expandedPosts && !isExploring;
    const visible = categoryMatches && titleMatches && !gated;
    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
      requestAnimationFrame(() => card.classList.add("is-visible"));
    }
  });

  if (blogEmpty) blogEmpty.hidden = visibleCount > 0;
  if (loadMoreButton) {
    loadMoreButton.hidden = expandedPosts || isExploring;
  }
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("is-active", item === button));
    updateBlogCards();
  });
});

blogSearch?.addEventListener("input", updateBlogCards);
loadMoreButton?.addEventListener("click", () => {
  expandedPosts = true;
  updateBlogCards();
});
updateBlogCards();

document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = new Date().getFullYear();
});

const copyButton = document.querySelector("[data-copy-code]");

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

copyButton?.addEventListener("click", async () => {
  const code = copyButton.parentElement?.querySelector("code")?.textContent ?? "";
  try {
    await copyText(code);
    copyButton.textContent = "已复制";
  } catch {
    copyButton.textContent = "复制失败";
  }
  window.setTimeout(() => {
    copyButton.textContent = "复制";
  }, 1300);
});

const progress = document.querySelector("[data-progress]");
const article = document.querySelector("#article-content");
const tocLinks = [...document.querySelectorAll(".article-toc a[href^='#']")];
const articleHeadings = tocLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateArticleState() {
  if (!article) return;

  if (progress) {
    const start = article.offsetTop;
    const distance = Math.max(1, article.offsetHeight - window.innerHeight);
    const percent = Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100));
    progress.style.width = `${percent}%`;
  }

  if (articleHeadings.length > 0) {
    const active = [...articleHeadings]
      .reverse()
      .find(heading => heading.getBoundingClientRect().top <= 160) ?? articleHeadings[0];
    tocLinks.forEach(link => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${active.id}`);
    });
  }
}

if (article) {
  window.addEventListener("scroll", updateArticleState, { passive: true });
  updateArticleState();
}
