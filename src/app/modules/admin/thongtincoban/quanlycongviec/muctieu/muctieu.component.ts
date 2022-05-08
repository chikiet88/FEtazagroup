import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-muctieu',
  templateUrl: './muctieu.component.html',
  styleUrls: ['./muctieu.component.scss']
})

export class MuctieuComponent implements OnInit {
  constructor() {
  }
  title = 'Browser market shares at a specific website, 2014';
  type = 'Gantt';
  chartColumns = [
    { type: 'string', id: 'Task ID' },
    { type: 'string', id: 'Task Name' },
    { type: 'string', id: 'Resource' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    { type: 'number', id: 'Duration' },
    { type: 'number', id: 'Percent Complete' },
    { type: 'string', id: 'Dependencies' },
  ]
  data = [
    [
      "toTrain",
      "Walk to train stop",
      "walk",
      null,
      null,
      this.toMilliseconds(5),
      100,
      null,
    ],
    [
      "music",
      "Listen to music",
      "music",
      null,
      null,
      this.toMilliseconds(70),
      100,
      null,
    ],
    [
      "wait",
      "Wait for train",
      "wait",
      null,
      null,
      this.toMilliseconds(10),
      100,
      "toTrain",
    ],
    [
      "train",
      "Train ride",
      "train",
      null,
      null,
      this.toMilliseconds(45),
      75,
      "wait",
    ],
    [
      "toWork",
      "Walk to work",
      "walk",
      null,
      null,
      this.toMilliseconds(10),
      0,
      "train",
    ]
  ];
  options = {
    height: 275,
    gantt: {
      criticalPathEnabled: false, // Critical path arrows will be the same as other arrows.
      arrow: {
        angle: 50,
        width: 1,
        color: 'white',
        radius: 2
      },
      labelStyle: {
        fontName: 'Open Sans',
        fontSize: 14,
        color: 'white'
      },
      barCornerRadius: 2,
      backgroundColor: {
        fill: 'transparent',
      },
      innerGridHorizLine: {
        stroke: '#ddd',
        strokeWidth: 0,
      },
      innerGridTrack: {
        fill: 'transparent'
      },
      innerGridDarkTrack: {
        fill: 'transparent'
      },
      percentEnabled:	true, 
      shadowEnabled: true,	
      shadowColor: 'white',
      shadowOffset: 2,
    }
  };
  ngOnInit(): void {

  }
  toMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  ngAfterViewInit() {

  }

}