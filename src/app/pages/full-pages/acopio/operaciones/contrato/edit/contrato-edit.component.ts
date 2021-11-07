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
  listOlores: any[];
  listColores: any[];
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
  selectedAgricultores = [];
  locId = 0;
  locCodigoEstado = '';
  locFechaRegistroString;
  mensajeGenerico = 'Ha ocurrido un error interno, por favor comunicarse con el administrador de sistema.';
  listaControlesCalidad = [];
  oloresSels = [];
  coloresSels = [];
  detalleControlesCalidad = [];

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
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
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
      correlativo: [],
      sumaCosechaSeleccionada: [],
      responsable: []
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

  async GetOlores() {
    this.listOlores = [];
    const res = await this.maestroService.obtenerMaestros('Olor').toPromise();
    if (res.Result.Success) {
      this.listOlores = res.Result.Data;
    }
  }

  async GetColores() {
    this.listColores = [];
    const res = await this.maestroService.obtenerMaestros('Color').toPromise();
    if (res.Result.Success) {
      this.listColores = res.Result.Data;
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

      if (data.Responsable) {
        this.frmContratoCompraVenta.controls.responsable.setValue(data.Responsable);
      }
      
      this.frmContratoCompraVenta.controls.fechaRegistro.setValue(data.FechaRegistro);
      this.frmContratoCompraVenta.controls.distribuidora.setValue(data.Distribuidor);
      this.frmContratoCompraVenta.controls.estado.setValue(data.DescripcionEstado);
      this.frmContratoCompraVenta.controls.correlativo.setValue(data.Correlativo);
      this.locCodigoEstado = data.EstadoId
      this.locFechaRegistroString = data.FechaRegistroString;
      this.CalcularCostoTotal();
      this.ActualizarListaAgricultores();
      if (parseInt(this.locCodigoEstado) >= 5) {
        this.GetOlores();
        this.GetColores();
      }
      this.detalleControlesCalidad = data.controles;
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

  ActualizarListaAgricultores() {
    if (this.locCodigoEstado === '03') {
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
    } else {
      this.ObtenerAgricultores();
    }
  }

  onSelectAgricultores(e) {
    const pesoKilos = this.frmContratoCompraVenta.value.pesoEnKilos;
    const sumaCosecha = this.frmContratoCompraVenta.value.sumaCosechaSeleccionada;
    let sumaSelected = 0;
    if (e && e.selected.length > 0) {
      // if (pesoKilos !== sumaCosecha) {
      let colTotalCosecha = 0;
      for (let i = 0; i < e.selected.length; i++) {
        if (pesoKilos === sumaCosecha || pesoKilos === sumaSelected) {
          this.selectedAgricultores.pop();
        }
        if (sumaSelected < pesoKilos) {
          colTotalCosecha = e.selected[i].TotalCosecha;
          if (colTotalCosecha) {
            if (colTotalCosecha > pesoKilos) {
              if (sumaSelected) {
                sumaSelected += (pesoKilos - sumaSelected);
              } else {
                sumaSelected = pesoKilos;
              }
            } else {
              sumaSelected += colTotalCosecha;
            }
          }
        }
      }
      // } else {
      //   sumaSelected = sumaCosecha;
      //   this.selectedAgricultores.pop();
      // }
    }
    this.frmContratoCompraVenta.controls.sumaCosechaSeleccionada.setValue(sumaSelected);
  }

  onActivate(e) {
    if (e.type === 'click') {
      var hh = e;
    }
  }

  Guardar() {
    if (this.locCodigoEstado === '03' && this.userSession.RolId === 7) {
      this.alertUtil.alertSiNoCallback('Confirmación',
        '¿Está seguro de solicitar la materia prima a los agricultores seleccionados?', () => {
          this.GuardarAgricultores();
        });
    } else if (this.locCodigoEstado === '05' && this.userSession.RolId === 9) {
      this.alertUtil.alertSiNoCallback('Confirmación',
        '¿Está seguro de guardar los datos ingresados para el control de calidad?',
        () => {
          this.GuardarControlCalidad();
        });
    }
  }

  GuardarAgricultores() {
    this.spinner.show();
    let request = {
      agricultores: []
    };
    if (this.selectedAgricultores && this.selectedAgricultores.length > 0) {
      let pesoKilos = this.frmContratoCompraVenta.value.pesoEnKilos;
      let cosecha = 0;

      this.selectedAgricultores.forEach(x => {

        if (x.TotalCosecha < pesoKilos) {
          cosecha = x.TotalCosecha;
          pesoKilos -= x.TotalCosecha;
        } else {
          cosecha = pesoKilos;
        }
        // sumaTotalCosecha += x.TotalCosecha;
        request.agricultores.push({
          ContratoId: this.locId,
          SocioFincaId: x.SocioFincaId,
          CantidadSolicitada: cosecha,
          Usuario: this.userSession.NombreUsuario
        });
      });

      if (request.agricultores.length > 0) {
        this.contratoService.RegistrarAgricultores(request)
          .subscribe((res) => {
            this.spinner.hide();
            if (res.Result.Success) {
              this.alertUtil.alertOkCallback('Confirmación',
                'Se ha solicitado materia prima a lo agricultores seleccionados correctamente.',
                () => {
                  this.ConsultarPorId();
                });
            } else {

            }
          }, (err) => {
            console.log(err);
            this.spinner.hide();
            this.alertUtil.alertError('ERROR', err.Result.Message);
          });
      }
    } else {
      this.spinner.hide();
      this.alertUtil.alertWarning('Validación', 'No ha seleccionado agricultores.');
    }
  }

  ObtenerAgricultores() {
    this.spinner.show();
    this.rows = [];
    this.contratoService.ObtenerAgricultores({ ContratoId: this.locId })
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          this.rows = res.Result.Data;
          if (parseInt(this.locCodigoEstado) === 5) {
            this.detalleControlesCalidad = this.rows;
            this.rows.forEach(x => {
              this.listaControlesCalidad.push({
                ContratoSocioFincaId: x.ContratoSocioFincaId,
                Humedad: 0,
                Observaciones: '',
                ListaOlores: '',
                ListaColores: '',
                UsuarioCreacion: this.userSession.NombreUsuario,
                Agricultor: x.NombreCompleto
              });
            });
          }
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
      });
  }

  GuardarControlCalidad() {
    const valHumedad = this.listaControlesCalidad.filter(x => x.Humedad <= 0);
    const valOlores = this.listaControlesCalidad.filter(x => x.ListaOlores === '');
    const valColores = this.listaControlesCalidad.filter(x => x.ListaColores === '');
    if (valHumedad.length > 0) {
      this.alertUtil.alertWarning('Validación', `Ingresar la humedad del agricultor ${valHumedad[0].Agricultor}.`);
      return;
    } else if (valOlores.length > 0) {
      this.alertUtil.alertWarning('Validación', `Seleccionar los olores del agricultor ${valOlores[0].Agricultor}.`);
      return;
    } else if (valColores.length > 0) {
      this.alertUtil.alertWarning('Validación', `Seleccionar los colores del agricultor ${valColores[0].Agricultor}.`);
      return;
    }
    this.spinner.show();
    const request = {
      controles: this.listaControlesCalidad
    }
    this.contratoService.RegistrarControlCalidad(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res) {
          if (res.Result.Success) {
            this.alertUtil.alertOkCallback('Confirmación',
              'Se ha registrado el control de calidad realizado a la materia prima de los agricultores.',
              () => {
                this.ConsultarPorId();
              });
          }
        }
      }, (err) => {
        console.log(err);
        this.spinner.hide();
        this.alertUtil.alertError('ERROR', this.mensajeGenerico);
      })
  }

  changeOlores(e, id) {
    if (e.currentTarget.checked) {
      this.oloresSels.push(e.currentTarget.value);
    } else {
      this.oloresSels.splice(this.oloresSels.indexOf(e.currentTarget.value), 1);
    }

    this.listaControlesCalidad.forEach(x => {
      if (x.ContratoSocioFincaId === id) {
        x.ListaOlores = this.oloresSels.join(',');
      }
    });
  }

  changeColores(e, id) {
    if (e.currentTarget.checked) {
      this.coloresSels.push(e.currentTarget.value);
    } else {
      this.coloresSels.splice(this.coloresSels.indexOf(e.currentTarget.value), 1);
    }
    this.listaControlesCalidad.forEach(x => {
      if (x.ContratoSocioFincaId === id) {
        x.ListaColores = this.coloresSels.join(',');
      }
    });
  }

  changeValorCalidad(e, id, tipo) {
    this.listaControlesCalidad.forEach(x => {
      if (x.ContratoSocioFincaId === id) {
        x.Humedad = tipo === 'hmd' ? parseFloat(e.currentTarget.value) : x.Humedad;
        x.Observaciones = tipo === 'obs' ? e.currentTarget.value : x.Observaciones;
      }
    });
  }
}
