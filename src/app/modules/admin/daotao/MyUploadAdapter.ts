// import { FileUploadService } from './services/file-upload.service';
// import { FileUpload } from './models/file-upload.model';
// import { map } from 'rxjs';
// import { environment } from 'environments/environment';

// export class MyUploadAdapter {
//     public loader: any;
//     public uploadService;
//     public sharedService;
//     public url: string;
//     public xhr: any;
//     inforImage: any;
//     percentage = 0;
//     currentFileUpload?: FileUpload;

//     constructor(
//         loader: any, uploadService,sharedService,) {
//         this.loader = loader;
//         this.uploadService = uploadService;
//         this.sharedService = sharedService;
//         // change "environment.BASE_URL" key and API path
//         this.url = `${environment.ApiURL}/upload`;

//         // change "token" value with your token
//     }

//     upload() {
//         return new Promise(async (resolve, reject) => {
//             this.loader.file.then((file: any) => {
//                 this.currentFileUpload = new FileUpload(file);
//                 console.log(file);
//                 const upload = { idTao:this.CUser.id,uuid: this.CurentDuan.id, Tieude: event.body['originalname'], Lienket: event.body['filename'], Exten:event.body['originalname'].split('.').pop()};
//                 this.sharedService.CreateUpload(file).subscribe(
//                     (data)=>{console.log(data);
//                     }
//                 );
//                 // this.uploadService
//                 //     .pushFileToStorage(this.currentFileUpload)
//                 //     .subscribe(
//                 //         (percentage) => {
//                 //             this.percentage = Math.round(
//                 //                 percentage ? percentage : 0
//                 //             );
//                 //             if (this.percentage == 100) {
//                 //                 this.uploadService._thumb$.subscribe((res) => {
//                 //                     if (res) {
//                 //                         this._initRequest();
//                 //                         this._initListeners(
//                 //                             resolve,
//                 //                             reject,
//                 //                             res
//                 //                         );
//                 //                         this._sendRequest(res);
//                 //                     }
//                 //                 });
//                 //             }
//                 //         },
//                 //         (error) => {
//                 //             console.log(error);
//                 //         }
//                 //     );

//                 //Lấy hình ảnh từ firebase về
//             });
//         });
//     }

//     abort() {
//         if (this.xhr) {
//             this.xhr.abort();
//         }
//     }

//     _initRequest() {
//         const xhr = (this.xhr = new XMLHttpRequest());
//         xhr.open('POST', this.url, true);

//         // change "Authorization" header with your header

//         xhr.responseType = 'json';
//     }

//     _initListeners(resolve: any, reject: any, file: any) {
//         const xhr = this.xhr;

//         const loader = this.loader;
//         const genericErrorText = "Couldn't upload file:" + ` ${file?.name}.`;

//         xhr.addEventListener('error', () => reject(genericErrorText));
//         xhr.addEventListener('abort', () => reject());

//         xhr.addEventListener('load', () => {
//             const response = xhr.response;
//             if (!response || response.error) {
//                 return reject(
//                     response && response.error
//                         ? response.error.message
//                         : genericErrorText
//                 );
//             }

//             // change "response.data.fullPaths[0]" with image URL
//             resolve({
//                 default: file.url
//             });
//         });

//         if (xhr.upload) {
//             xhr.upload.addEventListener('progress', (evt: any) => {
//                 if (evt.lengthComputable) {
//                     loader.uploadTotal = evt.total;
//                     loader.uploaded = evt.loaded;
//                 }
//             });
//         }
//     }

//     _sendRequest(file: any) {
//         const data = new FormData();

//         if (file) {
//             data.append('key', file.key),
//                 data.append('name', file.name),
//                 data.append('url', file.url),
//                 this.xhr.send(data);
//         }
//     }
// }
