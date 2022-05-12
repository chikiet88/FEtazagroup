import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  constructor() {
  }
  title = 'Browser market shares at a specific website, 2014';
  type = 'Timeline';
  chartColumns= [
    { type: 'string', id: 'President' },
    { type: 'string', id: 'Abc' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    ];
    data= [
      [ 'Washington','ABC', new Date(2022, 5, 10), new Date(2022, 5, 11) ],
      [ 'Adams','DEF',      new Date(2022, 5, 7), new Date(2022, 5, 9) ],
      [ 'Jefferson','IJK',  new Date(2022, 5, 2), new Date(2022, 5, 6) ]];
    options= {
      height: 275,
      gantt: {
        criticalPathEnabled: false,
        innerGridHorizLine: {
          stroke: '#ffe0b2',
          strokeWidth: 2
        },
        innerGridTrack: {fill: '#fff3e0'},
        innerGridDarkTrack: {fill: '#ffcc80'}
      }
    }
  ngOnInit(): void {

  }
  toMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  ngAfterViewInit() {

  }


}
