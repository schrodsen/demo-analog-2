import { PlatformService } from './../utils/platform.service';
import { AfterViewInit, ChangeDetectorRef, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouteResolverService } from "../services/route-resolver.service";
import { DynamicComponentModel } from "../services/model/dynamic-component.model";
import { ServerErrorComponent } from "../components/server-error/server-error.component";
import { DynamicTemplateComponent } from '../components/dynamic-template/dynamic-template.component';
import { ComponentTemplate } from '../components/dynamic-template/dynamic-template.types';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="dynamic-container">
      @for (item of dynamicComponents; track item) {
        <ng-container *ngComponentOutlet="item.componentType" />
      }
    </div>
    <!-- <p>
      Huhu
    </p>
    <app-dynamic-template [components]="components"></app-dynamic-template> -->
  `,
  imports: [
    CommonModule,
    DynamicTemplateComponent
  ],
})
export default class HomeComponent implements AfterViewInit {

  platform = inject(PlatformService);
  detect = inject(ChangeDetectorRef);
  pageTitle = inject(Title);
  router = inject(Router);
  routeResolverService = inject(RouteResolverService);

  //dynamicComponents$: Observable<DynamicComponentModel[]>;
  dynamicComponents: DynamicComponentModel[] = [];
  components: ComponentTemplate[] = [];

  constructor() {

    // this.dynamicComponents$ = this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    //   .pipe(
    //     map(pageModel => {
    //       console.log('outer', pageModel);
    //       this.pageTitle.setTitle(pageModel.title);
    //       return pageModel.components;
    //     }),
    //     catchError((err) => {
    //       console.log('caught', err)
    //       return of([]);
    //     })
    //   );

    // this.components.push({
    //   name: 'header',
    //   componentData: {}
    // })

    // this.components.push({
    //   name: 'imageSlider',
    //   componentData: {}
    // })

    // this.components.push({
    //   name: 'footer',
    //   componentData: {}
    // })

    this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    .subscribe({
      next: (pageModel) => {
        this.pageTitle.setTitle(pageModel.title);
        this.dynamicComponents = pageModel.components;
      }
    });
  }

  ngAfterViewInit() {
    // if (this.platform.isBrowser) {
    //   if (this.dynamicComponents.length === 0) {
    //     this.dynamicComponents = [{ componentType: ServerErrorComponent }];
    //   }
    // }
  }
}
