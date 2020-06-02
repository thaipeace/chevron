import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeWatchDirective } from './resize-watch.directive';
import { NgLazyDirective } from './ng-lazy.directive';
import { CompareValidatorDirective } from './validators/compare/compare.directive';
import { NoWhitespaceDirective } from './validators/no-whitespace/no-whitespace.directive';
import { ValueExistDirective } from './validators/value-exist/value-exist.directive';
import { ToggleCollapseDirective } from './toggle-collapse.directive';
import { DigitOnlyDirective } from './validators/digit-only.directive';
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';
import {SpinLoadingDirective} from '@shared/directives/spin-loading.directive';
import { InputTextValidatorDirective } from './input-text-validator.directive';
import {CopyGUIDDirective} from '@shared/directives/copy-guid.directive';

const directives = [
  ResizeWatchDirective,
  NgLazyDirective,
  CompareValidatorDirective,
  NoWhitespaceDirective,
  ValueExistDirective,
  ToggleCollapseDirective,
  DigitOnlyDirective,
  ClickStopPropagationDirective,
  SpinLoadingDirective,
  InputTextValidatorDirective,
  CopyGUIDDirective
];

@NgModule({
  imports: [CommonModule],
  exports: directives,
  declarations: directives
})
export class DirectivesModule {}
