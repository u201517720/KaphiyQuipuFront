export class ReqControlCalidad {
    constructor(
    EmpresaId: number,
    
    HumedadPorcentajeAnalisisFisico: number,
    UsuarioCalidad: string,
    GuiaRecepcionMateriaPrimaId?: number,
    NotaSalidaAlmacenId?: number,
    LoteId?:number,
    NotaIngresoPlantaId?: number,
    OrdenServicioControlCalidadId?:number,
    ObservacionAnalisisFisico?: string,
    AnalisisFisicoOlorDetalleList?: AnalisisFisicoOlorDetalleList[],
    AnalisisFisicoColorDetalleList?: AnalisisFisicoColorDetalleList[],
    ExportableGramosAnalisisFisico?: number,
    ExportablePorcentajeAnalisisFisico?: number,
    DescarteGramosAnalisisFisico?: number,
    DescartePorcentajeAnalisisFisico?: number,
    CascarillaGramosAnalisisFisico?: number,
    CascarillaPorcentajeAnalisisFisico?: number,
    TotalGramosAnalisisFisico?: number,
    TotalPorcentajeAnalisisFisico?: number,
    ObservacionRegistroTostado?: string,
    ObservacionAnalisisSensorial?: string,
    SubTotalAnalisisSensorial?: number,
    DefectosTasaAnalisisSensorial?: number,
    DefectosIntensidadAnalisisSensorial?: number,
    AnalisisFisicoDefectoPrimarioDetalleList?: AnalisisFisicoDefectoPrimarioDetalleList[],
    AnalisisFisicoDefectoSecundarioDetalleList?: AnalisisFisicoDefectoSecundarioDetalleList[],
    RegistroTostadoIndicadorDetalleList?: RegistroTostadoIndicadorDetalleList[],
    AnalisisSensorialDefectoDetalleList?: AnalisisSensorialDefectoDetalleList[],
    AnalisisSensorialAtributoDetalleList?: AnalisisSensorialAtributoDetalleList[],
    TotalAnalisisSensorial?: number)
    {
        if(TotalAnalisisSensorial)
        {
            this.TotalAnalisisSensorial = TotalAnalisisSensorial
        }
        if(ObservacionRegistroTostado)
        {
        this.ObservacionRegistroTostado = ObservacionRegistroTostado
        }
        if (ObservacionAnalisisSensorial)
        {
            this.ObservacionAnalisisSensorial = ObservacionAnalisisSensorial
        }
        if (AnalisisFisicoOlorDetalleList)
        {
            this.AnalisisFisicoOlorDetalleList = AnalisisFisicoOlorDetalleList
        }
        if (AnalisisFisicoColorDetalleList)
        {
            this.AnalisisFisicoColorDetalleList = AnalisisFisicoColorDetalleList
        }
        if (AnalisisFisicoDefectoPrimarioDetalleList && AnalisisFisicoDefectoPrimarioDetalleList.length>0)
        {
            this.AnalisisFisicoDefectoPrimarioDetalleList = AnalisisFisicoDefectoPrimarioDetalleList
        }
        if (AnalisisFisicoDefectoSecundarioDetalleList)
        {
            this.AnalisisFisicoDefectoSecundarioDetalleList = AnalisisFisicoDefectoSecundarioDetalleList
        }
        if (RegistroTostadoIndicadorDetalleList)
        {
            this.RegistroTostadoIndicadorDetalleList = RegistroTostadoIndicadorDetalleList
        }
        if (AnalisisSensorialDefectoDetalleList)
        {
            this.AnalisisSensorialDefectoDetalleList = AnalisisSensorialDefectoDetalleList
        }
        if (AnalisisSensorialAtributoDetalleList)
        {
            this.AnalisisSensorialAtributoDetalleList = AnalisisSensorialAtributoDetalleList
        }
        if (ExportableGramosAnalisisFisico)
        {
        this.ExportableGramosAnalisisFisico= ExportableGramosAnalisisFisico
        }

        if (ExportablePorcentajeAnalisisFisico)
        {
        this.ExportablePorcentajeAnalisisFisico = ExportablePorcentajeAnalisisFisico
        }
        if (DescarteGramosAnalisisFisico)
        {
        this.DescarteGramosAnalisisFisico= DescarteGramosAnalisisFisico
        }
        if (DescartePorcentajeAnalisisFisico)
        {
        this.DescartePorcentajeAnalisisFisico= DescartePorcentajeAnalisisFisico
        }
        if (CascarillaGramosAnalisisFisico)
        {
        this.CascarillaGramosAnalisisFisico = CascarillaGramosAnalisisFisico
        }
        if (CascarillaPorcentajeAnalisisFisico)
        {
        this.CascarillaPorcentajeAnalisisFisico = CascarillaPorcentajeAnalisisFisico
        }
        if (TotalGramosAnalisisFisico)
        {
        this.TotalGramosAnalisisFisico = TotalGramosAnalisisFisico
        }
        if (TotalPorcentajeAnalisisFisico)
        {
        this.TotalPorcentajeAnalisisFisico = TotalPorcentajeAnalisisFisico
        }
        if(ObservacionAnalisisFisico)
        {
        this.ObservacionAnalisisFisico = ObservacionAnalisisFisico
        }
        if(GuiaRecepcionMateriaPrimaId)
        {
        this.GuiaRecepcionMateriaPrimaId = GuiaRecepcionMateriaPrimaId
        }
        if(NotaSalidaAlmacenId)
        {
        this.NotaSalidaAlmacenId = NotaSalidaAlmacenId
        }
        if (LoteId)
        {
            this.LoteId= LoteId
        }
        if (OrdenServicioControlCalidadId)
        {
            this.OrdenServicioControlCalidadId = OrdenServicioControlCalidadId
        }
        if (NotaIngresoPlantaId)
        {
            this.NotaIngresoPlantaId = NotaIngresoPlantaId
        }
        this.SubTotalAnalisisSensorial = SubTotalAnalisisSensorial,
        this.DefectosTasaAnalisisSensorial = DefectosTasaAnalisisSensorial,
        this.DefectosIntensidadAnalisisSensorial = DefectosIntensidadAnalisisSensorial,

        this.EmpresaId = EmpresaId,
        this.GuiaRecepcionMateriaPrimaId = GuiaRecepcionMateriaPrimaId,
        this.HumedadPorcentajeAnalisisFisico = HumedadPorcentajeAnalisisFisico,       
        this.UsuarioCalidad = UsuarioCalidad    
    }
    EmpresaId: number;
    GuiaRecepcionMateriaPrimaId?: number;
    NotaSalidaAlmacenId?:number;
    LoteId?:number;
    NotaIngresoPlantaId?:number;
    OrdenServicioControlCalidadId?:number;
    ExportableGramosAnalisisFisico?: number;
    ExportablePorcentajeAnalisisFisico?: number;
    DescarteGramosAnalisisFisico?: number;
    DescartePorcentajeAnalisisFisico?: number;
    CascarillaGramosAnalisisFisico?: number;
    CascarillaPorcentajeAnalisisFisico?: number;
    TotalGramosAnalisisFisico?: number;
    TotalPorcentajeAnalisisFisico?: number;
    HumedadPorcentajeAnalisisFisico?: number;
    ObservacionAnalisisFisico?: string;
    UsuarioCalidad?: string;
    ObservacionRegistroTostado?: string;
    ObservacionAnalisisSensorial?: string;
    SubTotalAnalisisSensorial?: number;
    DefectosTasaAnalisisSensorial?: number;
    DefectosIntensidadAnalisisSensorial?: number;
    AnalisisFisicoOlorDetalleList?: AnalisisFisicoOlorDetalleList[];
    AnalisisFisicoColorDetalleList?: AnalisisFisicoColorDetalleList[];
    AnalisisFisicoDefectoPrimarioDetalleList?: AnalisisFisicoDefectoPrimarioDetalleList[];
    AnalisisFisicoDefectoSecundarioDetalleList?: AnalisisFisicoDefectoSecundarioDetalleList[];
    RegistroTostadoIndicadorDetalleList?: RegistroTostadoIndicadorDetalleList[];
    AnalisisSensorialDefectoDetalleList?: AnalisisSensorialDefectoDetalleList[];
    AnalisisSensorialAtributoDetalleList?: AnalisisSensorialAtributoDetalleList[];
    TotalAnalisisSensorial?: number;
}

 export class DefectosPrimarios
{
    DefectoDetalleId : string;
    DefectoDetalleDescripcion: string;
    DefectoDetalleEquivalente: string;
    Valor: string;

}

export class AnalisisFisicoColorDetalleList
{
    ColorDetalleId : string;
    ColorDetalleDescripcion: string;
    Valor: boolean;

}
export class AnalisisFisicoOlorDetalleList
{
    OlorDetalleId : string;
    OlorDetalleDescripcion: string;
    Valor: boolean;

}
export class AnalisisFisicoDefectoPrimarioDetalleList
{
    DefectoDetalleId : string;
    DefectoDetalleDescripcion: string;
    DefectoDetalleEquivalente: string;
    Valor: number;

}
export class AnalisisFisicoDefectoSecundarioDetalleList
{
    DefectoDetalleId : string;
    DefectoDetalleDescripcion: string;
    DefectoDetalleEquivalente: string;
    Valor: number;

}

export class RegistroTostadoIndicadorDetalleList
{
    IndicadorDetalleId: string;
    IndicadorDetalleDescripcion: string;
    Valor: number;
}

export class AnalisisSensorialDefectoDetalleList
{
    DefectoDetalleId: string;
    DefectoDetalleDescripcion: string;
    Valor: number;
}

export class AnalisisSensorialAtributoDetalleList
{
    AtributoDetalleId: string;
    AtributoDetalleDescripcion: string;
    Valor: number;
}

