import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.css']
})
export class AddLessonComponent {
  
  lessonName: string = '';
  uploadedFilesEdit: File[] = [];
  uploadedImagesEdit: string[] = [];
  hiddenCardsEdit: boolean[] = [];
  hiddenCards = Array(9).fill(false);
  uploadedFiles: any[] = Array(9).fill(null);
  uploadedImages: (string | null)[] = Array(9).fill(null);


  cards = [
    { title: 'رفع الصور' },
    { title: 'رفع فيديو' },
    { title: 'رفع الدرس PDF' },
    { title: 'أوراق عمل' },
    { title: 'تجهيز التقويم' },
    { title: 'رفع أي ملف إضافي' },
    { title: 'رفع أي ملف إضافي' },
    { title: 'رفع أي ملف إضافي' },
    { title: 'رفع بث مباشر' },
  ];
  isModalImageSelected = false;  // To track if the image selection is for the modal or not
  editUploadedFiles: { [key: number]: File[] } = {}; // Store only non-image files
  editUploadedImages: { [key: number]: string[] } = {}; // Store image previews
  editUploadedImageFiles: { [key: number]: File[] } = {}; // Store image files for proper removal
  
  lessonForm = this.fb.group({
    lessonName: ['', Validators.required],
    subjectId: [Validators.required],
  });
  constructor(
        private lessonService: LessonService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<AddLessonComponent>
  ){}

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  openEditFileInput(index: number): void {
    this.isModalImageSelected = false;
    console.log(index)
    const fileInput = this.fileInputs.toArray()[index]?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
    this.isModalImageSelected = true;
  }
  onSubmitLesson() {
    // Flatten `editUploadedFiles` object to get all files in a single array
    console.log(this.editUploadedFiles);
    console.log(this.editUploadedImageFiles);
    console.log(this.editUploadedImages);
    const lessonResources:  File[] = [
      ...Object.values(this.editUploadedFiles).flat(),
      ...Object.values(this.editUploadedImageFiles).flat()
    ].filter((file) => file !== null); // Remove any null values
    
  
    console.log(lessonResources);
  
    this.lessonService.uploadLesson(this.lessonName, lessonResources).subscribe(
      (response) => {
        this.toastr.success('لقد تم اضافه الدرس بنجاح !', 'نجاح', {
          timeOut: 2000,
        });
  
        // Reset the form and variables
        this.lessonForm.reset();
        this.lessonName = '';
  
        // Reset uploaded files for multiple files per card
        this.editUploadedFiles = {};
        this.editUploadedImages = {};
        this.hiddenCards = [];
        this.onDismiss();
        console.log('Lesson saved successfully:', response);
      },
      (error) => {
        console.error('Error saving lesson:', error);
      }
    );
  }

  removeFile(cardIndex: number, fileIndex: number, type: 'file' | 'image') {
    if (type === 'file' && this.editUploadedFiles[cardIndex]) {
      this.editUploadedFiles[cardIndex].splice(fileIndex, 1);
    } else if (type === 'image' && this.editUploadedImages[cardIndex]) {
      this.editUploadedImages[cardIndex].splice(fileIndex, 1);
      if (this.editUploadedImageFiles[cardIndex]) {
        this.editUploadedImageFiles[cardIndex].splice(fileIndex, 1);
      }
    }
  
    // If the arrays become empty, clean up the object to prevent empty lists
    if (this.editUploadedFiles[cardIndex]?.length === 0) {
      delete this.editUploadedFiles[cardIndex];
    }
    if (this.editUploadedImages[cardIndex]?.length === 0) {
      delete this.editUploadedImages[cardIndex];
    }
    if (this.editUploadedImageFiles[cardIndex]?.length === 0) {
      delete this.editUploadedImageFiles[cardIndex];
    }
  }

  onDismiss(): void {
    this.dialogRef.close();
  }
  onEditFileSelected(event: any, index: number): void {
    console.log('Triggered file selection for index:', index);
  
    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      console.error('No files selected');
      return;
    }
    console.log('Files selected:', files.length);
  
    // Ensure arrays for storing file information are initialized
    this.editUploadedFiles[index] = this.editUploadedFiles[index] || [];
    this.editUploadedImages[index] = this.editUploadedImages[index] || [];
    this.editUploadedImageFiles[index] = this.editUploadedImageFiles[index] || [];
  
    Array.from(files).forEach((file: File) => {
      console.log('Processing file:', file.name);
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
          console.log('File read complete for index:', index);
          this.editUploadedImages[index].push(e.target.result);
        };
        reader.readAsDataURL(file);
        this.editUploadedImageFiles[index].push(file);
      } else {
        this.editUploadedFiles[index].push(file);
        console.log('Non-image file:', file.name);
      }
    });
  
    this.isModalImageSelected = true;  // Indicate completion of image selection
  }
}
