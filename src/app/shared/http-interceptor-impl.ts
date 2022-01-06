import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {

  constructor(private http: HttpClient,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var contenType = 'application/json'
    if (req.url.includes("/SocioFincaCertificacion/Registrar")
      || req.url.includes("/SocioFincaCertificacion/DescargarArchivo")
      || req.url.includes("/FincaMapa/Registrar")
      || req.url.includes("/OrdenProceso/Registrar")
    ) {
      contenType = 'multipart/form-data'
    }
    const token = "";// this.storage.getToken();
    const headers = new HttpHeaders()
      .set('enctype', contenType)
      .set('Allowed', 'true')
      .set('Accept', 'application/json');
    //.append('Authorization', `bearer ${token}`);
    const reqCloned = req.clone({
      headers: headers
    });

    return next.handle(reqCloned).catch((err) => {
      console.error('Error Ocurred', err);
      return Observable.throw(err);
    }) as any;
  }
}
