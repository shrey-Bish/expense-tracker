export const CATEGORIES = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Education",
    "Shopping",
    "Other",
  ] as const;
  
  export type Category = (typeof CATEGORIES)[number];
  
  export type Expense = {
    id: string;
    title: string;
    description: string;
    category: Category;
    amountCents: number; // integer cents
    occurredAt: string;  // ISO string
    createdAt: string;   // ISO string
    updatedAt: string;   // ISO string
  };
  
  export type SortKey = "newest" | "oldest" | "amount_desc" | "amount_asc" | "title_asc";
  export type CategoryFilter = Category | "All";
  
  export type ExpenseDraft = {
    title: string;
    description: string;
    category: Category | "";
    amount: string; // keep as string for controlled input
    occurredAt: string; // yyyy-mm-dd
  };
  
  export function makeId(): string {
    // Modern browsers
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    // Fallback
    return `id_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }
  
  export function centsToDollars(cents: number): string {
    const sign = cents < 0 ? "-" : "";
    const abs = Math.abs(cents);
    const dollars = Math.floor(abs / 100);
    const rem = abs % 100;
    return `${sign}$${dollars.toString()}.${rem.toString().padStart(2, "0")}`;
  }
  
  export function dollarsStringToCents(amount: string): number {
    // Assignment says "amount should be an integer" — interpret as integer dollars.
    // Store as cents to avoid floats: $12 -> 1200
    const n = Number(amount);
    return n * 100;
  }
  
  export function todayYMD(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }