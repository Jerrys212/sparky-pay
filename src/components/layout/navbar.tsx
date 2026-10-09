import type { User } from "@/types";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { SidebarToggle } from "@/components/layout/sidebar-toggle";

export function Navbar({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-[1000] -mx-6 -mt-6 mb-8 flex items-center justify-between gap-4 border-b border-black/5 bg-canvas/85 px-6 py-4 backdrop-blur-[12px] xl:-mx-10 xl:-mt-8 xl:px-10 xl:py-5">
      <SidebarToggle />
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-[.55rem] rounded-full border border-border-light bg-card px-[.9rem] py-[.45rem] text-[.8rem] font-semibold whitespace-nowrap text-muted-green md:flex">
          <span aria-hidden="true" className="size-[7px] animate-status-pulse rounded-full bg-sys-green" />
          Terminal en línea
        </div>
        <ProfileMenu user={user} />
      </div>
    </header>
  );
}

export default Navbar;
