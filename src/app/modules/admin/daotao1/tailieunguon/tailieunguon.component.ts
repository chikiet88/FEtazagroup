import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import ClassicEditor from 'ckeditor5/build/ckEditor';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from '../models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { TailienguonService } from './tailienguon.service';
import { Files } from './tailieunguon.types';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
// interface ExampleFlatNode {
//     expandable: boolean;
//     item: string;
//     level: number;
// }
@Component({
    selector: 'app-tailieunguon',
    templateUrl: './tailieunguon.component.html',
    styleUrls: ['./tailieunguon.component.scss'],
})
export class TailieunguonComponent implements OnInit {
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    folderList: FormGroup;
    fileList: FormGroup;
    dataList: FormGroup;
    files: any;
    filedetail: any;
    public Editor = ClassicEditor;
    showFiller = true;
    deleteFile = false;
    danhmuc:any
    private _transformer = (node: any, level: number) => {
        console.log(node);
        node.expandable =!!node.children && node.children.length > 0;
        node.level =level;
        return node;
        // return {
        //     expandable: !!node.children && node.children.length > 0,
        //     id: node.id,
        //     pid: node.pid,
        //     Tieude: node.Tieude,
        //     Type: node.Type,
        //     level: level,
        // };
    };
    constructor(
        private tailieunguonService: TailienguonService,
        private fb: FormBuilder,
        private uploadService: FileUploadService,
        private _cauhinhService: CauhinhService
    ) {}

    treeControl = new FlatTreeControl<any>(
        (node) => node.level,
        (node) => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
    );

    dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
    );
    hasChild = (_: number, node: any) => node.expandable;
   
    addFolder() {
        const danhmuc = {Tieude:'Danh Mục Mới',Type:'folder',pid:'0'};
        this.folderList = this.fb.group({
            Tieude: ['New Folder'],
            Type: ['folder'],
            pid: 0,
        });
        this._cauhinhService.CreateDanhmuc(danhmuc).subscribe();
    }

    addFolderChild(id) {
        const danhmuc = {Tieude:'Danh Mục Mới',Type:'folder',pid:id};
       // this.folderList.get('pid').setValue(id);
        this._cauhinhService.CreateDanhmuc(danhmuc).subscribe();
    }
    updateFile(data, e) {
        this.fileList.addControl('id', new FormControl(data.id));
        this.fileList.get('id').setValue(data.id);
        this.fileList.get('pid').setValue(data.pid);
        this.fileList.get('Tieude').setValue(e.target.value);
        this._cauhinhService.UpdateDanhmuc(this.fileList.value).subscribe();
        this.ngOnInit();
    }
    updateFolder(data, e) {
        data.Tieude = e.target.value;
        delete data.children;
        delete data.expandable;
        delete data.level;
        console.log(data,e);       
        // this.folderList.addControl('id', new FormControl(data.id));
        // this.folderList.get('id').setValue(data.id);
        // this.folderList.get('pid').setValue(data.pid);
        // this.folderList.get('Tieude').setValue(e.target.value);
        this._cauhinhService.UpdateDanhmuc(data).subscribe();
        this.ngOnInit();
    }
    // getKey(key:string){
    //     this.folderList.addControl('key', new FormControl(key));
    //     this.folderList.get('key').setValue(key);
    // }
    getFileDetail(data) {
        this.tailieunguonService.getFileDetail(data.id).subscribe();
        this.tailieunguonService.file$.subscribe((res) => {
            this.filedetail = res;
            this.fileList
                .get('data.tailieu')
                .setValue(this.filedetail.data.tailieu);
            this.fileList.get('data.tag').setValue(this.filedetail.data.tag);
            this.fileList.get('data.date').setValue(this.filedetail.data.date);
            this.fileList
                .get('data.deadline')
                .setValue(this.filedetail.data.deadline);
            this.fileList
                .get('data.content')
                .setValue(this.filedetail.data.content);
            this.fileList.get('data.note').setValue(this.filedetail.data.note);
            this.fileList
                .get('data.sameAuthor')
                .setValue(this.filedetail.data.sameAuthor);
            this.fileList
                .get('data.censor')
                .setValue(this.filedetail.data.censor);
        });
        this.deleteFile = false;
    }

    addFile(id) {
        this.fileList = this.fb.group({
            item: ['New File'],
            type: ['file'],
            data: this.fb.group({
                tag: [''],
                idmenu: [0],
                tailieu: [''],
                date: [''],
                deadline: [''],
                content: [''],
                note: [''],
                author: [''],
                sameAuthor: [''],
                censor: [''],
            }),
            pid: [0],
        });
        this.fileList.get('pid').setValue(id);
        this.tailieunguonService.addFolder(this.fileList.value).subscribe();
        alert('Vui lòng đổi tên File');
    }

    onSubmit() {
        if (!this.filedetail.id) {
            alert('Vui lòng tạo file mới');
        } else {
            this.fileList.removeControl('pid');
            this.fileList.addControl('id', new FormControl(this.filedetail.id));
            this.fileList.get('id').setValue(this.filedetail.id);
            this.tailieunguonService
                .updateFileDetail(this.fileList.value)
                .subscribe();
        }
    }

    deleteFileDetail() {
        this.tailieunguonService
            .deleteFileDetail(this.filedetail.id)
            .subscribe();
        this.deleteFile = true;
        this.ngOnInit();
    }
    removefolder(id) {
        this.tailieunguonService.deleteFileDetail(id).subscribe();
    }

    deleteFileUpload(fileUpload: FileUpload): void {
        this.fileList = this.fb.group({
            item: ['New File'],
            type: ['file'],
            data: this.fb.group({
                tag: [''],
                idmenu: [0],
                tailieu: [''],
                date: [''],
                deadline: [''],
                content: [''],
                note: [''],
                author: [''],
                sameAuthor: [''],
                censor: [''],
            }),
            pid: [0],
        });
        this.uploadService.deleteFile(fileUpload);
    }

    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }
    nest = (items, id = '0', link = 'pid') =>
        items
            .filter((item) => item[link] == id)
            .map((item) => ({
                ...item,
                children: this.nest(items, item.id),
            }));

    ngOnInit(): void {
        this.danhmuc = [];
        this.folderList = this.fb.group({
            item: ['New Folder'],
            type: ['folder'],
            pid: 0,
        });
        this.fileList = this.fb.group({
            item: ['New File'],
            type: ['file'],
            data: this.fb.group({
                tag: [''],
                idmenu: [0],
                tailieu: [''],
                date: [''],
                deadline: [''],
                content: [''],
                note: [''],
                author: [''],
                sameAuthor: [''],
                censor: [''],
            }),
            pid: [0],
        });

        this._cauhinhService.getAllDanhmuc().subscribe();
        this._cauhinhService.danhmucs$.subscribe((result) => {
            console.log(result);
            
            // this.files = nest(result)
            this.dataSource.data = this.nest(result);
            console.log(this.dataSource.data);
            
        });
    }
}
