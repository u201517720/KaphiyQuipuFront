import { Component, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";
import { MaestroService } from '../../../../Services/maestro.service';

@Component({
    selector: 'app-consultar-transportista',
    templateUrl: './consultar-transportista.component.html',
    styleUrls: ['./consultar-transportista.component.scss', '/assets/sass/libs/datatables.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MConsultarTransportista implements OnInit {

    constructor(
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private maestroService: MaestroService
    ) {
    }

    modalConsultarTransportista: FormGroup;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @Output() transportistaEvent = new EventEmitter<any[]>();
    errorGeneral = { isError: false, errorMessage: '' };
    limitRef = 10;
    rows: any[];
    selected: any;

    ngOnInit(): void {
        this.LoadForm();
    }

    LoadForm() {
        this.modalConsultarTransportista = this.fb.group({
            nombre: [],
            nroDocumento: []
        });
    }

    get f() {
        return this.modalConsultarTransportista.controls;
    }

    updateLimitT(limit) {
        this.limitRef = limit.target.value;
    }

    Buscar() {
        this.spinner.show();
        const request = {
            Nombre: this.modalConsultarTransportista.value.nombre,
            NumeroDocumento: this.modalConsultarTransportista.value.nroDocumento
        }
        this.maestroService.ConsultarTransportista(request)
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