import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class NotaingresoplantaService {

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  private url = `${host}NotaIngresoPlanta`;

  Consultar(request: any): Observable<any> {
    const url = `${this.url}/Consultar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConsultarPorId(request: any): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Registrar(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  RegistrarControlCalidad(request: any): Observable<any> {
    const url = `${this.url}/ControlCalidad`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  ConfirmarRecepcionMateriaPrima(request: any): Observable<any> {
    const url = `${this.url}/ConfirmarRecepcion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  AutorizarTransformacion(request: any): Observable<any> {
    const url = `${this.url}/AutorizarTransformacion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  FinalizarEtiquetado(request: any): Observable<any> {
    const url = `${this.url}/FinalizarEtiquetado`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  RegistrarResultadosTransformacion(request: any): Observable<any> {
    const url = `${this.url}/ResultadosTransformacion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  FinalizarTransformacion(request: any): Observable<any> {
    const url = `${this.url}/FinalizarTransformacion`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}
