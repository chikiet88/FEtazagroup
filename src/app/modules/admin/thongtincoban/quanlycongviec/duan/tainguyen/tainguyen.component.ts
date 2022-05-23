import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
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
    private _httpClient: HttpClient
  ) { }
  @Input() CurentDuan: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  percentDone: any;
  uploadSuccess: boolean =false;
  ngOnInit(): void {

  }
  files: File[] = [];
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
          console.log(event.body);
          console.log(event);
        }
      })
  }
}
