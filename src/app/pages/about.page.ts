import { MetaTag, RouteMeta } from '@analogjs/router';
import { Component, inject } from '@angular/core';
import { RouterLink, ResolveFn } from '@angular/router';
import { generateMetaTags, metaResolver } from './../services/metadata-route-resolver.service';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const routeMeta: RouteMeta = {
  meta: metaResolver,
};

// const x : ResolveFn<MetaTag[]> = async (route, state) =>
// {
//   const url = '/';
//   const httpClient = inject(HttpClient);
//   const apiUrl = `http://localhost:5263/api/seo?route=${url}`;
//   const metadata = await lastValueFrom(httpClient.get<MetaDefinition[]>(apiUrl));
//   //const metadata = this.apiService.getMeta(url);
//   return generateMetaTags(metadata);
// }

// export const routeMeta: RouteMeta = {
//   meta: x
// };

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
