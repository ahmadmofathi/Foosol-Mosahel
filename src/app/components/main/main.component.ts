import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { SupscriptionService } from 'src/app/services/supscription/supscription.service';
import { Modal } from 'bootstrap';
import { WhiteboardService } from 'src/app/services/whiteboard/whiteboard.service';
import { environment } from 'src/environments/environment.development';
declare var bootstrap: any;

export interface LessonResource {
  id: string;
  resource: string;
  resourceType: string;
  fileName: string;
  isTeacherSet: boolean;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  @ViewChildren('editFileInput') editFileInputs!: QueryList<ElementRef>;
  @ViewChildren('edit2FileInput') edit2FileInputs!: QueryList<ElementRef>;

  // For Edit modal
  uploadedFilesEdit: File[] = [];
  uploadedImagesEdit: string[] = [];
  hiddenCardsEdit: boolean[] = [];

  // For Edit2 modal
  uploadedFilesEdit2: File[] = [];
  uploadedImagesEdit2: string[] = [];
  hiddenCardsEdit2: boolean[] = [];

  // cards = Array(9).fill({});
  hiddenCards = Array(9).fill(false);
  uploadedFiles: any[] = Array(9).fill(null);
  // uploadedFiles: (File | null)[] = Array(9).fill(null);
  uploadedImages: (string | null)[] = Array(9).fill(null);
  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;
  elements: any[] = [];
  grades: any[] = [];
  lessons: any[] = [];
  selectedSubjectId = '';
  selectedGradeId = '';
  visibleSubjects: any[] = []; // Subjects to display
  visibleGrades: any[] = []; // Grades to display
  visibleLessons: any[] = [];
  visibleClasses: any[] = [];
  subjectStartIndex = 0; // Index for subjects slider
  gradeStartIndex = 0; // Index for grades slider
  lessonStartIndex = 0;
  classStartIndex = 0;

  pageNumber = 1; // Current page
  itemsPerPage = 100; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  pages: number[] = []; // Array to hold the visible pages
  hasMoreData = true; // Flag to check if more data exists

  // lessonName: string = '';
  selectedFiles: File[] = [];
  classes: any[] = [];
  errorMessage: string = '';
  activeLessonId: string | null = null;
  activeClassId: string | null = null;

  lessonTitle: string = '';
  lessonFiles: File[] = [];
  selectedSubjectID: string = '';

  lessonForm: FormGroup;

  // Separate state for Edit modal
  // editUploadedFiles: (File | null)[] = Array(9).fill(null);
  // editUploadedImages: (string | null)[] = Array(9).fill(null);

  // Separate state for Edit2 modal
  edit2UploadedFiles: (File | null)[] = Array(9).fill(null);
  edit2UploadedImages: (string | null)[] = Array(9).fill(null);

  menuItems = [
    { icon: '../../../assets/images/student.svg', label: 'الطلاب' },
    { icon: '../../../assets/images/schedule.svg', label: 'الجدول' },
    { icon: '../../../assets/images/exam.svg', label: 'الاختبارات' },
    // Add more items as needed
  ];

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

  // uploadedFiles: File[] = []; // Stores uploaded files
  // uploadedImages: string[] = []; // Stores preview images

  currentIcons = {
    bell: '../../../assets/images/bell.svg',
    settings: '../../../assets/images/settings.svg',
    home: '../../../assets/images/home.svg',
  };


  // Track hover state
  isHovered = {
    bell: false,
    settings: false,
    home: false,
  };

  changeIcon(iconType: string, hover: boolean) {
    switch (iconType) {
      case 'bell':
        this.currentIcons.bell = hover
          ? '../../../assets/images/bellblue.png'
          : '../../../assets/images/bell.svg';
        this.isHovered.bell = hover;
        break;
      case 'settings':
        this.currentIcons.settings = hover
          ? '../../../assets/images/settingsBlue.png'
          : '../../../assets/images/settings.svg';
        this.isHovered.settings = hover;
        break;
      case 'home':
        this.currentIcons.home = hover
          ? '../../../assets/images/home-1.png'
          : '../../../assets/images/home.svg';
        this.isHovered.home = hover;
        break;
    }
  }

  constructor(
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef,
    private classService: ClassesService,
    private whiteboardService:WhiteboardService,
    private fb: FormBuilder,
    private supscriptionService: SupscriptionService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // this.lessonForm = this.fb.group({
    //   lessonName: ['', Validators.required], // Lesson name is required
    //   fileName: [null], // Optional field for files
    // });

    this.lessonForm = this.fb.group({
      lessonName: ['', Validators.required],
      subjectId: [Validators.required],
    });
  }

  lessonName: string = '';

  onSubmitLesson() {
    // Flatten `editUploadedFiles` object to get all files in a single array
    const lessonResources: File[] = Object.values(this.editUploadedFiles)
      .flat() // Merge all file arrays into one
      .filter((file) => file !== null); // Remove any null values
  
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
  
        // Close the modal
        this.closeModalById('Edit');
  
        // Refresh lessons
        this.getAllLessons();
  
        console.log('Lesson saved successfully:', response);
      },
      (error) => {
        console.error('Error saving lesson:', error);
      }
    );
  }
  

  openEditModal() {
    this.lessonForm.reset(); // Reset the form
    this.lessonName = ''; // Reset lesson name
    this.uploadedFiles = []; // Clear any previous uploaded files
    this.uploadedImages = []; // Clear any previous uploaded images
    this.hiddenCards = []; // Reset hidden cards
  }
  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide(); // Close the modal
    }

    // Clean up Bootstrap modal styles and backdrops
    document
      .querySelectorAll('.modal-backdrop')
      .forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }

  // lessonData = { LessonName: '' };

  //   onSubmitLesson(){
  //   this.lessonService.createLesson(this.lessonForm.value).subscribe({
  //     next: (response) => {
  //       console.log('Lesson created successfully:', response);
  //       console.log('Sending lessonData:', this.lessonForm);
  //     },
  //     error: (error) => {
  //       console.error('Error creating lesson:', error);
  //     },
  //   });
  // }

  ngOnInit() {
    // this.getAllSubjects();
    this.getAllgrades();
    this.getAllLessons();
    this.checkSelectionStatus();
    this.fetchLessonResources();
    // this.loadClasses();

    //   const storedSubjectId = localStorage.getItem('selectedSubjectId'); // Retrieve Subject ID
    // if (storedSubjectId) {
    //   this.selectedSubjectId = storedSubjectId; // Set the Subject ID
    //   this.getAllLessons(); // Fetch lessons
    // }
  }

  getAllSubjects() {
    this.subjectService.getAllSub(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.elements = response;
        this.updateVisibleSubjects();
        console.log('Fetched elements:', this.elements);
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  selectedLessonName: string | null = null;
  selectedClassId: string | null = null;
  selectedClassName: string | null = null;

  onLessonClick(lessonId: string): void {
    this.selectedLessonName = lessonId;
    this.selectedLessonId = lessonId;
    this.fetchLessonResources();
    localStorage.setItem('selectedLessonId', lessonId);
    this.updateVisibleLessons();
    console.log('Selected Lesson Id:', lessonId);
  }

  LessonNameView: string | null = null;

  saveLessonName(LessonNameView: string): void {
    console.log('Selected Lesson Name:', LessonNameView);
    localStorage.setItem('LessonName', LessonNameView);
    this.getLessonName();
  }

  getLessonName(): void {
    this.LessonNameView = localStorage.getItem('LessonName');
  }

  onClassClick(classId: string, className: string): void {
    this.selectedClassId = classId;
    localStorage.setItem('selectedClassId', classId);
    localStorage.setItem('selectedClassName', className); // Save className to localStorage
    console.log(
      'Selected Class Id:',
      classId,
      'Selected Class Name:',
      className
    );
  }

  getSubjectByGradeId(gradeId: string): void {
    const pageNumber = 1;
    const itemsPerPage = 100;

    this.subjectService
      .getSubjectsByGradeId(gradeId, pageNumber, itemsPerPage)
      .subscribe({
        next: (response) => {
          this.elements = response;
          console.log('selected subject', this.elements);
          this.updateVisibleSubjects();
        },
        error: (error) => {
          this.handleError(error, 'Error fetching grades by level');
        },
      });
  }

  handleError(error: any, message: string): void {
    console.error(message, error);
    this.errorMessage = `${message}: ${error.message}`;
  }

  getAllgrades() {
    const pageNumber = 1; // Example page number
    const pageSize = 100; // Example page size

    this.gradeService.getAllClasses(pageNumber, pageSize).subscribe(
      (response) => {
        this.grades = response; // Ensure the response contains the required fields
        this.updateVisibleGrades();
        console.log('this is all grades', this.grades);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  // gradeId: string = '1db022f2-6e6b-4be7-aa3a-5c17ef074bad';

  loadClasses(): void {
    // Dynamically fetch classes based on selected grade ID
    const gradeId = this.selectedGradeId; // Make sure this.selectedGradeId is set correctly
    this.classService.getClassesByGradeId(gradeId).subscribe(
      (data) => {
        this.classes = data;
        this.updateVisibleClasses();
        console.log('Fetched Classes:', this.classes);
      },
      (error) => {
        console.error('Error fetching classes', error);
      }
    );
  }
  onGradeClick(grade: any) {
    console.log('Grade object:', grade); // This should now show the entire object
    const gradeId = grade.id; // Extract grade ID
    const levelId = grade.levelId; // Extract level ID
    const gradeName = grade.gradeName;

    console.log('Selected Grade ID:', gradeId);
    console.log('Selected Level ID:', levelId);
    console.log('Selected Grade Name', gradeName);

    // Save in localStorage
    localStorage.setItem('selectedGradeId', gradeId || '');
    localStorage.setItem('selectedLevelId', levelId || '');
    localStorage.setItem('selectedGradeName', gradeName || '');

    this.selectedGradeId = gradeId;
    this.loadClasses(); // Fetch related data
  }

  allValuesSelected = false;

  checkSelectionStatus() {
    // Check if all required IDs are in localStorage
    const selectedLevelId = localStorage.getItem('selectedLevelId');
    const selectedGradeId = localStorage.getItem('selectedGradeId');
    const selectedSubjectId = localStorage.getItem('selectedSubjectId');

    this.allValuesSelected = !!(
      selectedLevelId &&
      selectedGradeId &&
      selectedSubjectId
    );
  }

  submitSelection() {
    // Ensure all required values are present
    this.checkSelectionStatus();
    if (!this.allValuesSelected) {
      console.error('One or more selections are missing.');
      alert('Please select Level, Grade, and Subject before proceeding.');
      this.toastr.error('يرجى التاكد من اختيار كلا من  الماده والصف !', 'خطأ', {
        timeOut: 2000, // Display for 2 seconds
      });
      return;
    }

    // Proceed with the submission logic
    const payload = {
      levelIds: [localStorage.getItem('selectedLevelId')],
      gradeIds: [localStorage.getItem('selectedGradeId')],
      subjectIds: [localStorage.getItem('selectedSubjectId')]
    };
    console.log(payload)
    
    // this.supscriptionService.addSelection(payload).subscribe(
    //   (response) => {
    //     console.log('Selection added successfully:', response);
    //     // Navigate to the teacher dashboard after submission
    //     this.router.navigate(['/teacherDash']);
    //   },
    //   (error) => {
    //     console.error('Error adding selection:', error);
    //     alert('Failed to submit selection. Please try again.');
    //   }
    // );
    this.whiteboardService.createLecture(this.selectedClassId!, this.selectedLessonId!            ).subscribe(
      (response) => {
        console.log('Selection added successfully:', response);
        // Navigate to the teacher dashboard after submission
        this.router.navigate(['/teacherDash']);
      },
      (error) => {
        console.error('Error adding selection:', error);
        alert('Failed to submit selection. Please try again.');
      }
    );
  }

  getAllLessons() {
    if (this.selectedSubjectId) {
      this.lessonService
        .getAllLessonsBySubjectId(
          this.selectedSubjectId,
          this.pageNumber,
          this.itemsPerPage
        )
        .subscribe(
          (response) => {
            console.log('API Response:', response); // Check the actual response here
            this.lessons = response;
            this.updateVisibleLessons();
          },
          (error) => {
            console.error('Error fetching lessons:', error);
          }
        );
    }
  }

  lessonResources: any;

  fetchLessonResources(): void {
    if(!this.selectedLessonId){
      this.lessonService.getLessonResources().subscribe({
        next: (response) => {
          this.lessonResources = response;
          // Ensure the lessonResources array has 9 elements, filling gaps with empty objects
          while (this.lessonResources.length < 9) {
            this.lessonResources.push({
              id: '',
              resource: '',
              resourceType: '',
              fileName: '',
              isTeacherSet: false,
            });
          }
          console.log('Lesson resources:', this.lessonResources);
        },
        error: (error) => {
          console.error('Error fetching lesson resources:', error);
        },
      });
    }
    else{
      this.lessonService.getSelectedLessonResources(this.selectedLessonId).subscribe({
        next: (response) => {
          this.lessonResources = response;
          console.log(this.lessonResources)
        },
        error: (error) =>{
          console.error('Error fetching lesson resources:', error);
        }
      })
    }
  }

  // Handle file and image display based on resource type
  getFileTypeIcon(resourceType: string): string {
    if (resourceType.includes('image')) {
      return 'fa-file-image';
    } else if (resourceType.includes('pdf')) {
      return 'fa-file-pdf';
    } else {
      return 'fa-file';
    }
  }

  selectedResourceId: string | null = null;

  selectResource(resourceId: string): void {
    this.selectedResourceId = resourceId;
    console.log('Selected Resource ID:', resourceId);
  }

  deleteResource(resourceId: string): void {
    this.lessonService.deleteResource(resourceId).subscribe({
      next: (response) => {
        try {
          console.log('Resource deleted successfully:', response.body);
          this.toastr.success('لقد تم حذف الملف بنجاح !', 'نجاح', {
            timeOut: 2000,
          });

          this.closeModalById('Edit2');
        } catch (e) {
          console.log('Resource deleted successfully:', response);
          this.toastr.error(
            'لقد حدث خطأ اثناء حذف الملف ربما ليس من صلحياتك حذفه !',
            'خطأ',
            {
              timeOut: 3000,
            }
          );
        }
        this.lessonResources = this.lessonResources.filter(
          (resource: LessonResource) => resource.id !== resourceId
        );
        // Ensure the lessonResources array has 9 elements, filling gaps with empty objects
        while (this.lessonResources.length < 9) {
          this.lessonResources.push({
            id: '',
            resource: '',
            resourceType: '',
            fileName: '',
            isTeacherSet: false,
          });
        }
      },
      error: (error) => {
        console.error('Error deleting resource:', error);
      },
    });
  }

  newResourceFile: File | null = null; // Initialize as null

  addResource(index: number, modal: 'edit' | 'edit2'): void {
    if (this.newResourceFile) {
      const formData = new FormData();
      formData.append('Resource', this.newResourceFile); // Ensure "Resource" field is included

      this.lessonService.addTeacherResource(formData).subscribe({
        next: (response) => {
          console.log('Resource added successfully:', response);
          this.toastr.success('لقد تم اضافه المرفق بنجاح !', 'نجاح', {
            timeOut: 2000,
          });
          this.closeModalById('Edit2');
          this.fetchLessonResources(); // Refresh the resource list

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
        },
        error: (error) => {
          console.error('Error adding resource:', error);
        },
      });
    } else {
      console.error('No file selected');
    }
  }

  getResourcePath(resource: string): string {
    const baseUrl = environment.apiUrl; // Replace with your actual base URL
    return `${baseUrl}${resource.replace(/\\/g, '/')}`;
  }

  // onFileSelected(event: any): void {
  //   // this.selectedFiles = Array.from(event.target.files);
  //   this.newResourceFile = event.target.files[0];
  //   this.addResource();
  // }

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  openEditFileInput(index: number): void {
    const fileInput = this.fileInputs.toArray()[index]?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  selectedIndex: number | null = null; // Track selected index

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

  openEdit2FileInput(index: number): void {
    this.cdr.detectChanges(); // Ensure QueryList is updated
    const fileInputArray = this.edit2FileInputs.toArray();
    if (fileInputArray[index]) {
      fileInputArray[index].nativeElement.click();
    } else {
      console.error('File input is undefined at index', index);
    }
  }

  // onFileSelected(event: any, index: number): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.newResourceFile = file;
  //     this.uploadedFiles[index] = this.newResourceFile; // Store the file at the given index
  //     this.addResource(index);
  //   } else {
  //     console.error('No file selected');
  //   }
  // }
  editUploadedFiles: { [key: number]: File[] } = {}; // Store only non-image files
editUploadedImages: { [key: number]: string[] } = {}; // Store image previews
editUploadedImageFiles: { [key: number]: File[] } = {}; // Store image files for proper removal

onEditFileSelected(event: any, index: number): void {
  const files: FileList = event.target.files;
  if (!files || files.length === 0) {
    console.error('No files selected');
    return;
  }

  if (!this.editUploadedFiles[index]) {
    this.editUploadedFiles[index] = [];
    this.editUploadedImages[index] = [];
    this.editUploadedImageFiles[index] = [];
  }

  // Convert FileList to an array and process each file
  Array.from(files).forEach((file: File) => {
    if (file.type.startsWith('image')) {
      // Store image file separately for removal
      this.editUploadedImageFiles[index].push(file);

      // Generate image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editUploadedImages[index].push(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Store only non-image files
      this.editUploadedFiles[index].push(file);
    }
  });

  this.addResource(index, 'edit'); // Process files
}

// Remove both the image preview and its corresponding file
// removeFile(cardIndex: number, fileIndex: number): void {
//   if (this.editUploadedFiles[cardIndex]?.[fileIndex]) {
//     this.editUploadedFiles[cardIndex].splice(fileIndex, 1);
//   }
//   if (this.editUploadedImages[cardIndex]?.[fileIndex]) {
//     this.editUploadedImages[cardIndex].splice(fileIndex, 1);
//     this.editUploadedImageFiles[cardIndex].splice(fileIndex, 1);
//   }
// }
  
  
  
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

  // openEditFileInput(index: number): void {
  //   const fileInputArray = this.editFileInputs.toArray();
  //   if (fileInputArray[index]) {
  //     fileInputArray[index].nativeElement.click();
  //   } else {
  //     console.error('File input is undefined at index', index);
  //   }
  // }

  // onEdit2FileSelected(event: any, index: number): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.newResourceFile = file;
  //     this.uploadedFiles[index] = this.newResourceFile; // Store the file at the given index
  //     this.addResource(index);
  //   } else {
  //     console.error('No file selected');
  //   }
  // }

  checkLessonId(): void {
    if (!this.selectedLessonId) {
      this.toastr.error('!لابد من اختيار الدرس اولا', 'خطأ', {
        timeOut: 2000,
      });
    } else {
      // Get the modal element by its ID
      const modalElement = document.getElementById('Edit2');
      if (modalElement) {
        // Create a new instance of the modal and show it
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      }
    }
  }
  addLesson(): void {
    // if (this.lessonForm.invalid) {
    //   console.error('Form is invalid. Please provide valid data.');
    //   return;
    // }

    const subjectId = localStorage.getItem('selectedSubjectId');
    if (!subjectId) {
      console.error('No Subject ID found in localStorage.');
      return;
    }

    const formData = new FormData();
    formData.append('lessonName', this.lessonForm.get('lessonName')?.value);

    const files = this.lessonForm.get('fileName')?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`files[${i}]`, files[i]);
      }
    }

    this.lessonService.addLesson(subjectId, formData).subscribe(
      (response) => {
        console.log('Lesson added successfully:', response);
      },
      (error) => {
        console.error('Error adding lesson:', error);
        alert('Failed to add lesson. Please try again.');
      }
    );
  }

  onSubjectClick(subjectId: string) {
    this.selectedSubjectId = subjectId;
    console.log('Selected Subject ID:', this.selectedSubjectId);
    localStorage.setItem('selectedSubjectId', subjectId);

    this.getAllLessons();
  }

  saveGradeId(gradeId: string) {
    localStorage.setItem('selectedGradeId', gradeId); // Save the grade ID to local storage
    console.log('Grade ID saved:', gradeId); // Optionally log the ID to the console for debugging
  }

  updateVisibleSubjects() {
    this.visibleSubjects = this.elements.slice(
      this.subjectStartIndex,
      this.subjectStartIndex + 3
    );
  }

  updateVisibleGrades() {
    this.visibleGrades = this.grades.slice(
      this.gradeStartIndex,
      this.gradeStartIndex + 3
    );
  }

  updateVisibleLessons() {
    this.visibleLessons = this.lessons.slice(
      this.lessonStartIndex,
      this.lessonStartIndex + 3
    );
  }

  updateVisibleClasses() {
    this.visibleClasses = this.classes.slice(
      this.classStartIndex,
      this.classStartIndex + 3
    );
  }

  nextItems() {
    if (this.subjectStartIndex + 3 < this.elements.length) {
      this.subjectStartIndex += 3;
      this.updateVisibleSubjects();
    }
  }

  nextItemsGrade() {
    if (this.gradeStartIndex + 3 < this.grades.length) {
      this.gradeStartIndex += 3;
      this.updateVisibleGrades();
    }
  }

  nextItemsLesson() {
    if (this.lessonStartIndex + 3 < this.lessons.length) {
      this.lessonStartIndex += 3;
      this.updateVisibleLessons();
    }
  }

  nextItemsClasses() {
    if (this.classStartIndex + 3 < this.classes.length) {
      this.classStartIndex += 3;
      this.updateVisibleClasses();
    }
  }

  prevItems() {
    if (this.subjectStartIndex > 0) {
      this.subjectStartIndex -= 3;
      this.updateVisibleSubjects();
    }
  }

  nextItemsGrades() {
    if (this.gradeStartIndex + 3 < this.grades.length) {
      this.gradeStartIndex += 3;
      this.updateVisibleGrades();
    }
  }

  prevItemsGrades() {
    if (this.gradeStartIndex > 0) {
      this.gradeStartIndex -= 3;
      this.updateVisibleGrades();
    }
  }

  prevItemLessons() {
    if (this.lessonStartIndex > 0) {
      this.lessonStartIndex -= 3;
      this.updateVisibleLessons();
    }
  }

  preItemClasses() {
    if (this.classStartIndex > 0) {
      this.classStartIndex -= 3;
      this.updateVisibleClasses();
    }
  }

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }

  // Opens the file input dialog for the specific card
  // openFileInput(cardIndex: number) {
  //   const fileInput =
  //     document.querySelectorAll<HTMLInputElement>('input[type="file"]')[
  //       cardIndex
  //     ];
  //   fileInput.click();
  // }

  // openFileInput(index: number): void {
  //   const fileInputArray = this.fileInputs.toArray();
  //   if (fileInputArray[index]) {
  //     fileInputArray[index].nativeElement.click();
  //   } else {
  //     console.error('File input is undefined at index', index);
  //   }
  // }

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
        console.warn('Please upload an image file.');
      }
    }
  }

  // onSubmit() {
  //   // const lessonResources = this.editUploadedFiles
  //   //   .filter((file) => file !== null)
  //   //   .map((file) => file as File);
  //   const lessonResources = this.editUploadedFiles;
  //   console.log(lessonResources);

  //   this.lessonService.uploadLesson(this.lessonName, lessonResources).subscribe(
  //     (response) => {
  //       alert('لقد تم الاضافه');
  //       console.log('Lesson saved successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error saving lesson:', error);
  //     }
  //   );
  // }

  // removeFile(cardIndex: number) {
  //   this.uploadedFiles[cardIndex] = null;
  //   this.uploadedImages[cardIndex] = null;
  // }

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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menu Open State:', this.menuOpen); // Debugging
  }

  toggleStyle(event: any) {
    const divElement = event.target.closest('.custom-box');
    // Toggle styles
    if (divElement.style.backgroundColor === 'rgb(0, 26, 114)') {
      // if it's already the '001A72'
      divElement.style.backgroundColor = 'white';
      divElement.style.color = '#001A72';
    } else {
      divElement.style.backgroundColor = '#001A72';
      divElement.style.color = 'white';
    }
  }

  selectedLevelId: string | null = null;
  // selectedGradeId:string | null =null ;
  // selectedSubjectId :string |null =null;
  selectedSubjectName: string | null = null;
  selectedLessonId: string | null = null;

  toggleStyleGeneric(event: any, itemId: string, type: string): void {
    // Reset styles for all items of the same type
    const allElements = document.querySelectorAll(`.${type}-box`);
    allElements.forEach((element) => {
      const divElement = element as HTMLElement;
      divElement.style.backgroundColor = '#ffff';
      divElement.style.color = '#001A72';
    });

    // Apply the active style to the clicked item
    const divElement = event.target.closest(`.${type}-box`);
    divElement.style.backgroundColor = '#001A72';
    divElement.style.color = '#ffff';

    // Perform specific actions based on type
    if (type === 'lesson') {
      this.lessonName = itemId;
      this.onLessonClick(itemId); // Fetch grades based on level
    } else if (type === 'grade') {
      this.selectedGradeId = itemId;
      this.getSubjectByGradeId(itemId); // Fetch subjects based on grade
    } else if (type === 'subject') {
      this.selectedSubjectId = itemId;
      console.log('Selected Subject:', itemId); // Add any subject-specific logic here
    }
  }

  getGradesByLevelId(levelId: string): void {
    const pageNumber = 1;
    const itemsPerPage = 100;

    this.gradeService
      .getGradesByLevelId(levelId, pageNumber, itemsPerPage)
      .subscribe({
        next: (response) => {
          this.grades = response;
          this.updateVisibleGrades();
        },
        error: (error) => {
          this.handleError(error, 'Error fetching grades by level');
        },
      });
  }
}
