import { Injectable, inject, signal } from '@angular/core';
import { DynamicPageModel, PageFakerService } from './faker/page-faker.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RouteResolverService {

  private pageFakerService = inject(PageFakerService);

  private _currentRoute = signal<string>('');
  currentRoute = this._currentRoute.asReadonly;

  constructor() { }

  setRoute(route: string) : void {
    this._currentRoute.set(route);
  }

  getPageConfigurationByUrlNew(url: string) : Observable<DynamicPageModel> {
    return this.pageFakerService.getConfigurationByUrlNew(url)
      .pipe(
        switchMap(value => {
          if (value.components.length > 0)
            return of(value);

          return this.pageFakerService.getPage500New();
        })
      );
  }
}
