import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { MaestroService } from '../../../../../services/maestro.service';
import { MaestroUtil } from '../../../../../services/util/maestro-util';
import { SolicitudcompraService } from '../../../../../services/solicitudcompra.service';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-solicitudcompra-edit',
  templateUrl: './solicitudcompra-edit.component.html',
  styleUrls: ['./solicitudcompra-edit.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SolicitudcompraEditComponent implements OnInit {

  active = 1;
  frmSolicitudCompraNew: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmTitle = 'REGISTRO DE SOLICITUD DE COMPRA';
  limitRef = 10;
  listPaises: any[];
  listCiudades: any[];
  listMonedas: any[];
  listUniMedida: any[];
  listTipoProduccion: any[];
  listEmpaques: any[];
  listTiposEmpaques: any[];
  listProductos: any[];
  listSubProductos: any[];
  listGradosPreparacion: any[];
  listCalidad: any[];
  selectedPais: any;
  selectedCiudad: any;
  selectedMoneda: any;
  selectedUniMedida: any;
  selectedTipoProduccion: any;
  selectedEmpaque: any;
  selectedTipoEmpaque: any;
  selectedProducto: any;
  selectedSubProducto: any;
  selectedGradoPreparacion: any;
  selectedCalidad: any;
  userSession: any;
  rows = [];
  selected = [];

  constructor(private fb: FormBuilder,
    private maestroService: MaestroService,
    private maestroUtil: MaestroUtil,
    private solicitudcompraService: SolicitudcompraService,
    private alertUtil: AlertUtil) {
    this.userSession = JSON.parse(localStorage.getItem('user'));
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
  }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.frmSolicitudCompraNew = this.fb.group({
      pais: [, Validators.required],
      ciudad: [, Validators.required],
      moneda: [, Validators.required],
      unidadMedida: [, Validators.required],
      tipoProduccion: [, Validators.required],
      empaque: [, Validators.required],
      tipoEmpaque: [, Validators.required],
      producto: [, Validators.required],
      subProducto: [, Validators.required],
      gradoPreparacion: [, Validators.required],
      calidad: [, Validators.required],
      cantASolicitar: [, Validators.required],
      pesoXSaco: [, Validators.required],
      pesoEnKilos: [, Validators.required],
      observaciones: [],
      costoUnitario: [],
      costoTotal: [],
      porcHumedadAF: [],
      observacionesAF: [],
      sacosPC: [],
      kilosBrutosPC: [],
      taraSacoPC: [],
      kilosNetosPC: [],
      qq55KgPC: [],
      cafeExportacionGramos: [],
      cafeExportacionPorc: [],
      descarteGramos: [],
      descartePorcentaje: [],
      cascaraGramos: [],
      cascaraPorcentaje: [],
      totalGramos: [],
      totalPorcentaje: [],
      humedadProcenPC: [],
      observacionesPC: []
    });
    this.GetCountries();
    this.GetCurrencies();
    this.GetMeasurementUnit();
    this.GetProductionType();
    this.GetPackaging();
    this.GetPackagingType();
    this.GetProducts();
    this.GetDegreePreparation();
    this.GetQuality();
  }

  get f() {
    return this.frmSolicitudCompraNew.controls;
  }

  async GetCountries() {
    this.listPaises = [];
    const res = await this.maestroService.ConsultarPaisAsync().toPromise()
    if (res.Result.Success) {
      this.listPaises = res.Result.Data;
    }
  }

  async GetCities() {
    this.listCiudades = [];
    const res = await this.maestroUtil.GetDepartmentsAsync(this.selectedPais);
    if (res.Result.Success) {
      this.listCiudades = res.Result.Data;
    }
  }

  async GetCurrencies() {
    this.listMonedas = [];
    const res = await this.maestroService.obtenerMaestros('Moneda').toPromise();
    if (res.Result.Success) {
      this.listMonedas = res.Result.Data;
    }
  }

  async GetMeasurementUnit() {
    this.listUniMedida = [];
    const res = await this.maestroService.obtenerMaestros('UnidadMedicion').toPromise();
    if (res.Result.Success) {
      this.listUniMedida = res.Result.Data;
    }
  }

  async GetProductionType() {
    this.listTipoProduccion = [];
    const res = await this.maestroService.obtenerMaestros('TipoProduccion').toPromise();
    if (res.Result.Success) {
      this.listTipoProduccion = res.Result.Data;
    }
  }

  async GetPackaging() {
    this.listEmpaques = [];
    const res = await this.maestroService.obtenerMaestros('Empaque').toPromise();
    if (res.Result.Success) {
      this.listEmpaques = res.Result.Data;
    }
  }

  async GetPackagingType() {
    this.listTiposEmpaques = [];
    const res = await this.maestroService.obtenerMaestros('TipoEmpaque').toPromise();
    if (res.Result.Success) {
      this.listTiposEmpaques = res.Result.Data;
    }
  }

  async GetProducts() {
    this.listProductos = [];
    const res = await this.maestroService.obtenerMaestros('Producto').toPromise();
    if (res.Result.Success) {
      this.listProductos = res.Result.Data;
    }
  }

  async GetSubProducts(code: any) {
    const res = await this.maestroService.obtenerMaestros("SubProducto").toPromise();
    if (res.Result.Success) {
      this.listSubProductos = res.Result.Data.filter(x => x.Val1 == code);
    }
  }

  async GetDegreePreparation() {
    this.listGradosPreparacion = [];
    const res = await this.maestroService.obtenerMaestros('Grado').toPromise();
    if (res.Result.Success) {
      this.listGradosPreparacion = res.Result.Data;
    }
  }

  async GetQuality() {
    this.listCalidad = [];
    const res = await this.maestroService.obtenerMaestros('Calidad').toPromise();
    if (res.Result.Success) {
      this.listCalidad = res.Result.Data;
    }
  }

  onChangePais(e: any) {
    this.GetCities();
  }

  ChangeProduct(e: any) {
    this.GetSubProducts(this.selectedProducto);
  }

  EnviarSolicitud() {
    if (!this.frmSolicitudCompraNew.invalid) {
      this.alertUtil.alertRegistro('Enviar Solicitud de Compra',
        '¿Está seguro de enviar la solicitud de compra?', () => {
          this.EnviarSolicitud();
        });
    }
  }

  CalcularPesoEnKilos() {
    const cantidad = this.frmSolicitudCompraNew.value.cantASolicitar ? this.frmSolicitudCompraNew.value.cantASolicitar : 0;
    const pesoSaco = this.frmSolicitudCompraNew.value.pesoXSaco ? this.frmSolicitudCompraNew.value.pesoXSaco : 0;
    const total = cantidad * pesoSaco;
    if (total) {
      this.frmSolicitudCompraNew.controls.pesoEnKilos.setValue(total);
    }

    const costo = this.frmSolicitudCompraNew.value.costoUnitario ? this.frmSolicitudCompraNew.value.costoUnitario : 0;
    const costoTotal = cantidad * costo;
    if (costoTotal) {
      this.frmSolicitudCompraNew.controls.costoTotal.setValue(costoTotal);
    }
  }

  ChangeMoneda() {
    if (this.frmSolicitudCompraNew.value.moneda === '01') {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(7.46);
    } else if (this.frmSolicitudCompraNew.value.moneda === '02') {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(1.89);
    }
  }

  updateLimit(e) {

  }

  RequestEnviarSolicitud() {
    const frm = this.frmSolicitudCompraNew.value;
    const request = {
      DistribuidorId: 0,
      PaisId: frm.pais ? frm.pais : '',
      DepartamentoId: frm.ciudad ? frm.ciudad : '',
      MonedaId: frm.moneda,
      UnidadMedidaId: frm.unidadMedida,
      TipoProduccionId: frm.tipoProduccion,
      EmpaqueId: frm.empaque,
      TipoEmpaqueId: frm.tipoEmpaque,
      TotalSacos: frm.cantASolicitar ? frm.cantASolicitar : 0,
      PesoSaco: frm.pesoXSaco ? frm.pesoXSaco : 0,
      PesoKilos: frm.pesoEnKilos ? frm.pesoEnKilos : 0,
      ProductoId: frm.producto,
      SubProductoId: frm.subProducto,
      GradoPreparacionId: frm.gradoPreparacion,
      CalidadId: frm.calidad,
      Observaciones: frm.observaciones,
      Estado: 1,
      EstadoId: '01',
      UsuarioRegistro: ''
    }
    return request;
  }

  GuardarSolicitud() {
    const request = this.RequestEnviarSolicitud();
    this.solicitudcompraService.Registrar(request)
      .subscribe((res) => {
        if (res) {

        }
      }, (err) => {
        console.log(err);
      });
  }

  Cancelar() {

  }

}
