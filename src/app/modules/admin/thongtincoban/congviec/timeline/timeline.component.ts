import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexXAxis, ApexPlotOptions, ChartComponent } from 'ng-apexcharts';
import { CongviecService } from '../congviec.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};
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
  
  @Input() TimelineDuan: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private _congviecService: CongviecService,
    private _nhanvienServiceService: NhanvienService,
  ) {
    this._congviecService.getBoards();
    this._congviecService.boards$.subscribe((data) => {  
        this.Boards = data                
    }) 
    this._nhanvienServiceService.nhanviens$
    .subscribe((data) => {
        this.Nhanviens =  data;
    });
    this._congviecService.getAllTasks().subscribe();
    this._congviecService.tasks$.subscribe((data) => {
        this.Tasks = data;   
         this.series = [];    
        const uniqueName = [...new Set(data.map(item => item.Thuchien))]  
        console.log(uniqueName); 
        data.forEach(v => {
          uniqueName.forEach(v1 => {
            if(v1==v.Thuchien&&v1!=''&&v.Batdau!=null&&v.Ketthuc!=null)
            {
              this.series.push(
                {name:v1,
                data:{x:v.Tieude,y:[
                new Date("2019-03-05").getTime(),
                new Date("2019-03-07").getTime()
                // new Date(v.Batdau).getTime(),new Date(v.Ketthuc).getTime()
              ]}})
            }
          });
        }); 
        console.log(this.series);  
        console.log(this.Tasks); 

    }) 

    this.chartOptions = {
      series:this.series,
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          var a = moment(val[0]);
          var b = moment(val[1]);
          var diff = b.diff(a, "days");
          return `asdasd${diff}${diff > 1 ? " days" : " day"}`;
        }
      },
      xaxis: {
        type: "datetime"
      },
      legend: {
        position: "top"
      }
    };
  }

  daysToMilliseconds(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  cols = ["Task ID","Task Name","Start Date", 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
  title = '';
  type = 'Gantt';
  data = [
    ['Research', 'Find sources',
     new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
    ['Write', 'Write paper',
     null, new Date(2015, 0, 9), this.daysToMilliseconds(3), 25, 'Research,Outline'],
    ['Cite', 'Create bibliography',
     null, new Date(2015, 0, 7), this.daysToMilliseconds(1), 20, 'Research'],
    ['Complete', 'Hand in paper',
     null, new Date(2015, 0, 10), this.daysToMilliseconds(1), 0, 'Cite,Write'],
    ['Outline', 'Outline paper',
     null, new Date(2015, 0, 6), this.daysToMilliseconds(1), 100, 'Research']
  ];
  options = {
    height: 400,
    gantt: {
      trackHeight: 30
   }
  }
  ngOnInit(): void {
    
  }

}
