import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { MaestroService } from '../../../../../services/maestro.service';
import { MaestroUtil } from '../../../../../services/util/maestro-util';
import { SolicitudcompraService } from '../../../../../services/solicitudcompra.service';
import { AlertUtil } from '../../../../../services/util/alert-util';
import { ContratoService } from '../../../../../services/contrato.service';

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
  frmTitle = 'SOLICITUD DE COMPRA';
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
  listCertificaciones: any[];
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
  selectedCertificacion: any;
  userSession: any;
  rows = [];
  selected = [];
  locId = 0;
  locCodigoEstado;
  locFechaRegistroString;

  constructor(private fb: FormBuilder,
    private maestroService: MaestroService,
    private maestroUtil: MaestroUtil,
    private solicitudcompraService: SolicitudcompraService,
    private alertUtil: AlertUtil,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private contratoService: ContratoService) {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(localStorage.getItem('user'));
    this.LoadForm();
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    if (this.locId > 0) {
      this.ConsultarPorId();
      this.frmTitle = 'DETALLE DE LA SOLICITUD ';
    }
  }

  ngOnInit(): void {
    this.LoadCombos();
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
      certificacion: [, Validators.required],
      cantASolicitar: [, Validators.required],
      pesoXSaco: [, Validators.required],
      pesoEnKilos: [, Validators.required],
      observaciones: [],
      costoUnitario: [],
      costoTotal: [],
      distribuidora: [],
      fechaRegistro: [],
      estado: [],
      correlativo: []
    });
  }

  LoadCombos() {
    if (!this.locId) {
      this.GetCountries();
      this.GetCurrencies();
      this.GetMeasurementUnit();
      this.GetProductionType();
      this.GetPackaging();
      this.GetPackagingType();
      this.GetProducts();
      this.GetDegreePreparation();
      this.GetQuality();
      this.GetCertificaciones();
    }
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

  async GetCertificaciones() {
    this.listCertificaciones = [];
    const res = await this.maestroService.obtenerMaestros('TipoCertificacion').toPromise();
    if (res.Result.Success) {
      this.listCertificaciones = res.Result.Data;
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
      this.alertUtil.alertRegistro('Confirmación',
        '¿Está seguro de enviar la solicitud de compra?', () => {
          this.GuardarSolicitud();
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
      CodigoCliente: this.userSession.CodigoCliente,
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
      CertificacionId: frm.certificacion,
      Observaciones: frm.observaciones,
      Estado: 1,
      EstadoId: '01',
      UsuarioRegistro: this.userSession.NombreUsuario
    }
    return request;
  }

  GuardarSolicitud() {
    if (this.userSession.RolId === 6) {
      this.spinner.show();
      const request = this.RequestEnviarSolicitud();
      this.solicitudcompraService.Registrar(request)
        .subscribe((res) => {
          this.spinner.hide();
          if (res) {
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                `Se ha generado solicitud de compra ${res.Result.Data}.`,
                () => {
                  this.router.navigate(['/home']);
                });
            } else {

            }
          }
        }, (err) => {
          console.log(err);
          this.spinner.hide();
        });
    }
  }

  ConsultarPorId() {
    this.spinner.show();
    this.solicitudcompraService.ConsultarPorId({ SolicitudCompraId: this.locId })
      .subscribe((res) => {
        if (res && res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        }
      }, (err) => {
        this.spinner.hide();
      });
  }

  async MostrarCostoUnitario() {
    const moneda = this.frmSolicitudCompraNew.value.moneda;
    if (moneda === '01') {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(7.46);
    }
  }

  CalcularCostoTotal() {
    const cantidad = this.frmSolicitudCompraNew.value.cantASolicitar;
    if (cantidad) {
      let costoUnitario = this.frmSolicitudCompraNew.value.costoUnitario;

      const costoTotal = cantidad * costoUnitario;
      if (costoTotal) {
        this.frmSolicitudCompraNew.controls.costoTotal.setValue(costoTotal);
      }
    }
  }

  async CompletarForm(data) {
    if (data) {
      if (data.PaisId) {
        await this.GetCountries();
        this.frmSolicitudCompraNew.controls.pais.setValue(data.PaisId);
      }

      if (data.DepartamentoId) {
        await this.GetCities();
        this.frmSolicitudCompraNew.controls.ciudad.setValue(data.DepartamentoId);
      }

      if (data.MonedaId) {
        await this.GetCurrencies();
        this.frmSolicitudCompraNew.controls.moneda.setValue(data.MonedaId);
        await this.MostrarCostoUnitario();
      }

      if (data.UnidadMedidaId) {
        await this.GetMeasurementUnit();
        this.frmSolicitudCompraNew.controls.unidadMedida.setValue(data.UnidadMedidaId);
      }

      if (data.TipoProduccionId) {
        await this.GetProductionType();
        this.frmSolicitudCompraNew.controls.tipoProduccion.setValue(data.TipoProduccionId);
      }

      if (data.EmpaqueId) {
        await this.GetPackaging();
        this.frmSolicitudCompraNew.controls.empaque.setValue(data.EmpaqueId);
      }

      if (data.TipoEmpaqueId) {
        await this.GetPackagingType();
        this.frmSolicitudCompraNew.controls.tipoEmpaque.setValue(data.TipoEmpaqueId);
      }

      if (data.ProductoId) {
        await this.GetProducts();
        this.frmSolicitudCompraNew.controls.producto.setValue(data.ProductoId);
      }

      if (data.SubProductoId) {
        await this.GetSubProducts(this.frmSolicitudCompraNew.value.producto);
        this.frmSolicitudCompraNew.controls.subProducto.setValue(data.SubProductoId);
      }

      if (data.GradoPreparacionId) {
        await this.GetDegreePreparation();
        this.frmSolicitudCompraNew.controls.gradoPreparacion.setValue(data.GradoPreparacionId);
      }

      if (data.CalidadId) {
        await this.GetQuality();
        this.frmSolicitudCompraNew.controls.calidad.setValue(data.CalidadId);
      }

      if (data.CertificacionId) {
        await this.GetCertificaciones();
        this.frmSolicitudCompraNew.controls.certificacion.setValue(data.CertificacionId);
      }

      if (data.TotalSacos) {
        this.frmSolicitudCompraNew.controls.cantASolicitar.setValue(data.TotalSacos);
      }

      if (data.PesoSaco) {
        this.frmSolicitudCompraNew.controls.pesoXSaco.setValue(data.PesoSaco);
      }

      if (data.PesoKilos) {
        this.frmSolicitudCompraNew.controls.pesoEnKilos.setValue(data.PesoKilos);
      }

      if (data.Observaciones) {
        this.frmSolicitudCompraNew.controls.observaciones.setValue(data.Observaciones);
      }
      this.frmSolicitudCompraNew.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmSolicitudCompraNew.controls.distribuidora.setValue(data.Distribuidor);
      this.frmSolicitudCompraNew.controls.estado.setValue(data.DescripcionEstado);
      this.frmSolicitudCompraNew.controls.correlativo.setValue(data.Correlativo);
      this.locCodigoEstado = data.EstadoId
      this.locFechaRegistroString = data.FechaRegistroString;
      this.CalcularCostoTotal();
    }
    this.spinner.hide();
  }

  Cancelar() {
    this.router.navigate(['/compras/solicitudcompra/list']);
  }

  GenerarContrato() {
    this.alertUtil.alertSiNoCallback('Pregunta', '¿Está seguro de generar el contrato?', () => {
      this.RegistrarContrato();
    });
  }

  RegistrarContrato() {
    this.spinner.show();
    const request = {
      SolicitudCompraId: this.locId,
      EmpresaId: this.userSession.EmpresaId,
      Observaciones: this.frmSolicitudCompraNew.value.observaciones,
      UsuarioRegistro: this.userSession.NombreUsuario
    };

    this.contratoService.Create(request)
      .subscribe((res) => {
        if (res.Result.Success) {
          this.spinner.hide();
          this.alertUtil.alertOkCallback('Confirmación',
            `Se ha generado contrato venta ${res.Result.Data}.`,
            () => {
              this.router.navigate(['/acopio/operaciones/contrato/list']);
            });
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
      });
  }

}
