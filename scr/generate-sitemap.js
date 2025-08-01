// scr/generate-sitemap.js
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://srpskivitez.github.io/DusanovZlatnik";

const scanDir = (dir) => {
  const results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath));
    } else if (file.endsWith(".html")) {
      const relativePath = path.relative(".", fullPath);
      results.push(`/${relativePath.replace(/\\/g, "/")}`);
    }
  }
  return results;
};

const staticPages = scanDir(".").filter((url) =>
  url.startsWith("/index.html") || url.startsWith("/docs/")
);

const buildUrlTag = (url) => {
  return `
  <url>
    <loc>${BASE_URL}${url}</loc>
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(buildUrlTag).join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", xml);
console.log("✅ Sitemap generated in root folder!");
