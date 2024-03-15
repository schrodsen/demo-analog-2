import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouteResolverService } from "../services/route-resolver.service";
import { DynamicComponentModel } from "../services/model/dynamic-component.model";

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="dynamic-container">
      @for (item of dynamicComponents; track item) {
        <ng-container *ngComponentOutlet="item.componentType" />
      }
    </div>
  `,
  imports: [
    CommonModule,
  ],
})
export default class HomeComponent {

  detect = inject(ChangeDetectorRef);
  pageTitle = inject(Title);
  router = inject(Router);
  routeResolverService = inject(RouteResolverService);

  //dynamicComponents$: Observable<DynamicComponentModel[]>;
  dynamicComponents: DynamicComponentModel[] = [];

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

    this.routeResolverService.getPageConfigurationByUrlNew(this.router.url)
    .subscribe({
      next: (pageModel) => {
        this.pageTitle.setTitle(pageModel.title);
        this.dynamicComponents = pageModel.components;
      }
    });
  }
}
