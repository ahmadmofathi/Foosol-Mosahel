import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-teacher-dash',
  templateUrl: './teacher-dash.component.html',
  styleUrls: ['./teacher-dash.component.css']
})
export class TeacherDashComponent  implements AfterViewInit {

  isStudentListVisible = false;

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
      this.isPreparationActive = false
    } else if (button === 'interaction') {
      this.isBehaviorActive = false;
      this.isInteractionActive = true;
      this.isPreparationActive = false
    
    } else if (button === 'preparation') {
      this.isBehaviorActive = false;
      this.isInteractionActive = false;
      this.isPreparationActive = true
    }
  }

  students = [
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غائب' },
        { label: 'ح', class: 'present حاضر' },
        { label: 'م', class: 'excused  مستأذن' },
        { label: 'ه', class: 'absent هروب' },
        { label: 'ت', class: 'sleep متاخر' }
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غائب' },
        { label: 'ح', class: 'present حاضر' },
        { label: 'م', class: 'excused  مستأذن' },
        { label: 'ه', class: 'absent هروب' },
        { label: 'ت', class: 'sleep متاخر' }
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غائب' },
        { label: 'ح', class: 'present حاضر' },
        { label: 'م', class: 'excused  مستأذن' },
        { label: 'ه', class: 'absent هروب' },
        { label: 'ت', class: 'sleep متاخر' }
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غائب' },
        { label: 'ح', class: 'present حاضر' },
        { label: 'م', class: 'excused  مستأذن' },
        { label: 'ه', class: 'absent هروب' },
        { label: 'ت', class: 'sleep متاخر' }
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غائب' },
        { label: 'ح', class: 'present حاضر' },
        { label: 'م', class: 'excused  مستأذن' },
        { label: 'ه', class: 'absent هروب' },
        { label: 'ت', class: 'sleep متاخر' }
      ]
    },
    // Add more students as needed
  ];


  students2 = [
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم' },
        { label: 'د', class: 'present عدم احضار الادوات' },
        { label: 'ك', class: 'excused عدم احضار الكتاب' },
        { label: 'س', class: 'absent سارح' },
        { label: 'ش', class: 'sleep مشاغب' }
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم' },
        { label: 'د', class: 'present عدم احضار الادوات' },
        { label: 'ك', class: 'excused عدم احضار الكتاب' },
        { label: 'س', class: 'absent سارح' },
        { label: 'ش', class: 'sleep مشاغب' }
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم' },
        { label: 'د', class: 'present عدم احضار الادوات' },
        { label: 'ك', class: 'excused عدم احضار الكتاب' },
        { label: 'س', class: 'absent سارح' },
        { label: 'ش', class: 'sleep مشاغب' }
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم' },
        { label: 'د', class: 'present عدم احضار الادوات' },
        { label: 'ك', class: 'excused عدم احضار الكتاب' },
        { label: 'س', class: 'absent سارح' },
        { label: 'ش', class: 'sleep مشاغب' }
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'ن', class: 'late نائم' },
        { label: 'د', class: 'present عدم احضار الادوات' },
        { label: 'ك', class: 'excused عدم احضار الكتاب' },
        { label: 'س', class: 'absent سارح' },
        { label: 'ش', class: 'sleep مشاغب' }
      ]
    },
    // Add more students as needed
  ];

  
  students3 = [
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل' },
        { label: 'م', class: 'present متفاعل' },
       
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل' },
        { label: 'م', class: 'present متفاعل' },
       
      ]
    },
    {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل' },
        { label: 'م', class: 'present متفاعل' },
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل' },
        { label: 'م', class: 'present متفاعل' },
      ]
    }, {
      name: 'أسامه علي صالح',
      image: '../../../../assets/images/student.svg',
      statusIcons: [
        { label: 'غ', class: 'late غير متفاعل' },
        { label: 'م', class: 'present متفاعل' },
      ]
    },
    // Add more students as needed
  ];



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
        this.colorLegend = this.getColorLegend(1)
        break;
      case 's3':
        this.displayedStudents = this.students3;
        this.colorLegend = this.getColorLegend(3)
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
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;
  x = 0;
  y = 0;
  mDown = false;
  pen = true;
  penSizeShow = true;
  penSize = 5;
  clean = false;  // Eraser state
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

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parentWidth = canvas.parentElement?.clientWidth || 0;
    this.canvasWidth = parentWidth;
    this.canvasHeight = this.canvasWidth * (500 / 700);
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
    const inputElement = document.getElementById('textInput') as HTMLInputElement;
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
      const inputElement = document.getElementById('textInput') as HTMLInputElement;
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
}