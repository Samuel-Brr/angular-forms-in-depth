import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {noop, of} from 'rxjs';
import { NumberSymbol } from '@angular/common';


@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"]
})
export class FileUploadComponent implements ControlValueAccessor {

  constructor(private http: HttpClient){

  }

  @Input()
  requiredFileType:string

  fileName: string = ''

  fileUploadError: boolean = false

  uploadProgress:number;

  onFileSelected(event) {

    const file:File = event.target.files[0]

    if(file){

      this.fileName = file.name

      this.fileUploadError = false

      const formData = new FormData()

      formData.append("thumbnail", file)

      this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          catchError(error => {
            this.fileUploadError = true
            return of(error)
          }),
          finalize(()=>{
            this.uploadProgress = null
          })
        )
        .subscribe(event => {
          if(event.type == HttpEventType.UploadProgress){
              this.uploadProgress = Math.round(100*(event.loaded/event.total))
          }
        })

    }


  }

}
