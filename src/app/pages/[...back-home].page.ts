
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { DynamicComponentModel, PageFakerService } from '../services/faker/page-faker.service';
import { RouteMeta } from '@analogjs/router';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
      }
    </div>

    <p>
      <a routerLink="/about">About me</a>
    </p>
  `,
  imports: [
    CommonModule,
    RouterLink,
  ]
})
export default class DynamicPageComponent {

  platform = inject(PlatformService)
  pageTitle = inject(Title);
  router = inject(Router);
  routeResolverService = inject(RouteResolverService);
  fakePageService = inject(PageFakerService);

  dynamicComponents$: Observable<DynamicComponentModel[]> = of([]);

  mytest = 'no change';

  constructor() {

    this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrl(this.router.url)
    .pipe(
      delay(100),
      map(pageModel => {
        this.pageTitle.setTitle(pageModel.title);
        return pageModel.components;
      })
    );
  }
}
