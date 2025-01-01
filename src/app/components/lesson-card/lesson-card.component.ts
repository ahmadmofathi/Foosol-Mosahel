import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.css'],
})
export class LessonCardComponent {
  lessons: any[] = [];
  subjects: any[] = [];
  subjectId: string = ''; 
  lessonForm: FormGroup;
  

  pageNumber = 1; // Current page
  itemsPerPage = 8; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  pages: number[] = []; // Array to hold the visible pages
  hasMoreData = true; // Flag to check if more data exists
  subjectName: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private lessonService: LessonService,
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private toastr: ToastrService,


  ) {

    this.lessonForm = this.fb.group({
      lessonName: ['', Validators.required],
      subjectId : [ Validators.required],
    });
  }

  lessonName: string = '';
  onSubmit() {
    // Filter out null files and create an array of only uploaded files
    const lessonResources = this.uploadedFiles
      .filter(file => file !== null)
      .map(file => file as File);

    // Call the service to upload the lesson
    this.lessonService.uploadLesson(this.lessonName, lessonResources).subscribe(
      (response) => {
        alert('لقد تم الاضافه');

        console.log('Lesson saved successfully:', response);
      },
      (error) => {
        console.error('Error saving lesson:', error);
      }
    );
  }
  

  ngOnInit() {
    this.loadLessons();
    this.getAllSubjects();
    this.loadSubjectName();
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    this.renderer.listen('document', 'click', () => {});
  }

  loadSubjectName(): void {
    const storedSubjectName = localStorage.getItem('subjectName');
    if (storedSubjectName) {
      this.subjectName = storedSubjectName; // Assign the value from localStorage
    } else {
      console.error('No subject name found in localStorage');
    }
  }

  loadLessons(): void {
    const CustomSubject = localStorage.getItem('selectedSubjectId');

  
    if (CustomSubject === null) {
      console.error('No subject selected');
      return; // Exit if no subject is selected
    }
  
    this.lessonService
      .getAllLessonsBySubjectId(CustomSubject, this.pageNumber, this.itemsPerPage)
      .subscribe(
        (data) => {
          this.lessons = data;
          console.log('Lessons loaded:', this.lessons);
        },
        (error) => {
          console.error('Error loading lessons', error);
        }
      );
  }
  

  getAllSubjects() {

    const pageNumber = 1; // Example page number
    const pageSize = 10;

    this.subjectService.getAllSub(pageNumber, pageSize).subscribe(
      (response) => {
        this.subjects = response; // Make sure response contains 'id' field
        console.log('Fetched elements:', this.subjects);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }


  cards = [
    { title: 'رفع الدرس PDF' },
    { title: 'رفع الصور' },
    { title: 'رفع فيديو' },
    { title: 'تجهيز التقويم' },
    { title: 'اوراق عمل' },
    { title: 'رفع بوربوينت' },
    { title: 'رفع اي ملف اضافي' },
    { title: 'رفع اي ملف اضافي' },
    { title: 'رفع اي ملف اضافي' }
  ];

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }

  // Uploaded files and images tracking
  uploadedFiles: (File | null)[] = Array(9).fill(null);
  uploadedImages: (string | null)[] = Array(9).fill(null);

  // Opens the file input dialog for the specific card
  openFileInput(cardIndex: number) {
    const fileInput = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[cardIndex];
    fileInput.click();
  }

  // Handles file attachment
  attachFile(event: Event, cardIndex: number) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        this.uploadedFiles[cardIndex] = file;
        this.uploadedImages[cardIndex] = URL.createObjectURL(file);
      } else {
        console.warn("Please upload an image file.");
      }
    }
  }

  // Removes the file and image from a specific card
  removeFile(cardIndex: number) {
    this.uploadedFiles[cardIndex] = null;
    this.uploadedImages[cardIndex] = null;
  }

  


  selectedItemId: number | null = null; // Store the ID of the item to delete
  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;

  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide(); // Close the modal
      Modal.getOrCreateInstance(modalElement)?.dispose(); // Dispose of modal instance
    }
  
    // Clean up Bootstrap modal styles
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  
  openAddModal() {
    // Reset the form fields to clear any previous data
    this.lessonForm.reset();
  
    // Set the flag to false since this is "Add" mode, not "Edit"
  
    // Re-enable the gradeId field (in case it was disabled in edit mode)
    this.lessonForm.get('gradeId')?.enable();
  
    // Open the modal using Bootstrap modal API
    const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Get or create instance
      modalInstance.show(); // Show the modal
    } else {
      console.error('Add modal element not found.');
    }
  }
  

//   onSubmitAdd() {
//     if (this.lessonForm.invalid) {
//       // Show error toastr
//       this.toastr.error('يرجى تعبئة جميع الحقول المطلوبة!', 'خطأ', { timeOut: 2000 });
//       return;
//     }

//     const formData = this.lessonForm.value;
//     this.lessonService.addLesson(formData.subjectId, formData).subscribe(
//       (response: string) => {
//         console.log('Response:', response);  // Log the plain text response
//         if (response.includes("Lesson added successfully")) {
//           this.toastr.success('تم إضافة الدرس بنجاح', 'نجاح', { timeOut: 2000 });

//        // Close the modal using Bootstrap's modal method
//        const modalElement = this.el.nativeElement.querySelector('#addModal');
//        const modalInstance = new window.bootstrap.Modal(modalElement);
       
//        // Close modal
//        modalInstance.hide();  

//        // Optionally remove backdrop manually
//        const backdrop = document.querySelector('.modal-backdrop');
//        if (backdrop) {
//          backdrop.remove();
//        }
// // This closes the modal

//           // Refresh or perform any additional actions
//           this.getAllSubjects();
//           this.closeModalById('addModal');
//         } else {
//           this.toastr.error('حدث خطأ، الرجاء المحاولة مرة أخرى.', 'خطأ', { timeOut: 2000 });
//         }
//       },
//       (error) => {
//         console.error('Error:', error);
//         this.toastr.error('حدث خطأ، الرجاء المحاولة مرة أخرى.', 'خطأ', { timeOut: 3000 });
//       }
//     );
//   }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    if (error.status === 200 && error.error && typeof error.error === 'string') {
      // If the error contains a message, display it in the toastr
      this.toastr.error(error.error, 'خطأ', { timeOut: 3000 });
    } else {
      // Generic error message if the server is unreachable or returns an unexpected response
      this.toastr.error('حدث خطأ، الرجاء المحاولة مرة أخرى.', 'خطأ', { timeOut: 3000 });
    }
  }
  


  

  addContractActive: boolean = false; // Default the "إنشاء عقد جديد" button to active
  exportPdfActive: boolean = false; // Default the "تصدير PDF" button to inactive
  addDegreeActive: boolean = false;

  isDateShow: boolean = false;

  // Toggle the "إنشاء عقد جديد" button active/inactive state
  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false; // Make "تصدير PDF" inactive
    this.addDegreeActive = false;
    this.isDateShow = true;
  }

  // Toggle the "تصدير PDF" button active/inactive state
  toggleExportPdf() {
    this.exportPdfActive = true;
    this.addContractActive = false; // Make "إنشاء عقد جديد" inactive
    this.addDegreeActive = false;
    this.isDateShow = false;
  }

  toggleDegree() {
    this.exportPdfActive = false;
    this.addContractActive = false; // Make "إنشاء عقد جديد" inactive
    this.addDegreeActive = true;
    this.isDateShow = false;
  }

  // Toggle dropdown visibility
  toggleExportDropdown() {
    this.exportPdfActive = !this.exportPdfActive;
  }

  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;

  openNav() {
    this.isNavbarOpen = !this.isNavbarOpen;
    this.showIcone();
  }

  showIcone() {
    this.isIconShow = true;
  }

  openSetting() {
    this.isSettingBarOpen = !this.isSettingBarOpen;
  }

  selectedGrade: any = null;


  onSelectFocus() {
    // This function is triggered when the select element is focused
    if (this.selectedGrade === null) {
      // Ensure the placeholder is shown when the select is focused and empty
      this.selectedGrade = null;
    }
  }

  onSelectBlur() {
    // This function is triggered when the select element loses focus
    if (!this.selectedGrade) {
      // Keep the placeholder visible if no grade is selected
      this.selectedGrade = null;
    }
  }
}
