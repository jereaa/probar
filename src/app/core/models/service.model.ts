export class ServiceModel {
    constructor(
        public code: string,
        public name: string,
        public additional: boolean,
        public price: number,
        public description?: string,
        public _id?: string,
        public value?: number,
        public event_count?: number,
        public last_event?: Date
    ) {}
}
