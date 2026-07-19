import type { OrderStatus } from "./api";

export const ORDER_STEPS: OrderStatus[] = ["Requested", "Quoted", "Approved", "In Progress", "Completed"];

export function stepIndexForStatus(status: OrderStatus): number {
  if (status === "Delayed") return ORDER_STEPS.indexOf("In Progress");
  const idx = ORDER_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
}

// Mirrors the backend's enforced order-lifecycle state machine (orderService.js) —
// admin must quote before approving/rejecting, then move through progress to completion.
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Requested: ["Quoted"],
  Quoted: ["Approved", "Rejected"],
  Approved: ["In Progress"],
  "In Progress": ["Delayed", "Completed"],
  Delayed: ["In Progress", "Completed"],
  Completed: [],
  Rejected: [],
};
