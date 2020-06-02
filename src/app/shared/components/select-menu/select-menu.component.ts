import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  ContentChild,
  TemplateRef,
  Directive,
  OnInit
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from '@angular/forms';
import {
  SelectItemTemplateDirective,
  EmptyTemplateDirective
} from '@app/shared/components/select-menu/select-menu-template.directive';
import {MappingLabelPipe} from '@app/shared/pipe/mapping-label.pipe';
import {LoadingBarService} from '@ngx-loading-bar/core';

@Component({
  selector: 'select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MappingLabelPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMenuComponent),
      multi: true
    }
  ]
})
export class SelectMenuComponent implements OnChanges, OnInit {
  @ContentChild(SelectItemTemplateDirective, {read: TemplateRef})
  itemTemplate: TemplateRef<any>;
  @ContentChild(EmptyTemplateDirective, {read: TemplateRef})
  emptyTemplate: TemplateRef<any>;

  @Input() items: any[] = [];
  // 'simpleArray': array simple ['a', 'b']
  // default: object station...
  @Input() type: string;
  @Input() color: string;
  @Input() default: string;
  @Input() bindLabel: string = '';
  @Input() placeHolder: string = 'Select';
  @Input() bindValue: string = '';
  @Input() classes: string = '';
  @Input() noMappingLabel: boolean = false;
  @Input() multiple: boolean = false;
  @Input() multipleSelect: boolean = true;
  @Input() border: boolean = false;
  @Input() disabled: boolean = false;
  @Output() clearSearch: any = new EventEmitter();
  @Output() change = new EventEmitter<any>();

  selected: any;
  internalItems: any[] = [];
  private _hasChanged: boolean;
  private _value: any;

  searchControl: FormControl = new FormControl('');
  // multiSelectInterval: any;

  constructor(public _changeDetector: ChangeDetectorRef,
              private _MappingLabelPipe: MappingLabelPipe,
              public _LoadingBarService: LoadingBarService) {
    /*this._LoadingBarService.progress$.subscribe((el) => {
      console.log(el, this.disabled);
      if (!el && this.disabled) {
        //api stop
        this.disabled = false;
      }
      if (el && !this.disabled) {
        //api running
        this.disabled = true;
      }
    });*/
  }

  ngOnInit() {
    this.clearSearch.next(() => {
      this.searchControl.setValue('');
    });
  }

  writeValue(value: string | string[]): void {
    this._value = value;
    this._findSelectedItem(this._value);
    this.updateInternalValue();
    this._changeDetector.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    const {items} = changes;
    if (!!items && !!items.currentValue) {
      this.updateInternalValue();
      if (this.default == 'first') {
        this.selected = this.internalItems[0].label;
      }
    }
  }

  updateInternalValue() {
    if (this.items) {
      if (this.type === 'simpleArray') {
        this.internalItems = this.items.map(item => ({
          label: !this.noMappingLabel ? this._MappingLabelPipe.transform(item) : item,
          value: item,
          checked: this.multiple ? false : undefined
        }));
      } else {
        this.internalItems = this.items.map(item => {
          return {
            label: this.bindLabel ? this._parseItemProp(item, this.bindLabel) : item,
            value: this.bindValue ? this._parseItemProp(item, this.bindValue) : item,
            checked: this.multiple ? false : undefined,
            item: item
          };
        });
      }
      this._findSelectedItem(this._value);
    }
  }

  private _findSelectedItem(value: any) {
    if (this.multiple) {
      if (Array.isArray(value)) {
        this.selected = value.reduce((values, v) => {
          const found = this.internalItems.find(i => i.value.toString().toLocaleLowerCase() === v.toString().toLocaleLowerCase());
          if (!!found) {
            values.push(found.label);
            found.checked = true;
          }
          return values;
        }, []);
      } else {
        this.selected = null;
      }
    } else {
      if (!!value && !!this.internalItems) {
        const found = this.internalItems.find(
          i => i.value.toString().toLocaleLowerCase() === value.toString().toLocaleLowerCase()
        );
        if (!!found) {
          this.selected = found.label;
        } else {
          this.selected = null;
        }
      } else {
        this.selected = null;
      }
    }
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onChange(item) {
    this.selected = item.label;
    this.change.emit(item);
  }

  onItemCheck($event, item) {
    $event.stopPropagation();
    item.checked = !item.checked;
    this.emitWhenSelect();
  }

  emitWhenSelect() {
    const selectedItems = this.internalItems.filter(i => i.checked);
    this.selected = selectedItems.map(s => s.label);
    this._hasChanged = true;

    // clearTimeout(this.multiSelectInterval);
    // this.multiSelectInterval = setTimeout(() => {
    //   this.change.emit(selectedItems.map(s => s.value));
    // }, 500);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  get selectedLabel(): string {
    return this._parseItemProp(this.selected, this.bindLabel);
  }

  private _parseItemProp(item: any, prop: string): string {
    const props = prop.split('.');
    if (item) {
      const result = props.reduce((label, prop) => {
        if (typeof label[prop] != undefined) {
          label = label[prop];
        }
        return label;
      }, item);
      return result;
    }
    return null;
  }

  selectAll($event: MouseEvent = null) {
    if ($event) {
      $event.stopPropagation();
    }
    this.internalItems.map(i => (i.checked = true));
    this.searchControl.setValue('');
    this.emitWhenSelect();
  }

  clearAll($event: MouseEvent = null) {
    if ($event) {
      $event.stopPropagation();
    }
    this.searchControl.setValue('');
    this.internalItems.map(i => (i.checked = false));
    this.emitWhenSelect();
  }

  onClose($event: void | 'click' | 'keydown' | 'tab') {
    // console.log($event);
    if (this.multiple && this._hasChanged) {
      const selectedItems = this.internalItems.filter(i => i.checked);
      this.change.emit(selectedItems.map(s => s.value));
    }
  }

  menuOpened() {
    this._hasChanged = false;
    // console.log('open');
  }
}

@Component({
  selector: '[app-custom-menu-list]',
  templateUrl: './custom-menu-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMenuListComponent),
      multi: false
    }
  ]
})
export class CustomMenuListComponent implements OnChanges {
  @ContentChild(SelectItemTemplateDirective, {read: TemplateRef})
  itemTemplate: TemplateRef<any>;
  @ContentChild(EmptyTemplateDirective, {read: TemplateRef})
  emptyTemplate: TemplateRef<any>;

  @Input() items: any[] = [];
  @Input() bindLabel: string = '';
  @Input() placeHolder: string = 'Select';
  @Input() bindValue: string = '';
  @Input() classes: string = '';
  @Input() multiple: boolean = false;
  @Input() multipleSelect: boolean = true;
  @Output() change = new EventEmitter<any>();

  selected: any;
  internalItems: any[] = [];
  private _value: any;

  searchControl: FormControl = new FormControl('');

  constructor(public _changeDetector: ChangeDetectorRef) {
  }

  writeValue(value: string | string[]): void {
    this._value = value;
    this._findSelectedItem(this._value);
    this.updateInternalValue();
    this._changeDetector.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    const {items} = changes;
    if (!!items && !!items.currentValue) {
      this.updateInternalValue();
    }
  }

  updateInternalValue() {
    if (this.items) {
      this.internalItems = this.items.map(item => {
        return {
          label: this.bindLabel ? this._parseItemProp(item, this.bindLabel) : item,
          value: this.bindValue ? this._parseItemProp(item, this.bindValue) : item,
          checked: this.multiple ? false : undefined,
          item: item
        };
      });
      this._findSelectedItem(this._value);
    }
  }

  private _findSelectedItem(value: any) {
    if (this.multiple) {
      if (Array.isArray(value)) {
        this.selected = value.reduce((values, v) => {
          const found = this.internalItems.find(i => i.value.toLocaleLowerCase() === v.toLocaleLowerCase());
          if (!!found) {
            values.push(found.label);
            found.checked = true;
          }
          return values;
        }, []);
      } else {
        this.selected = null;
      }
    } else {
      if (!!value && !!this.internalItems) {
        const found = this.internalItems.find(
          i => i.value.toLocaleLowerCase() === value.toString().toLocaleLowerCase()
        );
        if (!!found) {
          this.selected = found.label;
        } else {
          this.selected = null;
        }
      } else {
        this.selected = null;
      }
    }
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onChange(item) {
    this.selected = item.label;
    this.change.emit(item);
  }

  onItemCheck($event, item) {
    $event.stopPropagation();
    item.checked = !item.checked;
    this.emitWhenSelect();
  }

  emitWhenSelect() {
    const selectedItems = this.internalItems.filter(i => i.checked);
    this.selected = selectedItems.map(s => s.label);
    this.change.emit(selectedItems.map(s => s.value));
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  get selectedLabel(): string {
    return this._parseItemProp(this.selected, this.bindLabel);
  }

  private _parseItemProp(item: any, prop: string): string {
    const props = prop.split('.');
    const result = props.reduce((label, prop) => {
      if (label[prop] != undefined) {
        label = label[prop];
      }
      return label;
    }, item);
    return result;
  }

  selectAll($event: MouseEvent = null) {
    if ($event) {
      $event.stopPropagation();
    }
    this.internalItems.map(i => (i.checked = true));
    this.searchControl.setValue('');
    this.emitWhenSelect();
  }

  clearAll($event: MouseEvent = null) {
    if ($event) {
      $event.stopPropagation();
    }
    this.searchControl.setValue('');
    this.internalItems.map(i => (i.checked = false));
    this.emitWhenSelect();
  }
}
