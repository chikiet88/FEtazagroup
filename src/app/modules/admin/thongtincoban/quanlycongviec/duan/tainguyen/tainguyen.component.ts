import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { SharedService } from 'app/shared/shared.service';
import { environment } from 'environments/environment';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-tainguyen',
  templateUrl: './tainguyen.component.html',
  styleUrls: ['./tainguyen.component.scss']
})
export class TainguyenComponent implements OnInit {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _sharedService: SharedService,
    private _httpClient: HttpClient
  ) { }
  @Input() CurentDuan: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  percentDone: any;
  uploadSuccess: boolean =false;
  uploadFiles:[];
  files: File[] = [];
  ngOnInit(): void {
    this._sharedService.getAllUpload().subscribe();
    this._sharedService.uploads$.subscribe((data)=>
      {
        data.forEach(v => {
          v.path = this._sharedService.getPath(v.Lienket).subscribe();         
          this.files.push(v);
        });
        console.log(this.files);
      }
    )

  }
  onSelect(event) {
    this.files.push(...event.addedFiles);
    this.files.forEach(v => {
      console.log(v);
      this.uploadAndProgress(v)
    });
  }
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  uploadAndProgress(file) {
    console.log(file)
    var formData = new FormData();
    formData.append('file', file)
    this._httpClient.post(`${environment.ApiURL}/upload/file`, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
          const upload = {uuid:this.CurentDuan.id,Tieude:event.body['originalname'],Lienket:event.body['filename']};
          this._sharedService.CreateUpload(upload).subscribe();
          console.log(event.body);
          console.log(event);
        }
      })
  }
}
