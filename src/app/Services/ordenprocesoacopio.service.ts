import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class OrdenprocesoacopioService {

  private url = `${host}OrdenProceso`;

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  Consultar(request: any): Observable<any> {
    const url = `${this.url}/Consultar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Registrar(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarPorId(request: any): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ActualizarTipoProceso(request: any): Observable<any> {
    const url = `${this.url}/TipoProceso`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}
