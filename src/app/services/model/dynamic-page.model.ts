import { DynamicComponentModel } from "./dynamic-component.model";

export interface DynamicPageModel {
  title: string,
  components: DynamicComponentModel[],
}
