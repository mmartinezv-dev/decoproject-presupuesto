export interface Category {
  id?: number
  name: string
  sortOrder: number
}

export interface Product {
  id?: number
  name: string
  description: string
  unit: string
  price: number
  categoryId?: number
  category?: Category
}

export interface Client {
  id?: number
  name: string
  rut: string
  address: string
  phone: string
}

export interface BudgetItem {
  productName: string
  unit: string
  quantity: number
  price: number
  section?: string
}

export interface BudgetSection {
  title: string
  items: BudgetItem[]
}

export interface CompanyInfo {
  name: string
  rut: string
  address: string
  phone: string
}

export interface Budget {
  id?: number
  correlativo?: number
  status?: 'borrador' | 'final'
  currentStep?: number
  createdAt?: string
  companyName: string
  companyRut: string
  companyAddress: string
  companyPhone: string
  clientId: number | null
  clientName: string
  clientRut: string
  clientAddress: string
  clientPhone: string
  notes: string
  visitFindings?: { text: string; images: { src: string; caption: string }[] }[]
  visitSummary?: string
  preliminaryWorks?: string[]
  logo: string
  images?: { src: string; caption: string }[]
  neto: number
  iva: number
  total: number
  items: BudgetItem[]
}
