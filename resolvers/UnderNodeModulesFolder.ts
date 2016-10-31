import {IResolver} from "../core/resolver";
import * as configurator from "../core/configurator";
import {resolveWithExtensions} from "./helpers";

const config = configurator.get();

export class ResolverUnderNodeModulesFolder implements IResolver {
    get name() {
        return "underNodeModulesFolder";
    }

    resolve(location: string) {
        return resolveWithExtensions("node_modules/" + location, config.defaultExtensions);
    }
}
