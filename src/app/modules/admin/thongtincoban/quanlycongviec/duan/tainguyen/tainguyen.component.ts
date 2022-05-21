import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-tainguyen',
  templateUrl: './tainguyen.component.html',
  styleUrls: ['./tainguyen.component.scss']
})
export class TainguyenComponent implements OnInit {

  constructor(
    private _quanlycongviecService : QuanlycongviecService,
    private _httpClient: HttpClient
  ) { }

  ngOnInit(): void {
  }
  percentDone: number;
  uploadSuccess: boolean;

  upload(files: File[]){
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(files);
  }

  // basicUpload(files: File[]){
  //   var formData = new FormData();
  //   Array.from(files).forEach(f => formData.append('file', f))
  //   this.http.post('https://file.io', formData)
  //     .subscribe(event => {  
  //       console.log(event);
  //     })
  // }
  
  // //this will fail since file.io dosen't accept this type of upload
  // //but it is still possible to upload a file with this style
  // basicUploadSingle(file: File){    
  //   this.http.post('https://file.io', file)
  //     .subscribe(event => {  
  //       console.log('done')
  //     })
  // }
  
  uploadAndProgress(files: File[]){
    console.log(files)
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file',f))
    this._httpClient.post(`${environment.ApiURL}/upload`, {image:formData}, {reportProgress: true, observe: 'events'})
              .subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                this.percentDone = Math.round(100 * event.loaded / event.total);
                } else if (event instanceof HttpResponse) {
                  this.uploadSuccess = true;
                  console.log(event);
                }
            })
}
  // uploadAndProgress(files: File[]){
  //   console.log(files)
  //   var formData = new FormData();
  //   Array.from(files).forEach(f => formData.append('file',f))
  //   //this._quanlycongviecService.Uploadfile(data).subscribe();
  //   this.http.post('https://file.io', formData, {reportProgress: true, observe: 'events'})
  //     .subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.percentDone = Math.round(100 * event.loaded / event.total);
  //       } else if (event instanceof HttpResponse) {
  //         this.uploadSuccess = true;
  //         console.log(event);
  //       }
  //   });
  // }
  
  // //this will fail since file.io dosen't accept this type of upload
  // //but it is still possible to upload a file with this style
  // uploadAndProgressSingle(file: File){    
  //   this.http.post('https://file.io', file, {reportProgress: true, observe: 'events'})
  //     .subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.percentDone = Math.round(100 * event.loaded / event.total);
  //       } else if (event instanceof HttpResponse) {
  //         this.uploadSuccess = true;
  //       }
  //   });
  // }
}
