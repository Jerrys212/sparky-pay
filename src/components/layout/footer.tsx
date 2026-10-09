export function Footer() {
  return (
    <footer className="-mb-2 mt-auto flex flex-col flex-wrap items-center justify-between gap-3 border-t border-text-main/6 pt-5 text-[.85rem] text-muted-green md:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <i className="bi bi-asterisk inline-block animate-asterisk-12 text-forest-medium" aria-hidden="true" />
        <span className="font-bold text-text-main">Spark Pay</span>
        <span aria-hidden="true" className="opacity-50">
          |
        </span>
        <span>© 2026 · Evaluación Front End</span>
      </div>
      <div className="flex items-center gap-[.4rem]">
        <i className="bi bi-shield-lock-fill text-sys-green" aria-hidden="true" />
        Conexión cifrada
      </div>
    </footer>
  );
}

export default Footer;
