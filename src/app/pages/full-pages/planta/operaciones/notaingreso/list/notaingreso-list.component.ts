import { Component, OnInit, ViewChild, ViewEncapsulation, Input, EventEmitter, Output } from "@angular/core";
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { MaestroUtil } from '../../../../../../services/util/maestro-util';
import { AlertUtil } from '../../../../../../services/util/alert-util';
import { DateUtil } from '../../../../../../services/util/date-util';
import { PlantaService } from '../../../../../../services/planta.service';
import { NotaIngresoAlmacenPlantaService } from '../../../../../../services/nota-ingreso-almacen-planta-service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { Router } from "@angular/router"
import { MaestroService } from '../../../../../../services/maestro.service';
import { ILogin } from '../../../../../../services/models/login';

@Component({
  selector: "app-notaingreso-list",
  templateUrl: "./notaingreso-list.component.html",
  styleUrls: [
    "./notaingreso-list.component.scss",
    "/assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None
})
export class NotaIngresoListComponent implements OnInit {
  @ViewChild('vform') validationForm: FormGroup;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  submitted = false;
  listaEstado: Observable<any[]>;
  listaTipoDocumento: Observable<any[]>;
  listaProducto: Observable<any[]>;
  listaSubProducto: Observable<any[]>;
  listaMotivo: Observable<any[]>;
  selectedTipoDocumento: any;
  selectedEstado: any;
  selectedMotivo: any;
  selectedProducto: any;
  selectedSubProducto: any;
  consultaNotaIngresoPlantaForm: FormGroup;
  error: any = { isError: false, errorMessage: '' };
  errorFecha: any = { isError: false, errorMessage: '' };
  errorGeneral: any = { isError: false, errorMessage: '' };
  selected = []
  mensajeErrorGenerico = "Ocurrio un error interno.";
  estadoPesado = "01";
  estadoAnalizado = "02";
  vSessionUser: ILogin;
  @Input() popUp = false;
  @Output() agregarEvent = new EventEmitter<any>();

  // row data
  public rows = [];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  // private
  private tempData = [];
  constructor(
    private router: Router,
    private maestroUtil: MaestroUtil,
    private alertUtil: AlertUtil,
    private dateUtil: DateUtil,
    private plantaService: PlantaService,
    private notaIngresoAlmacenPlantaService: NotaIngresoAlmacenPlantaService,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService) {
    this.singleSelectCheck = this.singleSelectCheck.bind(this);
  }
  ngOnInit(): void {
    this.cargarForm();
    this.buscar();
    this.cargarcombos();
    this.consultaNotaIngresoPlantaForm.controls.fechaInicio.setValue(this.dateUtil.currentMonthAgo());
    this.consultaNotaIngresoPlantaForm.controls.fechaFin.setValue(this.dateUtil.currentDate());
    this.vSessionUser = JSON.parse(localStorage.getItem("user"));
  }

  get f() {
    return this.consultaNotaIngresoPlantaForm.controls;
  }

  filterUpdate(event) {
    /*
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
    */
  }
  singleSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }


  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  cargarForm() {
    this.consultaNotaIngresoPlantaForm = new FormGroup(
      {
        notaIngreso: new FormControl('', [Validators.minLength(5), Validators.maxLength(20), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
        codigoOrganizacion: new FormControl('', []),
        numeroGuiaRemision: new FormControl('', [Validators.minLength(5), Validators.maxLength(100)]),
        fechaInicio: new FormControl('', [Validators.required]),
        fechaFin: new FormControl('', [Validators.required,]),
        organizacion: new FormControl('', [Validators.minLength(8), Validators.maxLength(100), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]),
        ruc: new FormControl('', []),
        tipoProducto: new FormControl('', []),
        subProducto: new FormControl('', []),
        estado: new FormControl('', [Validators.required]),
        motivo: new FormControl('', [])
      });
    this.consultaNotaIngresoPlantaForm.setValidators(this.comparisonValidator())
  }

  cargarcombos() {
    var form = this;
    this.maestroUtil.obtenerMaestros("ProductoPlanta", function (res) {
      if (res.Result.Success) {
        form.listaProducto = res.Result.Data;
        if (form.popUp) {
          form.consultaNotaIngresoPlantaForm.controls.estado.setValue("03");
          form.consultaNotaIngresoPlantaForm.controls.estado.disable();
          form.consultaNotaIngresoPlantaForm.setValidators(this.comparisonValidator())
        }
      }
    });
    this.maestroUtil.obtenerMaestros("EstadoNotaIngresoPlanta", function (res) {
      if (res.Result.Success) {
        form.listaEstado = res.Result.Data;
      }
    });

    this.maestroUtil.obtenerMaestros("MotivoIngresoPlanta", function (res) {
      if (res.Result.Success) {
        form.listaMotivo = res.Result.Data;
      }
    });
  }

  changeSubProducto(e) {
    let filterProducto = e.Codigo;
    this.cargarSubProducto(filterProducto);
  }

  async cargarSubProducto(codigo: any) {

    var data = await this.maestroService.obtenerMaestros("SubProductoPlanta").toPromise();
    if (data.Result.Success) {
      this.listaSubProducto = data.Result.Data.filter(obj => obj.Val1 == codigo);
    }

  }

  buscar() {
    if (this.consultaNotaIngresoPlantaForm.invalid || this.errorGeneral.isError) {
      this.submitted = true;
      return;
    } else {

      this.submitted = false;
      var objRequest = {
        "Numero": this.consultaNotaIngresoPlantaForm.controls['notaIngreso'].value,
        "NumeroGuiaRemision": this.consultaNotaIngresoPlantaForm.controls['numeroGuiaRemision'].value,
        "RazonSocialOrganizacion": this.consultaNotaIngresoPlantaForm.controls['organizacion'].value,
        "RucOrganizacion": this.consultaNotaIngresoPlantaForm.controls['ruc'].value,
        "ProductoId": this.consultaNotaIngresoPlantaForm.controls['tipoProducto'].value,
        "SubProductoId": this.consultaNotaIngresoPlantaForm.controls['subProducto'].value,
        "MotivoIngresoId": this.consultaNotaIngresoPlantaForm.controls['motivo'].value,
        "EstadoId": this.consultaNotaIngresoPlantaForm.controls['estado'].value,
        "EmpresaId": this.vSessionUser.Result.Data.EmpresaId,
        "FechaInicio": this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value,
        "FechaFin": this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value,

      }
      this.spinner.show(undefined,
        {
          type: 'ball-triangle-path',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });
      this.plantaService.Consultar(objRequest)
        .subscribe(res => {
          this.spinner.hide();
          if (res.Result.Success) {
            if (res.Result.ErrCode == "") {
              res.Result.Data.forEach(obj => {

                var fecha = new Date(obj.FechaRegistro);
                obj.FechaRegistroCadena = this.dateUtil.formatDate(fecha, "/");

              });
              this.tempData = res.Result.Data;
              this.rows = [...this.tempData];
              this.selected = [];
            } else if (res.Result.Message != "" && res.Result.ErrCode != "") {
              this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
            } else {
              this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
            }
          } else {
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        },
          err => {
            this.spinner.hide();
            console.log(err);
            this.errorGeneral = { isError: false, errorMessage: this.mensajeErrorGenerico };
          }
        );
    }
  }

  compareTwoDates() {
    var anioFechaInicio = new Date(this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value).getFullYear()
    var anioFechaFin = new Date(this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value).getFullYear()

    if (new Date(this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value) < new Date(this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value)) {
      this.error = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio' };
      this.consultaNotaIngresoPlantaForm.controls['fechaFin'].setErrors({ isError: true })
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 2) {
      this.error = { isError: true, errorMessage: 'El Rango de fechas no puede ser mayor a 2 años' };
      this.consultaNotaIngresoPlantaForm.controls['fechaFin'].setErrors({ isError: true })
    } else {
      this.error = { isError: false, errorMessage: '' };
    }
  }

  compareFechas() {
    var anioFechaInicio = new Date(this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value).getFullYear()
    var anioFechaFin = new Date(this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value).getFullYear()
    if (new Date(this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value) > new Date(this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value)) {
      this.errorFecha = { isError: true, errorMessage: 'La fecha inicio no puede ser mayor a la fecha fin' };
      this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].setErrors({ isError: true })
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 2) {
      this.errorFecha = { isError: true, errorMessage: 'El Rango de fechas no puede ser mayor a 2 años' };
      this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].setErrors({ isError: true })
    } else {
      this.errorFecha = { isError: false, errorMessage: '' };
    }
  }


  public comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (!group.value.fechaInicio || !group.value.fechaFin) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar ambas fechas.' };
      } else if (!group.controls["estado"].value) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar un estado.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  nuevo() {
    this.router.navigate(['/planta/operaciones/notaingreso-edit']);
  }

  anular() {
    if (this.selected.length > 0) {
      if (this.selected[0].EstadoId == this.estadoPesado) {
        var form = this;
        swal.fire({
          title: '¿Estas seguro?',
          text: "¿Estas seguro de anular la guia?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2F8BE6',
          cancelButtonColor: '#F55252',
          confirmButtonText: 'Si',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ml-1'
          },
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) {
            form.anularGuia();
          }
        });
      } else {
        this.alertUtil.alertError("Error", "Solo se puede anular guias con estado pesado")
      }
    }
  }

  enviar() {
    if (this.selected.length > 0) {
      if (this.selected[0].EstadoId == this.estadoAnalizado) {
        var form = this;
        swal.fire({
          title: '¿Estas seguro?',
          text: "¿Estas seguro de enviar a almacen?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2F8BE6',
          cancelButtonColor: '#F55252',
          confirmButtonText: 'Si',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ml-1'
          },
          buttonsStyling: false,
        }).then(function (result) {
          if (result.value) {
            form.enviarAlmacenGuia();
          }
        });
      } else {
        this.alertUtil.alertError("Error", "Solo se puede enviar guias con estado analizado")
      }
    }
  }

  anularGuia() {
    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });
    this.plantaService.Anular(
      {
        "NotaIngresoPlantaId": this.selected[0].NotaIngresoPlantaId,
        "Usuario": this.vSessionUser.Result.Data.NombreUsuario
      })
      .subscribe(res => {
        this.spinner.hide();
        if (res.Result.Success) {
          if (res.Result.ErrCode == "") {
            this.alertUtil.alertOk('Anulado!', 'Nota Ingreso Anulado.');
            this.buscar();

          } else if (res.Result.Message != "" && res.Result.ErrCode != "") {
            this.alertUtil.alertError('Error', res.Result.Message);
          } else {
            this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
          }
        } else {
          this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
        }
      },
        err => {
          this.spinner.hide();
          console.log(err);
          this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
        }
      );
  }

  enviarAlmacenGuia() {

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });
    this.notaIngresoAlmacenPlantaService.enviarAlmacen(this.selected[0].NotaIngresoPlantaId, this.vSessionUser.Result.Data.NombreUsuario)
      .subscribe(res => {
        this.spinner.hide();
        if (res.Result.Success) {
          if (res.Result.ErrCode == "") {
            this.alertUtil.alertOk('Enviado!', 'Enviado Almacen.');
            this.buscar();

          } else if (res.Result.Message != "" && res.Result.ErrCode != "") {
            this.alertUtil.alertError('Error', res.Result.Message);

          } else {
            this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
          }
        } else {
          this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
        }
      },
        err => {
          this.spinner.hide();
          console.log(err);
          this.alertUtil.alertError('Error', this.mensajeErrorGenerico);
        }
      );

  }
  Agregar(selected: any) {
    this.agregarEvent.emit(selected)
  }
  
  exportar() {
    /*
    try {
      if (this.rows == null || this.rows.length <= 0) {
        this.alertUtil.alertError("Error", "No existen datos a exportar.");
      } else {
        this.filtrosMateriaPrima.Numero = this.consultaNotaIngresoPlantaForm.controls['numeroGuia'].value
        this.filtrosMateriaPrima.NombreRazonSocial = this.consultaNotaIngresoPlantaForm.controls['nombre'].value
        this.filtrosMateriaPrima.TipoDocumentoId = this.consultaNotaIngresoPlantaForm.controls['tipoDocumento'].value
        this.filtrosMateriaPrima.NumeroDocumento = this.consultaNotaIngresoPlantaForm.controls['numeroDocumento'].value
        this.filtrosMateriaPrima.ProductoId = this.consultaNotaIngresoPlantaForm.controls['producto'].value
        this.filtrosMateriaPrima.CodigoSocio = this.consultaNotaIngresoPlantaForm.controls['codigoSocio'].value
        this.filtrosMateriaPrima.EstadoId = this.consultaNotaIngresoPlantaForm.controls['estado'].value
        this.filtrosMateriaPrima.FechaInicio = this.consultaNotaIngresoPlantaForm.controls['fechaInicio'].value
        this.filtrosMateriaPrima.FechaFin = this.consultaNotaIngresoPlantaForm.controls['fechaFin'].value

        let vArrHeaderExcel: HeaderExcel[] = [];

        this.spinner.show(undefined,
          {
            type: 'ball-triangle-path',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
          });
        this.acopioService.consultarMateriaPrima(this.filtrosMateriaPrima)
          .subscribe(res => {
            this.spinner.hide();
            if (res.Result.Success) {
              if (res.Result.ErrCode == "") {
                this.tempData = res.Result.Data;

                vArrHeaderExcel = [
                  new HeaderExcel("Número Guia", "center"),
                  new HeaderExcel("Código Socio", "center"),
                  new HeaderExcel("Tipo Documento", "center"),
                  new HeaderExcel("Número Documento", "right", "#"),
                  new HeaderExcel("Nombre o Razón Social"),
                  new HeaderExcel("Fecha Registro", "center", "dd/mm/yyyy"),
                  new HeaderExcel("Estado", "center")
                ];

                let vArrData: any[] = [];
                for (let i = 0; i < this.tempData.length; i++) {
                  vArrData.push([
                    this.tempData[i].Numero,
                    this.tempData[i].CodigoSocio,
                    this.tempData[i].TipoDocumento,
                    this.tempData[i].NumeroDocumento,
                    this.tempData[i].NombreRazonSocial,
                    new Date(this.tempData[i].FechaRegistro),
                    this.tempData[i].Estado
                  ]);
                }
                this.excelService.ExportJSONAsExcel(vArrHeaderExcel, vArrData, 'DatosMateriaPrima');
              } else if (res.Result.Message != "" && res.Result.ErrCode != "") {
                this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
              } else {
                this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
              }
            }
          },
            err => {
              this.spinner.hide();
              console.log(err);
              this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
            }
          );
      }
    }
    catch (err) {
      alert('Ha ocurrio un error en la descarga delExcel.');
    }
    */
  }


}
