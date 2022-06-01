import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexLegend, ApexPlotOptions, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../../quanlycongviec.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
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
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Bob",
          data: [
            {
              x: "Design",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-08").getTime()
              ]
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-02").getTime(),
                new Date("2019-03-05").getTime()
              ]
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-07").getTime()
              ]
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-03").getTime(),
                new Date("2019-03-09").getTime()
              ]
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-08").getTime(),
                new Date("2019-03-11").getTime()
              ]
            },
            {
              x: "Validation",
              y: [
                new Date("2019-03-11").getTime(),
                new Date("2019-03-16").getTime()
              ]
            },
            {
              x: "Design",
              y: [
                new Date("2019-03-01").getTime(),
                new Date("2019-03-03").getTime()
              ]
            }
          ]
        },
        {
          name: "Joe",
          data: [
            {
              x: "Design",
              y: [
                new Date("2019-03-02").getTime(),
                new Date("2019-03-05").getTime()
              ]
            },
            {
              x: "Test",
              y: [
                new Date("2019-03-06").getTime(),
                new Date("2019-03-16").getTime()
              ]
            },
            {
              x: "Code",
              y: [
                new Date("2019-03-03").getTime(),
                new Date("2019-03-07").getTime()
              ]
            },
            {
              x: "Deployment",
              y: [
                new Date("2019-03-20").getTime(),
                new Date("2019-03-22").getTime()
              ]
            },
            {
              x: "Design",
              y: [
                new Date("2019-03-10").getTime(),
                new Date("2019-03-16").getTime()
              ]
            }
          ]
        },
        {
          name: "Dan",
          data: [
            {
              x: "Code",
              y: [
                new Date("2019-03-10").getTime(),
                new Date("2019-03-17").getTime()
              ]
            },
            {
              x: "Validation",
              y: [
                new Date("2019-03-05").getTime(),
                new Date("2019-03-09").getTime()
              ]
            }
          ]
        }
      ],
      chart: {
        height: 450,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%"
        }
      },
      xaxis: {
        type: "datetime"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      }
    };
  }
  Tasks: any[] = [];
  Grouptasks: any[] = [];
  filteredTasks: any;
  CUser: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  title = 'Timeline';
  type = 'Timeline';
  chartColumns= [
    { type: 'string', id: 'Group' },
    { type: 'string', id: 'Task' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    ];
  data = [];
  options = {}
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  ngOnInit(): void {
    this._quanlycongviecService.getDuans();
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    });  
    this._quanlycongviecService.boards$.subscribe((data)=>{
      console.log(data);  
      this.Grouptasks = data = data.filter(v1=>v1.tasks.some(v=>v.idTao==this.CUser.id ||v.Thuchien==this.CUser.id));
      const Arrayobject = [];
      data.forEach(v => {
        v.tasks.forEach(v1 => {
          if(v1.Batdau || v1.Ketthuc)
          {
            Arrayobject.push({group:v.Tieude,task:v1.Tieude,start:new Date(v1.Batdau),end:new Date(v1.Ketthuc)}) 
          }
        });
      });
      this.data = Arrayobject.map(function(obj) {
      return Object.keys(obj).map(function(key) { 
        return obj[key];
      });
    });
    })
    const rowHeight = 41;
    var chartHeight = this.data.length * rowHeight + 50;
    this.options = {
      height: chartHeight
    }
    console.log(this.data);
    
  }
  ngAfterViewInit() {

  }


}
