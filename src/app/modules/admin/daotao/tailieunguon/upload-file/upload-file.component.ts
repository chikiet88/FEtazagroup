import { ThisReceiver } from '@angular/compiler';
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import { FileUpload } from '../../models/file-upload.model';
import { FileUploadService } from '../../services/file-upload.service';
import { UploadFileService } from './upload-file.service';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnChanges {
    @Input() id: number;
    @Input() deleteFile: boolean;
    @Output() key = new EventEmitter();
    fileUploads?: any[];
    view = null;
    fileList: FormGroup;
    files: any;
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    constructor(
        private uploadService: FileUploadService,
        private uploadFile: UploadFileService,
        private fb: FormBuilder
    ) {}
    toggleView(i: number) {
        this.view = i;
    }
    deleteDocx(){
        this.view = null
    }
    ngOnChanges(changes: any) {
        this.uploadFile.files$
            .pipe(
                map(
                    (arr: any) =>
                        arr &&
                        arr.length &&
                        arr.reverse().filter((r) => {
                            return r.idTailieu == changes.id.currentValue;
                        })
                )
            )
            .subscribe((result) => {
                if (result) {
                    this.files = result;
                }
            });

        if (this.deleteFile == true) {
            for (let i = 0; i <= this.files.length; i++) {
                this.uploadFile.deleteFile(this.files[i].id).subscribe();
                
            }
        }
    }
    ngOnInit(): void {
        this.files = [];
        this.uploadFile.getFile().subscribe();

        this.uploadService._thumb$.subscribe((res) => {
            if (res) {
                this.fileList.get('idTailieu').setValue(this.id);
                this.fileList.get('name').setValue(res.file.name);
                this.fileList.get('link').setValue(res.url);
                this.uploadFile.uploadfile(this.fileList.value).subscribe();
            }
        });
        this.fileList = this.fb.group({
            name: [''],
            link: [''],
            idTailieu: [0],
        });

        this.uploadService
            .getFiles(6)
            .snapshotChanges()
            .pipe(
                map((changes) =>
                    // store the key
                    changes.map((c) => ({
                        key: c.payload.key,
                        ...c.payload.val(),
                    }))
                )
            )
            .subscribe((fileUploads) => {
                this.fileUploads = fileUploads;
                this.newKey(fileUploads);
            });
    }
    newKey(fileUploads) {
        const index = fileUploads.length - 1;

        const data = fileUploads[index].key;

        // return this.key.emit(data)
    }
    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }
    deleteFileUpload(fileUpload: FileUpload): void {
        this.uploadService.deleteFile(fileUpload);
    }
    upload(): void {
        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);
            this.selectedFiles = undefined;
            if (file) {
                this.currentFileUpload = new FileUpload(file);
                this.uploadService
                    .pushFileToStorage(this.currentFileUpload)
                    .subscribe(
                        (percentage) => {
                            this.percentage = Math.round(
                                percentage ? percentage : 0
                            );
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
            }
        }
    }
}
