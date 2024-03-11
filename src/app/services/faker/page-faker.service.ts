import { Injectable, Type, inject } from '@angular/core';
import { MarsPageModel } from '../model/mars-page.model';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export interface DynamicPageModel {
  title: string,
  components: DynamicComponentModel[],
}

export interface DynamicComponentModel {
  componentType: Type<any>,
  inputs?: Record<string, unknown>
}


@Injectable({ providedIn: 'root' })
export class PageFakerService {

  private httpClient = inject(HttpClient);

  private componentImportMap = new Map<string, any>([
    [ 'header', null ],
    [ 'footer', null ],
    [ 'first', null ],
    [ 'second', null ],
    [ 'third', null ],
    [ 'server-error', null ],
  ])

  getConfigurationByUrlNew(url: string): Observable<DynamicPageModel> {

    const apiUrl = `https://vhdev.proxy.beeceptor.com/page?route=${url}`;

    return this.httpClient.get<MarsPageModel>(apiUrl)
      .pipe(
        switchMap(pageModel => {
          console.log('page model', pageModel);
          return from(new Promise<DynamicPageModel>(async (resolve) => {

            const dynamicPageModel: DynamicPageModel = {
              title: '',
              components: [],
            }

            dynamicPageModel.title = pageModel.title;

            for (let component of pageModel?.components) {
              const componentType = await this.mapNameToComponent(component.componentName);
              dynamicPageModel.components.push({
                componentType: componentType
              });
            }
            console.log('dyn page found', dynamicPageModel);
            resolve(dynamicPageModel);
          }))
        }),
        catchError((err) => {
          console.log('error while getting page configuration', err);

          const emptyPageModel : DynamicPageModel = {
            title: '',
            components: []
          };
          return of(emptyPageModel);
        //   console.log('error while getting page configuration', err);

        //   return from(new Promise<DynamicPageModel>(async (resolve) => {

        //     console.log('building error page')
        //     const dynamicPageModel: DynamicPageModel = {
        //       title: '',
        //       components: [],
        //     }

        //     const pageModel = this.getPage500();
        //     dynamicPageModel.title = pageModel.title;

        //     for (let component of pageModel?.components) {
        //       const componentType = await this.mapNameToComponent(component.componentName);
        //       dynamicPageModel.components.push({
        //         componentType: componentType
        //       });
        //     }

        //     console.log('dyn page not found', dynamicPageModel);
        //     resolve(dynamicPageModel);
        //   }))
        })
      );
  }

  getPage500New() : Observable<DynamicPageModel> {
    return from(new Promise<DynamicPageModel>(async (resolve) => {

      const pageModel = this.routeToConfigurationMap.get('500') as MarsPageModel;
      const dynamicPageModel: DynamicPageModel = {
        title: '',
        components: [],
      }

      dynamicPageModel.title = pageModel.title;

      for (let component of pageModel?.components) {
        const componentType = await this.mapNameToComponent(component.componentName);
        dynamicPageModel.components.push({
          componentType: componentType
        });
      }
      console.log('dyn page found', dynamicPageModel);
      resolve(dynamicPageModel);
    }))
  }

  private async mapNameToComponent(name: string) : Promise<any> {

    switch (name) {
      case 'header':
        let headerImport = this.componentImportMap.get(name);
        if (headerImport === null) {
          headerImport = await import('../../components/header/header.component');
          this.componentImportMap.set(name, headerImport);
        }
        return headerImport.HeaderComponent;
      case 'footer':
        const footer = await import('../../components/footer/footer.component');
        return footer.FooterComponent;
      case 'first':
        let firstImport = this.componentImportMap.get(name);
        if (firstImport === null) {
          firstImport = await import('../../components/first/first.component');
          this.componentImportMap.set(name, firstImport);
        }
        return firstImport.FirstComponent;
      case 'second':
        const second = await import('../../components/second/second.component');
        return second.SecondComponent;
      case 'third':
        const third = await import('../../components/third/third.component');
        return third.ThirdComponent;
      case 'server-error':
        let serverError = this.componentImportMap.get(name);
        if (serverError === null) {
          serverError = await import('../../components/server-error/server-error.component');
          this.componentImportMap.set(name, serverError);
        }
        return serverError.ServerErrorComponent;
      default:
       return undefined;
    }
  }

  private routeToConfigurationMap = new Map<string, MarsPageModel>([
    [
      "500",
      {
        title: 'Ooops',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'server-error'
          },
        ]
      }
    ],
  ]);
}
