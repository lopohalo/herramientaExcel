export interface Tarea {
  uaa: any;
  numeroInterno: number;
  valorCompra: number;
  fechaCompra: Date;
  fechaVencimiento: Date;
  fechaEmision: Date;
  periocidad: string;
  spread: number;
  clasetitulo: string;
  tasaReferencia: number;
  sociedadComisionista: string;
  emisor: string;
  nemotecnico: string;
  id: number;
  selected?: boolean;
  meses: number;
  valorNominal: number;
  fechaVcto: Date;
  tipoTasa: number;
  idTipoTitulo: number;
}
