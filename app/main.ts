// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

declare var __enableVerboseLogging: () => undefined;

import { AppModule } from "./app.module";
// __enableVerboseLogging()
platformNativeScriptDynamic().bootstrapModule(AppModule);
