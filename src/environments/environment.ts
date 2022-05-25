// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
   // ApiURL:'https://v2api.tazagroup.vn'
    //ApiURL:'http://localhost:3000',
    ApiURL:'http://192.168.1.55:3000',
   // ApiURL1:'https://tazagroup.vn/api/index.php/v1/users?page[limit]=*',
    googleSheetsApiKey: 'AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js',
    // characters: {
    //   spreadsheetId: '1BhjD2orAIKfUc_juGHiA3RovXwEMaSS0qZhYYtlQag8',
    //   worksheetName: 'Import',
    // },
    characters: {
      spreadsheetId: '1Ax1KCdj0z10zG8jEPCmbXLmqvNy0WSxRq8etAk7yn4o',
      worksheetName: 'Realtime',
    },
    khtimona: {
      spreadsheetId: '1j2P9KMtZiyuEMwtPROf3kIGVCGwcZL3MW7H6fEx1fJU',
      //worksheetName: 'All 2021',
      //worksheetName: 'form2022',
      worksheetName: 'Realtime',
    },
    firebaseConfig : {
      apiKey: "AIzaSyCqpCiE9x4D7P3M1QI1UMfcWwOZ4Dcv5js",
      authDomain: "tazagroup.firebaseapp.com",
      projectId: "tazagroup",
      storageBucket: "tazagroup.appspot.com",
      messagingSenderId: "287950542192",
      appId: "1:287950542192:web:5de715205701996b7f2bb5"
    },

    
};
