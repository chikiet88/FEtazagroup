import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import ClassicEditor from 'ckeditor5/build/ckEditor';
import { map } from 'rxjs';
import { BaihocService } from '../baihoc/baihoc.service';
import { TailienguonService } from '../tailieunguon/tailienguon.service';
import { CauhoiService } from './cauhoi.service';

@Component({
    selector: 'app-cauhoi',
    templateUrl: './cauhoi.component.html',
    styleUrls: ['./cauhoi.component.scss'],
})
export class CauhoiComponent implements OnInit {
    dangCauhoi: number;
    tailieunguon: any[];
    cauhoiList: FormGroup;
    cauhoi: any[];
    isActive: number;
    baihoc: any;
    i = 0;
    idCauhoi: number;
    sothutuCauhoi = [];
    listTracnghiem = {};
    public Editor = ClassicEditor;

    constructor(
        private fb: FormBuilder,
        private cauhoiService: CauhoiService,
        private baihocService: BaihocService,
        private tailieunguonService: TailienguonService
    ) {}
    onSubmit() {
        alert('update thành công');
        if (this.cauhoiList.get('type').value == 1) {
            this.cauhoiList.get('traloi').setValue(this.listTracnghiem);
        } else {
            this.cauhoiList.removeControl('traloi');
        }
        this.cauhoiList.removeControl('chude');
        console.log(this.cauhoiList.value); 

        this.cauhoiService.addCauhoi(this.cauhoiList.value).subscribe();
        this.resetForm();
    }
    tailieunguonChange(e) {
        this.cauhoiList.get('idTailieunguon').setValue(e.value.id);

        if (e.value.data.tailieu) {
            this.cauhoiList.get('chude').setValue(e.value.data.tailieu);
        }
    }
    addCauhoi() {
        this.i++;
        this.sothutuCauhoi.push(this.i);
    }
    getDapan(item, i) {
        console.log(i);
        console.log(item[i]);
        this.isActive = i;

        this.cauhoiList.get('dapan').setValue({ [i]: item[i] });
    }
    removeTracnghiemItem(indexOfelement) {
        this.isActive = undefined
        this.sothutuCauhoi.splice(indexOfelement, 1);
        delete this.listTracnghiem[indexOfelement];
        console.log(this.listTracnghiem);
    }
    inputChange(i, e) {
        const a = {};
        a[i] = e;
        this.listTracnghiem = Object.assign(this.listTracnghiem, a);
        console.log(this.listTracnghiem);
    }
    dangCauhoiChange(e) {
        this.cauhoiList.get('type').setValue(e.value);
    }
    resetForm() {
        this.cauhoiList = this.fb.group({
            idTailieunguon: [''],
            cauhoi: [''],
            chude: [''],
            capdo: [''],
            traloi: [''],
            type: [''],
            dapan: [''],
            idNguoiduyet: [''],
            note: [''],
            tags: [''],
        });
    }
    onChange(item) {
        this.idCauhoi = item.id;

        this.cauhoiList.get('idTailieunguon').setValue(item.idTailieunguon);
        this.cauhoiList.get('cauhoi').setValue(item.cauhoi);
        this.cauhoiList.get('capdo').setValue(item.capdo);
        this.cauhoiList.get('type').setValue(item.type);

        this.cauhoiList.get('idNguoiduyet').setValue(item.idNguoiduyet);
        this.cauhoiList.get('note').setValue(item.note);
        this.cauhoiList.get('tags').setValue(item.tags);
    }

    deleteCauhoi() {
        alert('update thành công');

        this.cauhoiService.deleteCauhoi(this.idCauhoi).subscribe();
        this.resetForm();
    }
    updateCauhoi() {
        alert('update thành công');
        this.cauhoiService
            .updateFile(this.idCauhoi, this.cauhoiList.value)
            .subscribe();
        this.resetForm();
        this.ngOnInit();
    }
    ngOnInit(): void {
        this.baihocService.getBaihoc().subscribe();
        this.baihocService.baihoc$.subscribe((result) => {
            if (result) {
                console.log(result);

                this.baihoc = result;
            }
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
        this.cauhoiService.getCauhoi().subscribe();
        this.cauhoiService.cauhoi$.subscribe((res: any) => {
            console.log(res);

            return (this.cauhoi = res);
        });

        this.resetForm();
    }
}
