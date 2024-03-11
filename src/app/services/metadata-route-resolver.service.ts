import { MetaTag } from '@analogjs/router';
import { Inject, Injectable, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MetaDefinition } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { PlatformService } from '../utils/platform.service';
import { DOCUMENT } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class MetadataRouteResolverService {

  platform = inject(PlatformService);
  httpClient = inject(HttpClient);

  constructor(@Inject(DOCUMENT) private doc: Document) {
  }

  async getMetaByUrl(url: string) : Promise<MetaTag[]> {

    const apiUrl = `https://vhdev.proxy.beeceptor.com/seo?route=${url}`;
    const metadata = await lastValueFrom(this.httpClient.get<MetaDefinition[]>(apiUrl)
      .pipe(
        map((value) => {
          return this.generateMeta(value);
        }),
        catchError(() => {
          const emptyArray: MetaTag[] = [];
          return of(emptyArray);
        })
      )
    );

    this.addLinks();

    return metadata;
  }

  addLinks() {

    const lang = ['de', 'ch', 'at'];

    // add canonical link
    const canonicalLink : HTMLLinkElement = this.createCanonicalLink();
    const alternateLinks : HTMLLinkElement[] = lang.map((n) =>
      this.createAlternateLink());

    for (let link of alternateLinks) {
      link.href = 'https://www.reisenaktuell.com';
      link.hreflang = 'de'
    }
  }

  private createAlternateLink(): HTMLLinkElement {
    const _link = this.doc.createElement('link');
    _link.setAttribute('rel', 'alternate');
    this.doc.head.appendChild(_link);
    return _link;
  }

  private createCanonicalLink(): HTMLLinkElement {
    const _canonicalLink = this.doc.createElement('link');
    _canonicalLink.setAttribute('rel', 'canonical');
    _canonicalLink.href = 'https://www.reisenaktuell.com';
    this.doc.head.appendChild(_canonicalLink);

    return _canonicalLink;
  }

  private generateMeta(metaTags: MetaDefinition[]) : MetaTag[] {

    const meta : MetaTag[] = [];

    for(let tag of metaTags) {

      if (tag.property !== null && tag.content !== undefined) {
        meta.push({
          property: tag.property as string,
          content: tag.content as string,
        });
        continue;
      }

      if (tag.name !== null && tag.content !== undefined) {
        meta.push({
          name: tag.name as string,
          content: tag.content as string,
        });
        continue;
      }

      if (tag.httpEquiv !== null && tag.content !== undefined) {
        meta.push({
          httpEquiv: tag.name as string,
          content: tag.content as string,
        });
        continue;
      }

      if (tag.charset !== null) {
        meta.push({
          charset: tag.charset as string,
        });
        continue;
      }
    }

    return meta;
  }
}
