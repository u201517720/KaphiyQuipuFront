import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class SocioFincaService {

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) {
  }

  private url = `${host}SocioFinca`;

  Create(request: any): Observable<any> {
    const url = `${this.url}/Registrar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  Update(request: any): Observable<any> {
    const url = `${this.url}/Actualizar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchSocioById(request: any): Observable<any> {
    const url = `${this.url}/ConsultarPorSocioId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchById(request: any): Observable<any> {
    const url = `${this.url}/ConsultarPorId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchSocioFinca(request: any): Observable<any> {
    const url = `${this.url}/ConsultarSocioFincaEstimadoPorSocioFincaId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }

  SearchPartnerProducerByFincaPartnerId(request: any): Observable<any> {
    const url = `${this.url}/ConsultarSocioProductorPorSocioFincaId`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
}
