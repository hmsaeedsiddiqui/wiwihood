import { useRouter } from 'next/navigation';

export default function NavLinkButton({ href, children, style }: { href: string, children: React.ReactNode, style?: React.CSSProperties }) {
  const router = useRouter();
  return (
    <button
      style={style}
      onClick={() => router.push(href)}
    >
      {children}
    </button>
  );
}
