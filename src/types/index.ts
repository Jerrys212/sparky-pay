export type Role = "operador" | "supervisor";

export interface User {
  name: string;
  firstName: string;
  initials: string;
  role: Role;
  avatar: string;
}

export type TransactionStatus = "Aprobada" | "Aplicado" | "Pendiente" | "Rechazada";
export type OperationType = "Venta" | "Cancelación" | "Devolución";
export type BadgeVariant = TransactionStatus | OperationType;

export interface Transaction {
  id: string;
  fecha: string;
  aprobacion: string;
  referencia: string;
  titular: string;
  tarjeta: string;
  importe: number;
  estatus: TransactionStatus;
}

export interface ResultRow {
  label: string;
  value?: string;
  badge?: BadgeVariant;
}

export interface OperationResult {
  title: string;
  date: string;
  rows: ResultRow[];
}

export type ReversalType = "cancelacion" | "devolucion";

export interface ReversalConfig {
  type: ReversalType;
  label: string;
  lower: string;
  subtitle: string;
  buttonLabel: string;
  icon: string;
  points: string[];
}

export type ToastVariant = "success" | "error";

export interface ToastInput {
  variant: ToastVariant;
  title: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface StatItem {
  label: string;
  icon: string;
  value: string;
  suffix?: string;
  note: string;
  trend?: "up";
}

export interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  tone: "lime" | "red" | "orange";
}

export interface TransactionListItem {
  id: string;
  icon: string;
  titular: string;
  detail: string;
  amount: string;
  time: string;
  typeBadge?: BadgeVariant;
  statusBadge?: BadgeVariant;
}

export interface TransactionRow {
  id: string;
  day: string;
  time: string;
  aprobacion: string;
  referencia: string;
  titular: string;
  card: string;
  amount: string;
  estatus: TransactionStatus;
}

export interface HomeContent {
  permissions: string;
  actions: ActionItem[];
  listTitle: string;
  listHref?: string;
  listEmpty: { title: string; description: string };
}
