import { Component, OnInit } from '@angular/core';
import { TailienguonService } from '../tailieunguon/tailienguon.service';
import ClassicEditor from 'ckeditor5/build/ckEditor';

import { map } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BaihocService } from './baihoc.service';
import { DethiService } from '../dethi/dethi.service';

@Component({
    selector: 'app-baihoc',
    templateUrl: './baihoc.component.html',
    styleUrls: ['./baihoc.component.scss'],
})
export class BaihocComponent implements OnInit {
    tailieu: any;
    baihoc: any[];
    dethi:any[];
    baihocDetail: any;
    baihocList: FormGroup;
    public Editor = ClassicEditor;

    constructor(
        private tailieunguonService: TailienguonService,
        private fb: FormBuilder,
        private baihocService: BaihocService,
        private dethiService: DethiService
    ) {}

    onSubmit() {
        this.baihocService.uploadBaihoc(this.baihocList.value).subscribe();
        alert('Tạo bài học thành công');
        this.resetForm();
    }
    deleteBaihoc(id) {
        this.baihocService.deleteBaihoc(id).subscribe;
    }

    onSelect(item) {
        this.baihocList.addControl('id', new FormControl(item.id));
        this.baihocList.get('id').setValue(item.id);

        this.baihocList.get('idTailieu').setValue(item.idTailieu);

        this.baihocList.get('name').setValue(item.name);
        this.baihocList.get('danhMuc').setValue(item.danhMuc);

        this.baihocList.get('content').setValue(item.content);
        this.baihocList.get('nguoiDuyet').setValue(item.nguoiDuyet);
        this.baihocList.get('deThi').setValue(item.deThi);
        this.baihocList.get('note').setValue(item.note);
    }
    resetForm() {
        this.baihocList.removeControl('id');
        this.baihocList = this.fb.group({
            idTailieu: [0],
            name: [''],
            danhMuc: [''],
            content: [''],
            nguoiDuyet: [''],
            deThi: [''],
            note: [''],
        });
    }
    updateBaihoc() {
        alert('Cập nhật thành công');

        this.baihocService.updateBaihoc(this.baihocList.value).subscribe();
        this.resetForm();
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.baihocList = this.fb.group({
            idTailieu: [0],
            name: [''],
            danhMuc: [''],
            content: [''],
            nguoiDuyet: [''],
            deThi: [''],
            note: [''],
        });
        this.dethiService.getDethi().subscribe();
        this.dethiService.dethi$.subscribe((res) => (this.dethi = res));
        this.baihocService.getBaihoc().subscribe();
        this.baihocService.baihoc$.subscribe((res) => {
            console.log(res);

            return (this.baihoc = res);
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

                    this.tailieu = result;
                }
            });
    }
}
