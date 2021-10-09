export class ReqNotaSalidaPlanta
{
    constructor(
        NotaSalidaAlmacenPlantaId: number,
        EmpresaId: number,
        AlmacenId: string,
        Numero: string,
        MotivoSalidaId: string,
        MotivoSalidaReferencia: string, 
        EmpresaIdDestino: number,
        EmpresaTransporteId: number,
        TransporteId: number,
        NumeroConstanciaMTC: string,
        MarcaTractorId: string,
        PlacaTractor: string,
        MarcaCarretaId: string,
        PlacaCarreta: string,
        Conductor: string,
        Licencia: string,
        Observacion: string,
       
        PesoKilosBrutos: number,
        PesoKilosNetos: number,
        Tara: number,
        CantidadTotal: number,
        EstadoId: string,
        UsuarioNotaSalidaAlmacenPlanta: string,
        ListNotaSalidaAlmacenPlantaDetalle: NotaSalidaAlmacenPlantaDetalleDTO[],
        )
        {
            if(EstadoId)
            {
            this.EstadoId = EstadoId
            }
            if(NotaSalidaAlmacenPlantaId != 0)
            {
            this.NotaSalidaAlmacenPlantaId = NotaSalidaAlmacenPlantaId
            }
            if(Numero != "")
            {
            this.Numero = Numero
            }
            this.EmpresaId = EmpresaId,
            this.AlmacenId = AlmacenId,
            this.MotivoSalidaId = MotivoSalidaId,
            this.MotivoSalidaReferencia = MotivoSalidaReferencia,
            this.EmpresaIdDestino = EmpresaIdDestino,
            this.EmpresaTransporteId = EmpresaTransporteId,
            this.TransporteId = TransporteId,
            this.NumeroConstanciaMTC = NumeroConstanciaMTC,
            this.MarcaTractorId = MarcaTractorId,
            this.PlacaTractor = PlacaTractor,
            this.MarcaCarretaId = MarcaCarretaId,
            this.PlacaCarreta = PlacaCarreta,
            this.Conductor = Conductor,
            this.Licencia = Licencia,
            this.Observacion = Observacion,
            this.PesoKilosBrutos = PesoKilosBrutos,
            this.PesoKilosNetos = PesoKilosNetos,
            this.Tara = Tara,
            this.UsuarioNotaSalidaAlmacenPlanta = UsuarioNotaSalidaAlmacenPlanta,
            this.ListNotaSalidaAlmacenPlantaDetalle = ListNotaSalidaAlmacenPlantaDetalle,
            this.CantidadTotal = CantidadTotal


    }

    NotaSalidaAlmacenPlantaId: number;
    EmpresaId: number;
    AlmacenId: string;
    Numero: string;
    MotivoSalidaId: string;
    MotivoSalidaReferencia: string;
    EmpresaIdDestino: number;
    EmpresaTransporteId: number;
    TransporteId: number;
    NumeroConstanciaMTC: string;
    MarcaTractorId: string;
    PlacaTractor: string;
    MarcaCarretaId: string;
    PlacaCarreta: string;
    Conductor: string;
    Licencia: string;
    Observacion: string;
    PesoKilosBrutos: number;
    PesoKilosNetos: number;
    Tara: number;
    EstadoId: string;
    UsuarioNotaSalidaAlmacenPlanta: string;
    ListNotaSalidaAlmacenPlantaDetalle: NotaSalidaAlmacenPlantaDetalleDTO[];
    CantidadTotal: number;
}

 export class  NotaSalidaAlmacenPlantaDetalleDTO{

    constructor(NotaIngresoAlmacenPlantaId:number)
    {
        this.NotaIngresoAlmacenPlantaId = NotaIngresoAlmacenPlantaId
    }

    NotaIngresoAlmacenPlantaId: number
}