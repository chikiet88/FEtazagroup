import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexChart, ApexFill, ApexNonAxisChartSeries, ApexResponsive, ApexTheme, ChartComponent } from 'ng-apexcharts';
import { CongviecService } from '../congviec.service';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any[];
};
@Component({
  selector: 'app-dashboardcongviec',
  templateUrl: './dashboardcongviec.component.html',
  styleUrls: ['./dashboardcongviec.component.scss']
})
export class DashboardcongviecComponent implements OnInit {
  series:any[] = [];
  labels:any[] = [];
  gtitle:string
  gtype:string
  gdata:any[]=[];
  gcols:any[]=[];
  goptions:any;
  gtitle1:string
  gtype1:string
  gdata1:any[]=[];
  gcols1:any[]=[];
  goptions1:any;
  Tasks:any[] = [];
  @ViewChild("chart") chart: ChartComponent;
  @Input() Dashboard: any;
  public chartOptions: Partial<ChartOptions>;
  constructor() {}
  ngOnInit(): void {
    this.Dashboard.forEach(v => {
      v.tasks.forEach(v1 => {
        this.Tasks.push(v1);
      });
    });
    this.gdata = this.Dashboard.map(v=>{
    return [`${v.tasks.length} ${v.Tieude}`, v.tasks.length];
    });
    this.gtitle = 'Data';
    this.gtype = 'PieChart';
    this.gcols = ['Browser', 'Percentage'];
    this.goptions = {    
       pieHole:0.4,
       height:400,
       legend:{position: 'top', textStyle: {color: 'blue', fontSize: 12}}
    };
    const chualam = this.Tasks.filter(v=>v.Trangthai==0).length;
    const danglam = this.Tasks.filter(v=>v.Trangthai==1).length;
    const hoanthanh = this.Tasks.filter(v=>v.Trangthai==2).length;
    this.gdata1 =     [
      [`${chualam} Chưa Làm`, chualam],
      [`${danglam} Đang Làm`,danglam],
      [`${hoanthanh} Hoàn Thành`,hoanthanh],
    ]
      this.gtitle1 = 'Data';
      this.gtype1 = 'PieChart';
      this.gcols1 = ['Browser', 'Percentage'];
      this.goptions1 = {height:400,};
  }
}
