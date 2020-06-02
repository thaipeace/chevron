import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-paginator-custom',
    templateUrl: './paginator-custom.component.html',
    styleUrls: ['./paginator-custom.component.scss']
})
export class PaginatorCustomComponent implements OnInit, OnChanges {
    @Output() onChangePage: EventEmitter<any> = new EventEmitter<any>();
    @Input() paginator: PaginatorModel = new PaginatorModel(11, 5);

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {paginator} = changes;
        if (paginator && paginator.currentValue) {
            this.emit();
        }
    }

    onNextPage() {
        this.paginator.next();
        this.emit();
    }

    onPreviousPage() {
        this.paginator.previous();
        this.emit();
    }

    printCurrentPageInfo() {
        const total = this.paginator.total;
        const startIndex = this.paginator.getPageStartIndex();
        const endIndex = startIndex + this.paginator.pageSize;
        return `${total === 0 ? 0 : startIndex + 1} - ${
            endIndex > total ? total : endIndex
        } of ${total}`;
    }

    emit() {
        this.onChangePage.emit(this.paginator.getCurrentIndexs());
    }

    onPageChange() {
        this.emit();
    }
}

export class PaginatorModel {
    currentPage: number;
    pageSize: number;
    total: number;

    constructor(total: number, pageSize: number, currentPage: number = 1) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.total = total;
    }

    getPageStartIndex() {
        return this.pageSize * (this.currentPage - 1);
    }

    isLastPage() {
        return Math.ceil(this.total / this.pageSize) === this.currentPage;
    }

    isFirstPage() {
        return this.currentPage === 1;
    }

    next() {
        if (!this.isLastPage()) {
            this.currentPage++;
        }
    }

    previous() {
        if (!this.isFirstPage()) {
            this.currentPage--;
        }
    }

    getCurrentIndexs() {
        const array = [];
        for (let i = this.getPageStartIndex(); i < (this.getPageStartIndex() + this.pageSize); i++) {
            if (i >= this.total) {
                break;
            }
            array.push(i);
        }
        return array;
    }

    getPageList() {
        return new Array(Math.ceil(this.total / this.pageSize));
    }
}
