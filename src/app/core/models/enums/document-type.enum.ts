export enum EDocumentType {
  CedulaCiudadania = 'CC',
  CedulaExtranjeria = 'CE',
  TarjetaIdentidad = 'TI',
  Pasaporte = 'PA',
  PermisoProteccionTemporal = 'PPT',
  Nit = 'NIT'
}

export const DOCUMENT_TYPE_LABELS: Record<EDocumentType, string> = {
  [EDocumentType.CedulaCiudadania]: 'Cédula de ciudadanía',
  [EDocumentType.CedulaExtranjeria]: 'Cédula de extranjería',
  [EDocumentType.TarjetaIdentidad]: 'Tarjeta de identidad',
  [EDocumentType.Pasaporte]: 'Pasaporte',
  [EDocumentType.PermisoProteccionTemporal]: 'Permiso de protección temporal',
  [EDocumentType.Nit]: 'NIT'
};
