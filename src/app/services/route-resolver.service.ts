import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MarsPageModel } from './model/mars-page.model';
import { DynamicPageModel } from './model/dynamic-page.model';

@Injectable({
  providedIn: 'root'
})
export class RouteResolverService {

  private httpClient = inject(HttpClient);

  constructor() { }

  getPageConfigurationByUrlNew(url: string) : Observable<DynamicPageModel> {

    const apiUrl = `https://vhdev.proxy.beeceptor.com/page?route=${url}`;

    return this.httpClient.get<MarsPageModel>(apiUrl)
      .pipe(
        switchMap(pageModel => {
          return from(new Promise<DynamicPageModel>(async (resolve) => {

            const dynamicPageModel: DynamicPageModel = {
              title: '',
              components: [],
            }

            dynamicPageModel.title = pageModel.title;

            for (let component of pageModel?.components) {
              // if (component.componentName === 'image-slider')
              //   continue;
              const componentType = await this.loadComponent(component.componentName);
              dynamicPageModel.components.push({
                componentType: componentType
              });
            }
            resolve(dynamicPageModel);
          }))
        }),
        catchError((err) => {
          console.log('error while getting page configuration', err);
          return this.getPage500();
        })
      );
  }

  getPage500() : Observable<DynamicPageModel> {
    return from(new Promise<DynamicPageModel>(async (resolve) => {

      const dynamicPageModel: DynamicPageModel = {
        title: 'Server not available',
        components: [],
      }

      const serverError = await import('../components/server-error/server-error.component');
      dynamicPageModel.components.push({
        componentType: serverError.ServerErrorComponent
      });

      resolve(dynamicPageModel);
    }))
  }

  // Returns the component as type to be used
  private async loadComponent(name: string) : Promise<any> {

    // const componentImport = await import(`../../components/${name}/${name}.component.ts`);
    // if (name === 'header') {
    //   //console.log('import', componentImport);
    //   return componentImport['HeaderComponent'];
    // } else if (name === 'footer') {
    //   //console.log('import', componentImport);
    //   return componentImport['FooterComponent'];
    // }

    switch (name) {
      case 'header':
        let headerImport = await import('../components/header/header.component');
        return headerImport.HeaderComponent;
      case 'footer':
        const footer = await import('../components/footer/footer.component');
        return footer.FooterComponent;
      case 'first':
        const firstImport = await import('../components/first/first.component');
        return firstImport.FirstComponent;
      case 'second':
        const second = await import('../components/second/second.component');
        return second.SecondComponent;
      case 'third':
        const third = await import('../components/third/third.component');
        return third.ThirdComponent;
      case 'image-slider':
        const imageSlider = await import('../components/image-slider/image-slider.component');
        return imageSlider.ImageSliderComponent;
      default:
        return undefined;
    }
  }
}
