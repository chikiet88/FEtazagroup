import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { UserService } from 'app/core/user/user.service';
import { SharedService } from 'app/shared/shared.service';
import { environment } from 'environments/environment';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-tainguyen',
  templateUrl: './tainguyen.component.html',
  styleUrls: ['./tainguyen.component.scss']
})
export class TainguyenComponent implements OnInit {
  @Input() CurentDuan: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  percentDone: any;
  uploadSuccess: boolean = false;
  uploadFiles: [];
  files: File[] = [];
  CUser: any;
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _sharedService: SharedService,
    private _httpClient: HttpClient,
    private _userService: UserService,
  ) { 
    this._userService.user$.subscribe((data) => {
      this.CUser = data;    
    });
  }
  ngOnInit(): void {
    this._sharedService.uploads$.subscribe((data) => {     
      data.forEach(v => {
        v.path = `${environment.ApiURL}/upload/path/${v.Lienket}`;     
      });
      this.files = data.filter(v=>v.uuid == this.CurentDuan.id);
    }
    )
  }
  onSelect(event) {
    event.addedFiles.forEach((v,k) => {
      setTimeout(() => {
        this.uploadAndProgress(v)
      }, k*100);
    });
  }
  onRemove(item) {
    this._sharedService.deletePath(item.Lienket).subscribe();
    this._sharedService.DeleteUpload(item.id).subscribe();
  }
  uploadAndProgress(file) {
    console.log(file)
    var formData = new FormData();
    formData.append('file', file)
    this._sharedService.UploadFile(formData,this.CUser,this.CurentDuan.id);
    // this._httpClient.post(`${environment.ApiURL}/upload/file`, formData, { reportProgress: true, observe: 'events' })
    //   .subscribe(event => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.percentDone = Math.round(100 * event.loaded / event.total);
    //     } else if (event instanceof HttpResponse) {
    //       this.uploadSuccess = true;
    //       const upload = { idTao:this.CUser.id,uuid: this.CurentDuan.id, Tieude: event.body['originalname'], Lienket: event.body['filename'], Exten:event.body['originalname'].split('.').pop()};
    //       this._sharedService.CreateUpload(upload).subscribe();
    //     }
    //   })
  }
}
