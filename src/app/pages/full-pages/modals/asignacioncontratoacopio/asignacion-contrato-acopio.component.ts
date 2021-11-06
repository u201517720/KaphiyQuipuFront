import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { PrecioDiaRendimientoService } from '../../../../services/precio-dia-rendimiento.service';
import { ContratoService } from '../../../../services/contrato.service';
import { AlertUtil } from '../../../../services/util/alert-util';

@Component({
  selector: 'app-asignacion-contrato-acopio',
  templateUrl: './asignacion-contrato-acopio.component.html',
  styleUrls: ['./asignacion-contrato-acopio.component.scss']
})
export class MAsignacionContratoAcopioComponent implements OnInit {

  frmMdlAsignacionContratoAcopio: FormGroup;
  @Output() response = new EventEmitter<any[]>();
  listGKsPergaminos;
  selectedKGPergamino;
  userSession;
  @Input() request: any;
  flagDiv: boolean = false;

  constructor(private fb: FormBuilder,
    private precioDiaRendimientoService: PrecioDiaRendimientoService,
    private contratoService: ContratoService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertUtil: AlertUtil,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.LoadForm();
  }

  LoadForm() {
    this.userSession = JSON.parse(sessionStorage.getItem('user'));
    this.frmMdlAsignacionContratoAcopio = this.fb.group({
      pesoNetoKGOro: [0],
      KGPergamino: [, Validators.required],
      porcenRendimiento: [0],
      pesoNetoQQ: [0],
      totalKGPergamino: [0],
      pendienteKGPergamino: [0]
    });
    this.GetKGsPergaminos();
    this.LoadData();
  }

  get f() {
    return this.frmMdlAsignacionContratoAcopio.controls;
  }

  async GetKGsPergaminos() {
    this.listGKsPergaminos = [];
    const request = { EmpresaId: this.userSession.Result.Data.EmpresaId };
    const res = await this.precioDiaRendimientoService.ConsultPerformancePercentage(request).toPromise();
    if (res.Result.Success) {
      // let list = [];
      // let label = '';
      // for (let i = 0; i < res.Result.Data.length; i++) {
      //   label = `${res.Result.Data[i].RendimientoInicio}\t\t${res.Result.Data[i].RendimientoFin}\t\t${res.Result.Data[i].KGPergamino}`;
      //   list.push({
      //     Label: label,
      //     Codigo: res.Result.Data[i].KGPergamino,
      //     RenInicio: res.Result.Data[i].RendimientoInicio
      //   });
      // }
      // this.listGKsPergaminos = list;
      this.listGKsPergaminos = res.Result.Data;
    }
  }

  async LoadData() {
    if (this.request) {
      if (this.request.pesoNetoKGOro)
        this.frmMdlAsignacionContratoAcopio.controls.pesoNetoKGOro.setValue(this.request.pesoNetoKGOro);
      if (this.request.pesoNetoQQ)
        this.frmMdlAsignacionContratoAcopio.controls.pesoNetoQQ.setValue(this.request.pesoNetoQQ);
      if (this.request.KGPergamino) {
        await this.GetKGsPergaminos();
        this.frmMdlAsignacionContratoAcopio.controls.KGPergamino.setValue(this.request.KGPergamino);
      }
      if (this.request.porcenRendimiento)
        this.frmMdlAsignacionContratoAcopio.controls.porcenRendimiento.setValue(this.request.porcenRendimiento);
      if (this.request.totalKGPergamino)
        this.frmMdlAsignacionContratoAcopio.controls.totalKGPergamino.setValue(this.request.totalKGPergamino);
      if (this.request.pendienteKGPergamino)
        this.frmMdlAsignacionContratoAcopio.controls.pendienteKGPergamino.setValue(this.request.pendienteKGPergamino);
    }
  }

  Confirm() {
    const form = this;
    if (!this.frmMdlAsignacionContratoAcopio.invalid) {
      swal.fire({
        title: 'Confirmación',
        text: `¿Seguro que desea asignar contrato, luego de grabar no podrá ser modificado?`,
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
      }).then((result) => {
        if (result.value) {
          form.ConfirmAssignment();
        }
      });
    }
  }

  ConfirmAssignment() {
    this.spinner.show();
    const request = {
      EmpresaId: this.userSession.Result.Data.EmpresaId,
      ContratoId: this.request.contratoId,
      Usuario: this.userSession.Result.Data.NombreUsuario,
      KGPergaminoAsignacion: this.frmMdlAsignacionContratoAcopio.value.KGPergamino,
      PorcentajeRendimientoAsignacion: this.frmMdlAsignacionContratoAcopio.value.porcenRendimiento,
      TotalKGPergaminoAsignacion: this.frmMdlAsignacionContratoAcopio.value.totalKGPergamino
    }

    this.contratoService.AssignCollection(request)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.Result.Success) {
          if (res.Result.ErrCode === '01') {
            this.alertUtil.alertOkCallback('Validación', 'Ya existe un Contrato Asignado a Acopio.',
              () => {
                this.Close();
              });
          } else {
            this.alertUtil.alertOkCallback('Confirmación', 'Confirmación exitosa.',
              () => {
                this.response.emit();
                //this.Close();
                this.modalService.dismissAll();
                this.router.navigate(['/exportador/operaciones/contrato/list']);
              });
          }
        } else {
          this.alertUtil.alertError('ERROR', res.Result.Message);
        }
      }, (err) => {
        this.spinner.hide();
        console.log(err);
      });
  }

  Close() {
    this.modalService.dismissAll();
    
  }

  changeKGPergamino(e) {
    if (e) {
      if (e.RendimientoInicio)
        this.frmMdlAsignacionContratoAcopio.controls.porcenRendimiento.setValue(e.RendimientoInicio);
      if (e.KGPergamino) {
        const resultado = e.KGPergamino * this.frmMdlAsignacionContratoAcopio.value.pesoNetoQQ;
        this.frmMdlAsignacionContratoAcopio.controls.KGPergamino.setValue(e.KGPergamino);
        this.frmMdlAsignacionContratoAcopio.controls.totalKGPergamino.setValue(parseFloat(resultado.toFixed(2)));
      }

      this.flagDiv = false;
    }
  }

  HideShow() {
    this.flagDiv = !this.flagDiv;
  }
}
