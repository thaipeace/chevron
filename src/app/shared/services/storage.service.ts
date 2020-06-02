import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    get(key: string): any {
        return localStorage.getItem(key);
    }

    set(key: string, value: string) {
        return localStorage.setItem(key, value);
    }
}
