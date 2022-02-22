import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
export interface KHData {
  TenKH: string;
  SDT: string;
  TDS: string;
  TTT: string;
  LMD: Date;
  NMD: string;
  LMC: Date;
  NMC: string;
}


//'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'
/** Constants used to fill up our data base. */
@Component({
  selector: 'app-thongkekh',
  templateUrl: './thongkekh.component.html',
  styleUrls: ['./thongkekh.component.scss']
})
export class ThongkekhComponent implements AfterViewInit{
  displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  dataKhachhang: MatTableDataSource<KHData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    const dataKH:KHData[] = [
             {
                 TenKH: "VÕ THỊ TÚY NHƯ",
                 SDT: "909090262",
                 TDS: "293420000",
                 TTT: "271920000",
                 LMD: new Date("10/24/2016"),
                 NMD: "GÒ VẤP",
                 LMC: new Date("10/24/2016"),
                 NMC: "GÒ VẤP"
             },
             {
              TenKH: "GUYỄN THỤY TƯỜNG VY",
              SDT: "909054854",
              TDS: "293420000",
              TTT: "271920000",
              LMD: new Date("02/01/2021"),
              NMD: "GÒ VẤP",
              LMC: new Date("03/01/2022"),
              NMC: "GÒ VẤP"
          },             {
            TenKH: "GUYỄN THỤY TƯỜNG VY",
            SDT: "909054854",
            TDS: "293420000",
            TTT: "271920000",
            LMD: new Date("02/01/2021"),
            NMD: "GÒ VẤP",
            LMC: new Date("03/01/2022"),
            NMC: "GÒ VẤP"
        },             {
          TenKH: "GUYỄN THỤY TƯỜNG VY",
          SDT: "909054854",
          TDS: "293420000",
          TTT: "271920000",
          LMD: new Date("02/01/2021"),
          NMD: "GÒ VẤP",
          LMC: new Date("03/01/2022"),
          NMC: "GÒ VẤP"
      },             {
        TenKH: "GUYỄN THỤY TƯỜNG VY",
        SDT: "909054854",
        TDS: "293420000",
        TTT: "271920000",
        LMD: new Date("02/01/2021"),
        NMD: "GÒ VẤP",
        LMC: new Date("03/01/2022"),
        NMC: "GÒ VẤP"
    },             {
      TenKH: "GUYỄN THỤY TƯỜNG VY",
      SDT: "909054854",
      TDS: "293420000",
      TTT: "271920000",
      LMD: new Date("02/01/2021"),
      NMD: "GÒ VẤP",
      LMC: new Date("03/01/2022"),
      NMC: "GÒ VẤP"
  },             {
    TenKH: "GUYỄN THỤY TƯỜNG VY",
    SDT: "909054854",
    TDS: "293420000",
    TTT: "271920000",
    LMD: new Date("02/01/2021"),
    NMD: "GÒ VẤP",
    LMC: new Date("03/01/2022"),
    NMC: "GÒ VẤP"
},
    ];
   // this.dataSource = new MatTableDataSource(users);
    this.dataKhachhang = new MatTableDataSource(dataKH);
  }

  ngAfterViewInit() {
    this.dataKhachhang.paginator = this.paginator;
    this.dataKhachhang.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataKhachhang.filter = filterValue.trim().toLowerCase();

    if (this.dataKhachhang.paginator) {
      this.dataKhachhang.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
// }
