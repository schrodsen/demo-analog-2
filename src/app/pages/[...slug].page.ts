
import { Component, OnInit, inject, ChangeDetectorRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { MetadataRouteResolverService } from '../services/metadata-route-resolver.service';
import { RouteResolverService } from '../services/route-resolver.service';
import { PlatformService } from '../utils/platform.service';
import { DynamicComponentModel } from '../services/model/dynamic-component.model';
import { ServerErrorComponent } from '../components/server-error/server-error.component';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// export const metaResolver: ResolveFn<MetaTag[]> = async (route, state) => {
//   const platform = inject(PlatformService);
//   const resolverService = inject(MetadataRouteResolverService);

//   return (platform.isServer)
//    ? await resolverService.getMetaByUrl(state.url)
//    : [];
// };

export const routeMeta: RouteMeta = {
  meta: async (route, state) => {
    const platform = inject(PlatformService);

    if (platform.isServer) {
      const resolverService = inject(MetadataRouteResolverService);
      return await resolverService.getMetaByUrl(state.url);
    }
    return [];
  }
};

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  template: `
    <div class="dynamic-container">
      @for (item of (dynamicComponents$ | async); track item) {
        <ng-container *ngComponentOutlet="item.componentType" />
      }
    </div>
  `,
  imports: [
    CommonModule,
  ],
})
export default class DynamicPageComponent implements AfterViewInit {

  platform = inject(PlatformService);
  detect = inject(ChangeDetectorRef);
  pageTitle = inject(Title);
  router = inject(Router);
  routeResolverService = inject(RouteResolverService);

  dynamicComponents$: Observable<DynamicComponentModel[]>;
  loader = signal<number>(0);
  //dynamicComponents: DynamicComponentModel[] = [];

  constructor() {

    this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
      .pipe(
        map(pageModel => {
          console.log('outer', pageModel);
          this.pageTitle.setTitle(pageModel.title);
          this.loader.set(pageModel.components.length);
          return pageModel.components;
        }),
        catchError((err) => {
          console.log('caught', err)
          return of([]);
        })
      );

    // this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    // .subscribe({
    //   next: (pageModel) => {
    //     this.pageTitle.setTitle(pageModel.title);
    //     //console.log('component', pageModel.components);
    //     this.dynamicComponents = pageModel.components;
    //   }
    // });
  }

  ngAfterViewInit() {
    if (this.platform.isBrowser) {
      console.log('browser', this.loader())
      if (this.loader() === 0) {
        this.dynamicComponents$ = of([{ componentType: ServerErrorComponent }]);
      }
    }
  }
}
