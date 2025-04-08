import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.css']
})
export class EditLessonComponent {
  lessonName: string = '';
  lessonResources: any;
  lessonForm: FormGroup;
  selectedLessonId: any;
  
  constructor(
      private lessonService: LessonService,
      private toastr: ToastrService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<EditLessonComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any 
  ){
      this.lessonForm = this.fb.group({
        lessonName: [localStorage.getItem('LessonName'), Validators.required],
        subjectId: [ localStorage.getItem('selectedSubjectId'),Validators.required],
      });
      this.lessonName = localStorage.getItem('LessonName')!;
      this.selectedLessonId = this.data.id;
      this.fetchLessonResources();
  }

  getResourcePath(resource: string): string {
    const baseUrl = environment.resourceUrl;
    return `${baseUrl}${resource.replace(/\\/g, '/')}`;
  }


  fetchLessonResources(): void {
    console.log(this.selectedLessonId)
    if(this.selectedLessonId){
      this.lessonService.getLessonResources(this.selectedLessonId).subscribe({
        next: (response) => {
          this.lessonResources = response.teacherImagesResponse;
          console.log('Lesson resources:', this.lessonResources);
        },
        error: (error) => {
          console.error('Error fetching lesson resources:', error);
        },
      });
    }
  }

  newResourceFile: File | null = null; // Initialize as null
  edit2UploadedFiles: (File | null)[] = Array(9).fill(null);
  edit2UploadedImages: (string | null)[] = Array(9).fill(null);
  editUploadedFiles: { [key: number]: File[] } = {}; // Store only non-image files
  editUploadedImages: { [key: number]: string[] } = {}; // Store image previews
  editUploadedImageFiles: { [key: number]: File[] } = {}; // Store image files for proper removal
  
  addResource(index: number, modal: 'edit' | 'edit2'): void {
    console.log(this.newResourceFile)
    if (this.newResourceFile) {
      const formData = new FormData();
      formData.append('Resources', this.newResourceFile); // Ensure "Resource" field is included

      this.lessonService.addTeacherResource(formData).subscribe({
        next: (response) => {
          console.log('Resource added successfully:', response);
          this.toastr.success('لقد تم اضافه المرفق بنجاح !', 'نجاح', {
            timeOut: 2000,
          });

          // Use FileReader to create a temporary object URL
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (modal === 'edit') {
              this.editUploadedImages[index] = e.target.result; // e.target.result is the data URL
            } else if (modal === 'edit2') {
              this.edit2UploadedImages[index] = e.target.result; // e.target.result is the data URL
            }
          };

          // Ensure this.newResourceFile is not null before calling readAsDataURL
          if (this.newResourceFile) {
            reader.readAsDataURL(this.newResourceFile); // Convert file to base64 or URL format
          }

          this.fetchLessonResources();
        },
        error: (error) => {
          console.error('Error adding resource:', error);
        },
      });
    } else {
      console.error('No file selected');
    }
  }
  
  @ViewChildren('edit2FileInput') edit2FileInputs!: QueryList<ElementRef>;

  openEdit2FileInput(index: number): void {
    const fileInputArray = this.edit2FileInputs.toArray();
    if (fileInputArray[index]) {
      fileInputArray[index].nativeElement.click();
    } else {
      console.error('File input is undefined at index', index);
    }
  }

  onEdit2FileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    console.log(event.target.files);
    if (file) {
      this.newResourceFile = file;
      this.edit2UploadedFiles[index] = this.newResourceFile; // Store the file at the given index
      this.addResource(index, 'edit2');
    } else {
      console.error('No file selected');
    }
  }
  
  hiddenCards = Array(9).fill(false);
  onSubmitLesson() {
    // Flatten `editUploadedFiles` object to get all files in a single array
    console.log(this.editUploadedFiles);
    console.log(this.editUploadedImageFiles);
    console.log(this.editUploadedImages);
    const lessonResources: File[] = Object.values(this.editUploadedImageFiles)
      .flat() // Merge all file arrays into one
      .filter((file) => file !== null); // Remove any null values
  
    console.log(lessonResources);
  
    this.lessonService.uploadLesson(this.lessonName, lessonResources).subscribe(
      (response) => {
        this.onDismiss();
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
        
        console.log('Lesson saved successfully:', response);
      },
      (error) => {
        console.error('Error saving lesson:', error);
      }
    );
  }


  onDismiss(): void {
    this.dialogRef.close();
  }
}
