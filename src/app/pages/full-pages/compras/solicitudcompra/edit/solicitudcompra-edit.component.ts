import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContratoService } from '../../../../../Services/contrato.service';
import { MaestroService } from '../../../../../Services/maestro.service';
import { SolicitudcompraService } from '../../../../../Services/solicitudcompra.service';
import { AlertUtil } from '../../../../../Services/util/alert-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

@Component({
  selector: 'app-solicitudcompra-edit',
  templateUrl: './solicitudcompra-edit.component.html',
  styleUrls: ['./solicitudcompra-edit.component.scss', '/assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SolicitudcompraEditComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private maestroService: MaestroService,
    private maestroUtil: MaestroUtil,
    private solicitudcompraService: SolicitudcompraService,
    private alertUtil: AlertUtil,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private generalService: GeneralService,
    private router: Router,
    private contratoService: ContratoService) {
    this.locId = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : 0;
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    this.LoadForm();
    if (this.userSession) {
      this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
    }
    if (this.locId > 0) {
      this.ConsultarPorId();
      this.frmTitle = 'DETALLE DE LA SOLICITUD ';
    }
  }

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
  locCodigoEstado: number;
  locFechaRegistroString;
  submitted = false;
  mensajeGenerico = 'Ha ocurrido un error interno. Por favor, comun??quese con el ??rea de soporte de sistemas.';
  errorGeneral = { isError: false, errorMessage: '' };
  msgSolicitudNoAceptada: string;

  ngOnInit(): void {
    this.submitted = false;
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
      correlativo: [],
      tara: [],
      kgsNetos: []
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

  async onChangePais(e: any) {
    this.GetCities();
    if (e.Codigo === 'PE') {
      this.frmSolicitudCompraNew.controls.moneda.setValue('01');
    } else {
      this.frmSolicitudCompraNew.controls.moneda.setValue('02');
    }
  }

  ChangeProduct(e: any) {
    this.GetSubProducts(this.selectedProducto);
  }

  EnviarSolicitud() {
    if (this.userSession.RolId === 6) {
      this.submitted = false;
      if (!this.frmSolicitudCompraNew.invalid) {
        this.alertUtil.alertRegistro('Pregunta',
          '??Est?? seguro de enviar la solicitud de compra?', () => {
            this.GuardarSolicitud();
          });
      } else {
        this.submitted = true;
      }
    }
  }

  CalcularPesoEnKilos() {
    const cantidad = this.frmSolicitudCompraNew.value.cantASolicitar ? this.frmSolicitudCompraNew.value.cantASolicitar : 0;
    const pesoSaco = this.frmSolicitudCompraNew.value.pesoXSaco ? this.frmSolicitudCompraNew.value.pesoXSaco : 0;
    const total = cantidad * pesoSaco + (cantidad * 0.3);
    if (total) {
      this.frmSolicitudCompraNew.controls.pesoEnKilos.setValue(total);
    } else {
      this.frmSolicitudCompraNew.controls.pesoEnKilos.reset();
    }

    const costo = this.frmSolicitudCompraNew.value.costoUnitario ? this.frmSolicitudCompraNew.value.costoUnitario : 0;
    const costoTotal = cantidad * costo;
    if (costoTotal) {
      this.frmSolicitudCompraNew.controls.costoTotal.setValue(costoTotal);
    } else {
      this.frmSolicitudCompraNew.controls.costoTotal.reset();
    }
  }

  ChangeMoneda() {
    if (this.frmSolicitudCompraNew.value.moneda === '01') {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(13.5);
    } else if (this.frmSolicitudCompraNew.value.moneda === '02') {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(5.4);
    }
  }

  updateLimit(e) {
    this.limitRef = e.target;
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
    this.spinner.show();
    const request = this.RequestEnviarSolicitud();
    this.solicitudcompraService.Registrar(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res) {
          if (res.Result.Success) {
            this.alertUtil.alertOkCallback('Confirmaci??n',
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

  ConsultarPorId() {
    this.spinner.show();
    this.errorGeneral.isError = false;
    this.solicitudcompraService.ConsultarPorId({ SolicitudCompraId: this.locId })
      .subscribe((res) => {
        if (res && res.Result.Success) {
          this.CompletarForm(res.Result.Data);
        } else {
          this.alertUtil.alertError('ERROR', this.mensajeGenerico);
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
        this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
      });
  }

  async MostrarCostoUnitario() {
    const moneda = this.frmSolicitudCompraNew.value.moneda;
    if (moneda === '01') {
      this.generalService.ObtenerTipoCambio()
        .subscribe((res) => {
          this.frmSolicitudCompraNew.controls.costoUnitario.setValue(parseFloat((5.4 * res.Result.Data.Venta).toFixed(2)));
        }, (err) => {
          console.log(err);
        });
    } else {
      this.frmSolicitudCompraNew.controls.costoUnitario.setValue(5.4);
    }
  }

  CalcularCostoTotal() {
    const pesoKilos = this.frmSolicitudCompraNew.value.pesoEnKilos;
    if (pesoKilos) {
      const costoUnitario = this.frmSolicitudCompraNew.value.costoUnitario;
      const cantidad = this.frmSolicitudCompraNew.value.cantASolicitar;
      const pesoSaco = this.frmSolicitudCompraNew.value.pesoXSaco;
      const costoTotal = cantidad * pesoSaco * costoUnitario;
      if (costoTotal) {
        this.frmSolicitudCompraNew.controls.costoTotal.setValue(parseFloat(costoTotal.toFixed(2)));
      } else {
        this.frmSolicitudCompraNew.controls.costoTotal.reset();
      }
    } else {
      this.frmSolicitudCompraNew.controls.costoTotal.reset();
    }
  }

  async CompletarForm(data) {
    if (data) {
      if (data.PaisId) {
        await this.GetCountries();
        this.frmSolicitudCompraNew.controls.pais.setValue(data.PaisId);
      }

      if (data.DepartamentoId) {
        await this.onChangePais({ Codigo: data.PaisId });
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
      this.frmSolicitudCompraNew.controls.tara.setValue(parseFloat((data.TotalSacos * 0.3).toFixed(2)));
      this.frmSolicitudCompraNew.controls.kgsNetos.setValue(parseFloat((data.PesoSaco * data.TotalSacos).toFixed(2)));
      this.locCodigoEstado = parseInt(data.EstadoId);
      this.locFechaRegistroString = data.FechaRegistroString;
      this.CalcularCostoTotal();
    }
    this.spinner.hide();
  }

  Cancelar() {
    if (this.userSession.RolId === 6) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/compras/solicitudcompra/list']);
    }
  }

  GenerarContrato() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '??Est?? seguro de generar el contrato?', () => {
        this.RegistrarContrato();
      });
  }

  RegistrarContrato() {
    this.errorGeneral.isError = false;
    this.spinner.show();
    const request = {
      SolicitudCompraId: this.locId,
      EmpresaId: this.userSession.EmpresaId,
      Observaciones: this.frmSolicitudCompraNew.value.observaciones,
      UsuarioRegistro: this.userSession.NombreUsuario,
      PrecioUnitario: this.frmSolicitudCompraNew.value.costoUnitario,
      CostoTotal: this.frmSolicitudCompraNew.value.costoTotal,
      Tara: this.frmSolicitudCompraNew.value.tara,
      KilosNetos: this.frmSolicitudCompraNew.value.kgsNetos
    };

    this.contratoService.Create(request)
      .subscribe((res) => {
        if (res.Result.Success) {
          this.spinner.hide();
          this.alertUtil.alertOkCallback('Confirmaci??n',
            `Se ha generado contrato venta ${res.Result.Data}.`,
            () => {
              this.router.navigate(['/acopio/operaciones/contrato/list']);
            });
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
        this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
      });
  }

  EvaluarDisponibilidad() {
    this.alertUtil.alertSiNoCallback('Pregunta',
      '??Est?? seguro de evaluar la disponibilidad de la materia prima?',
      () => {
        this.spinner.show();
        this.errorGeneral.isError = false;
        if (!this.frmSolicitudCompraNew.invalid) {
          const request = {
            CodigoSolicitudCompra: this.locId,
            CodigoTipoCertificacion: this.frmSolicitudCompraNew.value.certificacion,
            PesoNeto: this.frmSolicitudCompraNew.value.cantASolicitar * (this.frmSolicitudCompraNew.value.pesoXSaco + 9),
            PesoSaco: this.frmSolicitudCompraNew.value.pesoXSaco,
            Usuario: this.userSession.NombreUsuario
          };

          this.solicitudcompraService.EvaluarDisponibilidad(request)
            .subscribe((res) => {
              this.spinner.hide();
              if (res.Result.Success) {
                if (res.Result.Data.Aceptado) {
                  this.alertUtil.alertSiNoCallback('Confirmaci??n y Pregunta',
                    res.Result.Data.Mensaje,
                    () => {
                      this.RegistrarContrato();
                    }, () => {
                      this.ConsultarPorId();
                    });
                } else {
                  this.msgSolicitudNoAceptada = res.Result.Data.Mensaje;
                }
              }
            }, (err) => {
              this.spinner.hide();
              this.errorGeneral = { isError: true, errorMessage: this.mensajeGenerico };
            });
        }
      });
  }

  CancelarSolicitud() {

  }

}
