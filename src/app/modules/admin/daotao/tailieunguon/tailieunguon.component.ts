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
import { clone } from 'lodash';
import { BehaviorSubject } from 'rxjs';
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
    Danhmuc: any;
    Tailieunguon:any;
    Tree:any;
    CurrentTailieu:any;
    private _tree: BehaviorSubject<any> = new BehaviorSubject(null);
    private _transformer = (node: any, level: number) => {
        node.expandable = !!node.children && node.children.length > 0;
        node.level = level;
        return node;
    };
    constructor(
        private _tailieunguonService: TailienguonService,
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
        const danhmuc = { Tieude: 'Danh Mục Mới', Type: 'folder', pid: '0' };
        this.folderList = this.fb.group({
            Tieude: ['New Folder'],
            Type: ['folder'],
            pid: 0,
        });
        this._cauhinhService.CreateDanhmuc(danhmuc).subscribe();
    }

    addFolderChild(node) {
        const danhmuc = { Tieude: 'Danh Mục Mới', Type: 'folder', pid: node.id };
        this._cauhinhService.CreateDanhmuc(danhmuc).subscribe((res) => {
            this.treeControl.expand(
                this.treeControl.dataNodes.find((v) => v.id == node.id)
            );
            let x = this.files.find((v) => v.id == node.pid);
            while (x) {
                this.treeControl.expand(
                    this.treeControl.dataNodes.find((v) => v.id == x.id)
                );
                x = this.files.find((v) => v.id == x.pid);
            }
        });
    }
    updateFile(data, e) {
        data.Tieude = e.target.value;
        console.log(data);
       // this._cauhinhService.UpdateDanhmuc(this.fileList.value).subscribe();
    }
    updateFolder(data, e) {
        data.Tieude = e.target.value;
        delete data.children;
        delete data.expandable;
        delete data.level;
        console.log(data, e);
        this._cauhinhService.UpdateDanhmuc(data).subscribe(res=>{
            this.treeControl.expand(
                this.treeControl.dataNodes.find((v) => v.id == data.id)
            );
            let x = this.files.find((v) => v.id == data.pid);
            while (x) {
                this.treeControl.expand(
                    this.treeControl.dataNodes.find((v) => v.id == x.id)
                );
                x = this.files.find((v) => v.id == x.pid);
            }
        });
        e.stoppropagation()
    }
    removefolder(data) {
        console.log(data);
        
        this._cauhinhService.Deletedanhmuc(data.id).subscribe(res=>{
            let x = this.files.find((v) => v.id == data.pid);
            while (x) {
                this.treeControl.expand(
                    this.treeControl.dataNodes.find((v) => v.id == x.id)
                );
                x = this.files.find((v) => v.id == x.pid);
            }
        });
    }
    getFileDetail(data) {    
        this.CurrentTailieu = clone(data);
        delete this.CurrentTailieu.Type
        delete this.CurrentTailieu.children
        delete this.CurrentTailieu.expandable
        delete this.CurrentTailieu.level      
        delete this.CurrentTailieu.pid 
        console.log(this.CurrentTailieu);
    }
    ChangeValue(field,e)
    {
        this.CurrentTailieu[field] = e.target.value;
        console.log(e.target.value);  
    }

    CreateTailieunguon(node) {
        const tailieunguon = 
        {
            Tieude:'Tài Liệu Mới',
            idDM: node.id,
        }
        this._tailieunguonService.CreateTailieunguon(tailieunguon).subscribe((data)=>
        {
            this.treeControl.expand(
                this.treeControl.dataNodes.find((v) => v.id == node.id)
            );
            let x = this.files.find((v) => v.id == node.pid);
            while (x) {
                this.treeControl.expand(
                    this.treeControl.dataNodes.find((v) => v.id == x.id)
                );
                x = this.files.find((v) => v.id == x.pid);
            }
        }

        );
    }

    UpdateTailieu() {
        this._tailieunguonService.UpdateTailieunguon(this.CurrentTailieu).subscribe();
        
    }
    onSubmit() {
        // if (!this.filedetail.id) {
        //     alert('Vui lòng tạo file mới');
        // } else {
        //     this.fileList.removeControl('pid');
        //     this.fileList.addControl('id', new FormControl(this.filedetail.id));
        //     this.fileList.get('id').setValue(this.filedetail.id);
        //     this._tailieunguonService
        //         .updateFileDetail(this.fileList.value)
        //         .subscribe();
        // }
    }

    deleteFileDetail() {
        // this._tailieunguonService
        //     .deleteFileDetail(this.filedetail.id)
        //     .subscribe();
        // this.deleteFile = true;
        // this.ngOnInit();
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
        this._cauhinhService.danhmucs$.subscribe((result) => {
            this.Danhmuc = this.Tree = result;
        });
        this._tailieunguonService.tailieunguons$.subscribe((data)=>{this.Tailieunguon = data;})
        this.Tailieunguon.forEach(v => {
                v.Type= 'file';
                v.pid = v.idDM
                this.Tree.push(v);
        });
        this._tree.next(this.Tree);
        console.log(this.Danhmuc);
        // this.files = result
         this.dataSource.data = this.nest(this._tree.value);
        console.log(this.dataSource.data);
    }   
}
