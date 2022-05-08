import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-khachhangs',
  templateUrl: './khachhangs.component.html',
  styleUrls: ['./khachhangs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KhachhangsComponent implements OnInit {

  constructor(
  ) {
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
  
  }
}
