export const EXTERNAL_LINKS = {
  personalSite: "https://yu-wenhao.com",
  blog: "https://yu-wenhao.com/blog",
  airesumeadvisor: "https://airesumeadvisor.com",
} as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/hence/",
  facebook: "https://www.facebook.com/wenhao.yu.116026",
} as const;

export function withUtm(url: string, source: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}ref=${source}`;
}
