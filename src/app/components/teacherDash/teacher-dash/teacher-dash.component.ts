import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-teacher-dash',
  templateUrl: './teacher-dash.component.html',
  styleUrls: ['./teacher-dash.component.css']
})
export class TeacherDashComponent  implements AfterViewInit {
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
  cursorStyle: string = 'default'; // New property for cursor style
  textInputVisible = false; // State to manage text input visibility
  textInputValue = ''; // Holds the text input value
  startX = 0; // To store the starting X position for text
  startY = 0; // To store the starting Y position for text
  
  // Listen to window resize event and adjust the canvas size
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parentWidth = canvas.parentElement?.clientWidth || 0;

    // Set the canvas dimensions based on the container's width
    this.canvasWidth = parentWidth;
    this.canvasHeight = this.canvasWidth * (500 / 700); // Keep the aspect ratio (original was 700x500)

    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;

    // Get the drawing context
    this.ctx = canvas.getContext('2d');
    this.setCursor(); // Set initial cursor style

  }

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
  }

  // Method for toggling the pen tool
  togglePen() {
    // this.penSizeShow = !this.penSizeShow;
    this.pen = true;
    this.clean = false;
    this.setCursor(); // Update cursor style for pen

  }

  // Method for toggling the eraser tool
  toggleEraser() {
    this.clean = !this.clean;
    // this.penSizeShow = false;
    this.pen = false;
    this.setCursor(); // Update cursor style for pen
  }
  toggleText() {
    this.textInputVisible = true; // Show text input when text mode is selected
    // this.penSizeShow = false; // Hide pen size selector
    this.clean = false; // Ensure eraser is not active
    this.pen = false; // Ensure pen is not active
    this.setCursor(); // Update cursor style for text
  }
  setCursor() {
    const canvas = this.canvasRef.nativeElement;
    if (this.pen) {
      this.cursorStyle = 'url(https://i.ibb.co/brhhfs6/pencil20x20.png), auto'; // Custom cursor for drawing
    } else if (this.clean) {
      this.cursorStyle = 'url(https://i.ibb.co/kyV4Npc/eraser20x20.png), auto'; // Custom cursor for erasing
    } else {
      this.cursorStyle = 'text'; // Text insertion cursor
    }
    canvas.style.cursor = this.cursorStyle; // Apply the cursor to the canvas
  }
  // Drawing related methods (e.g., mouseDown, mouseUp, etc.)
  mouseDown(event: MouseEvent) {
    if (this.ctx) {
      this.mDown = true;
      this.ctx.beginPath();
      this.ctx.lineWidth = this.penSize;
      this.ctx.strokeStyle = this.color;
      this.x = event.offsetX;
      this.y = event.offsetY;
      this.ctx.moveTo(this.x, this.y);
      
      // If in text mode, store the starting position
      if (this.textInputVisible) {
        this.startX = this.x;
        this.startY = this.y;
        this.showTextInput(); // Show text input where mouse is clicked
      }
    }
  }

  mouseUp() {
    this.mDown = false;
  }

  mouseMove(event: MouseEvent) {
    if (this.mDown && this.ctx) {
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
    inputElement.value = ''; // Clear previous input
    inputElement.focus();
  }

  // Handle text input change
  onTextInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textInputValue = input.value;
  }

  // Add text to canvas
  addTextToCanvas() {
    if (this.ctx && this.textInputValue.trim() !== '') {
      this.ctx.fillStyle = this.color; // Use selected pen color
      this.ctx.font = `${this.penSize * 2}px Arial`; // Set font size based on pen size
      this.ctx.fillText(this.textInputValue, this.startX, this.startY); // Draw text on canvas
      this.textInputVisible = false; // Hide input after adding text
      const inputElement = document.getElementById('textInput') as HTMLInputElement;
      inputElement.style.display = 'none'; // Hide input field
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
            this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image on canvas
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }
}