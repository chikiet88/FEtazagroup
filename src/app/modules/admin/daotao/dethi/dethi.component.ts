import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DethiService } from './dethi.service';
import ClassicEditor from 'ckeditor5/build/ckEditor';
import { TailienguonService } from '../tailieunguon/tailienguon.service';
import { map } from 'rxjs';
import { CauhoiService } from '../cauhoi/cauhoi.service';

@Component({
    selector: 'app-dethi',
    templateUrl: './dethi.component.html',
    styleUrls: ['./dethi.component.scss'],
})
export class DethiComponent implements OnInit {
    dangDethi: number;
    tailieunguon: any[];
    dethiList: FormGroup;
    dethi: any[];
    cauhoi: any[];
    idCauhoiList = [];
    cauhoiRender = [];
    cauhoiList: any;
    baihoc: any;
    idDethi: number;
    public Editor = ClassicEditor;

    constructor(
        private fb: FormBuilder,
        private dethiService: DethiService,
        private tailieunguonService: TailienguonService,
        private cauhoiService: CauhoiService
    ) {}

    onSubmit() {
        alert('tao thành công');
        this.dethiList.removeControl('diem');
        this.dethiList.get('idCauhoi').setValue(this.idCauhoiList);

        this.dethiService.addDethi(this.dethiList.value).subscribe();
        console.log(this.dethiList.value);

        this.resetForm();
    }

    tailieunguonChange(e) {
        console.log(e.value);

        this.cauhoiService.cauhois$.subscribe((res) => {
            this.cauhoiList = res.filter((x) => x.idTailieunguon == e.value.id);
        });
    }
    removeCauhoiItem(item) {
        this.cauhoiRender = this.cauhoiRender.filter((x) => x.id != item.id);
        this.idCauhoiList = this.idCauhoiList.filter((x) => x != item.id);
    }

    itemCauhoi(item) {
        item.diem = this.dethiList.get('diem').value;

        if (item.diem == 0 || item.diem == '') {
            alert('Vui lòng nhập điểm');
        } else if (item.diem != 0) {
            this.cauhoiRender.push(item);
            console.log(this.cauhoiRender);

            this.idCauhoiList.push(item.id);
        }
    }
    refeshCauhoi() {
        this.ngOnInit();
    }

    resetForm() {
        this.dethiList = this.fb.group({
            idTailieunguon: [''],
            idNguoiduyet: [''],
            diem: [0],
            idCauhoi: [''],
            note: [''],
        });
    }
    onChange(item) {
        this.idDethi = item.id;
    }
    deleteDethi() {
        alert('delete thành công');

        this.dethiService.deleteDethi(this.idDethi).subscribe();
        this.resetForm();
    }
    updateDethi() {
        alert('update thành công');
        this.dethiService
            .updateFile(this.idDethi, this.dethiList.value)
            .subscribe();
        this.resetForm();
        this.ngOnInit();
    }
    ngOnInit(): void {
        this.cauhoiService.getCauhoi().subscribe();
        this.cauhoiService.cauhois$.subscribe((res) => {
            this.cauhoi = res;
            console.log(res);
        });

        this.tailieunguonService.getFile().subscribe();
        this.tailieunguonService.files$
            .pipe(
                map(
                    (arr: any) =>
                        arr &&
                        arr.length &&
                        arr.filter((r) => {
                            return r.type == 'file';
                        })
                )
            )
            .subscribe((result) => {
                if (result) {
                    console.log(result);

                    this.tailieunguon = result;
                }
            });
        this.dethiService.getDethi().subscribe();
        this.dethiService.dethi$.subscribe((res: any) => {
            console.log(res);

            return (this.dethi = res);
        });

        this.resetForm();
    }
}
