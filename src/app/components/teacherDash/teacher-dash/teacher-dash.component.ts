import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/services/students/students.service';
import { WhiteboardService } from 'src/app/services/whiteboard/whiteboard.service';
import { LessonDataService } from './../lesson-data.service';
import { environment } from 'src/environments/environment.development';

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

  constructor(
    private lectureService: WhiteboardService,
    private toastr: ToastrService,
    private studentService: StudentsService,
    private lessonDataService: LessonDataService,
    private whiteboardService: WhiteboardService
  ) {}

  saveStudentId(studentId: string) {
    console.log('Selected student ID:', studentId);
    localStorage.setItem('StudentSelectedId', studentId);
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
    this.SetStatas();
    this.stopCountdown();
  }

  logStatusValue(statusValue: number): void {
    console.log('Status value:', statusValue);
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

    if (!this.remainingMinutes || this.remainingMinutes <= 0) {
      this.toastr.error('قم بادخال الوقت بطريقه صحيحه (الدقائق)!', 'خطأ', {
        timeOut: 1000,
      });
      return;
    }

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

  colorLegend = this.getColorLegend(2);
  // Method to change the displayed student group based on the button clicked
  showBehavior(group: string) {
    switch (group) {
      case 's1':
        this.displayedStudents = this.students;
        this.colorLegend = this.getColorLegend(2); // Update color legend
        break;

      case 's2':
        this.displayedStudents = this.students2;
        this.colorLegend = this.getColorLegend(1);
        break;
      case 's3':
        this.displayedStudents = this.students3;
        this.colorLegend = this.getColorLegend(3);
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
      this.studentService.getStudentByClassId(classId).subscribe(
        (data) => {
          this.studentData = data;
          this.displayedStudentsR = data;
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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parentWidth = canvas.parentElement?.clientWidth || 0;
    this.canvasWidth = parentWidth;
    this.canvasHeight = this.canvasWidth * (380 / 700);
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
}

