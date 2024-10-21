import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-teacher-dash',
  templateUrl: './teacher-dash.component.html',
  styleUrls: ['./teacher-dash.component.css']
})
export class TeacherDashComponent  implements AfterViewInit {
  @ViewChild('drawingCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('textInput', { static: false }) textInputRef!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private startX = 0;
  private startY = 0;
  penColor: string = '#000000';
  penSize: number = 2;
  mode: string = 'draw'; // draw, erase, text
  canvasHistory: string[] = [];
  currentStep: number = -1;
  cursorStyle: string = 'default'; // New property for cursor style
  isFullScreen: boolean = false;
  currentBoardId = 1;


  constructor() {
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = this.penSize;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.penColor;
    this.saveCanvasState(); // Save the initial empty state of the canvas
    this.setCursor(); // Apply initial cursor style
  }
  // setCursor() {
  //   throw new Error('Method not implemented.');
  // }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.drawing = true;
    if (this.mode === 'draw') {
      this.ctx.beginPath();
      this.ctx.moveTo(event.offsetX, event.offsetY);
    } else if (this.mode === 'erase') {
      this.ctx.clearRect(event.offsetX, event.offsetY, this.penSize, this.penSize);
    } else if (this.mode === 'text') {
      this.startX = event.offsetX;
      this.startY = event.offsetY;
      this.showTextInput(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.drawing) return;
    if (this.mode === 'draw') {
      this.ctx.lineTo(event.offsetX, event.offsetY);
      this.ctx.stroke();
    } else if (this.mode === 'erase') {
      this.ctx.clearRect(event.offsetX, event.offsetY, this.penSize, this.penSize);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(): void {
    this.drawing = false;
    this.ctx.closePath();
    this.saveCanvasState(); // Save the current state after drawing
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(): void {
    this.drawing = false;
  }

  // Handle color change
  onPenColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.penColor = input.value;
    this.ctx.strokeStyle = this.penColor;
  }

  onPenSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.penSize = +input.value;
    this.ctx.lineWidth = this.penSize;
  }

  // Change mode and cursor style
  setMode(mode: string): void {
    this.mode = mode;
    this.setCursor(); // Update cursor when the mode changes
  }

  setCursor(): void {
    const canvas = this.canvasRef.nativeElement;
    if (this.mode === 'draw') {
      this.cursorStyle = 'crosshair'; // Standard cursor for drawing
    } else if (this.mode === 'erase') {
      this.cursorStyle = 'not-allowed'; // Erasing cursor looks like "not-allowed"
    } else if (this.mode === 'text') {
      this.cursorStyle = 'text'; // Text insertion cursor
    }
    canvas.style.cursor = this.cursorStyle; // Apply the cursor to the canvas
  }

  // Show text input box on the canvas at a specific position
  showTextInput(x: number, y: number): void {
    const input = this.textInputRef.nativeElement;
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style.display = 'block';
    input.focus();
  }

  // Add text to the canvas
  addText(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.style.display = 'none'; // Hide input after typing

    if (this.ctx && value.trim() !== '') {
      this.ctx.fillStyle = this.penColor;
      this.ctx.font = `${this.penSize * 10}px Arial`;
      this.ctx.fillText(value, this.startX, this.startY);
    }

    input.value = ''; // Clear input field
    this.saveCanvasState(); // Save the canvas state after adding text
  }

  // Save canvas state
  saveCanvasState(): void {
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL();
    this.canvasHistory = this.canvasHistory.slice(0, this.currentStep + 1); // Discard undone states
    this.canvasHistory.push(dataUrl);
    this.currentStep++;
  }

  addImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, this.startX, this.startY, img.width, img.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  undo(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.restoreCanvasState(this.canvasHistory[this.currentStep]);
    }
  }

  redo(): void {
    if (this.currentStep < this.canvasHistory.length - 1) {
      this.currentStep++;
      this.restoreCanvasState(this.canvasHistory[this.currentStep]);
    }
  }

  restoreCanvasState(dataUrl: string): void {
    const canvas = this.canvasRef.nativeElement;
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      this.ctx.drawImage(img, 0, 0); // Restore the canvas
    };
  }
}