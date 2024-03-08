import { Observable } from 'rxjs';
import { Injectable, inject, signal } from '@angular/core';
import { DynamicPageModel, PageFakerService } from './faker/page-faker.service';

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

  getPageConfigurationByUrl(url: string) : Observable<DynamicPageModel> {
    return this.pageFakerService.getConfigurationByUrl(url);
  }
}
