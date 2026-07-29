export enum EInstallmentsTerm {
  Months6 = 'Months6',
  Months12 = 'Months12',
  Months18 = 'Months18',
  Months24 = 'Months24',
  Months30 = 'Months30',
  Months36 = 'Months36',
  Months42 = 'Months42',
  Months48 = 'Months48'
}

export const INSTALLMENTS_TERM_MONTHS: Record<EInstallmentsTerm, number> = {
  [EInstallmentsTerm.Months6]: 6,
  [EInstallmentsTerm.Months12]: 12,
  [EInstallmentsTerm.Months18]: 18,
  [EInstallmentsTerm.Months24]: 24,
  [EInstallmentsTerm.Months30]: 30,
  [EInstallmentsTerm.Months36]: 36,
  [EInstallmentsTerm.Months42]: 42,
  [EInstallmentsTerm.Months48]: 48
};
