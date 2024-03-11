import { RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlatformService } from '../utils/platform.service';
import { MetadataRouteResolverService } from '../services/metadata-route-resolver.service';


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
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>About me</h2>

    <p>
      <a routerLink="/">Home</a>
    </p>
  `,
  imports: [
    RouterLink
  ]
})
export default class AboutComponent {

  constructor() {

  }
}
