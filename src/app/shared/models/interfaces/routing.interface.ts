export interface IRoutingModel {
  model: any;
  resolveLabelFn?: (model) => string;
}

export function createRoutingModel(model, resolveLabelFn?): IRoutingModel {
  return { model, resolveLabelFn };
}
