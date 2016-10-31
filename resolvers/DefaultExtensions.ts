import * as configurator from "../core/configurator";
import {IResolver} from "../core/resolver";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverDefaultExtensions implements IResolver {
    get name() {
        return "defaultExtensions";
    }

    resolve(location: string) {
        return resolveWithExtensions(location, config.defaultExtensions);
    }
}
