import {logger} from "./logger";

export interface IResolver {
    name: string;
    resolve(path: string): Promise<string>;
}

export class ResolverNull implements IResolver {
    get name() {
        return "null";
    }

    resolve(location: string) {
        logger.log(location);

        return Promise.resolve(location);
    }
}

