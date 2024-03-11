
import { Component, ViewContainerRef, afterRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, TransferState } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { DynamicComponentModel, PageFakerService } from '../services/faker/page-faker.service';
import { RouteMeta } from '@analogjs/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MetadataRouteResolverService } from '../services/metadata-route-resolver.service';
import { RouteResolverService } from '../services/route-resolver.service';
import { PlatformService } from '../utils/platform.service';

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
      } @empty {
        <div>No Elements</div>
      }
    </div>

    <p>
      <a routerLink="/about">About me</a>
    </p>
  `,
  imports: [
    CommonModule,
    RouterLink,
  ],
})
export default class DynamicPageComponent {

  platform = inject(PlatformService)
  pageTitle = inject(Title);
  router = inject(Router);
  viewContainerRef = inject(ViewContainerRef);
  routeResolverService = inject(RouteResolverService);

  dynamicComponents$: Observable<DynamicComponentModel[]>;

  constructor() {

    this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
      .pipe(
        map(pageModel => {
          console.log('outer', pageModel);
          this.pageTitle.setTitle(pageModel.title);
          return pageModel.components;
        }),
        catchError((err) => {
          console.log('caught', err)
          return of([]);
        })
      );


    // this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    //   .pipe(
    //     map(pageModel => {
    //       console.log('outer', pageModel);
    //       this.pageTitle.setTitle(pageModel.title);
    //       return pageModel.components;
    //     },
    //     catchError((err) => {
    //       console.log('error in loading', err);
    //       return of([])
    //     }))
    //   );

    afterRender(() => {

      // console.log('after render')

      // this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
      // .subscribe({
      //   next: (pageModel) => {
      //     this.pageTitle.setTitle(pageModel.title);
      //     this.dynamicComponents = pageModel.components;
      //     console.log('components', this.dynamicComponents);
      //   }
      // });
    })
  }
}
