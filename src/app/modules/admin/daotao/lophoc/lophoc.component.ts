import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import ClassicEditor from 'ckeditor5/build/ckEditor';
import { map } from 'rxjs';
import { BaihocService } from '../baihoc/baihoc.service';
import { LophocService } from './lophoc.service';

@Component({
    selector: 'app-lophoc',
    templateUrl: './lophoc.component.html',
    styleUrls: ['./lophoc.component.scss'],
})
export class LophocComponent implements OnInit {
    lophocList: FormGroup;
    lophoc: any[];
    baihoc: any;
    idLophoc: number;
    public Editor = ClassicEditor;

    constructor(
        private fb: FormBuilder,
        private lophocService: LophocService,
        private baihocService: BaihocService
    ) {}
    onSubmit() {
        alert('update thành công');
        this.lophocService.addLophoc(this.lophocList.value).subscribe();
        this.resetForm()
    }
    resetForm() {
        this.lophocList = this.fb.group({
            idBaihoc: [''],
            name: [''],
            idHinhthuc: [''],
            date: [''],
            deadline: [''],
            minute: [''],
            idGiangvien: [''],
            idHocvien: [''],
            idMaDT: [''],
            idNhomdcDT: [''],
            idNguoiduyet: [''],
            linkmeet: [''],
            note: [''],
        });
    }
    onChange(item) {
        this.idLophoc = item.id;

        this.lophocList.get('idBaihoc').setValue(item.idBaihoc);
        this.lophocList.get('name').setValue(item.name);
        this.lophocList.get('idHinhthuc').setValue(item.idHinhthuc);
        this.lophocList.get('date').setValue(item.date);
        this.lophocList.get('deadline').setValue(item.deadline);
        this.lophocList.get('minute').setValue(item.minute);
        this.lophocList.get('idGiangvien').setValue(item.idGiangvien);
        this.lophocList.get('idHocvien').setValue(item.idHocvien);
        this.lophocList.get('idMaDT').setValue(item.idMaDT);
        this.lophocList.get('idNhomdcDT').setValue(item.idNhomdcDT);
        this.lophocList.get('idNguoiduyet').setValue(item.idNguoiduyet);
        this.lophocList.get('linkmeet').setValue(item.linkmeet);
        this.lophocList.get('note').setValue(item.note);
    }
    deleteLophoc() {
        alert('update thành công');

        this.lophocService.deleteLophoc(this.idLophoc).subscribe();
        this.resetForm();
    }
    updateLophoc() {
        alert('update thành công');
        this.lophocService
            .updateFile(this.idLophoc, this.lophocList.value)
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
        this.lophocService.getLophoc().subscribe();
        this.lophocService.lophoc$.subscribe((res: any) => {
            console.log(res);

            return (this.lophoc = res);
        });

       this.resetForm()
    }
}
