"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { NavSection, User } from "@/types";
import { cn } from "@/lib/cn";
import { Avatar } from "./Avatar";
import { RoleBadge } from "./Badge";
import { useSidebar } from "./SidebarContext";

interface SidebarProps {
  sections: NavSection[];
  user: User;
  homeHref: string;
}

export function Sidebar({ sections, user, homeHref }: SidebarProps) {
  const pathname = usePathname();
  const { minimized, mobileOpen, setMobileOpen } = useSidebar();
  const labelClass = minimized ? "xl:hidden" : undefined;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <>
      <aside
        id="app-sidebar"
        aria-label="Menú lateral"
        className={cn(
          "fixed top-0 left-0 z-[1030] flex h-screen w-sidebar flex-col overflow-x-hidden overflow-y-auto border-r border-white/10 bg-forest-dark px-6 py-8 transition-all duration-300 ease-smooth xl:translate-x-0 xl:shadow-none",
          mobileOpen ? "translate-x-0 shadow-lg" : "-translate-x-full",
          minimized && "xl:w-sidebar-min xl:px-3",
        )}
      >
        <Link
          href={homeHref}
          className={cn("group mb-10 flex items-center gap-3 text-white hover:text-white", minimized && "xl:justify-center")}
        >
          <i
            className="bi bi-asterisk inline-block text-2xl text-lime transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 group-hover:text-lime-hover"
            aria-hidden="true"
          />
          <span className={cn("text-[1.35rem] font-bold tracking-[-0.025em] whitespace-nowrap text-white", labelClass)}>
            Spark Pay
          </span>
        </Link>

        <nav aria-label="Principal">
          {sections.map((section) => (
            <div key={section.title} className="mb-7">
              <div
                className={cn(
                  "mb-3 pl-3 text-[.7rem] font-bold tracking-[.12em] text-sidebar-muted uppercase opacity-60",
                  labelClass,
                )}
              >
                {section.title}
              </div>
              <ul className="flex flex-col gap-[.35rem]">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        title={item.label}
                        className={cn(
                          "relative flex items-center gap-[.85rem] rounded-md px-[.85rem] py-3 text-[.95rem] whitespace-nowrap transition-all duration-200 hover:bg-white/5 hover:text-white",
                          active ? "bg-white/5 font-semibold text-white" : "font-medium text-sidebar-muted",
                          minimized && "xl:justify-center",
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute top-[15%] -left-6 h-[70%] w-1 rounded-r-[4px] bg-lime",
                              minimized && "xl:-left-3",
                            )}
                          />
                        )}
                        <i
                          className={cn("bi", item.icon, active && "text-lime", minimized ? "text-[1.15rem] xl:text-[1.35rem]" : "text-[1.15rem]")}
                          aria-hidden="true"
                        />
                        <span className={labelClass}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            "mt-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-[.85rem]",
            minimized && "xl:justify-center",
          )}
        >
          <Avatar user={user} size="lg" tone="lime" />
          <div className={cn("flex min-w-0 flex-col items-start gap-[.3rem]", labelClass)}>
            <span className="max-w-[160px] truncate text-sm font-semibold text-white">{user.name}</span>
            <RoleBadge role={user.role} dark size="sm" />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[1025] animate-fade-in bg-forest-dark/40 backdrop-blur-[4px] xl:hidden"
        />
      )}
    </>
  );
}

export default Sidebar;
