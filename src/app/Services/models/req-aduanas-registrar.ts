export class ReqAduanas {
    constructor(
        EmpresaId: number,
        AduanaId: number,
        Numero: string,
        ContratoId: number,
        EmpresaAgenciaAduaneraId: number,
        EmpresaExportadoraId: number,
        EmpresaProductoraId: number,
        NumeroContratoInternoProductor: string,
        FechaEmbarque: Date,
        FechaZarpeNave: Date,
        FechaFacturacion: Date,
        Puerto: string,
        Marca: string,
        PO: string,
        NumeroContenedores: number,
        EstadoSeguimientoId: string,
        FechaEstampado: Date,
        FechaEnvioMuestra: Date,
        FechaRecepcionMuestra: Date,
        EstadoMuestraId: string,
        Courier: string,
        NumeroSeguimientoMuestra: string,
        Observacion: string,
        FechaEnvioDocumentos: Date,
        FechaLlegadaDocumentos: Date,        
        Certificaciones: Certificaciones[],
        
        Detalle: Detalle[],
        Usuario: string
        ) {
            
        if (AduanaId != 0) {
            this.AduanaId = AduanaId
        }
        if (Numero != "") {
            this.Numero = Numero
        }
        this.EmpresaId = EmpresaId;
        this.ContratoId = ContratoId;
        this.EmpresaExportadoraId = EmpresaExportadoraId;
        this.EmpresaProductoraId = EmpresaProductoraId;
        this.NumeroContratoInternoProductor = NumeroContratoInternoProductor;
        this.FechaEmbarque = FechaEmbarque;
        this.FechaZarpeNave = FechaZarpeNave;
        this.FechaFacturacion = FechaFacturacion;
        this.Puerto = Puerto;
        this.Marca = Marca;
        this.PO = PO;
        this.NumeroContenedores = NumeroContenedores;
        this.EstadoSeguimientoId = EstadoSeguimientoId;
        this.FechaEstampado = FechaEstampado;
        this.FechaRecepcionMuestra = FechaRecepcionMuestra;
        this.Courier = Courier;
        this.FechaEnvioMuestra = FechaEnvioMuestra;
        this.NumeroSeguimientoMuestra = NumeroSeguimientoMuestra;
        this.EstadoMuestraId = EstadoMuestraId;
        this.FechaRecepcionMuestra = FechaRecepcionMuestra;
        this.Observacion = Observacion;
        this.FechaEnvioDocumentos = FechaEnvioDocumentos;
        this.FechaLlegadaDocumentos = FechaLlegadaDocumentos;
        this.Certificaciones = Certificaciones;
        this.Usuario = Usuario;
        this.EmpresaAgenciaAduaneraId = EmpresaAgenciaAduaneraId;
        this.Detalle = Detalle;
        
    }

    EmpresaId: number;
    AduanaId: number;
    Numero: string;
    ContratoId: number;
    EmpresaAgenciaAduaneraId: number;
    EmpresaExportadoraId: number;
    EmpresaProductoraId: number;
    NumeroContratoInternoProductor: string;
    FechaEmbarque: Date;
    FechaZarpeNave: Date;
    FechaFacturacion: Date;
    Puerto: string;
    Marca: string;
    PO: string;
    NumeroContenedores: number
    EstadoSeguimientoId: string;
    FechaEstampado: Date;
    FechaEnvioMuestra: Date;
    FechaRecepcionMuestra: Date;

    Courier: string;
    
    NumeroSeguimientoMuestra: string;
    EstadoMuestraId: string;
    Observacion: string;
    FechaEnvioDocumentos :Date;
    FechaLlegadaDocumentos :Date;
    Certificaciones: Certificaciones[];    
    Usuario: string;    
    Detalle: Detalle[];
    
}

export class Certificaciones {
    EmpresaProveedoraAcreedoraId: number;
    TipoCertificacionId: string;
    CodigoCertificacion: string;
    TipoId: string;
}

export class Detalle {
    NroNotaIngresoPlanta: string;
    CantidadSacos: number;
    NumeroLote: string;
    KilosNetos: number;
}
