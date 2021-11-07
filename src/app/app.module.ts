import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { AgmCoreModule } from "@agm/core";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpInterceptorImpl } from './shared/http-interceptor-impl';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DragulaService } from "ng2-dragula";
import { NgxSpinnerModule } from 'ngx-spinner';

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
//import * as fromApp from './store/app.reducer';
import { AppComponent } from "./app.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { AuthService } from "./services/auth.service";
import { MaestroService } from "./services/maestro.service";
import { MaestroUtil } from "./services/util/maestro-util";
import { AlertUtil } from "./services/util/alert-util";
import { DateUtil } from "./services/util/date-util";
import { AcopioService, FiltrosMateriaPrima, FiltrosProveedor } from "./services/acopio.service";
import { AuthGuard } from "./shared/auth/auth-guard.service";
import { WINDOW_PROVIDERS } from './shared/services/window.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

var firebaseConfig = {
  apiKey: "YOUR_API_KEY", //YOUR_API_KEY
  authDomain: "YOUR_AUTH_DOMAIN", //YOUR_AUTH_DOMAIN
  databaseURL: "YOUR_DATABASE_URL", //YOUR_DATABASE_URL
  projectId: "YOUR_PROJECT_ID", //YOUR_PROJECT_ID
  storageBucket: "YOUR_STORAGE_BUCKET", //YOUR_STORAGE_BUCKET
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", //YOUR_MESSAGING_SENDER_ID
  appId: "YOUR_APP_ID", //YOUR_APP_ID
  measurementId: "YOUR_MEASUREMENT_ID" //YOUR_MEASUREMENT_ID
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent, ContentLayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    NgbModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: "YOUR_GOOGLE_MAP_API_KEY"
    }),
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AcopioService,
    FiltrosMateriaPrima,
    FiltrosProveedor,
    MaestroService,
    MaestroUtil,
    AlertUtil,
    DateUtil,
    AuthService,
    AuthGuard,
    DragulaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorImpl,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

