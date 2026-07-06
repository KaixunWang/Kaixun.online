import SITE_CONFIG from "@/config";

const GOOGLE_VIEWER = "https://docs.google.com/gview?embedded=1&url=";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

const getPublicPdfUrl = (src: string) => new URL(src, SITE_CONFIG.Site).href;

const getPreviewUrl = (src: string) => {
  if (LOCAL_HOSTS.has(window.location.hostname)) return src;
  return `${GOOGLE_VIEWER}${encodeURIComponent(getPublicPdfUrl(src))}`;
};

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

const renderPdf = (node: HTMLElement) => {
  if (node.dataset.pdfReady === "true") return;

  const src = node.dataset.src;
  const title = node.dataset.title || node.textContent?.trim() || "PDF";
  if (!src) return;

  node.dataset.pdfReady = "true";
  node.textContent = "";

  const preview = document.createElement("div");
  preview.className = "vh-pdf-preview";

  const iframe = document.createElement("iframe");
  iframe.src = getPreviewUrl(src);
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  preview.appendChild(iframe);

  const actions = document.createElement("p");
  actions.className = "vh-pdf-fallback";
  appendLink(actions, src, `打开 PDF：${title}`);

  if (!LOCAL_HOSTS.has(window.location.hostname)) {
    appendLink(actions, getPreviewUrl(src), "备用预览");
  }

  node.append(preview, actions);
};

export default () => {
  document.querySelectorAll<HTMLElement>(".vh-pdf[data-src]").forEach(renderPdf);
};
