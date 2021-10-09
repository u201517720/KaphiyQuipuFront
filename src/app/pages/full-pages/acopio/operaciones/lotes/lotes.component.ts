import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import swal from 'sweetalert2';

import { MaestroUtil } from '../../../../../services/util/maestro-util';
import { DateUtil } from '../../../../../services/util/date-util';
import { HeaderExcel } from '../../../../../services/models/headerexcel.model';
import { ExcelService } from '../../../../../shared/util/excel.service';
import { LoteService } from '../../../../../services/lote.service';
import { AlertUtil } from '../../../../../services/util/alert-util';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss', "/assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LotesComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private maestroUtil: MaestroUtil,
    private dateUtil: DateUtil,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private loteService: LoteService,
    private alertUtil: AlertUtil) { }

  banLoteForm: any;
  listTypeDocuments: Observable<any>;
  listStates: Observable<any>;
  listAlmacen: Observable<any>;
  listProducts: [];
  listCertificacion: [];
  listByProducts: [];
  selectedTypeDocument: any;
  selectedState: any;
  selectedAlmacen: any;
  selectedProduct: any;
  selectedCertificacion: any;
  selectedByProduct: any;
  error: any = { isError: false, errorMessage: '' };
  errorGeneral: any = { isError: false, errorMessage: '' };
  mensajeErrorGenerico: string = "Ocurrio un error interno.";
  errorFecha: any = { isError: false, errorMessage: '' };
  rows: any[] = [];
  tempData = [];
  submitted: boolean = false;
  limitRef = 10;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  selected = [];
  vSessionUser: any;

  ngOnInit(): void {
    this.LoadForm();
    this.LoadCombos();
    this.banLoteForm.controls['fechaFin'].setValue(this.dateUtil.currentDate());
    this.banLoteForm.controls['fechaInicio'].setValue(this.dateUtil.currentMonthAgo());
    this.vSessionUser = JSON.parse(localStorage.getItem('user'));
  }

  LoadForm(): void {
    this.banLoteForm = this.fb.group({
      nroLote: ['', [Validators.minLength(5), Validators.maxLength(20), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]],
      tipoDocumento: [],
      nroDoc: ['', [Validators.minLength(8), Validators.maxLength(20), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]],
      fechaInicio: [, [Validators.required]],
      fechaFin: [, [Validators.required]],
      codSocio: ['', [Validators.minLength(5), Validators.maxLength(20), Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')]],
      estado: ['', [Validators.required]],
      nombreRazonSocial: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      almacen: [],
      producto: [],
      certificacion: [],
      subProducto: []
    });
    this.banLoteForm.setValidators(this.comparisonValidator());
  }

  comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (!group.value.fechaInicio || !group.value.fechaFin) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar ambas fechas.' };
      } else if (!group.value.estado) {
        this.errorGeneral = { isError: true, errorMessage: 'Por favor seleccionar un estado.' };
      } else {
        this.errorGeneral = { isError: false, errorMessage: '' };
      }
      return;
    };
  }

  get f() {
    return this.banLoteForm.controls;
  }

  LoadCombos(): void {
    let form = this;
    this.maestroUtil.obtenerMaestros("TipoDocumento", function (res) {
      if (res.Result.Success) {
        form.listTypeDocuments = res.Result.Data;
      }
    });
    this.maestroUtil.obtenerMaestros("EstadoLote", function (res) {
      if (res.Result.Success) {
        form.listStates = res.Result.Data;
      }
    });
    this.maestroUtil.obtenerMaestros("Almacen", function (res) {
      if (res.Result.Success) {
        form.listAlmacen = res.Result.Data;
      }
    });
    this.maestroUtil.obtenerMaestros("TipoCertificacion", function (res) {
      if (res.Result.Success) {
        form.listCertificacion = res.Result.Data;
      }
    });
    this.maestroUtil.obtenerMaestros("Producto", function (res) {
      if (res.Result.Success) {
        form.listProducts = res.Result.Data;
      }
    });
  }

  compareTwoDates(): void {
    let vBeginDate = new Date(this.banLoteForm.value.fechaInicio);
    let vEndDate = new Date(this.banLoteForm.value.fechaFin);

    var anioFechaInicio = vBeginDate.getFullYear()
    var anioFechaFin = vEndDate.getFullYear()

    if (vEndDate < vBeginDate) {
      this.error = { isError: true, errorMessage: 'La fecha fin no puede ser anterior a la fecha inicio.' };
      this.banLoteForm.value.fechaInicio.setErrors({ isError: true })
    } else if (this.dateUtil.restarAnio(anioFechaInicio, anioFechaFin) > 2) {
      this.error = { isError: true, errorMessage: 'Por favor el Rango de fechas no puede ser mayor a 2 años.' };
      this.banLoteForm.value.fechaFin.setErrors({ isError: true })
    } else {
      this.error = { isError: false, errorMessage: '' };
    }
  }

  changeProduct(event: any): void {
    let form = this;
    if (event) {
      this.maestroUtil.obtenerMaestros("SubProducto", function (res) {
        if (res.Result.Success) {
          if (res.Result.Data.length > 0) {
            form.listByProducts = res.Result.Data.filter(x => x.Val1 == event.Codigo);
          } else {
            form.listByProducts = [];
          }
        }
      });
    } else {
      form.listByProducts = [];
    }
  }

  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.Numero.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  onSelectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  Buscar(exportExcel?: boolean): void {
    if (this.banLoteForm.invalid || this.errorGeneral.isError) {
      this.submitted = true;
      return;
    } else {
      this.selected = [];
      this.submitted = false;
      let request = {
        Numero: this.banLoteForm.value.nroLote,
        TipoDocumentoId: this.banLoteForm.value.tipoDocumento,
        FechaInicio: this.banLoteForm.value.fechaInicio,
        FechaFin: this.banLoteForm.value.fechaFin,
        NumeroDocumento: this.banLoteForm.value.nroDoc,
        CodigoSocio: this.banLoteForm.value.codSocio,
        EstadoId: this.banLoteForm.value.estado,
        NombreRazonSocial: this.banLoteForm.value.nombreRazonSocial,
        AlmacenId: this.banLoteForm.value.almacen,
        ProductoId: this.banLoteForm.value.producto,
        TipoCertificacionId: this.banLoteForm.value.certificacion,
        SubProductoId: this.banLoteForm.value.subProducto,
        EmpresaId: 1
      }

      this.spinner.show();

      this.loteService.Consultar(request)
        .subscribe(res => {
          this.spinner.hide();
          if (res.Result.Success) {
            if (!res.Result.ErrCode) {
              if (!exportExcel) {
                this.rows = [];
                res.Result.Data.forEach((obj: any) => {
                  obj.FechaRegistroCadena = this.dateUtil.formatDate(new Date(obj.FechaRegistro));
                });
                this.tempData = res.Result.Data;
                this.rows = [...this.tempData];
              } else {
                let vArrHeaderExcel: HeaderExcel[] = [
                  new HeaderExcel("Número lote", "center"),
                  new HeaderExcel("Número Contrato", "center"),
                  new HeaderExcel("Almacen"),
                  new HeaderExcel("Certificación"),
                  new HeaderExcel("Fecha Lote", "center", "dd/mm/yyyy"),
                  new HeaderExcel("Peso Bruto", "right", "#"),
                  new HeaderExcel("Peso Neto", "right", "#"),
                  new HeaderExcel("Puntaje Final", "right", "#"),
                  new HeaderExcel("% Rendimiento Promedio", "center"),
                  new HeaderExcel("% Humedad Promedio", "center"),
                  new HeaderExcel("Estado", "center")
                ];

                let vArrData: any[] = [];
                for (let i = 0; i < res.Result.Data.length; i++) {
                  vArrData.push([
                    res.Result.Data[i].Numero,
                    res.Result.Data[i].NumeroContrato,
                    res.Result.Data[i].Almacen,
                    res.Result.Data[i].Certificacion,
                    new Date(res.Result.Data[i].FechaRegistro),
                    res.Result.Data[i].TotalKilosBrutosPesado,
                    res.Result.Data[i].TotalKilosNetosPesado,
                    res.Result.Data[i].TotalAnalisisSensorial,
                    res.Result.Data[i].PromedioRendimientoPorcentaje,
                    res.Result.Data[i].PromedioHumedadPorcentaje,
                    res.Result.Data[i].Estado
                  ]);
                }
                this.excelService.ExportJSONAsExcel(vArrHeaderExcel, vArrData, 'DatosLotes');
              }
            } else if (res.Result.Message && res.Result.ErrCode) {
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
            console.error(err);
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        );
    }
  }

  Anular(): void {
    if (this.selected.length > 0) {
      if (this.selected.length == 1) {
        if (this.selected[0].EstadoId == "01") {
          let form = this;
          swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Está seguro de anular el lote "${this.selected[0].Numero}"?`,
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
              form.AnularFila();
            }
          });
        } else {
          this.alertUtil.alertError("Advertencia",
            "La fila seleccionada se encuentra en un estado diferente a INGRESADO.");
        }
      } else {
        this.alertUtil.alertError("Advertencia", "Por favor seleccionar de UNO en UNO.");
      }
    } else {
      this.alertUtil.alertError("Advertencia", "No existen filas seleccionadas.");
    }
  }

  AnularFila(): void {
    let form = this;
    this.spinner.show();
    this.loteService.Anular({ LoteId: this.selected[0].LoteId, Usuario: this.vSessionUser.Result.Data.NombreUsuario })
      .subscribe(res => {
        if (res.Result.Success) {
          if (!res.Result.ErrCode) {
            form.alertUtil.alertOk("Confirmación",
              `El lote ${form.selected[0].Numero} fue anulado correctamente.`);
            form.Buscar();
            form.spinner.hide();
          } else if (res.Result.Message && res.Result.ErrCode) {
            this.errorGeneral = { isError: true, errorMessage: res.Result.Message };
          } else {
            this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
          }
        } else {
          this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
        }
      }, err => {
        form.spinner.hide();
        console.error(err);
        this.errorGeneral = { isError: true, errorMessage: this.mensajeErrorGenerico };
      });
  }

  Exportar(): void {
    this.Buscar(true);
  }

}
