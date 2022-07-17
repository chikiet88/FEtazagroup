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

  cols = ["Task ID","Task Name",'Resource',"Start Date", 'End Date', 'Duration', 'Percent Complete', 'Dependencies'];
  title = '';
  type = 'Gantt';
  data = [
    ['2014Spring', 'Spring 2014', 'spring',
     new Date(2014, 2, 22), new Date(2014, 5, 20), 0, 100, null],
    ['2014Summer', 'Summer 2014', 'summer',
     new Date(2014, 5, 21), new Date(2014, 8, 20), 0, 100, null],
    ['2014Autumn', 'Autumn 2014', 'autumn',
     new Date(2014, 8, 21), new Date(2014, 11, 20), 0, 100, null],
    ['2014Winter', 'Winter 2014', 'winter',
     new Date(2014, 11, 21), new Date(2015, 2, 21), 0, 100, null],
    ['2015Spring', 'Spring 2015', 'spring',
     new Date(2015, 2, 22), new Date(2015, 5, 20), 0, 50, null],
    ['2015Summer', 'Summer 2015', 'summer',
     new Date(2015, 5, 21), new Date(2015, 8, 20), 0, 0, null],
    ['2015Autumn', 'Autumn 2015', 'autumn',
     new Date(2015, 8, 21), new Date(2015, 11, 20), 0, 0, null],
    ['2015Winter', 'Winter 2015', 'winter',
     new Date(2015, 11, 21), new Date(2016, 2, 21), 0, 0, null],
    ['Football', 'Football Season', 'sports',
     new Date(2014, 8, 4), new Date(2015, 1, 1), 0, 100, null],
    ['Baseball', 'Baseball Season', 'sports',
     new Date(2015, 2, 31), new Date(2015, 9, 20), 0, 14, null],
    ['Basketball', 'Basketball Season', 'sports',
     new Date(2014, 9, 28), new Date(2015, 5, 20), 0, 86, null],
    ['Hockey', 'Hockey Season', 'sports',
     new Date(2014, 9, 8), new Date(2015, 5, 21), 0, 89, null]
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
