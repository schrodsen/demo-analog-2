import { MetaTag } from '@analogjs/router';
import { Injectable, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MetaDefinition } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { PlatformService } from '../utils/platform.service';

export const metaResolver: ResolveFn<MetaTag[]> = async (route, state) => {
  const platform = inject(PlatformService);
  const resolverService = inject(MetadataRouteResolverService);

  return (platform.isServer)
   ? await resolverService.getMetaByUrl(state.url)
   : [];
};

@Injectable({
  providedIn: 'root'
})
export class MetadataRouteResolverService {

  platform = inject(PlatformService);
  httpClient = inject(HttpClient);

  constructor() { }

  async getMetaByUrl(url: string) : Promise<MetaTag[]> {

    const apiUrl = `https://vhdev.proxy.beeceptor.com/seo?route=${url}`;
    console.log('url to mock api', apiUrl);
    const metadata = await lastValueFrom(this.httpClient.get<MetaDefinition[]>(apiUrl)
      .pipe(
        map((value) => {
          console.log('seo',value);
          return this.generateMeta(value);
        }),
        catchError((err) => {
          console.log('seo', err);
          const emptyArray: MetaTag[] = [];
          return of(emptyArray);
        })
      )
    );

    return metadata;
    //const metadata = this.apiService.getMeta(url);
    //return this.generateMeta(metadata);
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

export function generateMetaTags(metaTags: MetaDefinition[]) : MetaTag[] {

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
