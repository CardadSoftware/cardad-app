import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CustomTitleStrategy } from './services/custom-title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()
    , importProvidersFrom(
      BrowserAnimationsModule, // Import BrowserAnimationsModule only here
      RouterModule.forRoot([])  // Example for router setup
    ), provideAnimationsAsync()
    ,{ provide: TitleStrategy, useClass: CustomTitleStrategy }
  ]
};
