import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { MaestroService } from '../../../../../../services/maestro.service';
import { MaestroUtil } from '../../../../../../services/util/maestro-util';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { ContratoService } from '../../../../../../services/contrato.service';
import { AgricultorService } from '../../../../../../services/agricultor.service';
import { TransactionReponse } from '../../../../../../services/models/transaction-response';

@Component({
  selector: 'app-contrato-edit',
  templateUrl: './contrato-edit.component.html',
  styleUrls: ['./contrato-edit.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContratoEditComponent implements OnInit {

  active = 1;
  frmContratoCompraVenta: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  frmTitle = 'DETALLE DEL CONTRATO';
  limitRef = 50;
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
  agricultoresSeleccionados;

  constructor(private fb: FormBuilder,
    private maestroService: MaestroService,
    private maestroUtil: MaestroUtil,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private alertUtil: AlertUtil,
    private contratoService: ContratoService,
    private agricultorService: AgricultorService) {
    this.locId = parseInt(this.route.snapshot.params['id']);
    this.userSession = JSON.parse(localStorage.getItem('user'));
    this.LoadForm();
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    if (this.locId > 0) {
      this.ConsultarPorId();
      this.frmTitle = 'DETALLE DEL CONTRATO ';

    }
  }

  ngOnInit(): void {
    this.LoadCombos();
  }

  LoadForm() {
    this.frmContratoCompraVenta = this.fb.group({
      pais: [],
      ciudad: [],
      moneda: [],
      unidadMedida: [],
      tipoProduccion: [],
      empaque: [],
      tipoEmpaque: [],
      producto: [],
      subProducto: [],
      gradoPreparacion: [],
      calidad: [],
      certificacion: [],
      cantASolicitar: [],
      pesoXSaco: [],
      pesoEnKilos: [],
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
      observacionesPC: [],
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
    return this.frmContratoCompraVenta.controls;
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

  CalcularPesoEnKilos() {
    const cantidad = this.frmContratoCompraVenta.value.cantASolicitar ? this.frmContratoCompraVenta.value.cantASolicitar : 0;
    const pesoSaco = this.frmContratoCompraVenta.value.pesoXSaco ? this.frmContratoCompraVenta.value.pesoXSaco : 0;
    const total = cantidad * pesoSaco;
    if (total) {
      this.frmContratoCompraVenta.controls.pesoEnKilos.setValue(total);
    }

    const costo = this.frmContratoCompraVenta.value.costoUnitario ? this.frmContratoCompraVenta.value.costoUnitario : 0;
    const costoTotal = cantidad * costo;
    if (costoTotal) {
      this.frmContratoCompraVenta.controls.costoTotal.setValue(costoTotal);
    }
  }

  ChangeMoneda() {
    if (this.frmContratoCompraVenta.value.moneda === '01') {
      this.frmContratoCompraVenta.controls.costoUnitario.setValue(7.46);
    } else if (this.frmContratoCompraVenta.value.moneda === '02') {
      this.frmContratoCompraVenta.controls.costoUnitario.setValue(1.89);
    }
  }

  ConsultarPorId() {
    this.spinner.show();
    this.contratoService.SearchById({ ContratoId: this.locId })
      .subscribe((res) => {
        if (res && res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        }
      }, (err) => {
        this.spinner.hide();
      });
  }

  async MostrarCostoUnitario() {
    const moneda = this.frmContratoCompraVenta.value.moneda;
    if (moneda === '01') {
      this.frmContratoCompraVenta.controls.costoUnitario.setValue(7.46);
    }
  }

  CalcularCostoTotal() {
    const cantidad = this.frmContratoCompraVenta.value.cantASolicitar;
    if (cantidad) {
      let costoUnitario = this.frmContratoCompraVenta.value.costoUnitario;

      const costoTotal = cantidad * costoUnitario;
      if (costoTotal) {
        this.frmContratoCompraVenta.controls.costoTotal.setValue(costoTotal);
      }
    }
  }

  async CompletarForm(data) {
    if (data) {
      if (data.PaisId) {
        await this.GetCountries();
        this.frmContratoCompraVenta.controls.pais.setValue(data.PaisId);
      }

      if (data.DepartamentoId) {
        await this.GetCities();
        this.frmContratoCompraVenta.controls.ciudad.setValue(data.DepartamentoId);
      }

      if (data.MonedaId) {
        await this.GetCurrencies();
        this.frmContratoCompraVenta.controls.moneda.setValue(data.MonedaId);
        await this.MostrarCostoUnitario();
      }

      if (data.UnidadMedidaId) {
        await this.GetMeasurementUnit();
        this.frmContratoCompraVenta.controls.unidadMedida.setValue(data.UnidadMedidaId);
      }

      if (data.TipoProduccionId) {
        await this.GetProductionType();
        this.frmContratoCompraVenta.controls.tipoProduccion.setValue(data.TipoProduccionId);
      }

      if (data.EmpaqueId) {
        await this.GetPackaging();
        this.frmContratoCompraVenta.controls.empaque.setValue(data.EmpaqueId);
      }

      if (data.TipoEmpaqueId) {
        await this.GetPackagingType();
        this.frmContratoCompraVenta.controls.tipoEmpaque.setValue(data.TipoEmpaqueId);
      }

      if (data.ProductoId) {
        await this.GetProducts();
        this.frmContratoCompraVenta.controls.producto.setValue(data.ProductoId);
      }

      if (data.SubProductoId) {
        await this.GetSubProducts(this.frmContratoCompraVenta.value.producto);
        this.frmContratoCompraVenta.controls.subProducto.setValue(data.SubProductoId);
      }

      if (data.GradoPreparacionId) {
        await this.GetDegreePreparation();
        this.frmContratoCompraVenta.controls.gradoPreparacion.setValue(data.GradoPreparacionId);
      }

      if (data.CalidadId) {
        await this.GetQuality();
        this.frmContratoCompraVenta.controls.calidad.setValue(data.CalidadId);
      }

      if (data.CertificacionId) {
        await this.GetCertificaciones();
        this.frmContratoCompraVenta.controls.certificacion.setValue(data.CertificacionId);
      }

      if (data.TotalSacos) {
        this.frmContratoCompraVenta.controls.cantASolicitar.setValue(data.TotalSacos);
      }

      if (data.PesoSaco) {
        this.frmContratoCompraVenta.controls.pesoXSaco.setValue(data.PesoSaco);
      }

      if (data.PesoKilos) {
        this.frmContratoCompraVenta.controls.pesoEnKilos.setValue(data.PesoKilos);
      }

      if (data.Observaciones) {
        this.frmContratoCompraVenta.controls.observaciones.setValue(data.Observaciones);
      }
      this.frmContratoCompraVenta.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmContratoCompraVenta.controls.distribuidora.setValue(data.Distribuidor);
      this.frmContratoCompraVenta.controls.estado.setValue(data.DescripcionEstado);
      this.frmContratoCompraVenta.controls.correlativo.setValue(data.Correlativo);
      this.locCodigoEstado = data.EstadoId
      this.locFechaRegistroString = data.FechaRegistroString;
      this.CalcularCostoTotal();
      if (parseInt(this.locCodigoEstado) >= 3) {
        this.ObtenerAgricultoresDisponibles();
      }
    }
    this.spinner.hide();
  }

  ConfirmarContrato() {
    if (this.locCodigoEstado === '02' && this.userSession.RolId === 6) {
      if (!this.frmContratoCompraVenta.invalid) {
        this.alertUtil.alertSiNoCallback('Confirmación', '¿Está seguro de confirmar el contrato?', () => {
          const request = {
            Id: this.locId,
            NroContrato: this.frmContratoCompraVenta.value.correlativo,
            Distribuidor: this.frmContratoCompraVenta.value.distribuidora,
            Producto: this.listProductos.find(x => x.Codigo == this.selectedProducto).Label,
            SubProducto: this.listSubProductos.find(x => x.Codigo == this.selectedSubProducto).Label,
            TipoProduccion: this.listTipoProduccion.find(x => x.Codigo == this.selectedTipoProduccion).Label,
            Calidad: this.listCalidad.find(x => x.Codigo == this.selectedCalidad).Label,
            GradoPreparacion: this.listGradosPreparacion.find(x => x.Codigo == this.selectedGradoPreparacion).Label,
            Usuario: this.userSession.NombreUsuario
          }

          this.contratoService.confirmar(request).subscribe((response: TransactionReponse<string>) => {
            console.log(response);
            if (response.Result.Success) {
              this.alertUtil.alertOk('Confirmación', `El contrato ha sido confirmado correctamente.`);
              this.router.navigate(['/home']);
            } else {
              this.alertUtil.alertError('Error', "Ocurrió un error en el proceso: " + response.Result.Message)
            }
          })
        })
      }
    }
  }

  Cancelar() {
    this.router.navigate(['/acopio/operaciones/contrato/list']);
  }

  ObtenerAgricultoresDisponibles() {
    const request = {
      TipoCertificacionId: this.frmContratoCompraVenta.value.certificacion
    }
    this.agricultorService.Consultar(request)
      .subscribe((res) => {
        if (res && res.Result.Success) {
          this.rows = res.Result.Data;
        }
      }, (err) => {
        console.log(err);
      });
  }

  onSelectAgricultores(e) {
    this.agricultoresSeleccionados = e.selected;
  }

  Guardar() {
    if (this.locCodigoEstado === '03' && this.userSession.RolId === 7) {
      this.alertUtil.alertSiNoCallback('Confirmación',
        '¿Está seguro de solicitar la materia prima a los agricultores seleccionados?', () => {
          this.GuardarAgricultores();
        });
    }
  }

  GuardarAgricultores() {
    this.spinner.show();
    let request = {
      agricultores: []
    };
    this.agricultoresSeleccionados.forEach(x => {
      request.agricultores.push({
        ContratoId: this.locId,
        SocioFincaId: x.SocioFincaId,
        CantidadSolicitada: 10,
        Usuario: this.userSession.NombreUsuario
      });
    });
    if (request.agricultores.length > 0) {
      this.contratoService.RegistrarAgricultores(request)
        .subscribe((res) => {
          if (res.Result.Success) {
            this.alertUtil.alertOk('Confirmación',
              'Se ha solicitado materia prima a lo agricultores seleccionados correctamente.');
          }
        }, (err) => {
          console.log(err);
        });
    }
  }
}
