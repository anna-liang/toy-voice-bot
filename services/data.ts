export class DataService {

    store: Record<string, any>;

    constructor() {
        this.store = new Map()
    }

}

export const Data = new DataService().store;
export const Welcome = new DataService().store;
export const Movies = new DataService().store;
export const Weather = new DataService().store;