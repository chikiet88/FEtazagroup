import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _quanlycongviecService: QuanlycongviecService,
  ) { }
  ngOnInit(): void {
  }
  createDuan(Duan): void
  {
      this._quanlycongviecService.CreateDuans(Duan).subscribe();
    }
}
