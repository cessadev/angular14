export enum EPaymentMethod {
  Cash = 'Cash',
  BankTransfer = 'BankTransfer',
  DebitCard = 'DebitCard',
  CreditCard = 'CreditCard',
  PSE = 'PSE',
  Nequi = 'Nequi',
  Daviplata = 'Daviplata'
}

export const PAYMENT_METHOD_LABELS: Record<EPaymentMethod, string> = {
  [EPaymentMethod.Cash]: 'Efectivo',
  [EPaymentMethod.BankTransfer]: 'Transferencia bancaria',
  [EPaymentMethod.DebitCard]: 'Tarjeta débito',
  [EPaymentMethod.CreditCard]: 'Tarjeta crédito',
  [EPaymentMethod.PSE]: 'PSE',
  [EPaymentMethod.Nequi]: 'Nequi',
  [EPaymentMethod.Daviplata]: 'Daviplata'
};
