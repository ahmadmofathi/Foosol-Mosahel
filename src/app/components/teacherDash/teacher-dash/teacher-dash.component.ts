import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/services/students/students.service';
import { WhiteboardService } from 'src/app/services/whiteboard/whiteboard.service';
import { LessonDataService } from './../lesson-data.service';
import { environment } from 'src/environments/environment.development';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LessonService } from 'src/app/services/lesson/lesson.service';
import { SupscriptionService } from 'src/app/services/supscription/supscription.service';
import { Router } from '@angular/router';
import { LessonResource } from '../../main/main.component';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { AddLessonComponent } from '../../add-lesson/add-lesson.component';
import { MatDialog } from '@angular/material/dialog';
import { EditLessonComponent } from '../../edit-lesson/edit-lesson.component';
import { count, timeout } from 'rxjs';
@Component({
  selector: 'app-teacher-dash',
  templateUrl: './teacher-dash.component.html',
  styleUrls: ['./teacher-dash.component.css'],
})
export class TeacherDashComponent implements AfterViewInit {
  isStudentListVisible = false;
  isH2Visible: boolean = true;
  isH3Visible: boolean = true;
  isClockVisible: boolean = true;
  isTimerVisible: boolean = true;
  isDateVisible: boolean = true;
  isProgressVisible: boolean = true;
  isStudentPhotoVisible: boolean = true;
  isTeacherPhotoVisible: boolean = true;

  remainingMinutes: number = 0;
  remainingTime: string | null = null; // Countdown timer

  remainingSeconds: number = 0;
  remainingTimeSec: number = 0;
  remainingTime2: string | null = null;

  time: string = '';

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

  constructor(
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private supscriptionService: SupscriptionService,
    private router: Router,
    private lectureService: WhiteboardService,
    private toastr: ToastrService,
    private studentService: StudentsService,
    private lessonDataService: LessonDataService,
    private whiteboardService: WhiteboardService,
    private classService:ClassesService,
  ) {
        this.lessonForm = this.fb.group({
          lessonName: ['', Validators.required],
          subjectId: [Validators.required],
        });
  }

  saveStudentId(studentId: string) {
    console.log('Selected student ID:', studentId);
    localStorage.setItem('StudentSelectedId', studentId);
    console.log(this.studentData)
    this.selectedStudent = this.studentData.find(s=>s.studentId==studentId);
    console.log(this.selectedStudent)
    // Save the student ID as needed
    // For example, save it in a variable or send it to a service
  }

  boards: { id: number; state: string }[] = [
    { id: 1, state: '' }, // Default board with ID 1
  ];

  activeBoard: number = 1;

  initializeCanvas() {
    const canvasEl = this.canvasRef.nativeElement;
    this.ctx = canvasEl.getContext('2d')!;
  }

  saveBoardState() {
    const currentBoard = this.boards.find(
      (board) => board.id === this.activeBoard
    );
    if (currentBoard) {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (canvas) {
        currentBoard.state = canvas.toDataURL(); // Save the canvas content as data URL
      }
    }
  }

  // Load the selected board's state
  loadBoardState(boardId: number) {
    const selectedBoard = this.boards.find((board) => board.id === boardId);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (selectedBoard && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      if (selectedBoard.state) {
        const img = new Image();
        img.src = selectedBoard.state;
        img.onload = () => ctx.drawImage(img, 0, 0);
      }
    }
  }

  // Switch between boards
  switchBoard(boardId: number) {
    if (this.activeBoard !== boardId) {
      this.saveBoardState(); // Save the current board's state
      this.activeBoard = boardId; // Update the active board
      this.loadBoardState(boardId); // Load the selected board's state
    }
  }

  // Add a new board and switch to it
  addNewBoard() {
    const newId = this.boards.length + 1; // Generate a new board ID
    this.boards.push({ id: newId, state: '' }); // Add a new board with an empty state
    this.switchBoard(newId); // Switch to the newly created board
  }

  isLectureStarted = false;

  onStartLecture() {
    this.onSubmitLecture();
  }

  onEndLecture() {
    this.isLectureStarted = false;
    this.remainingTime = null;
    console.log('Lecture ended');
    // this.SetStatas();
    this.SendFinalStats();
    this.stopCountdown();
  }

  StdsPoints = new Map<string, any>();

  logStatusValue(statusValue: number, stdId: string): void {
    console.log('Status value:', statusValue, stdId);

    // Check if student data exists, otherwise initialize it
    if (!this.StdsPoints.has(stdId)) {
      this.StdsPoints.set(stdId, {
        studentId: stdId,
        attendance: 0,
        behaviors: [],
        engagement: 0,
        addedPoints: 0,
      });
    }

    // Update student data
    console.log(this.pointsCategory)
    const student = this.StdsPoints.get(stdId);
    if(this.pointsCategory=='a') student.attendance = statusValue;
    else if(this.pointsCategory=='e') student.engagement = statusValue;
    else if(this.pointsCategory=='b'){
      student.behaviors.push(statusValue);
      const sen = 'تمت إضافة ' +statusValue+' نقطة ';
      this.toastr.info(sen,
        'نقاط سلوك',
        {
        timeOut:1400,
        });
    } 
    this.StdsPoints.set(stdId, student);
    console.log(this.StdsPoints);
    this.SelectedStatus(statusValue,stdId);
  }
  
  onSubmitLecture(): void {
    const classId = localStorage.getItem('selectedClassId');
    const lessonId = localStorage.getItem('selectedLessonId');

    // Validate inputs
    if (!classId || !lessonId) {
      this.toastr.error(
        'تاكد انك قمت باختيار كلا من الفصل و الدرس لبدء الحصه',
        'خطأ',
        {
          timeOut: 2000,
        }
      );
      return;
    }

    // if (!this.remainingMinutes || this.remainingMinutes <= 0) {
    //   this.toastr.error('قم بادخال الوقت بطريقه صحيحه (الدقائق)!', 'خطأ', {
    //     timeOut: 1000,
    //   });
    //   return;
    // }

    const periodInMinutes = this.remainingMinutes; // Store the time entered

    // Call the service to create the lecture
    this.whiteboardService
      .setSetting(periodInMinutes)
      .subscribe(
        (response) => {
          console.log('Lecture created successfully:', response);
          // Assuming the response contains the created lecture ID, save it in localStorage
          // const lectureId = response.lectureId; // Adjust this based on your API's response structure
          // if (lectureId) {
          //   localStorage.setItem('createdLectureId', lectureId);
          //   console.log('Lecture ID saved to localStorage:', lectureId);
          // }

          this.toastr.success('تم بدء الحصة بنجاح!', 'نجاح', {
            timeOut: 1000,
          });

          this.isLectureStarted = true;
          this.startCountdown();
        },
        (error) => {
          console.error('Error creating lecture:', error);
          this.toastr.error('خطا في انشاء الحصه', 'خطأ', {
            timeOut: 1000,
          });
        }
      );
  }

  SetStatas(): void {
    const studentId = localStorage.getItem('StudentSelectedId'); // Get student ID from localStorage
    if (!studentId) {
      console.error('Student ID is missing from localStorage');
      return;
    }

    const selectedAttendanceStatus = this.students[0].statusIcons.find(
      (icon) => icon.value === 2
    ); // Mock selected value 2
    const selectedEngagementStatus = this.students3[0].statusIcons.find(
      (icon) => icon.value === 1
    ); // Mock selected value 1
    const selectedBehaviors = this.students2[0].statusIcons.filter(
      (icon) => icon.value >= 0 && icon.value <= 4
    ); // Mock selected all values

    // Extracting the actual selected values
    const attendance = selectedAttendanceStatus
      ? selectedAttendanceStatus.value
      : null;
    const engagement = selectedEngagementStatus
      ? selectedEngagementStatus.value
      : null;
    const behaviors = selectedBehaviors.map((icon) => icon.value);

    const statusData = [
      {
        studentId: studentId,
        attendance: attendance,
        behaviors: behaviors,
        engagement: engagement,
        addedPoints: 0,
      },
    ];
    console.log('Data sent to API:', statusData); // Log the data sent to the API

    this.lectureService.setStatus(statusData).subscribe({
      next: (response) => {
        try {
          const responseBody =
            typeof response.body === 'string'
              ? JSON.parse(response.body)
              : response.body;
          console.log('Status set successfully:', responseBody);
        } catch (e) {
          console.log('Status set successfully:', response.body);
        }
      },
      error: (error) => {
        console.error('Error setting status:', error);
      },
    });
  }

  onBlur() {
    // This triggers the countdown when the input loses focus
    if (this.remainingMinutes > 0) {
      // this.startCountdown();
    }
  }

  onBlur2() {
    if (this.remainingTimeSec > 0) {
      this.startCountdownInSeconds();
    }
  }

  startCountdownInSeconds() {
    if (this.remainingTimeSec > 0) {
      this.remainingTime2 = `${this.remainingTimeSec}`; // Set initial countdown in seconds

      const timer = setInterval(() => {
        if (this.remainingTimeSec <= 0) {
          clearInterval(timer);
          this.remainingTime2 = '00'; // Set timer to 00 when done
        } else {
          const seconds = this.remainingTimeSec;
          this.remainingTime2 = `${Math.floor(seconds / 60)}:${(seconds % 60)
            .toString()
            .padStart(2, '0')}`;
          this.remainingTimeSec--; // Decrement seconds
        }
      }, 1000);
    }
  }

  startCountdown(): void {
    if (this.remainingMinutes > 0) {
      this.remainingTime = `${this.remainingMinutes}`; // Set initial countdown

      // Convert minutes to seconds
      let totalSeconds = this.remainingMinutes * 60;

      // Countdown logic
      this.timer = setInterval(() => {
        if (totalSeconds <= 0) {
          clearInterval(this.timer);
          this.remainingTime = '00'; // Set timer to 00 when done
        } else {
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          this.remainingTime = `${minutes}:${
            seconds < 10 ? '0' : ''
          }${seconds}`;
          totalSeconds--;
        }
      }, 1000);
    }
  }

  private timer: any; // To store the interval ID

  stopCountdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.remainingTime = '00';
    }
  }

  toggleStudentList() {
    this.isStudentListVisible = !this.isStudentListVisible;
  }
  isBehaviorActive: boolean = false;
  isInteractionActive: boolean = false;
  isPreparationActive: boolean = true;

  toggleButton(button: string) {
    if (button === 'behavior') {
      this.isBehaviorActive = true;
      this.isInteractionActive = false;
      this.isPreparationActive = false;
    } else if (button === 'interaction') {
      this.isBehaviorActive = false;
      this.isInteractionActive = true;
      this.isPreparationActive = false;
    } else if (button === 'preparation') {
      this.isBehaviorActive = false;
      this.isInteractionActive = false;
      this.isPreparationActive = true;
    }
  }

  isOneActive: boolean = true;
  isTwoActive: boolean = false;
  isThreeActive: boolean = false;

  toggleButtonNumber(button: string) {
    if (button === 'one') {
      this.isOneActive = true;
      this.isTwoActive = false;
      this.isThreeActive = false;
    } else if (button === 'two') {
      this.isOneActive = false;
      this.isTwoActive = true;
      this.isThreeActive = false;
    } else if (button === 'three') {
      this.isOneActive = false;
      this.isTwoActive = false;
      this.isThreeActive = true;
    }
  }

  students = [
    {
      statusIcons: [
        { label: 'غ', class: 'late غائب', value: 1 },
        { label: 'ح', class: 'present حاضر', value: 0 },
        { label: 'م', class: 'excused  مستأذن', value: 3 },
        { label: 'ه', class: 'absent هروب', value: 4 },
        { label: 'ت', class: 'sleep متاخر', value: 2 },
      ],
    },
  ];

  students2 = [
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم', value: 4 },
        { label: 'د', class: 'present عدم احضار الادوات', value: 3 },
        { label: 'ك', class: 'excused عدم احضار الكتاب', value: 2 },
        { label: 'س', class: 'absent سارح', value: 1 },
        { label: 'ش', class: 'sleep مشاغب', value: 0 },
      ],
    },
  ];

  students3 = [
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل', value: 1 },
        { label: 'م', class: 'present متفاعل', value: 0 },
      ],
    },
  ];

  statuses = {
    حاضر: 0, // present
    غائب: 1, // late
    متاخر: 2, // sleep
    مستأذن: 3, // excused
    هروب: 4, // absent
  };

  statuses2 = {
    مشاغب: 0, // naughty
    سارح: 1, // distracted
    'عدم احضار الكتاب': 2, // no book
    'عدم احضار الادوات': 3, // no tools
    نائم: 4, // sleeping
  };

  engagementStatuses = {
    متفاعل: 0, // active
    'غير متفاعل': 1, // inactive
  };

  displayedStudents = this.students; // Initialize with the first group
  pointsCategory = 'a';
  colorLegend = this.getColorLegend(2);
  // Method to change the displayed student group based on the button clicked
  showBehavior(group: string) {
    switch (group) {
      case 's1':
        this.displayedStudents = this.students;
        this.colorLegend = this.getColorLegend(2); // Update color legend
        this.pointsCategory = 'a'; //attendance
        break;

      case 's2':
        this.displayedStudents = this.students2;
        this.colorLegend = this.getColorLegend(1);
        this.pointsCategory = 'b'; //behavior
        break;
        case 's3':
          this.displayedStudents = this.students3;
          this.colorLegend = this.getColorLegend(3);
          this.pointsCategory = 'e'; //engagement
        break;
    }
  }

  getColorLegend(group: number) {
    switch (group) {
      case 1:
        return [
          { colorClass: 'late-color', label: 'نائم' },
          { colorClass: 'present-color', label: 'عدم احضار الادوات' },
          { colorClass: 'excused-color', label: 'عدم احضار الكتاب' },
          { colorClass: 'absent-color', label: 'سارح' },
          { colorClass: 'sleep-color', label: 'مشاغب' },
        ];
      case 2:
        return [
          { colorClass: 'late-color', label: 'غائب' },
          { colorClass: 'present-color', label: 'حاضر' },
          { colorClass: 'excused-color', label: 'مستاذن' },
          { colorClass: 'absent-color', label: 'هروب' },
          { colorClass: 'sleep-color', label: 'متاخر' },
        ];
      case 3:
        return [
          { colorClass: 'late-color', label: 'غير متفاعل' },
          { colorClass: 'present-color', label: 'متفاعل' },
        ];
      default:
        return [];
    }
  }

  getTextColorClass(colorClass: string): string {
    switch (colorClass) {
      case 'late-color':
        return 'lateSpan';
      case 'present-color':
        return 'presentSpan';
      case 'excused-color':
        return 'excusedSpan';
      case 'absent-color':
        return 'absentSpan';
      case 'sleep-color':
        return 'sleepSpan';
      default:
        return '';
    }
  }

  ngAfterViewInit(): void {
    this.resizeCanvas();
    throw new Error('Method not implemented.');
  }
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;
  // private ctx: CanvasRenderingContext2D;
  x = 0;
  y = 0;
  mDown = false;
  pen = true;
  penSizeShow = true;
  penSize = 5;
  clean = false; // Eraser state
  cleanSize = 30;
  color = 'black';
  save = false;
  imageType = 'image/png';
  dataUrl = '';
  canvasWidth = 0;
  canvasHeight = 0;
  cursorStyle: string = 'default'; // Cursor style
  textInputVisible = false; // Manage text input visibility
  textInputValue = ''; // Text input value
  startX = 0; // Starting X for text
  startY = 0; // Starting Y for text
  private isDrawing = false;
  canDraw: boolean = true; // Control drawing state
  private canvasHistory: string[] = [];
  private historyIndex = -1;
  images: string[] =[];
  videos!: string[];
  className: string | null = '';
  gradeName: string | null = '';

  ngOnInit() {
    this.getAllgrades();
    this.getAllLessons();
    this.checkSelectionStatus();
    this.fetchLessonResources();
    
    this.resizeCanvas();
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    this.getStudentInClass();
    this.getLessonRecourses();

    this.className = localStorage.getItem('selectedClassName');
    this.gradeName = localStorage.getItem('selectedGradeName');
  }

  studentData: any[] = [];
  displayedStudentsR: any[] = [];
  selectedStudent: any;

  studentData2 = [
    {
      id: 'b533f02e-977b-4dd6-9130-cdce1ea404fc',
      firstName: 'Ahmed',
      lastName: 'Ali',
      attendanceIcons: [
        { label: 'غ', class: 'late غائب', value: 1 },
        { label: 'ح', class: 'present حاضر', value: 0 },
        { label: 'م', class: 'excused مستأذن', value: 3 },
        { label: 'ه', class: 'absent هروب', value: 4 },
        { label: 'ت', class: 'sleep متاخر', value: 2 },
      ],
      engagementIcons: [
        { label: 'غ', class: 'late غير متفاعل', value: 1 },
        { label: 'م', class: 'present متفاعل', value: 0 },
      ],
      behaviorIcons: [
        { label: 'ن', class: 'late نائم', value: 4 },
        { label: 'د', class: 'present عدم احضار الادوات', value: 3 },
        { label: 'ك', class: 'excused عدم احضار الكتاب', value: 2 },
        { label: 'س', class: 'absent سارح', value: 1 },
        { label: 'ش', class: 'sleep مشاغب', value: 0 },
      ],
    },
    // Add more students as needed
  ];

  currentView: string = 'attendance';
  // isBehaviorActive = false;
  isEngagementActive = false;
  // isPreparationActive = false;

  getStudentInClass() {
    const classId = localStorage.getItem('selectedClassId');

    // Fetch student data
    if (classId) {
      this.classService.getStudentsInClass(classId,1,200).subscribe(
        (data) => {
          this.studentData = data.students;
          this.displayedStudentsR = data.students;
          console.log('Student Data:', this.studentData);
        },
        (error) => {
          console.error('Error fetching student data:', error);
        }
      );
    }
  }

  chooseRandomStudent() {
    const randomIndex = Math.floor(Math.random() * this.studentData.length);
    this.selectedStudent = this.studentData[randomIndex];
    console.log(this.selectedStudent)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  resizeCanvas(x:any =380,y:any =700) {
    const canvas = this.canvasRef.nativeElement;
    const parentWidth = canvas.parentElement?.clientWidth || 0;
    this.canvasWidth = parentWidth;
    this.canvasHeight = this.canvasWidth * (x / y);
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.ctx = canvas.getContext('2d');
    this.setCursor();
  }

  togglenotdraw() {
    this.canDraw = !this.canDraw; // Toggle drawing state
    this.setCursor();
  }

  togglePen() {
    this.pen = true;
    this.clean = false;
    this.canDraw = true;
    this.setCursor();
  }

  toggleEraser() {
    this.clean = !this.clean;
    this.pen = false;
    this.setCursor();
  }

  toggleText() {
    this.textInputVisible = true;
    this.clean = false;
    this.pen = false;
    this.setCursor();
  }

  setCursor() {
    const canvas = this.canvasRef.nativeElement;
    if (!this.canDraw) {
      this.cursorStyle = 'not-allowed'; // Cursor style when drawing is disabled
    } else if (this.pen) {
      this.cursorStyle = 'url(https://i.ibb.co/brhhfs6/pencil20x20.png), auto';
    } else if (this.clean) {
      this.cursorStyle = 'url(https://i.ibb.co/kyV4Npc/eraser20x20.png), auto';
    } else {
      this.cursorStyle = 'text';
    }
    canvas.style.cursor = this.cursorStyle;
  }

  mouseDown(event: MouseEvent) {
    if (!this.canDraw || !this.ctx) return;
    this.mDown = true;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.penSize;
    this.ctx.strokeStyle = this.color;
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.ctx.moveTo(this.x, this.y);

    if (this.textInputVisible) {
      this.startX = this.x;
      this.startY = this.y;
      this.showTextInput();
    }
  }

  mouseUp() {
    this.mDown = false;
    this.saveState();
  }

  mouseMove(event: MouseEvent) {
    if (this.mDown && this.canDraw && this.ctx) {
      this.x = event.offsetX;
      this.y = event.offsetY;
      if (this.clean) {
        this.ctx.clearRect(this.x, this.y, this.cleanSize, this.cleanSize);
      } else {
        this.ctx.lineTo(this.x, this.y);
        this.ctx.stroke();
      }
    }
  }

  saveState() {
    if (this.historyIndex < this.canvasHistory.length - 1) {
      this.canvasHistory = this.canvasHistory.slice(0, this.historyIndex + 1);
    }

    this.canvasHistory.push(this.canvasRef.nativeElement.toDataURL());
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.restoreState(this.canvasHistory[this.historyIndex]);
  }

  // Redo the undone action
  redo() {
    if (this.historyIndex >= this.canvasHistory.length - 1) return;
    this.historyIndex++;
    this.restoreState(this.canvasHistory[this.historyIndex]);
  }

  restoreState(state: string) {
    const img = new Image();
    img.src = state;
    img.onload = () => {
      if (this.ctx) {
        // Check if ctx is initialized
        this.ctx.clearRect(
          0,
          0,
          this.canvasRef.nativeElement.width,
          this.canvasRef.nativeElement.height
        );
        this.ctx.drawImage(img, 0, 0);
      } else {
        console.error('Canvas context is not initialized.');
      }
    };
  }

  touchStart(event: TouchEvent) {
    if (!this.canDraw || !this.ctx) return;
    event.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const touch = event.touches[0];
    this.startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  touchMove(event: TouchEvent) {
    if (!this.canDraw || !this.ctx) return;
    event.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const touch = event.touches[0];
    this.draw(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  touchEnd() {
    this.stopDrawing();
  }

  clear() {
    if (this.ctx) {
      this.toolsDisabled = false;
      this.canDraw = true;
      const canvas = this.canvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  saving() {
    const canvas = this.canvasRef.nativeElement;
    this.dataUrl = canvas.toDataURL(this.imageType);
    console.log(this.dataUrl);
  }

  toggleSave() {
    this.save = !this.save;
  }

  showTextInput() {
    const inputElement = document.getElementById(
      'textInput'
    ) as HTMLInputElement;
    inputElement.style.left = `${this.startX}px`;
    inputElement.style.top = `${this.startY}px`;
    inputElement.style.display = 'block';
    inputElement.value = '';
    inputElement.focus();
  }

  onTextInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textInputValue = input.value;
  }

  addTextToCanvas() {
    if (this.ctx && this.textInputValue.trim() !== '') {
      this.ctx.fillStyle = this.color;
      this.ctx.font = `${this.penSize * 2}px Arial`;
      this.ctx.fillText(this.textInputValue, this.startX, this.startY);
      this.textInputVisible = false;
      const inputElement = document.getElementById(
        'textInput'
      ) as HTMLInputElement;
      inputElement.style.display = 'none';
    }
  }

  onImageSelected(event: Event) {
    console.log(this.isModalImageSelected)
    if (this.isModalImageSelected) {
      // Do nothing or handle image for modal here
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = this.canvasRef.nativeElement;
          if (this.ctx) {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }

  private startDrawing(x: number, y: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.isDrawing = true;
    }
  }

  private draw(x: number, y: number) {
    if (this.ctx && this.isDrawing) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }

  private stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      if (this.ctx) {
        this.ctx.closePath();
      }
    }
  }

  currentIndex: number = 0; // Track the current image index
  toolsDisabled = false; // State to disable tools
  isImagesLoaded = false;
  imagesToggle(){
    this.isImagesLoaded = !this.isImagesLoaded;
    this.toolsDisabled = !this.toolsDisabled;
    this.isVideoPlaying = false;
  }
  // drawImageOnCanvas() {
  //   this.toolsDisabled = true;
  //   this.togglenotdraw();
  //   if (this.images.length === 0 || !this.ctx) return;
  
  //   const imageUrl = this.images[this.currentIndex];
  //   const img = new Image();
  //   img.src = imageUrl; // Directly using the image URL
  //   this.isImagesLoaded = true;
  //   img.onload = () => {
  //     const canvas = this.canvasRef.nativeElement;
  //     this.ctx!.clearRect(0, 0, canvas.width, canvas.height);
  //     this.ctx!.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
  //   };
  //   img.onerror = () => {
  //     console.error('Error loading the image.');
  //   };
  // }
    
  nextImage() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length; // Wrap around to the first image
    // this.drawImageOnCanvas();
  }

  // Navigate to the previous image
  previousImage() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length; // Wrap around to the last image
    // this.drawImageOnCanvas();
  }

  currentVideoIndex: number = 0;
  isVideoPlaying: boolean = false;
  videoElement:any;
  // Videos 
  videosToggle(){
    this.isVideoPlaying = !this.isVideoPlaying;
    this.toolsDisabled = !this.toolsDisabled;
    this.isImagesLoaded = false;
  }
  nextVideo() {
    if (this.videos.length === 0) return;
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length; // Wrap around to the first video
  }

  // Navigate to the previous Video
  previousVideo() {
    if (this.videos.length === 0) return;
    this.currentVideoIndex = (this.currentVideoIndex - 1+ this.images.length) % this.videos.length; // Wrap around to the first video
  }
  // displayVideo(index: number = 0) {
  //   const videoUrl = this.videos[index];
    
  //   this.addNewBoard();
    
  //   // Create and configure the video element
  //   this.videoElement = document.createElement('video');
  //   this.videoElement.src = videoUrl;
  //   this.videoElement.autoplay = true;
  //   this.videoElement.loop = false;
  //   this.videoElement.muted = false;
  //   this.videoElement.controls = true;
  
  //   this.videoElement.onplay = () => {
  //     this.isVideoPlaying = true;
  //     this.drawVideoOnCanvas(this.videoElement);
  //   };
  
  //   this.videoElement.onpause = () => {
  //     this.isVideoPlaying = false;
  //   };
  
  //   this.videoElement.onerror = () => {
  //     console.error('Error loading video:', videoUrl);
  //   };
  // }
  

  // Draw the video frame-by-frame onto the canvas
  // drawVideoOnCanvas(video: HTMLVideoElement) {
  //   const canvas = this.canvasRef.nativeElement;
  //   if (!this.ctx) {
  //     this.ctx = canvas.getContext('2d')!;
  //   }
  
  //   const drawFrame = () => {
  //     if (!this.isVideoPlaying) return;
  
  //     this.ctx?.clearRect(0, 0, canvas.width, canvas.height);
  //     this.ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  //     requestAnimationFrame(drawFrame);
  //   };
  
  //   drawFrame();
  // }
  
  removeBoard(boardId: number) {
    const boardIndex = this.boards.findIndex(board => board.id === boardId);
  
    if (boardIndex === -1) {
      console.warn(`Board with ID ${boardId} does not exist.`);
      return;
    }
    
    // Prevent removal if there's only one board remaining
    if (this.boards.length === 1) {
      console.warn("Cannot remove the last remaining board.");
      return;
    }
    if (boardId === 2 && this.videoElement) {
    this.videoElement.pause();
    this.videoElement.src = ""; // Unload video
    this.videoElement = null;  // Remove reference to video element
    this.isVideoPlaying = false;
    console.log("Video playback stopped and resources cleared for board.");
  }
    this.clearBoardResources(boardId);
    // Remove the board from the list
    this.boards.splice(boardIndex, 1);
  
    // Handle focus after removing a board
    if (this.boards.length > 0) {
      const newActiveBoardIndex = boardIndex > 0 ? boardIndex - 1 : 0;
      this.switchBoard(this.boards[newActiveBoardIndex].id);
    }
  
    console.log(`Board with ID ${boardId} has been removed.`);
  }
  clearBoardResources(boardId: number) {
    if (this.activeBoard === boardId) {
      // Clear the canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      }
  
      // Stop and remove the video element if playing
      if (this.videoElement) {
        this.videoElement.pause();
        this.videoElement.src = ""; // Unload the video source
        this.videoElement = null;  // Remove reference to the video element
      }
  
      console.log(`Resources for board ID ${boardId} have been cleared.`);
    }
  }

  getLessonRecourses() {
    const lessonId = localStorage.getItem('selectedLessonId');
    if (lessonId) {
      this.lessonDataService.getLessonData(lessonId).subscribe({
        next: (response) => {
          console.log('Lesson images:', response);
          this.images = response
            .filter((res: any) => this.lessonDataService.isImage(res.resource))
            .map((res: any) => `${environment.resourceUrl}${res.resource}`);
            console.log(this.images)
          this.videos = response
            .filter((res: any) => this.lessonDataService.isVideo(res.resource))
            .map((res: any) => `${environment.resourceUrl}${res.resource}`);
            console.log(this.videos)
        },
        error: (error) => {
          console.error('Error fetching lesson images:', error);
        },
      });
    }
  }
  showNav:boolean=true;
  toggleNavbar(){
    this.showNav = !this.showNav;
  }


  OnlyBoard1:boolean=true;
  toggleOnlyBoard1(){
    this.OnlyBoard1 = !this.OnlyBoard1;
    console.log(this.OnlyBoard1)
  }
  OnlyBoard2:boolean=true;
  toggleOnlyBoard2(){
    this.OnlyBoard2 = !this.OnlyBoard2;
    console.log(this.OnlyBoard2)
  }


  SendFinalStats(){
    const studentsArray = Array.from(this.StdsPoints.values());
    console.log(studentsArray)
    this.lectureService.setStatus(studentsArray).subscribe({
      next: (response) => {
        console.log('Status updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating status:', error);
      },
    });
  }



  
    lessonName: string = '';
  
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
          this.closeModalById('AddLesson');
    
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
    
    isLocked =true;
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
          // this.router.navigate(['/teacherDash']);
          this.getLessonRecourses();
          this.isLocked = false;
          this.showNav = false;
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
    videoResources: any;
    fileResources: any;
  
    fetchLessonResources(): void {
      console.log(this.selectedLessonId)
      if(this.selectedLessonId){
        this.lessonService.getLessonResources(this.selectedLessonId).subscribe({
          next: (response) => {
            this.lessonResources = response.teacherImagesResponse;
            this.videoResources = response.teacherVideosResponses;
            this.fileResources = response.teacherPdfsResponse;
            // Ensure the lessonResources array has 9 elements, filling gaps with empty objects
            // while (this.lessonResources.length < 9) {
            //   this.lessonResources.push({
            //     id: '',
            //     resource: '',
            //     resourceType: '',
            //     fileName: '',
            //     isTeacherSet: false,
            //   });
            // }
            console.log('Lesson resources:', this.lessonResources);
          },
          error: (error) => {
            console.error('Error fetching lesson resources:', error);
          },
        });
      }
      // else{
        
      //   this.lessonService.getSelectedLessonResources(this.selectedLessonId).subscribe({
      //     next: (response) => {
      //       this.lessonResources = response;
      //       console.log(this.lessonResources)
      //     },
      //     error: (error) =>{
      //       console.error('Error fetching lesson resources:', error);
      //     }
      //   })
      // }
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
      const baseUrl = environment.resourceUrl;
      console.log
      return `${baseUrl}${resource.replace(/\\/g, '/')}`;
    }
  
    // onFileSelected(event: any): void {
    //   // this.selectedFiles = Array.from(event.target.files);
    //   this.newResourceFile = event.target.files[0];
    //   this.addResource();
    // }
  
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
  isModalImageSelected = false;  // To track if the image selection is for the modal or not
  editUploadedFiles: { [key: number]: File[] } = {}; // Store only non-image files
  editUploadedImages: { [key: number]: string[] } = {}; // Store image previews
  editUploadedImageFiles: { [key: number]: File[] } = {}; // Store image files for proper removal
  
  onEditFileSelected(event: any, index: number): void {
    console.log('Triggered file selection for index:', index);
  
    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      console.error('No files selected');
      return;
    }
    
    index++;
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
          this.cdr.detectChanges(); // Update UI immediately
        };
        reader.readAsDataURL(file);
        this.editUploadedImageFiles[index].push(file);
      } else {
        this.editUploadedFiles[index].push(file);
      }
    });
  
    this.isModalImageSelected = true;  // Indicate completion of image selection
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
        this.getLessonRecourses();
        // Get the modal element by its ID
        const editDialog = this.dialog.open(EditLessonComponent,{
          height:'80%',
          width:'70%',
          data:{id:this.selectedLessonId}
        });
        editDialog.afterClosed().subscribe((result)=>{
          this.fetchLessonResources();
        })
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


    scrollIcons(direction: string) {
      const slider = document.querySelector('.custom-icon-slider') as HTMLElement;
      if (slider) {
        const scrollAmount = 150; // Adjust scroll distance
        slider.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
      }
    }
    





  private isResizing = false;
  private startsizeX: number = 0;
  private startWidth: number = 0;

  startResizing(event: MouseEvent) {
    this.isResizing = true;
    this.startsizeX = event.clientX;
    
    // Cast the element to HTMLDivElement to access offsetWidth
    const colC1 = document.querySelector('.col_c1') as HTMLDivElement;
    this.startWidth = colC1?.offsetWidth || 0;

    // Prevent text selection during dragging
    document.body.style.userSelect = 'none';

    // Add event listeners to handle the mousemove and mouseup events
    document.addEventListener('mousemove', this.resize.bind(this));
    document.addEventListener('mouseup', this.stopResizing.bind(this));
  }

  // Function to handle the resizing logic
  resize(event: MouseEvent) {
    if (this.isResizing) {
      const dx = event.clientX - this.startsizeX; // Calculate how much the mouse has moved
      const newWidth = this.startWidth + dx;  // Update the width of the first panel

      // Set the new width, ensuring it doesn't shrink too much
      const colC1 = document.querySelector('.col_c1') as HTMLDivElement;
      if (newWidth > 100 && newWidth < window.innerWidth - 100) {
        colC1.style.width = `${newWidth}px`;
      }
    }
  }

  // Function to stop resizing when mouse is released
  stopResizing() {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.resize.bind(this));
    document.removeEventListener('mouseup', this.stopResizing.bind(this));

    // Restore user select
    document.body.style.userSelect = 'auto';
  }



  readonly dialog = inject(MatDialog);
  openAddLesson(){
    let dialogRef = this.dialog.open(AddLessonComponent, {
      height: '80%',
      width: '70%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllLessons();
    });
  }


  SelectedStatus(statusValue: number, stdId: string):string {
      if(statusValue == this.StdsPoints.get(stdId).engagement)
        return 'selected-status'
      else
        return '';
  }

  boxes =[
    {
      id:4,
      title:'الجزء الرابع',
      isOpened:false,
      time:-1,
    },
    {
      id:3,
      title:'الجزء الثالث',
      isOpened:false,
      time:-1,
    },
    {
      id:2,
      title:'الجزء الثاني',
      isOpened:false,
      time:-1,
    },
    {
      id:1,
      title:'الجزء الاول',
      isOpened:false,
      time:-1,
    },
  ]

  selectedStatValue:any;
  statIcons:any;
  getLabelForStatus(studentId:any): string {
    if(this.pointsCategory=='a'){
      this.selectedStatValue = this.StdsPoints.get(studentId)?.attendance;
      this.statIcons = [
        { label: 'غ', class: 'late غائب', value: 1 },
        { label: 'ح', class: 'present حاضر', value: 0 },
        { label: 'م', class: 'excused مستأذن', value: 3 },
        { label: 'ه', class: 'absent هروب', value: 4 },
        { label: 'ت', class: 'sleep متاخر', value: 2 },
      ];
    }
    else if(this.pointsCategory=='e'){
      this.selectedStatValue = this.StdsPoints.get(studentId)?.engagement;
      this.statIcons = [
        { label: 'غ', class: 'late غير متفاعل', value: 1 },
        { label: 'م', class: 'present متفاعل', value: 0 },
      ];
    }

  
    const status = this.statIcons.find((status:any) => status.value === this.selectedStatValue);
    return status ? status.label : ''; // Return the label or empty string if not found
  }
  getClassForStatus(studentId:any): string {
    if(this.pointsCategory=='a'){
      this.selectedStatValue = this.StdsPoints.get(studentId)?.attendance;
      this.statIcons = [
        { label: 'غ', class: 'late غائب', value: 1 },
        { label: 'ح', class: 'present حاضر', value: 0 },
        { label: 'م', class: 'excused مستأذن', value: 3 },
        { label: 'ه', class: 'absent هروب', value: 4 },
        { label: 'ت', class: 'sleep متاخر', value: 2 },
      ];
    }
    else if(this.pointsCategory=='e'){
      this.selectedStatValue = this.StdsPoints.get(studentId)?.engagement;
      this.statIcons = [
        { label: 'غ', class: 'late غير متفاعل', value: 1 },
        { label: 'م', class: 'present متفاعل', value: 0 },
      ];
    }
  
    const status = this.statIcons.find((status:any) => status.value === this.selectedStatValue);
    return status ? status.class : ''; // Return the label or empty string if not found
  }


  
  leftWidth = 300; // Initial width for the left element
  rightWidth = 500; // Initial width for the right element
  isDragging = false;

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    const initialX = event.clientX;
    const initialLeftWidth = this.leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (this.isDragging) {
        const offset = moveEvent.clientX - initialX;
        this.leftWidth = Math.max(100, initialLeftWidth + offset);  // Prevent too small widths
        this.rightWidth = Math.max(100, window.innerWidth - this.leftWidth - 10); // Adjust the right width accordingly
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}

