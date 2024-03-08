import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
// import { environment } from '../../environment';
// import { RES, toFormat } from '../resources';
// import { IListParams, IProject } from './models';
import { SeoConfig } from './seo-config';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private _jsonSnippet: HTMLScriptElement | null;
  private _graphObjects: any[] = [];

  private _canonicalLink: HTMLLinkElement | null;
  private _alternateLinks: HTMLLinkElement[] = [];

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this._jsonSnippet = null;
    this._canonicalLink = null;

    // ad fixed tags
    this.AddTags();
  }

  AddTags() {
    // get fixed tags and add, always check since we have inhertited services

    const tags: MetaDefinition[] = [
      { property: 'og:site_name', content: 'Sekrab Garage' },
      { property: 'og:type', content: 'website' },
      { property: 'twitter:site', content: '@sekrabbin' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:creator', content: '@sekrabbin' },
      { name: 'author', content: 'Ayyash' },
    ];

    // add tags
    this.meta.addTags(tags);

    // add canonical link
    const _canonical = this.doc.querySelector('link[rel="canonical"]');
    this._canonicalLink =
      (_canonical as HTMLLinkElement) || this.createCanonicalLink();

    // add alternate language, one at a time, here
    const _links = this.doc.querySelectorAll('link[rel="alternate"]');
    if (_links.length > 0) {
      this._alternateLinks = Array.from(_links) as HTMLLinkElement[];
    } else {
      this._alternateLinks = SeoConfig.Seo.hrefLangs.map((n) =>
        this.createAlternateLink()
      );
    }

    // create the initial ld+json script
    this._jsonSnippet =
      this.doc.querySelector('script[type="application/ld+json"]') ||
      this.createJsonSnippet();
  }

  get url(): string {
    let url = this.doc.location.pathname;
    if (url.indexOf(';') > -1) {
      url = url.substring(0, url.indexOf(';'));
    }
    return url;
  }

  // get defaultUrl(): string {
  //   return toFormat(
  //     Config.Seo.baseUrl,
  //     Config.Seo.defaultRegion,
  //     Config.Seo.defaultLanguage,
  //     ''
  //   );
  // }
  // get siteUrl(): string {
  //   return toFormat(
  //     Config.Seo.baseUrl,
  //     Config.Basic.region,
  //     Config.Basic.language,
  //     ''
  //   );
  // }

  /**** the private functions  ****/
  private createAlternateLink(): HTMLLinkElement {
    // append alternate link to body
    const _link = this.doc.createElement('link');
    _link.setAttribute('rel', 'alternate');
    this.doc.head.appendChild(_link);
    return _link;
  }

  private createCanonicalLink(): HTMLLinkElement {
    // append canonical to body
    const _canonicalLink = this.doc.createElement('link');
    _canonicalLink.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(_canonicalLink);

    return _canonicalLink;
  }

  private createJsonSnippet(): HTMLScriptElement {
    // if on browser platform, return

    const _script = this.doc.createElement('script');
    // set attribute to application/ld+json
    _script.setAttribute('type', 'application/ld+json');

    // append and return reference
    this.doc.body.appendChild(_script);
    return _script;
  }

  /*** the protected functions ***/
  // protected setUrl(params?: IListParams) {
  //   // prefix with baseUrl and remove language, but not in development
  //   const path = this.doc.location.pathname.substring(
  //     environment.production ? 4 : 1
  //   );

  //   let url = this.defaultUrl;

  //   if (url.indexOf(';') > -1) {
  //     url = url.substring(0, url.indexOf(';'));
  //   }
  //   // if category or page exist, append them as query params
  //   // or matrix params, that should be okay, but not wise
  //   if (params) {
  //     const s = new URLSearchParams();
  //     params.category && s.append('category', params.category.key);
  //     params.page && s.append('page', params.page.toString());
  //     url += '?' + s.toString();
  //   }

  //   // set attribute and og:url
  //   this._canonicalLink.setAttribute('href', url);
  //   this.meta.updateTag({ property: 'og:url', content: url });

  //   this.setAlternateLinks(path);

  //   console.log(url);
  // }

  // protected setAlternateLinks(path) {
  //   // for each config hrefLang, set the link that already exists

  //   Config.Seo.hrefLangs.forEach((n, i) => {
  //     // what is the right language
  //     let lang = n.language;
  //     if (lang === 'x-default') lang = Config.Seo.defaultLanguage;

  //     // construct the url
  //     const url = toFormat(
  //       Config.Seo.baseUrl,
  //       n.region || Config.Seo.defaultRegion,
  //       lang,
  //       path
  //     );

  //     // construct hreflang
  //     const hreflang = n.language + (n.region ? '-' + n.region : '');
  //     this._alternateLinks[i].setAttribute('href', url);
  //     this._alternateLinks[i].setAttribute('hreflang', hreflang);

  //     console.log(this._alternateLinks[i].getAttribute('href'));
  //     console.log(this._alternateLinks[i].getAttribute('hreflang'));
  //   });
  // }

  // protected setTitle(title: string) {
  //   const _title = `${title} - ${RES.SITE_NAME}`;

  //   this.title.setTitle(_title);
  //   this.meta.updateTag({
  //     name: 'title',
  //     property: 'og:title',
  //     content: _title,
  //   });
  //   this.meta.updateTag({ property: 'twitter:title', content: _title });

  //   console.log(_title);
  // }

  // protected setDescription(description: string) {
  //   this.meta.updateTag({
  //     name: 'description',
  //     property: 'og:description',
  //     content: description,
  //   });
  //   console.log(description);
  // }

  // protected setImage(imageUrl?: string) {
  //   // prepare image, either passed or
  //   const _imageUrl = imageUrl || Config.Seo.defaultImage;

  //   this.meta.updateTag({
  //     name: 'image',
  //     property: 'og:image',
  //     content: _imageUrl,
  //   });
  //   this.meta.updateTag({ property: 'twitter:image', content: _imageUrl });
  //   console.log(_imageUrl);
  // }

  // protected updateJsonSnippet(schema: any) {
  //   // if on briwser platform return

  //   // first find the graph objects then append to it
  //   const found = this._graphObjects.findIndex(
  //     (n) => n['@type'] === schema['@type']
  //   );
  //   if (found > -1) {
  //     this._graphObjects[found] = schema;
  //   } else {
  //     this._graphObjects.push(schema);
  //   }

  //   const _graph = {
  //     '@context': 'https://schema.org',
  //     '@graph': this._graphObjects,
  //   };
  //   this._jsonSnippet.textContent = JSON.stringify(_graph);
  // }

  // protected emptyJsonSnippet() {
  //   // sometimes, in browser platform, we need to empty objects first
  //   this._graphObjects = [];
  // }

  // /*** public and shared methods ***/
  // setPage(title: string) {
  //   // set to title if found, else fall back to default
  //   this.setTitle(RES.PAGE_TITLES[title] || RES.DEFAULT_PAGE_TITLE);

  //   // aslo reset canonical
  //   this.setUrl();
  // }
}
