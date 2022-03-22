// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
   // ApiURL:'https://v2api.tazagroup.vn'
    ApiURL:'http://localhost:3000',
   // ApiURL1:'https://tazagroup.vn/api/index.php/v1/users?page[limit]=*',
    googleSheetsApiKey: 'AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js',
    // characters: {
    //   spreadsheetId: '1qBzPZ6AbiJZCQp8gsiioZRNRmGRwoq_agx5Q5DK05EY',
    //   worksheetName: 'Import',
    // },
    characters: {
      spreadsheetId: '1BhjD2orAIKfUc_juGHiA3RovXwEMaSS0qZhYYtlQag8',
      worksheetName: 'Import',
    },
    // googleSheetsApiKey: 'AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js',
    // characters: {
    //   spreadsheetId: '1anVnNF8EPeh4_9qyCQaXdreGqcoYUcM9LC7bioe0mvU',
    //   worksheetName: 'Characters1',
    // },
    // googleSheetsApiKey: 'AIzaSyBWAabxkOgkJVIK3PVrWnXz3y2inylGiQo',
    // characters: {
    //   spreadsheetId: '1Z-7nH87Qslg_c1jPtuJna-PmzzKFtxNr1_Zt9OTD3eo',
    //   worksheetName: '2021',
    // },
    // characters: {
    //   spreadsheetId: '1anVnNF8EPeh4_9qyCQaXdreGqcoYUcM9LC7bioe0mvU',
    //   worksheetName: 'Characters1',
    // },
    // googleSheetsApiKey: 'AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js',
    // characters: {
    //   spreadsheetId: '1cwdN0a8Dx2N5QjOsjeVQu9yqOoKZGop2',
    //   worksheetName: '2021',
    // },



    
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
