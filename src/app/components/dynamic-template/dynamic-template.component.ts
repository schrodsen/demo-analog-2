import { ChangeDetectorRef, Component, ComponentRef, Input, OnChanges, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentsService } from './dynamic-template.service';
import { ComponentTemplate, LoadedRenderItems } from './dynamic-template.types';

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

@Component({
  selector: 'app-dynamic-template',
  standalone: true,
  template: ` <ng-template #container></ng-template> `,
})
export class DynamicTemplateComponent implements OnChanges, OnDestroy {
  @Input() components: ComponentTemplate[] = [];
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef | undefined;

  private componentRefs: ComponentRef<any>[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private dynamicComponentsService: DynamicComponentsService
  ) {}

  ngOnDestroy() {
    this.componentRefs.forEach((ref) => ref.destroy());
    if (this.container) {
      this.container.clear();
    }
  }

  ngOnChanges() {
    if (!this.components || this.components.length === 0) {
      return;
    }

    this.componentRefs.forEach((ref) => ref.destroy()); // clear all refs

    const loadedComponentModules = this.components
      .filter((componentData) =>
        this.dynamicComponentsService.checkComponentMap(componentData, 'dev')
      )
      .map(async (componentTemplate) => {
        const itemRef =
          await this.dynamicComponentsService.loadComponentConstructor(
            componentTemplate.name
          );
        return { renderItemRef: itemRef, componentTemplate };
      });

    this.container?.clear(); // clear the container that holds the components
    this.renderComponents(loadedComponentModules);
  }

  async renderComponents(items: Promise<LoadedRenderItems>[]) {
    const allSettledItems = await Promise.allSettled(items);
    for (let item of allSettledItems) {
      if (isFulfilled(item)) {
        const newComponent = this.dynamicComponentsService.createComponent(
          this.container as ViewContainerRef,
          item.value.componentTemplate,
          item.value.renderItemRef
        );
        if (newComponent) {
          this.componentRefs.push(newComponent);
        }
      } else {
        // is rejected
        console.error(item.reason);
      }
    }
    this.cdr.markForCheck();
  }
}
