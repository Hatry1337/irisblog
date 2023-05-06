export default class HTTPError extends Error {
    constructor(message: string, public status: number, public extras?: Object) {
        super(message);
    }
}