import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Download, ZoomIn, ZoomOut } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMath(math, displayMode = false) {
  return katex.renderToString(math, {
    displayMode,
    throwOnError: false,
    strict: "ignore",
    trust: false
  });
}

function renderInlineLatex(text = "") {
  let safe = escapeHtml(text);
  safe = safe.replace(/\\textbf\{([^{}]+)\}/g, "<strong>$1</strong>");
  safe = safe.replace(/\\emph\{([^{}]+)\}/g, "<em>$1</em>");
  safe = safe.replace(/\\\(([\s\S]+?)\\\)/g, (_, math) => renderMath(math, false));
  safe = safe.replace(/\$([^$\n]+?)\$/g, (_, math) => renderMath(math, false));
  return safe;
}

function latexToBlocks(source = "") {
  const normalized = source
    .replace(/\\section\*?\{([^{}]+)\}/g, "\n\n@@SECTION:$1@@\n\n")
    .replace(/\\subsection\*?\{([^{}]+)\}/g, "\n\n@@SUBSECTION:$1@@\n\n")
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => `\n\n@@MATH:${math.trim()}@@\n\n`)
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, math) => `\n\n@@MATH:${math.trim()}@@\n\n`);

  return normalized
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("@@SECTION:")) return { type: "section", value: part.slice(10, -2) };
      if (part.startsWith("@@SUBSECTION:")) return { type: "subsection", value: part.slice(13, -2) };
      if (part.startsWith("@@MATH:")) return { type: "math", value: part.slice(7, -2) };
      return { type: "paragraph", value: part.replace(/\n+/g, " ") };
    });
}

function paginateLatexBlocks(blocks, maxWeight = 1850) {
  const pages = [];
  let page = [];
  let weight = 0;

  blocks.forEach((block) => {
    const blockWeight = block.value.length + (block.type === "math" ? 280 : block.type === "section" ? 180 : 80);
    if (page.length && weight + blockWeight > maxWeight) {
      pages.push(page);
      page = [];
      weight = 0;
    }
    page.push(block);
    weight += blockWeight;
  });

  if (page.length) pages.push(page);
  return pages.length ? pages : [[{ type: "paragraph", value: "Start typing LaTeX to preview notes." }]];
}

function LatexButton({ children, className = "", ...props }) {
  return (
    <button className={`btn secondary ${className}`} {...props}>
      {children}
    </button>
  );
}

function LatexBlock({ block }) {
  if (block.type === "section") {
    return <h2 dangerouslySetInnerHTML={{ __html: renderInlineLatex(block.value) }} />;
  }
  if (block.type === "subsection") {
    return <h3 dangerouslySetInnerHTML={{ __html: renderInlineLatex(block.value) }} />;
  }
  if (block.type === "math") {
    return <div className="latex-math" dangerouslySetInnerHTML={{ __html: renderMath(block.value, true) }} />;
  }
  return <p dangerouslySetInnerHTML={{ __html: renderInlineLatex(block.value) }} />;
}

export default function LatexDocument({ title, source, compact = false }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pages = useMemo(() => paginateLatexBlocks(latexToBlocks(source), compact ? 1050 : 1850), [source, compact]);
  const activeIndex = Math.min(pageIndex, pages.length - 1);
  const activePage = pages[activeIndex];

  useEffect(() => {
    setPageIndex(0);
  }, [source]);

  return (
    <section className={`latex-document ${compact ? "compact" : ""}`}>
      <div className="pdf-toolbar">
        <LatexButton
          className="icon-btn"
          aria-label="Previous LaTeX page"
          disabled={activeIndex === 0}
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
        >
          <ArrowLeft size={16} />
        </LatexButton>
        <span>{title} · page {activeIndex + 1} of {pages.length}</span>
        <LatexButton
          className="icon-btn"
          aria-label="Next LaTeX page"
          disabled={activeIndex === pages.length - 1}
          onClick={() => setPageIndex((value) => Math.min(pages.length - 1, value + 1))}
        >
          <ArrowRight size={16} />
        </LatexButton>
        {!compact && (
          <div className="toolbar-end">
            <LatexButton className="icon-btn" aria-label="Zoom in"><ZoomIn size={16} /></LatexButton>
            <LatexButton className="icon-btn" aria-label="Zoom out"><ZoomOut size={16} /></LatexButton>
            <LatexButton className="icon-btn" aria-label="Download"><Download size={16} /></LatexButton>
          </div>
        )}
      </div>
      <article className="latex-page">
        {activePage.map((block, index) => <LatexBlock block={block} key={`${block.type}-${index}`} />)}
      </article>
    </section>
  );
}
