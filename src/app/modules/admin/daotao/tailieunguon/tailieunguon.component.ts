import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from '../models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TailienguonService } from './tailienguon.service';
import { Files } from './tailieunguon.types';

interface ExampleFlatNode {
    expandable: boolean;
    item: string;
    level: number;
}
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

    private _transformer = (node: Files, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            id: node.id,
            parentid: node.parentid,
            item: node.item,
            type: node.type,
            level: level,
        };
    };
    constructor(
        private tailieunguonService: TailienguonService,
        private fb: FormBuilder,
        private uploadService: FileUploadService
    ) {}

    treeControl = new FlatTreeControl<ExampleFlatNode>(
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
    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    addFolder() {
        this.folderList = this.fb.group({
            item: ['New Folder'],
            type: ['folder'],
            parentid: 0,
        });
        this.tailieunguonService
            .addFolder(this.folderList.value)
            .subscribe();
            alert('Vui lòng đổi tên Folder')
            
    }

    addFolderChild(id) {
        this.folderList.get('parentid').setValue(id);

        this.tailieunguonService.addFolder(this.folderList.value).subscribe();
    }
    updateFile(data, e) {
        this.fileList.addControl('id', new FormControl(data.id));
        this.fileList.get('id').setValue(data.id);
        this.fileList.get('parentid').setValue(data.parentid);

        this.fileList.get('item').setValue(e.target.value);

        this.tailieunguonService.updateFile(this.fileList.value).subscribe();
        this.ngOnInit();
    }
    updateFolder(data, e) {
        this.folderList.addControl('id', new FormControl(data.id));
        this.folderList.get('id').setValue(data.id);
        this.folderList.get('parentid').setValue(data.parentid);
        this.folderList.get('item').setValue(e.target.value);
        this.tailieunguonService.updateFile(this.folderList.value).subscribe();
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
            parentid: [0],
        });
        this.fileList.get('parentid').setValue(id);
        this.tailieunguonService.addFolder(this.fileList.value).subscribe();
        alert('Vui lòng đổi tên File');
    }

    onSubmit() {
        if (!this.filedetail.id) {
            alert('Vui lòng tạo file mới');
        } else {
            this.fileList.removeControl('parentid');
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
        this.ngOnInit()
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
            parentid: [0],
        });
        this.uploadService.deleteFile(fileUpload);
    }

    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }

    ngOnInit(): void {
        this.folderList = this.fb.group({
            item: ['New Folder'],
            type: ['folder'],
            parentid: 0,
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
            parentid: [0],
        });

        this.tailieunguonService.getFile().subscribe();
        this.tailieunguonService.files$.subscribe((result) => {
            // this.files = nest(result)

            this.dataSource.data = nest(result);
        });

        const nest = (items, id = '', link = 'parentid') =>
            items
                .filter((item) => item[link] == id)
                .map((item) => ({
                    ...item,
                    children: nest(items, item.id),
                }));
    }
    @ViewChild(UploadFileComponent) comp: UploadFileComponent;
}
