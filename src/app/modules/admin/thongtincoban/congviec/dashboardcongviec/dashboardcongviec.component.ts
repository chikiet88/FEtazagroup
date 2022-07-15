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
  @ViewChild("chart") chart: ChartComponent;
  @Input() Dashboard: any;
  public chartOptions: Partial<ChartOptions>;
  constructor(
  ) {
  }
  ngOnInit(): void {
    console.log(this.Dashboard);
    this.gdata = this.Dashboard.map(v=>{
    return [`${v.tasks.length} ${v.Tieude}`, v.tasks.length];
    });
  console.log( this.gdata);
    this.gtitle = 'Data';
    this.gtype = 'PieChart';
    // this.gdata = [

    //    ['Chưa Làm', 45.0],
    //    ['Đang Làm', 26.8],
    //    ['Hoàn Thành', 12.8],
    // ];
    this.gcols = ['Browser', 'Percentage'];
    this.goptions = {    
       pieHole:0.4,
       height:400,
       legend:{position: 'top', textStyle: {color: 'blue', fontSize: 12}}
    };

    this.LoadDashboard(this.Dashboard);
  }
  LoadDashboard(data)
  {

    data.forEach(v => {
      this.series.push(v.tasks.length);
      this.labels.push(`${v.tasks.length} ${v.Tieude}`);
    });
    this.chartOptions = {
      series:this.series,
      chart: {
        type: "pie"
      },
      labels: this.labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

}
