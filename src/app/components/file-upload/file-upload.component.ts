import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() acceptExtension?: string;
  @Output() fileChange = new EventEmitter<any>();
  _dragging = false;
  _loaded = false;
  _readerResult: any = undefined;
  _isImage = false;
  _file: File | null = null;
  _errorMessage: string | null = null;

  @ViewChild('fileReader', { static: true }) private _fileReader?: ElementRef;

  constructor(private _cdr: ChangeDetectorRef) {}

  handleDragEnter(): void {
    this._dragging = true;
    this._cdr.markForCheck();
  }

  handleDragLeave(): void {
    this._dragging = false;
    this._cdr.markForCheck();
  }

  handleDrop(e: DragEvent): void {
    e.preventDefault();
    this._dragging = false;
    this._cdr.markForCheck();
    this.handleInputChange(e);
  }

  handleInputChange(e: any): void {
    this._file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (this._file) {
      this._isImage = this._checkImageFile(this._file);
      if (!this._isValidType(this._file)) {
        this._errorMessage = `Invalid file type. Allowed types: ${this.acceptExtension}`;
        this._file = null;
        this._readerResult = null;
        return;
      }
      this._loaded = false;
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(this._file);
      this._cdr.markForCheck();
    }
  }

  cancel(e: Event): void {
    e.stopPropagation();
    this._isImage = false;
    this._loaded = false;
    this._readerResult = null;
    this._file = null;
    const input = this._fileReader?.nativeElement;
    if (input) {
      input.value = null;
    }
    this._onChange(null);
    this.fileChange.emit(null);
    this._errorMessage = null;
    this._cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(value: any): void {
    this._readerResult = value;
  }

  private _handleReaderLoaded({ target: reader }: { target: any }): void {
    this._loaded = true;
    this._readerResult = reader.result;
    this.fileChange.emit(this._readerResult);
    this._onChange(this._readerResult);
    this._cdr.markForCheck();
  }

  private _isValidType = (file: File): boolean => {
    if (!this.acceptExtension) {
      return true;
    }
    const rg = new RegExp(this.acceptExtension.replace('*', '.*'));
    const fileExtension = file.name
      .substring(file.name.lastIndexOf('\\') + 1)
      .split('.')
      .pop();
    return (
      (fileExtension !== undefined &&
        fileExtension !== null &&
        this.acceptExtension.includes(fileExtension)) ||
      rg.test(file.type)
    );
  };

  private _checkImageFile = (file: File): boolean => {
    return file['type'].split('/')[0] === 'image';
  };

  private _onChange = (value: any) => {};
  private _onTouched = () => {};
}
