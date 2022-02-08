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
}