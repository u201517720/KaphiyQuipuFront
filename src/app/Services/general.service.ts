import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private urlMstr = `${host}Maestro`;
  private urlGral = `${host}General`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) { }

  ObtenerTipoCambio(): Observable<any> {
    const url = `${this.urlMstr}/GetExchangeRate`;
    return this.http.post<any>(url, {}).catch(this.errorHandling.handleError);
  }

  ConsultarDocumentoPago(request): Observable<any> {
    const url = `${this.urlGral}/ConsultPaymentDocument`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarDocumentoPagoPorId(request): Observable<any> {
    const url = `${this.urlGral}/ConsultPaymentDocumentById`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConfirmarVoucherPago(request): Observable<any> {
    const url = `${this.urlGral}/ConfirmVoucherPayment`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  GenerarPagoPendientePlanta(request): Observable<any> {
    const url = `${this.urlGral}/GeneratePlantPendingPayment`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarDocumentoPagoPlanta(request): Observable<any> {
    const url = `${this.urlGral}/ConsultPaymentDocumentPlant`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarDocumentoPagoPlantaPorId(request): Observable<any> {
    const url = `${this.urlGral}/ConsultPaymentDocumentPlantById`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  AprobarDepositoPlanta(request): Observable<any> {
    const url = `${this.urlGral}/ApprovePlantDeposit`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  GuardarVoucherPlanta(request): Observable<any> {
    const url = `${this.urlGral}/SaveVoucherPlant`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConfirmarVoucherPagoPlanta(request): Observable<any> {
    const url = `${this.urlGral}/ConfirmVoucherPaymentPlant`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}