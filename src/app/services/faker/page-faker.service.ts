import { Injectable, Type } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { MarsPageModel } from '../model/mars-page.model';

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

  private componentImportMap = new Map<string, any>([
    [ 'header', null ],
    [ 'footer', null ],
    [ 'first', null ],
    [ 'second', null ],
    [ 'third', null ],
  ])

  getConfigurationByUrl(url: string) : Observable<DynamicPageModel> {

    return from(new Promise<DynamicPageModel>(async (resolve, reject) => {
      const dynamicPageModel: DynamicPageModel = {
        title: '',
        components: [],
      }

      let pageConfiguration = this.routeToConfigurationMap.get(url);
      if (pageConfiguration === undefined) {
        pageConfiguration = this.getPage500();
      }

      dynamicPageModel.title = pageConfiguration.title;

      for (let component of pageConfiguration?.components) {
        const componentType = await this.mapNameToComponent(component.componentName);
        dynamicPageModel.components.push({
          componentType: componentType
        });
      }

      resolve(dynamicPageModel);
    }));
  }

  private getPage500() : MarsPageModel {
    return  this.routeToConfigurationMap.get('500') as MarsPageModel;
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
        return firstImport.HeaderComponent;
      case 'second':
        const second = await import('../../components/second/second.component');
        return second.SecondComponent;
      case 'third':
        const third = await import('../../components/third/third.component');
        return third.ThirdComponent;
      case 'server-error':
        const serverError = await import('../../components/server-error/server-error.component');
        return serverError.ServerErrorComponent;
      default:
       return undefined;
    }
  }

  private routeToConfigurationMap = new Map<string, MarsPageModel>([
    [
      "500",
      {
        title: 'test',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'header'
          },
          {
            componentId: 'my-guid',
            componentName: 'server-error'
          },
          {
            componentId: 'my-guid',
            componentName: 'footer'
          },
        ]
      }
    ],
    [
      "/",
      {
        title: 'test',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'header'
          },
          {
            componentId: 'my-guid',
            componentName: 'footer'
          },
        ]
      }
    ],
    [
      "/about",
      {
        title: 'test',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'header'
          },
          {
            componentId: 'my-guid',
            componentName: 'first'
          },
          {
            componentId: 'my-guid',
            componentName: 'footer'
          },
        ]
      }
    ],
    [
      "/test",
      {
        title: 'test',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'header'
          },
          {
            componentId: 'my-guid',
            componentName: 'first'
          },
          {
            componentId: 'my-guid',
            componentName: 'second'
          },
          {
            componentId: 'my-guid',
            componentName: 'third'
          },
          {
            componentId: 'my-guid',
            componentName: 'footer'
          },
        ]
      }
    ],
    [
      "/tuff/tuff",
      {
        title: 'test',
        components: [
          {
            componentId: 'my-guid',
            componentName: 'first'
          },
          {
            componentId: 'my-guid',
            componentName: 'second'
          },
          {
            componentId: 'my-guid',
            componentName: 'third'
          },
        ]
      }
    ],
  ]);
}
