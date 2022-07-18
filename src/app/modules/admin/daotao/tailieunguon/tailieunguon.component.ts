import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
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
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { UserService } from 'app/core/user/user.service';
import { NotifierService } from 'angular-notifier';
import { MyUploadAdapter } from '../MyUploadAdapter';
import { SharedService } from 'app/shared/shared.service';
import { environment } from 'environments/environment';
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
    filesTailieu: any;
    isFile = false;
    isFolder = true;
    public Tailieu = {
        Noidung: '',
        Ghichu: '',
    };
    public Editor = ClassicEditor;
    public onReady(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(
                loader,
                this._uploadService,
                this._sharedService
            );
        };
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
    }
    public config = {
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                },
            ],
        },
    };
    showFiller = true;
    deleteFile = false;
    Danhmuc: any;
    Tailieunguon: any;
    Tree: any;
    CurrentTailieu: any;
    triggerOrigin: any;
    CUser: any;
    isOpenTacgia = false;
    isOpenPheduyet = false;
    filterNhanviens: any[] = [];
    Nhanviens: any[] = [];
    filteredTacgia: any[] = [];
    filteredKiemduyet: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    private _tree: BehaviorSubject<any> = new BehaviorSubject(null);
    private _transformer = (node: any, level: number) => {
        node.expandable = !!node.children && node.children.length > 0;
        node.level = level;
        return node;
    };
    constructor(
        private _tailieunguonService: TailienguonService,
        private fb: FormBuilder,
        private _uploadService: FileUploadService,
        private _cauhinhService: CauhinhService,
        private _userService: UserService,
        private _nhanvienService: NhanvienService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _notifierService: NotifierService,
        private _sharedService: SharedService
    ) {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.CUser = data;
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnInit(): void {
        this._nhanvienService.nhanviens$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.Nhanviens =
                    this.filterNhanviens =
                    this.filteredTacgia =
                    this.filteredKiemduyet =
                        data;
                this._changeDetectorRef.markForCheck();
            });
        this._cauhinhService.danhmucs$.subscribe((result) => {
            this.Danhmuc = this.files = result;
            this._tailieunguonService.tailieunguons$.subscribe((data) => {
                this.Tailieunguon = data;
                this.Tailieunguon.forEach((v) => {
                    v.Type = 'file';
                    v.pid = v.idDM;
                });
                this.Tree = [...this.Danhmuc, ...this.Tailieunguon];
                this.dataSource.data = this.nest(this.Tree);
            });
        });
    }
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
        const danhmuc = {
            Tieude: 'Danh Mục Mới',
            Type: 'folder',
            pid: '0',
            Module: 2,
            idTao: this.CUser.id,
        };
        this.folderList = this.fb.group({
            Tieude: ['New Folder'],
            Type: ['folder'],
            pid: 0,
        });
        this._cauhinhService.CreateDanhmuc(danhmuc).subscribe();
        this._notifierService.notify('success', 'Tạo Mới Thành Công');
    }

    addFolderChild(node) {
        const danhmuc = {
            Tieude: 'Danh Mục Mới',
            Type: 'folder',
            pid: node.id,
            Module: 2,
            idTao: this.CUser.id,
        };
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
        this._notifierService.notify('success', 'Tạo MớiThành Công');
    }
    updateFile(data, e) {
        data.Tieude = e.target.value;
        console.log(data);
        // this._cauhinhService.UpdateDanhmuc(this.fileList.value).subscribe();
    }
    updateFolder(data, e) {
        const olddata = clone(data);
        olddata.Tieude = e.target.value;
        delete olddata.children;
        delete olddata.expandable;
        delete olddata.level;
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
        this._cauhinhService.UpdateDanhmuc(olddata).subscribe();
        this._notifierService.notify('success', 'Cập Nhật Thành Công');
    }
    removefolder(data) {
        this._cauhinhService.Deletedanhmuc(data.id).subscribe((res) => {
            this._notifierService.notify('success', 'Xóa Thành Công');
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
        this.isFile = true;
        this.isFolder = false;

        this.CurrentTailieu = clone(data);
        this.LoadTailieu(data.id);
        delete this.CurrentTailieu.Type;
        delete this.CurrentTailieu.children;
        delete this.CurrentTailieu.expandable;
        delete this.CurrentTailieu.level;
        delete this.CurrentTailieu.pid;
        this.Tailieu.Noidung = this.CurrentTailieu.Noidung;
        this.Tailieu.Ghichu = this.CurrentTailieu.Ghichu;
    }
    getFolderDetail(data) {
        this.isFile = false;
        this.isFolder = true;
    }

    ChangeValue(field, value) {
        this.CurrentTailieu[field] = value;
    }
    ChangeEditorValue(field, { editor }: ChangeEvent) {
        if (editor.getData() != undefined) {
            this.CurrentTailieu[field] = editor.getData();
        }
    }
    toggleTacgia(trigger: any) {
        this.triggerOrigin = trigger;
        this.isOpenTacgia = !this.isOpenTacgia;
    }
    togglePheduyet(trigger: any) {
        this.triggerOrigin = trigger;
        this.isOpenPheduyet = !this.isOpenPheduyet;
    }
    filterTacgia(event): void {
        const value = event.target.value.toLowerCase();
        this.filteredTacgia = this.Nhanviens.filter((v) =>
            v.name.toLowerCase().includes(value)
        );
    }
    filterKiemduyet(event): void {
        const value = event.target.value.toLowerCase();
        this.filteredKiemduyet = this.Nhanviens.filter((v) =>
            v.name.toLowerCase().includes(value)
        );
    }

    CreateTailieunguon(node) {
        const tailieunguon = {
            Tieude: 'Tài Liệu Mới',
            idDM: node.id,
            idTao: this.CUser.id,
        };
        this._tailieunguonService
            .CreateTailieunguon(tailieunguon)
            .subscribe((data) => {
                this._notifierService.notify('success', 'Tạo Mới Thành Công');
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
    UpdateTailieu() {
        console.log(this.CurrentTailieu);
        this._tailieunguonService
            .UpdateTailieunguon(this.CurrentTailieu)
            .subscribe();
        this._notifierService.notify('success', 'Cập Nhật Thành Công');
    }
    ChonTacgia(id) {
        this.CurrentTailieu.Tacgia.push(id);
        this._tailieunguonService
            .UpdateTailieunguon(this.CurrentTailieu)
            .subscribe();
        this.isOpenTacgia = false;
        this.filteredTacgia = this.Nhanviens;
    }
    ChonKiemduyet(id) {
        this.CurrentTailieu.Kiemduyet.push(id);
        this._tailieunguonService
            .UpdateTailieunguon(this.CurrentTailieu)
            .subscribe();
        this.isOpenPheduyet = false;
        this.filteredKiemduyet = this.Nhanviens;
    }
    RemoveMang(type, value) {
        this.CurrentTailieu[type] = this.CurrentTailieu[type].filter(
            (v) => v != value
        );
        this._tailieunguonService
            .UpdateTailieunguon(this.CurrentTailieu)
            .subscribe();
        //this.ngOnInit();
    }
    deleteFileDetail() {
        console.log(this.CurrentTailieu);
        this._tailieunguonService
            .DeleteTailieunguon(this.CurrentTailieu.id)
            .subscribe((data) => {
                this.CurrentTailieu = {};
            });
        this._notifierService.notify('success', 'Xóa Thành Công');
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

    // this.Tailieunguon.forEach(v => {
    //         v.Type= 'file';
    //         v.pid = v.idDM
    //         this.Tree.push(v);
    // });
    // this._tree.next(this.Tree);
    // console.log(this.Danhmuc);
    // this.dataSource.data = this.nest(this._tree.value);
    // console.log(this.dataSource.data);

    LoadTailieu(idTL) {
        this._sharedService.uploads$.subscribe((data) => {
            console.log(data);
            data.forEach((v) => {
                v.path = `${environment.ApiURL}/upload/path/${v.Lienket}`;
            });
            this.filesTailieu = data.filter(
                (v) => v.uuid == this.CurrentTailieu.id
            );
        });
    }
    onSelect(event) {
        event.addedFiles.forEach((v, k) => {
            setTimeout(() => {
                this.uploadAndProgress(v);
            }, k * 100);
        });
    }
    onRemove(item) {
        this._sharedService.deletePath(item.Lienket).subscribe();
        this._sharedService.DeleteUpload(item.id).subscribe();
    }
    uploadAndProgress(file) {
        var formData = new FormData();
        formData.append('file', file);
        this._sharedService.UploadFile(
            formData,
            this.CUser,
            this.CurrentTailieu.id
        );
        // this._httpClient.post(`${environment.ApiURL}/upload/file`, formData, { reportProgress: true, observe: 'events' })
        //   .subscribe(event => {
        //     if (event.type === HttpEventType.UploadProgress) {
        //       this.percentDone = Math.round(100 * event.loaded / event.total);
        //     } else if (event instanceof HttpResponse) {
        //       this.uploadSuccess = true;
        //       const upload = {idTao:this.CUser.id, uuid: this.idTailieu, Tieude: event.body['originalname'], Lienket: event.body['filename'], Exten:event.body['originalname'].split('.').pop()};
        //       this._sharedService.CreateUpload(upload).subscribe();
        //     }
        //   })
    }
}
