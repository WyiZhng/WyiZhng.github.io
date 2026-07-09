import type { CollectionEntry } from "astro:content";

export type KnowledgeCategory = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
};

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "frontend",
    title: "前端",
    description: "Vue、路由、异步编程与浏览器侧开发记录。",
    keywords: ["vue", "router", "promise", "async", "前端", "javascript"],
  },
  {
    id: "git-engineering",
    title: "Git / 工程化",
    description: "版本控制、VS Code、工程流程和工具链实践。",
    keywords: ["git", "vscode", "工程", "版本控制", "系统框架"],
  },
  {
    id: "ai-yolo",
    title: "AI / YOLO",
    description: "AI 工具、计算机视觉、模型配置与实验复盘。",
    keywords: ["ai", "yolo", "视觉", "模型", "性能"],
  },
  {
    id: "project-review",
    title: "项目复盘",
    description: "博客搭建、项目过程、问题分析和阶段总结。",
    keywords: ["博客", "技术分析", "项目", "复盘"],
  },
  {
    id: "notes",
    title: "基础笔记",
    description: "暂时无法归入专题的学习笔记和测试内容。",
    keywords: ["hello", "test", "page", "blog"],
  },
];

export function getPostCategory(post: CollectionEntry<"posts">) {
  const haystack = [
    post.data.title,
    post.data.description,
    ...(post.data.tags ?? []),
    post.id,
  ]
    .join(" ")
    .toLowerCase();

  return (
    knowledgeCategories.find(category =>
      category.keywords.some(keyword => haystack.includes(keyword.toLowerCase()))
    ) ?? knowledgeCategories[knowledgeCategories.length - 1]
  );
}

export function groupPostsByCategory(posts: CollectionEntry<"posts">[]) {
  return knowledgeCategories.map(category => ({
    ...category,
    posts: posts.filter(post => getPostCategory(post).id === category.id),
  }));
}
