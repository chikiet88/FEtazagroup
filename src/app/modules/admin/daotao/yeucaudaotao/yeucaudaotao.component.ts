import { Component, OnInit } from '@angular/core';
import { TailienguonService } from '../tailieunguon/tailienguon.service';
import ClassicEditor from 'ckeditor5/build/ckEditor';
import { map } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { YeucaudaotaoService } from './yeucaudaotao.service';

@Component({
    selector: 'app-yeucaudaotao',
    templateUrl: './yeucaudaotao.component.html',
    styleUrls: ['./yeucaudaotao.component.scss'],
})
export class YeucaudaotaoComponent implements OnInit {
    tailieu: any;
    yeucau: any[];
    dethi: any[];
    baihocDetail: any;
    yeucaudaotaoList: FormGroup;
    public Editor = ClassicEditor;

    constructor(
        private tailieunguonService: TailienguonService,
        private fb: FormBuilder,
        private _yeucaudaotaoService: YeucaudaotaoService
    ) {}

    onSubmit() {
        console.log(this.yeucaudaotaoList.get('dateFrom').value);
        console.log(this.yeucaudaotaoList.get('dateTo').value);

        // this._yeucaudaotaoService
        //     .uploadYeucaudaotao(this.yeucaudaotaoList.value)
        //     .subscribe();
        // alert('Tạo bài học thành công');
        // this.resetForm();
    }
    deleteYeucaudaotao(id) {
        this._yeucaudaotaoService.deleteYeucaudaotao(id).subscribe;
    }

    onSelect(item) {
        this.yeucaudaotaoList.addControl('id', new FormControl(item.id));
        this.yeucaudaotaoList.get('id').setValue(item.id);

        this.yeucaudaotaoList.get('idTailieu').setValue(item.idTailieu);

        this.yeucaudaotaoList.get('name').setValue(item.name);
        this.yeucaudaotaoList.get('danhMuc').setValue(item.danhMuc);

        this.yeucaudaotaoList.get('content').setValue(item.content);
        this.yeucaudaotaoList.get('nguoiDuyet').setValue(item.nguoiDuyet);
        this.yeucaudaotaoList.get('deThi').setValue(item.deThi);
        this.yeucaudaotaoList.get('note').setValue(item.note);
    }
    resetForm() {
        this.yeucaudaotaoList = this.fb.group({
            idNguoiyeucau: [0],
            idNguoiduyet: [0],
            chiphi: [''],
            idBophandaotao: [0],
            idHocvien: [0],
            yeucaudaura: [''],
            duyetnoidung: [''],
            hinhthuc: [''],
            idGiangvien: [0],
            danhgia: [''],
            ghichu: [''],
            dateFrom: [''],
            dateTo: [''],
            totalTime: [''],
        });
    }
    updateYeucaudaotao() {
        alert('Cập nhật thành công');

        this._yeucaudaotaoService
            .updateYeucaudaotao(this.yeucaudaotaoList.value)
            .subscribe();
        this.resetForm();
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.resetForm();

        this._yeucaudaotaoService.getYeucaudaotao().subscribe();
        this._yeucaudaotaoService.yeucaudaotao$.subscribe((res) => {
            console.log(res);

            return (this.yeucau = res);
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
