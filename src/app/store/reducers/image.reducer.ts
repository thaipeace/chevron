import { Action } from '@ngrx/store';
import * as ImageActions from '../actions/image.actions';
import { Image } from '@app/shared/models/image.model';

const initialState: Image = {
    base64: ''
}

export function reducer(state: Image[] = [initialState], action: ImageActions.Actions) {

    switch (action.type) {
        case ImageActions.UPDATE_IMAGE:
            return [...state, action.payload];
        
        default:
            return state;
    }
}