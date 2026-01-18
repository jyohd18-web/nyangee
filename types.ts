
export enum Category {
  FOOD = '식비/간식',
  TOY = '장난감',
  SUPPLY = '생활용품'
}

export interface LivingExpense {
  id: string;
  date: string;
  vendor: string;
  category: Category;
  itemName: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalPrice: number; // (qty * unitPrice) + shipping
}

export interface MedicalExpense {
  id: string;
  date: string;
  clinicName: string;
  diagnosisName: string;
  price: number;
  receiptImage?: string; // base64
}

export interface InitialCost {
  id: string;
  date: string;
  vendor: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  shippingFee: number;
  totalPrice: number;
}

export interface Income {
  id: string;
  date: string;
  source: string;
  amount: number;
}

export type AppState = {
  livingExpenses: LivingExpense[];
  medicalExpenses: MedicalExpense[];
  initialCosts: InitialCost[];
  incomes: Income[];
};

export type ActiveTab = 'summary' | 'monthly' | 'living' | 'medical' | 'income' | 'initial';
