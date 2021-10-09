export class ReqActualizarPesado {
    constructor(
        GuiaRecepcionMateriaPrimaId: number,
        EmpresaId: number,
        TipoProvedorId: string,
        TerceroId: number,
        ProductoId: string,
        SubProductoId: string,
        FechaCosecha: Date,
        FechaPesado: Date,
        UsuarioPesado: string,
        UnidadMedidaIdPesado: string,
        CantidadPesado: number,
        KilosBrutosPesado: number,
        TaraPesado?: number,
        ObservacionPesado?: string) {
        this.GuiaRecepcionMateriaPrimaId = GuiaRecepcionMateriaPrimaId;
        this.EmpresaId = EmpresaId;
        this.TipoProvedorId = TipoProvedorId;
        this.TerceroId = TerceroId;
        this.ProductoId = ProductoId;
        this.SubProductoId = SubProductoId;
        this.FechaCosecha = FechaCosecha;
        this.FechaPesado = FechaPesado;
        this.UsuarioPesado = UsuarioPesado;
        this.UnidadMedidaIdPesado = UnidadMedidaIdPesado;
        this.CantidadPesado = CantidadPesado;
        this.KilosBrutosPesado = KilosBrutosPesado;
        this.TaraPesado = TaraPesado;
        this.ObservacionPesado = ObservacionPesado;
    }

    GuiaRecepcionMateriaPrimaId: number;
    EmpresaId: number;
    TipoProvedorId: string;
    TerceroId: number;
    ProductoId: string;
    SubProductoId: string;
    FechaCosecha: Date;
    FechaPesado: Date;
    UsuarioPesado: string;
    UnidadMedidaIdPesado: string;
    CantidadPesado: number;
    KilosBrutosPesado: number;
    TaraPesado?: number;
    ObservacionPesado?: string;
}