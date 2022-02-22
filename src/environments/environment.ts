// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
   // ApiURL:'https://v2api.tazagroup.vn'
    ApiURL:'http://localhost:3000',
    googleSheetsApiKey: 'AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js',
    characters: {
      spreadsheetId: '1anVnNF8EPeh4_9qyCQaXdreGqcoYUcM9LC7bioe0mvU',
      worksheetName: 'Characters',
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
