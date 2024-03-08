import { Injectable } from '@angular/core';
import { MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaFakerService {

  routeToMetaMap = new Map<string, MetaDefinition[]>([
    [
      "/",
      [
        {
          name: 'title',
          content: 'Home Reisenaktuell',
        },
        {
          name: 'description',
          content: 'Whatever',
        },
        {
          name: 'keywords',
          content: 'Reisen, Eigenreisen, Flugreisen, günstig',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'googlebot',
          content: 'max-image-preview:large, notranslate',
        },
      ],
    ],
    [
      "/about",
      [
        {
          name: 'title',
          content: 'about Reisenaktuell',
        },
      ]
    ],
    [
      "base",
      [
        {
          name: 'author',
          content: 'Mars Boys',
        },
      ]
    ],
  ]);

  constructor() { }

  getMeta(url: string) : MetaDefinition[] {

    const routeMeta = this.routeToMetaMap.get(url) ?? [];
    const baseMeta = this.routeToMetaMap.get('base') ?? [];

    return baseMeta.concat(routeMeta) ?? [];
  }
}
