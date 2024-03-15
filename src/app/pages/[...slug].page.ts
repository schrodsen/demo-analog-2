
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { MetadataRouteResolverService } from '../services/metadata-route-resolver.service';
import { RouteResolverService } from '../services/route-resolver.service';
import { PlatformService } from '../utils/platform.service';
import { DynamicComponentModel } from '../services/model/dynamic-component.model';

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
      @for (item of dynamicComponents; track item) {
        <ng-container *ngComponentOutlet="item.componentType" />
      }
    </div>
  `,
  imports: [
    CommonModule,
  ],
})
export default class DynamicPageComponent implements OnInit {

  detect = inject(ChangeDetectorRef);
  pageTitle = inject(Title);
  router = inject(Router);
  routeResolverService = inject(RouteResolverService);

  //dynamicComponents$: Observable<DynamicComponentModel[]>;
  dynamicComponents: DynamicComponentModel[] = [];

  constructor() {

    // this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    //   .pipe(
    //     map(pageModel => {
    //       console.log('outer', pageModel);
    //       this.pageTitle.setTitle(pageModel.title);
    //       return pageModel.components;
    //     }),
    //     catchError((err) => {
    //       console.log('caught', err)
    //       return of([]);
    //     })
    //   );

    this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    .subscribe({
      next: (pageModel) => {
        this.pageTitle.setTitle(pageModel.title);
        //console.log('component', pageModel.components);
        this.dynamicComponents = pageModel.components;
      }
    });
  }

  ngOnInit() {
  }
}
