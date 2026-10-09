import type {
  HomeContent,
  NavSection,
  ResultRow,
  ReversalConfig,
  ReversalType,
  Role,
  SupervisorOperation,
  ToastInput,
  Transaction,
  User,
} from "@/types";
import { formatMoney } from "@/lib/format";

export const users: Record<Role, User> = {
  operador: {
    name: "Laura Méndez",
    firstName: "Laura",
    initials: "LM",
    role: "operador",
    avatar: "/images/avatar.png",
  },
  supervisor: {
    name: "Carlos Rivera",
    firstName: "Carlos",
    initials: "CR",
    role: "supervisor",
    avatar: "/images/avatar.png",
  },
};

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
      ],
    },
  ],
};

const tx = (
  fecha: string,
  aprobacion: string,
  referencia: string,
  titular: string,
  tarjeta: string,
  importe: number,
): Transaction => ({ id: aprobacion, fecha, aprobacion, referencia, titular, tarjeta, importe, estatus: "Aprobada" });

export const transactions: Transaction[] = [
  tx("2026-10-08T14:32", "482913", "90817263", "Ana Sofía López", "4152******7781", 1250),
  tx("2026-10-08T12:05", "481207", "90816544", "Jorge Hernández", "5579******2210", 85),
  tx("2026-10-08T10:47", "480655", "90815902", "Mariana Torres", "4931******0458", 4200),
  tx("2026-10-07T18:20", "479318", "90814377", "Luis Ramírez", "5204******9136", 640.5),
  tx("2026-10-07T11:13", "478902", "90813820", "Valeria Gutiérrez", "4766******3302", 1899.9),
  tx("2026-10-06T16:41", "477245", "90812195", "Diego Morales", "4152******6627", 320),
  tx("2026-10-05T19:08", "476130", "90811463", "Fernanda Castillo", "5491******1874", 2150),
  tx("2026-10-05T09:36", "475588", "90810729", "Ricardo Navarro", "4027******5590", 455),
  tx("2026-10-04T13:54", "474011", "90809386", "Paola Jiménez", "5368******4021", 980.1),
  tx("2026-10-03T17:22", "473496", "90808154", "Alejandro Ruiz", "4915******8843", 760),
  tx("2026-10-02T15:10", "472870", "90807611", "Daniela Flores", "5512******3765", 1180),
  tx("2026-10-01T10:02", "471334", "90806098", "Emilio Vargas", "4213******0912", 400),
];

export const supervisorOperations: SupervisorOperation[] = [
  { id: "731045", titular: "Mariana Torres", tipo: "Cancelación", aprobacion: "731045", tarjeta: "4931******0458", importe: 4200, hora: "13:12", estatus: "Aplicado" },
  { id: "730912", titular: "Luis Ramírez", tipo: "Devolución", aprobacion: "730912", tarjeta: "5204******9136", importe: 320, hora: "12:40", estatus: "Aplicado" },
  { id: "730587", titular: "Diego Morales", tipo: "Devolución", aprobacion: "730587", tarjeta: "4152******6627", importe: 160, hora: "11:05", estatus: "Aplicado" },
  { id: "730233", titular: "Jorge Hernández", tipo: "Cancelación", aprobacion: "730233", tarjeta: "5579******2210", importe: 85, hora: "09:48", estatus: "Aplicado" },
];

export const homeContent: Record<Role, HomeContent> = {
  operador: {
    permissions: roleLabels.operador.permissions,
    stats: [
      { label: "Ventas de hoy", icon: "bi-bag-check", value: "12", note: "+3 respecto a ayer", trend: "up" },
      { label: "Monto aprobado hoy", icon: "bi-cash-stack", value: "$8,450.00", suffix: "MXN", note: "Corte en curso" },
    ],
    actions: [
      { title: "Nueva venta", description: "Cobra con tarjeta de forma segura.", href: "/operador/venta", icon: "bi-cart-plus", tone: "lime" },
      { title: "Consultas", description: "Revisa las transacciones aprobadas.", href: "/operador/consultas", icon: "bi-receipt", tone: "lime" },
    ],
    listTitle: "Últimas transacciones",
    listHref: "/operador/consultas",
  },
  supervisor: {
    permissions: roleLabels.supervisor.permissions,
    stats: [
      { label: "Cancelaciones hoy", icon: "bi-x-circle", value: "3", note: "Todas aplicadas" },
      { label: "Devoluciones hoy", icon: "bi-arrow-counterclockwise", value: "5", note: "+2 respecto a ayer", trend: "up" },
    ],
    actions: [
      { title: "Cancelación", description: "Anula una venta del mismo día.", href: "/supervisor/cancelacion", icon: "bi-x-circle", tone: "red" },
      { title: "Devolución", description: "Reembolsa total o parcialmente una venta.", href: "/supervisor/devolucion", icon: "bi-arrow-counterclockwise", tone: "orange" },
    ],
    listTitle: "Últimas operaciones",
    listHref: "/supervisor/cancelacion",
  },
};

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

export const MOCK_LATENCY_MS = 1200;
export const TOAST_DURATION_MS = 4000;
export const PAGE_SIZE = 10;

export const mockCard = "1234 ****** 5678";

export const saleResult = {
  aprobacion: "482913",
  referencia: "90817263",
  tarjeta: mockCard,
  titular: "Ana Sofía López",
  importe: 1250,
};

export const reversalResult = {
  aprobacion: "731045",
  referencia: "90817263",
  tarjeta: mockCard,
};

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
} satisfies Record<string, ToastInput | ((label: string) => ToastInput)>;

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

export const transactionsSummary = (() => {
  const total = transactions.reduce((sum, t) => sum + t.importe, 0);
  return [
    { label: "Transacciones", value: String(transactions.length), icon: "bi-receipt" },
    { label: "Monto total", value: formatMoney(total), icon: "bi-cash-stack" },
    { label: "Ticket promedio", value: formatMoney(total / transactions.length), icon: "bi-graph-up" },
  ];
})();
