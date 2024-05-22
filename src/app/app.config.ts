import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  provideCharts,
  withDefaultRegisterables,
  } from 'ng2-charts';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideCharts(withDefaultRegisterables()), 
    importProvidersFrom(HttpClientModule),
    

  ], 
  
  
};
