import { EMAIL, GITHUB_HANDLE, GITHUB_URL, X_HANDLE, X_URL } from "../lib/profile";

// ＝＝＝ 連絡先（X / GitHub / メール）。URL は app/lib/profile.ts ＝＝＝
export type ContactKind = "x" | "github" | "mail";

export const contactLinks: { label: string; href: string; icon: ContactKind; external: boolean }[] = [
  { label: X_HANDLE, href: X_URL, icon: "x", external: true },
  { label: GITHUB_HANDLE, href: GITHUB_URL, icon: "github", external: true },
  { label: EMAIL, href: `mailto:${EMAIL}`, icon: "mail", external: false },
];

const PATH_X = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const PATH_GITHUB = "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z";

// アイコン（X / GitHub は塗り、メールは線）。size はピクセル、className は詳細ページのホバー演出用
export const ContactIcon = ({ kind, size = 14, className }: { kind: ContactKind; size?: number; className?: string }) => {
  if (kind === "x" || kind === "github") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
        <path d={kind === "x" ? PATH_X : PATH_GITHUB} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
};

// 詳細ページのフッターの連絡先ブロック（大きいアイコン + ハンドル名。縦に並べる）
export default function ContactLinks() {
  return (
    <div className="flex flex-col gap-6 mb-16 items-start">
      {contactLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          className="flex items-center gap-4 max-lg:min-h-11 text-silk hover:text-silk-muted active:text-silk-muted transition-colors group"
        >
          <ContactIcon kind={link.icon} size={28} className="group-hover:scale-110 transition-transform" />
          <span className="text-xl font-normal tracking-wide">{link.label}</span>
        </a>
      ))}
    </div>
  );
}
