import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[50px] -left-[50px] size-[300px] rounded-full bg-radial from-lime-translucent from-0% to-transparent to-70%"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[50px] -bottom-[100px] size-[400px] rounded-full bg-radial from-lime-translucent from-0% to-transparent to-70%"
      />
      <div className="relative w-full max-w-[440px] rounded-xxl border border-border-light bg-card p-10 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
        <div className="mb-7 flex items-center justify-center gap-[.6rem]">
          <i className="bi bi-asterisk inline-block animate-asterisk-15 text-[1.75rem] text-forest-medium" aria-hidden="true" />
          <span className="text-2xl font-extrabold tracking-[-0.03em] text-forest-dark">Spark Pay</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthShell;
