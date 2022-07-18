import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import moment from 'moment';
import { CongviecService } from '../congviec.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  Boards: any[] = [];
  Tasks: any[] = [];
  Nhanviens: any[] = [];
  series: any[] = [];
  gdata: any[] = [];
  gcols: any[] = [];
  gtitle: any;
  gtype: any;
  goptions: any;
  trackHeight:any;
  ThisDuan:any;
  @Input() TimelineDuan: any;
  constructor(
    private _congviecService: CongviecService,
    private _nhanvienServiceService: NhanvienService,
  ) {
    this._congviecService.getBoards();
    this._congviecService.boards$.subscribe((data) => {  
        this.Boards = data  
        console.log(data);  
        data.forEach(v => {
          v.tasks.forEach(v1 => {
            this.Tasks.push(v1);
          });
        });  
        this.trackHeight = this.Tasks.length;
        let gdata = [];
        gdata = this.Tasks.map((v,k)=>{
         // return [v.id, v.Tieude,v.gid,new Date(v.Batdau), new Date(v.Ketthuc),0, 100, null];
          if(k<28)
          {
          return [v.id, v.Tieude,v.gid,new Date(2014, 3, k+1), new Date(2014, 3, k+2),20, 10, null];
          }
          else
          {
            return [v.id, v.Tieude,v.gid,new Date(2014, 3, 30), new Date(2014, 3, 30),0, 100, null];
          }

          });  
          console.log(gdata);
          
        this.gdata = gdata;        
    }) 
    this._nhanvienServiceService.nhanviens$
    .subscribe((data) => {
        this.Nhanviens =  data;
    });
    this._congviecService.getAllTasks().subscribe();

  }


  ngOnInit(): void {
    this.gcols = ["id","Công Vệc","Nhóm :","Bắt Đầu", "Kết Thúc", "Thời Gian", "Hoàn Thành %", 'Dependencies'];
    this.gtitle = '';
    this.gtype = 'Gantt';
    this.goptions = {
      height:  this.trackHeight*50,
      gantt: {
        trackHeight: 50,
        sortTasks:true
      }
    }
  }

}
