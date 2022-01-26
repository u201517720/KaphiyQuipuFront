import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";
import { MaestroService } from '../../../../Services/maestro.service';

@Component({
    selector: 'app-consultar-responsable',
    templateUrl: './consultar-responsable.component.html',
    styleUrls: ['./consultar-responsable.component.scss', '/assets/sass/libs/datatables.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MConsultarResponsable implements OnInit {

    constructor(
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private maestroService: MaestroService
    ) { }

    modalConsultarResponsable: FormGroup;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @Output() transportistaEvent = new EventEmitter<any[]>();
    errorGeneral = { isError: false, errorMessage: '' };
    limitRef = 10;
    rows: any[];
    selected = [];

    ngOnInit(): void {
        this.LoadForm();
    }

    LoadForm() {
        this.modalConsultarResponsable = this.fb.group({
            nombre: [],
            nroDocumento: []
        });
    }

    get f() {
        return this.modalConsultarResponsable.controls;
    }

    updateLimit(limit) {
        this.limitRef = limit.target.value;
    }

    Buscar() {
        this.spinner.show();
        const request = {
            Nombre: this.modalConsultarResponsable.value.nombre,
            Documento: this.modalConsultarResponsable.value.nroDocumento,
            Tipo: '01'
        }
        this.maestroService.ConsultarResponsable(request)
            .subscribe((res) => {
                this.spinner.hide();
                if (res.Result.Success) {
                    this.rows = res.Result.Data;
                }
            });
    }

    Seleccionar() {
        this.transportistaEvent.emit(this.selected);
        this.CloseModal();
    }

    CloseModal() {
        this.modalService.dismissAll();
    }
}