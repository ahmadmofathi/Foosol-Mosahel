import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LevelService } from 'src/app/services/level/level.service';
import { SubjectService } from 'src/app/services/subject/subject.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
})
export class LessonComponent {
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private levelService: LevelService
  ) {}

  public Editor = ClassicEditor;
  public editorConfig = {
    placeholder: 'قم بكتابة الرد في هذا الجزء',
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
  };

  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;

  elements: any[] = [];
  grades: any[] = [];
  levels: any[] = [];
  subjects: any[] = [];
  gradeById: any[] = [];
  visibleSubjects: any[] = []; // Subjects to display
  visibleGrades: any[] = []; // Grades to display
  subjectStartIndex = 0; // Index for subjects slider
  gradeStartIndex = 0; // Index for grades slider

  pageNumber = 1; // Current page
  itemsPerPage = 8; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  pages: number[] = []; // Array to hold the visible pages
  hasMoreData = true; // Flag to check if more data exists
  errorMessage: string = '';

  selectedLevelId: string | null = null;
  selectedGradeId: string | null = null;
  selectedSubjectId: string | null = null;
  selectedSubjectName: string | null = null;

  ngOnInit() {
    // this.getAllSubjects();
    // this.getAllgrades();
    this.getAllLevels();
    // this.getGradesByLevelId()
  }

  getAllSubjects() {
    this.subjectService.getAllSub(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.elements = response; // Make sure response contains 'id' field
        this.updateVisibleSubjects();

        console.log('Fetched elements:', this.elements);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  getAllgrades() {
    const pageNumber = 1; // Example page number
    const pageSize = 10; // Example page size

    this.gradeService.getAllClasses(pageNumber, pageSize).subscribe(
      (response) => {
        this.grades = response; // Ensure the response contains the required fields
        this.updateVisibleGrades();
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
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

  // Save the subject ID when clicked
  onSubjectClick(subjectId: string, subjectName: string) {
    this.selectedSubjectId = subjectId;
    this.selectedSubjectName = subjectName;
    localStorage.setItem('selectedSubjectId', subjectId); // Save to localStorage
    localStorage.setItem('subjectName', subjectName);
    console.log('Selected Subject ID:', this.selectedSubjectId);
    console.log('Selected Subject Name:', this.selectedSubjectName);
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

  handleError(error: any, message: string): void {
    console.error(message, error);
    this.errorMessage = `${message}: ${error.message}`;
  }

  getAllLevels() {
    this.levelService.getAllLevels().subscribe(
      (response) => {
        this.levels = response; // Assign the fetched Regions
        console.log('levels:', this.elements);
      },
      (error) => {
        console.error('Error fetching level section:', error);
      }
    );
  }

  selectLevel(levelId: string): void {
    if (this.selectedLevelId === levelId) {
      // Deselect if the same level is clicked
      this.selectedLevelId = null;
    } else {
      // Select the clicked level
      this.selectedLevelId = levelId;
    }

    console.log('Selected Level ID:', this.selectedLevelId);
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

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }

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

  questions = [
    { title: '', answer: '', showAnswer: false },
    { title: '', answer: '', showAnswer: false },
  ];

  toggleAnswer(index: number) {
    this.questions[index].showAnswer = !this.questions[index].showAnswer;
  }

  addNewQuestion() {
    this.questions.push({
      title: `سؤال ${this.questions.length + 1}`,
      answer: '',
      showAnswer: false,
    });
  }

  saveQuestions() {
    console.log('Questions saved:', this.questions);
    alert('تم حفظ المعلومات بنجاح');
  }

  toggleStyle(event: any, levelId: string): void {
    // Reset styles for all level elements
    const allLevelElements = document.querySelectorAll('.custom-box');
    allLevelElements.forEach((element) => {
      const divElement = element as HTMLElement;
      divElement.style.backgroundColor = '#D9D9D9';
      divElement.style.color = '#001A72';
    });

    // Apply the active style to the clicked level
    const divElement = event.target.closest('.custom-box');
    divElement.style.backgroundColor = '#001A72';
    divElement.style.color = '#D9D9D9';

    // Update selected level and fetch grades
    this.selectedLevelId = levelId;
    this.getGradesByLevelId(levelId);
  }

  toggleStyleGeneric(event: any, itemId: string, type: string): void {
    // Reset styles for all items of the same type
    const allElements = document.querySelectorAll(`.${type}-box`);
    allElements.forEach((element) => {
      const divElement = element as HTMLElement;
      divElement.style.backgroundColor = '#D9D9D9';
      divElement.style.color = '#001A72';
    });

    // Apply the active style to the clicked item
    const divElement = event.target.closest(`.${type}-box`);
    divElement.style.backgroundColor = '#001A72';
    divElement.style.color = '#D9D9D9';

    // Perform specific actions based on type
    if (type === 'level') {
      this.selectedLevelId = itemId;
      this.getGradesByLevelId(itemId); // Fetch grades based on level
    } else if (type === 'grade') {
      this.selectedGradeId = itemId;
      this.getSubjectByGradeId(itemId); // Fetch subjects based on grade
    } else if (type === 'subject') {
      this.selectedSubjectId = itemId;
      console.log('Selected Subject:', itemId); // Add any subject-specific logic here
    }
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
    { title: 'رفع اي ملف اضافي' },
  ];

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  // hideCard(cardIndex: number) {
  //   this.hiddenCards[cardIndex] = true;
  // }

  // Uploaded files and images tracking
  uploadedFiles: (File | null)[] = Array(9).fill(null);
  uploadedImages: (string | null)[] = Array(9).fill(null);

  // Opens the file input dialog for the specific card
  openFileInput(cardIndex: number) {
    const fileInput =
      document.querySelectorAll<HTMLInputElement>('input[type="file"]')[
        cardIndex
      ];
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
        console.warn('Please upload an image file.');
      }
    }
  }

  // Removes the file and image from a specific card
  removeFile(cardIndex: number) {
    this.uploadedFiles[cardIndex] = null;
    this.uploadedImages[cardIndex] = null;
  }
}
