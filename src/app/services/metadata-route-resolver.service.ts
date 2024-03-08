import { MetaTag } from '@analogjs/router';
import { Injectable, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MetaDefinition } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, of } from 'rxjs';

export const metaResolver: ResolveFn<MetaTag[]> = async (route, state) => {
  const resolverService = inject(MetadataRouteResolverService);
  return await resolverService.getMetaByUrl(state.url);
};

@Injectable({
  providedIn: 'root'
})
export class MetadataRouteResolverService {

  httpClient = inject(HttpClient);
  //apiService = inject(MetaFakerService);

  constructor() { }

  async getMetaByUrl(url: string) : Promise<MetaTag[]> {

    const apiUrl = `https://vhdev.proxy.beeceptor.com/seo?route=${url}`;
    const metadata = await lastValueFrom(this.httpClient.get<MetaDefinition[]>(apiUrl)
      .pipe(
        catchError(() => {
          return of([]);
        })
      )
    );
    //const metadata = this.apiService.getMeta(url);
    return this.generateMeta(metadata);
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
