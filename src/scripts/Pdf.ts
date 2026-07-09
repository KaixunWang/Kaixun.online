import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

const appendLink = (container: HTMLElement, href: string, text: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener nofollow";

  const span = document.createElement("span");
  span.textContent = text;
  link.appendChild(span);
  container.appendChild(link);
};

const loadPdfData = async (src: string) => {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.arrayBuffer();
};

const openPdf = async (src: string) => {
  const data = await loadPdfData(src);

  try {
    return await getDocument({ data }).promise;
  } catch {
    return getDocument({ data, disableWorker: true }).promise;
  }
};

const renderPage = async (
  pdf: Awaited<ReturnType<typeof openPdf>>,
  pageNum: number,
  pageEl: HTMLElement,
) => {
  if (pageEl.dataset.rendered === "true") return;

  const page = await pdf.getPage(pageNum);
  const baseViewport = page.getViewport({ scale: 1 });
  const width = pageEl.clientWidth || pageEl.parentElement?.clientWidth || 0;
  const scale = width > 0 ? width / baseViewport.width : 1;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = "100%";
  canvas.style.height = "auto";

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  pageEl.textContent = "";
  pageEl.appendChild(canvas);
  pageEl.dataset.rendered = "true";
};

const observePages = (
  pdf: Awaited<ReturnType<typeof openPdf>>,
  preview: HTMLElement,
  pageCount: number,
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const pageEl = entry.target as HTMLElement;
        const pageNum = Number(pageEl.dataset.page);
        if (!pageNum) return;
        void renderPage(pdf, pageNum, pageEl).catch(() => {
          pageEl.textContent = `第 ${pageNum} 页加载失败`;
        });
        observer.unobserve(pageEl);
      });
    },
    { root: preview, rootMargin: "240px 0px" },
  );

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pageEl = document.createElement("div");
    pageEl.className = "vh-pdf-page";
    pageEl.dataset.page = String(pageNum);
    pageEl.textContent = `第 ${pageNum} 页加载中…`;
    preview.appendChild(pageEl);
    observer.observe(pageEl);
  }
};

const renderPdf = async (node: HTMLElement) => {
  if (node.dataset.pdfReady === "true") return;

  const src = node.dataset.src;
  const title = node.dataset.title || node.textContent?.trim() || "PDF";
  if (!src) return;

  node.dataset.pdfReady = "true";
  node.textContent = "";

  const preview = document.createElement("div");
  preview.className = "vh-pdf-preview";

  const loading = document.createElement("div");
  loading.className = "vh-pdf-loading";
  loading.textContent = "PDF 加载中…";
  preview.appendChild(loading);

  const actions = document.createElement("p");
  actions.className = "vh-pdf-fallback";
  appendLink(actions, src, `打开 PDF：${title}`);

  node.append(preview, actions);

  try {
    const pdf = await openPdf(src);
    loading.remove();
    observePages(pdf, preview, pdf.numPages);
  } catch {
    loading.textContent = "PDF 预览加载失败，请使用下方链接直接打开。";
  }
};

export default () => {
  document.querySelectorAll<HTMLElement>(".vh-pdf[data-src]").forEach((node) => {
    void renderPdf(node);
  });
};
