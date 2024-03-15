import { Type } from "@angular/core";

export interface DynamicComponentModel {
  componentType: Type<any>,
  inputs?: Record<string, unknown>
}
