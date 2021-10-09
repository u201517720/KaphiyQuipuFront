import { Injectable } from '@angular/core';
import { host } from '../shared/hosts/main.host';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandling } from '../shared/util/error-handling';

@Injectable({
  providedIn: 'root'
})
export class AdelantoService {

  constructor(private http: HttpClient,
    private errorHandling: ErrorHandling) { }

  private url = `${host}Adelanto`;

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

  Actualizar(request: any): Observable<any> {
    const url = `${this.url}/Actualizar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
  Asociar(request: any): Observable<any> {
    const url = `${this.url}/Asociar`;
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError);
  }
  Anular(AdelantoId: number, username: string) {
    let url = `${this.url}/Anular`;
    let request = {
        AdelantoId: AdelantoId,
        Usuario: username
    }
    return this.http.post<any>(url, request).catch(this.errorHandling.handleError)
  }

}
