export interface BudgetItemEntity {
  id?: number;
  productName: string;
  section: string;
  unit: string;
  quantity: number;
  price: number;
  subtotal: number;
  sectionManualTotal?: number | null;
}

export interface BudgetEntity {
  id?: number;
  correlativo?: number;
  createdAt?: Date;
  companyName: string;
  companyRut: string;
  companyAddress: string;
  companyPhone: string;
  clientId?: number | null;
  clientName: string;
  clientRut: string;
  clientAddress: string;
  clientPhone: string;
  notes: string;
  visitFindings: { text: string; images: { src: string; caption: string }[] }[];
  visitSummary: string;
  preliminaryWorks: string[];
  specialAnnotations: { title: string; text: string }[];
  logo: string;
  images: { src: string; caption: string }[];
  neto: number;
  iva: number;
  total: number;
  status?: string;
  currentStep?: number;
  items: BudgetItemEntity[];
}
