import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexXAxis,
    ApexPlotOptions,
    ApexTooltip
} from "ng-apexcharts";

import { DateUtil } from '../../../../../Services/util/date-util';
import { MaestroUtil } from '../../../../../Services/util/maestro-util';
import { GeneralService } from '../../../../../Services/general.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    colors: string[];
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
    stroke: ApexStroke;
};

@Component({
    selector: 'app-lista-valoracion-agricultor-acopio',
    templateUrl: './lista-Valoracion-Agricultor-Acopio.component.html'
})
export class ListaValoracionAgricultorAcopioComponent implements OnInit {

    frmListaValoracionAgricultor: FormGroup;
    errorGeneral = { isError: false, errorMessage: '' };
    @ViewChild("chartAcopio") chart: ChartComponent;
    userSession;
    listActores: [];
    selectedActor: [];
    public chartOptions: Partial<ChartOptions>;

    constructor(private fb: FormBuilder,
        private dateUtil: DateUtil,
        private spinner: NgxSpinnerService,
        private router: Router,
        private generalService: GeneralService,
        private maestroUtil: MaestroUtil) {
        this.userSession = JSON.parse(sessionStorage.getItem('user'));
        if (this.userSession) {
            this.userSession = this.userSession.Result ? this.userSession.Result.Data ? this.userSession.Result.Data : this.userSession.Result : this.userSession;
        }
    }

    ngOnInit(): void {
        this.LoadForm();
    }

    LoadForm() {
        this.frmListaValoracionAgricultor = this.fb.group({
            actor: [, Validators.required],
            fechaInicial: [, Validators.required],
            fechaFinal: [, Validators.required],
        });
        this.frmListaValoracionAgricultor.controls.fechaInicial.setValue(this.dateUtil.currentMonthAgo());
        this.frmListaValoracionAgricultor.controls.fechaFinal.setValue(this.dateUtil.currentDate());
        this.GetActores();
    }

    get f() {
        return this.frmListaValoracionAgricultor.controls;
    }

    GetActores() {
        this.maestroUtil.obtenerMaestros('ActoresValoracionAgricultor', (res) => {
            this.listActores = res.Result.Data;
        });
    }

    Visualizar() {
        if (!this.frmListaValoracionAgricultor.invalid) {
            this.spinner.show();
            const request = {
                FechaInicio: this.frmListaValoracionAgricultor.value.fechaInicial,
                FechaFin: this.frmListaValoracionAgricultor.value.fechaFinal,
                Tipo: parseInt(this.frmListaValoracionAgricultor.value.actor)
            }

            this.generalService.ListarPuntajeValoracionesAgricultores(request)
                .subscribe((res) => {
                    this.spinner.hide();
                    if (res.Result.Data) {
                        this.chartOptions = {
                            series: [
                                {
                                    name: "Puntaje",
                                    data: res.Result.Data.map(x => x.Puntaje)
                                }
                            ],
                            chart: {
                                type: "bar",
                                height: 300
                            },
                            plotOptions: {
                                bar: {
                                    distributed: true,
                                    horizontal: true
                                }
                            },
                            colors: [
                                "#2b908f", "#2b908f", "#2b908f", "#2b908f", "#2b908f"
                            ],
                            dataLabels: {
                                enabled: false,
                                formatter: function (val, opt) {
                                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
                                },
                                offsetX: 0,
                                dropShadow: {
                                    enabled: true
                                }
                            },
                            stroke: {
                                width: 1,
                                colors: ["#fff"]
                            },
                            xaxis: {
                                categories: res.Result.Data.map(x => x.Productor)
                            },
                            title: {
                                text: "Custom DataLabels",
                                align: "center",
                                floating: true
                            },
                            subtitle: {
                                text: "Category Names as DataLabels inside bars",
                                align: "center"
                            },
                        };
                    }
                }, (err) => {

                });
        }
    }
}
