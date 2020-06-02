import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Image } from '@app/shared/models/image.model';

export const UPDATE_IMAGE = '[IMAGE] Update';

export class UpdateImage implements Action {
    readonly type = UPDATE_IMAGE

    constructor(public payload: Image) {}
}

export type Actions = UpdateImage;