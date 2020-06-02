import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { ToastService } from '@shared/services/others/toast.service';
import { GUID_QUESTION_MARK } from '@shared/constants/value.constant';
import { PdfDialogComponent } from '@shared/components/dialogs/pdf-dialog/pdf-dialog.component';
import { DialogService } from '@shared/services/others/dialog.service';
import { DataUtilService } from '../services/data-util.service';
import { Payload } from '../models/payload';
import { PayloadsConstant } from '../constants/payloads.constant';
import { ApiDataService } from '../services/api-data.service';

@Directive({
  selector: '[appCopyGUID]'
})
export class CopyGUIDDirective implements OnChanges {
  @Input() key: number;
  @Input() text: string;

  _viewContainer: ViewContainerRef;

  ctrlIsPressed: boolean = false;
  links: any[] = [];
  selectedLink: any;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.ctrlIsPressed = event.ctrlKey;
  }

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    this.ctrlIsPressed = false;
  }

  constructor(el: ElementRef,
    private viewContainer: ViewContainerRef,
    private _ComponentFactoryResolver: ComponentFactoryResolver,
    private _ToastService: ToastService,
    private _DialogService: DialogService,
    private dataUtilService: DataUtilService,
    private apiDataService: ApiDataService
  ) {
    this._viewContainer = viewContainer;
    // console.log(el);
    // console.log(this._viewContainer);
    this._viewContainer.element.nativeElement.classList.add('cursor-pointer');
    this._viewContainer.element.nativeElement.addEventListener('click', (e) => {
      // console.log(e);
      // console.log(this.ctrlIsPressed);
      if (this.ctrlIsPressed) {
        // console.log('show');
        this.copyTextToClipboard(GUID_QUESTION_MARK[this.key]);
      } else {
        let exePayload = new Payload(PayloadsConstant.HELP_LINK.LIST,  []);
        this.apiDataService.executeQuery(exePayload).subscribe(res => {
          let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
          this.links = raw.APIResponse && raw.APIResponse.Status === 'Success'
            ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.HelpLinks.HelpLink)
            : []
          this.selectedLink = this.links.find(l => l.Key === GUID_QUESTION_MARK[this.key]);
          
          if (this.selectedLink) {
            this.dataUtilService.checkUrl(this.selectedLink.Value);
            setTimeout(() => {
              if (this.dataUtilService.isLinkAvailable) {
                this.openInformationDialog(this.selectedLink.FileName , this.selectedLink.Value, this.selectedLink.Key);
              } else {
                this._ToastService.openSimple('Help link not found');
              }  
            }, 1000);
          } else {
            this._ToastService.openSimple('Help link is not defined');
          }
        }, error => {
          console.log('Loading error');
        });
        
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { key } = changes;
    // if (!!key) {
      
    // }
  }

  copyTextToClipboard(text) {
    // We need to create a dummy textarea with the text to be copied in the DOM
    const textArea = document.createElement('textarea');

    // Hide the textarea from actually showing
    textArea.style.position = 'fixed';
    textArea.style.top = '-999px';
    textArea.style.left = '-999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    // Set the texarea's content to our value defined in our [text-copy] attribute
    textArea.value = text;
    document.body.appendChild(textArea);

    // This will select the textarea
    textArea.select();

    try {
      // Most modern browsers support execCommand('copy'|'cut'|'paste'), if it doesn't it should throw an error
      const successful = document.execCommand('copy');
      // Let the user know the text has been copied, e.g toast, alert etc.
      if (successful) {
        this._ToastService.openSimple(`${text} is copied into clipboard!`);
      } else {
        this._ToastService.openSimple('some error occur');
      }
    } catch (err) {
      // Tell the user copying is not supported and give alternative, e.g alert window with the text to copy
      this._ToastService.openSimple('unable to copy');
    }

    // Finally we remove the textarea from the DOM
    document.body.removeChild(textArea);
  }

  private openInformationDialog(title, src, topRight) {
    // TODO need update when having api
    this._DialogService.open(PdfDialogComponent, {
      title: title,
      topRight: topRight,
      src: src
    });
  }
}
