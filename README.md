# YI's Blog

个人技术博客，基于 [Astro](https://astro.build/) 和 [AstroPaper](https://github.com/satnaing/astro-paper) 构建，部署到 GitHub Pages。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 内容

- 新文章放在 `src/content/posts/`
- 关于页内容在 `src/content/pages/about.md`
- 静态资源放在 `public/`
- 旧 Hexo 静态站点已保留在 `legacy-hexo-static/`

## 部署

推送到 `main` 后，GitHub Actions 会构建 Astro 项目并发布到 GitHub Pages。
