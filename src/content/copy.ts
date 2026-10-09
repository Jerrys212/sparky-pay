import type {
  HomeContent,
  NavSection,
  ResultRow,
  ReversalConfig,
  ReversalType,
  Role,
  StatItem,
  ToastInput,
} from "@/types";
import { formatMoney } from "@/lib/format";

export const roleLabels: Record<Role, { label: string; icon: string; permissions: string }> = {
  operador: { label: "Operador", icon: "bi-person-badge", permissions: "Ventas y Consultas" },
  supervisor: { label: "Supervisor", icon: "bi-shield-check", permissions: "Cancelaciones y Devoluciones" },
};

export const navigation: Record<Role, NavSection[]> = {
  operador: [
    { title: "General", items: [{ label: "Inicio", href: "/operador", icon: "bi-grid-fill" }] },
    {
      title: "Transacciones",
      items: [
        { label: "Nueva venta", href: "/operador/venta", icon: "bi-cart-plus" },
        { label: "Consultas", href: "/operador/consultas", icon: "bi-receipt" },
      ],
    },
  ],
  supervisor: [
    { title: "General", items: [{ label: "Inicio", href: "/supervisor", icon: "bi-grid-fill" }] },
    {
      title: "Transacciones",
      items: [
        { label: "Cancelación", href: "/supervisor/cancelacion", icon: "bi-x-circle" },
        { label: "Devolución", href: "/supervisor/devolucion", icon: "bi-arrow-counterclockwise" },
        { label: "Operaciones", href: "/supervisor/operaciones", icon: "bi-list-check" },
      ],
    },
  ],
};

export const homeContent: Record<Role, HomeContent> = {
  operador: {
    permissions: roleLabels.operador.permissions,
    actions: [
      { title: "Nueva venta", description: "Cobra con tarjeta de forma segura.", href: "/operador/venta", icon: "bi-cart-plus", tone: "lime" },
      { title: "Consultas", description: "Revisa las transacciones aprobadas.", href: "/operador/consultas", icon: "bi-receipt", tone: "lime" },
    ],
    listTitle: "Últimas transacciones",
    listHref: "/operador/consultas",
    listEmpty: { title: "Sin transacciones", description: "No pudimos cargar las transacciones o aún no hay ninguna aprobada." },
  },
  supervisor: {
    permissions: roleLabels.supervisor.permissions,
    actions: [
      { title: "Cancelación", description: "Anula una venta del mismo día.", href: "/supervisor/cancelacion", icon: "bi-x-circle", tone: "red" },
      { title: "Devolución", description: "Reembolsa total o parcialmente una venta.", href: "/supervisor/devolucion", icon: "bi-arrow-counterclockwise", tone: "orange" },
    ],
    listTitle: "Últimas operaciones",
    listHref: "/supervisor/operaciones",
    listEmpty: { title: "Sin operaciones", description: "No pudimos cargar las operaciones o aún no hay ninguna aplicada." },
  },
};

export const homeStats = {
  operador: {
    count: { label: "Transacciones aprobadas", icon: "bi-bag-check", note: "Según la última consulta" },
    amount: { label: "Monto aprobado", icon: "bi-cash-stack", suffix: "MXN", note: "Suma de las transacciones aprobadas" },
  },
  supervisor: {
    cancelaciones: { label: "Cancelaciones", icon: "bi-x-circle", note: "Aplicadas" },
    devoluciones: { label: "Devoluciones", icon: "bi-arrow-counterclockwise", note: "Aplicadas" },
  },
} satisfies Record<Role, Record<string, Omit<StatItem, "value">>>;

export const reversalConfigs: Record<ReversalType, ReversalConfig> = {
  cancelacion: {
    type: "cancelacion",
    label: "Cancelación",
    lower: "cancelación",
    subtitle: "Anula una venta realizada el mismo día.",
    buttonLabel: "Aplicar cancelación",
    icon: "bi-x-circle",
    points: [
      "La venta se realizó hoy y aún no se cierra el corte.",
      "Se anula el importe total de la operación.",
      "El cargo desaparece del estado de cuenta del cliente.",
    ],
  },
  devolucion: {
    type: "devolucion",
    label: "Devolución",
    lower: "devolución",
    subtitle: "Reembolsa total o parcialmente una venta.",
    buttonLabel: "Aplicar devolución",
    icon: "bi-arrow-counterclockwise",
    points: [
      "La venta es de un día anterior.",
      "Puedes reembolsar el total o una parte.",
      "El reembolso tarda de 3 a 5 días hábiles en reflejarse.",
    ],
  },
};

export const TOAST_DURATION_MS = 4000;
export const PAGE_SIZE = 10;

export const mockCard = "1234 ****** 5678";

export const toastMessages = {
  saleSuccess: { variant: "success", title: "Venta aprobada", message: "La transacción se procesó correctamente." },
  saleError: { variant: "error", title: "No se pudo completar", message: "Verifica los datos de la tarjeta e inténtalo de nuevo." },
  reversalSuccess: (label: string): ToastInput => ({
    variant: "success",
    title: `${label} aplicada`,
    message: "La operación se aplicó correctamente.",
  }),
  reversalError: { variant: "error", title: "No se pudo completar", message: "No se encontró una venta con esa referencia." },
  genericSuccess: { variant: "success", title: "Operación exitosa", message: "La transacción se procesó correctamente." },
  transactionsSuccess: (total: number): ToastInput => ({
    variant: "success",
    title: "Consulta exitosa",
    message: `Se cargaron ${total} transacciones aprobadas.`,
  }),
  transactionsError: {
    variant: "error",
    title: "No se pudo consultar",
    message: "No pudimos obtener las transacciones. Inténtalo de nuevo.",
  },
  operationsSuccess: (total: number): ToastInput => ({
    variant: "success",
    title: "Consulta exitosa",
    message: `Se cargaron ${total} operaciones aplicadas.`,
  }),
  operationsError: {
    variant: "error",
    title: "No se pudo consultar",
    message: "No pudimos obtener las operaciones. Inténtalo de nuevo.",
  },
  logoutSuccess: { variant: "success", title: "Sesión cerrada", message: "Cerraste sesión correctamente." },
} satisfies Record<string, ToastInput | ((...args: never[]) => ToastInput)>;

export const sampleSaleReceipt: { title: string; date: string; rows: ResultRow[] } = {
  title: "Venta aprobada",
  date: "8 de octubre de 2026, 14:32",
  rows: [
    { label: "No. de aprobación", value: "482913" },
    { label: "Referencia financiera", value: "90817263" },
    { label: "Tarjeta", value: mockCard },
    { label: "Titular", value: "Ana Sofía López" },
    { label: "Importe", value: formatMoney(1250) },
    { label: "Fecha", value: "8 oct 2026, 14:32" },
  ],
};

export const sampleCancelReceipt: { title: string; date: string; rows: ResultRow[] } = {
  title: "Cancelación aplicada",
  date: "8 de octubre de 2026, 15:05",
  rows: [
    { label: "No. de aprobación", value: "731045" },
    { label: "Referencia financiera", value: "90817263" },
    { label: "Tarjeta", value: mockCard },
    { label: "Estatus", badge: "Aplicado" },
    { label: "Fecha", value: "8 oct 2026, 15:05" },
  ],
};
