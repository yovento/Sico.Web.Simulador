import { constants } from "./../app/core/common/constants";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  urlSicoCRMVb: "http://192.168.1.180/SICO.Api/api/",
  urlSicoCRMCSharp: "https://localhost:44337/api/",
  urlSicoCRMCSharpReports: "https://localhost:44341/api/",

  constants: constants,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
