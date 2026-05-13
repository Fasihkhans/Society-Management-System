"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/admin", label: "Admin" },
  { href: "/collector", label: "Collector" },
  { href: "/resident", label: "Resident" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__badge">WS</span>
          <span>
            <strong>Work Society</strong>
            <small>Finance, receipts, and street records</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "site-nav__link site-nav__link--active" : "site-nav__link"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
