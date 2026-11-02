import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 为相对路径图片补上 GitHub Pages 项目站的 basePath 前缀 */
function withBasePath(src?: string): string | undefined {
  if (!src || /^(https?:)?\/\//.test(src) || src.startsWith("/invest")) {
    return src;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}

/** Markdown 渲染器：GFM 表格/任务列表 + 图片自动 basePath + prose 样式 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-note">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, ...rest }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={withBasePath(typeof src === "string" ? src : undefined)}
              alt={alt ?? ""}
              loading="lazy"
              {...rest}
            />
          ),
          a: ({ children, ...rest }) => (
            <a {...rest} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
