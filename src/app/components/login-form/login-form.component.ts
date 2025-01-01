import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  isChecked = false;
  signUpForm: FormGroup;
  errorMessage: string | null = null;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isClicked(){
    this.isChecked = true
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,

  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      signature: []
    }, {
      validator: this.passwordMatchValidator
    });
  }

   @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
   @ViewChild('inputSignature', { static: true }) inputSignature!: ElementRef<HTMLInputElement>;

    ctx: CanvasRenderingContext2D | null = null;
    // private ctx: CanvasRenderingContext2D;
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
    private canvasHistory: string[] = [];
    private historyIndex = -1;
  
    className: string | null = '';
    gradeName: string | null = '';

  
  
  
    ngOnInit() {
      this.resizeCanvas();
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
  
      // this.getStudentInClass();
  
      this.className = localStorage.getItem('selectedClassName');
      this.gradeName = localStorage.getItem('selectedGradeName');
    }
  
     
    studentData: any[] = [];
    displayedStudentsR: any[] = [];
    selectedStudent: any;
  
    // getStudentInClass(){
    //    const classId = localStorage.getItem('selectedClassId'); 
  
    //   // Fetch student data
    //   if (classId) {
    //     this.studentService.getStudentByClassId(classId).subscribe(
    //       data => {
    //         this.studentData = data;
    //         this.displayedStudentsR = data;
    //         console.log('Student Data:', this.studentData);
    //       },
    //       error => {
    //         console.error('Error fetching student data:', error);
    //       }
    //     );
    //   }
    // }
  
    chooseRandomStudent() {
      const randomIndex = Math.floor(Math.random() * this.studentData.length);
      this.selectedStudent = this.studentData[randomIndex];
    }
    
  
    // @HostListener('window:resize', ['$event'])
    // onResize(event: Event) {
    //   this.resizeCanvas();
    // }
  
    resizeCanvas() {
      const canvas = this.canvasRef.nativeElement;
      // const parentWidth = canvas.parentElement?.clientWidth || 0;
      // this.canvasWidth = parentWidth;
      // this.canvasHeight = this.canvasWidth * (500/700);
      // canvas.width = this.canvasWidth;
      // // canvas.height = this.canvasHeight;
      this.ctx = canvas.getContext('2d');
      this.setCursor();
    }

    saveSignature() {
      const canvasElement = this.canvasRef.nativeElement;
      const dataUrl = canvasElement.toDataURL('image/png');
      const file = this.dataURLtoBlob(dataUrl);
      const fileName = 'signature.png';
  
      // Assign the Blob object to the form control
      this.signUpForm.get('signature')?.setValue(file);
      
      // Set the input value to the filename
      this.inputSignature.nativeElement.value = fileName;
  
        // Trigger form submission
    
    }
  
  
    dataURLtoBlob(dataurl: string) {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : '';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  
  
    uploadSignature(formData: FormData) {
      this.authService.register(formData).subscribe(response => {
        console.log('Data uploaded successfully', response);
        this.toastr.success('تم تسجيل الدخول بنجاح !', 'Success');
        this.signUpForm.reset();
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error uploading data', error);
      });
    }
 
    passwordMatchValidator(formGroup: FormGroup) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
    }

    onSubmit() {
      if (this.signUpForm.valid) {
        const formData = new FormData();
        formData.append('firstName', this.signUpForm.get('firstName')?.value);
        formData.append('lastName', this.signUpForm.get('lastName')?.value);
        formData.append('phoneNumber', this.signUpForm.get('phoneNumber')?.value);
        formData.append('password', this.signUpForm.get('password')?.value);
  
        // Append signature if it exists
        const signatureBlob = this.signUpForm.get('signature')?.value;
        if (signatureBlob instanceof Blob) {
          formData.append('signature', signatureBlob, 'signature.png');
        }
  
        this.uploadSignature(formData);
      } else {
        console.warn('Form is not valid');
        console.log(this.signUpForm);
      }
    }
  

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
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
        if (this.ctx) { // Check if ctx is initialized
          this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
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

  selectedRole: string = 'teacher'; // Default selected role

  selectRole(role: string) {
    this.selectedRole = role;
  }



  // register(){

  //   if (this.signUpForm.invalid) {
  //     this.errorMessage = 'Please fill all fields correctly.';
  //     return;
  //   }

  //   const { fullName, phoneNumber, password, confirmPassword } = this.signUpForm.value;

  //   if (password !== confirmPassword) {
  //     this.errorMessage = 'Passwords do not match!';
  //     return;
  //   }

  //   // Split the fullName into firstName and lastName
  //   const [firstName, ...lastNameParts] = fullName.split(' ');
  //   const lastName = lastNameParts.join(' ');

  //   const registerData = {
  //     phoneNumber,
  //     password,
  //     firstName: firstName || '',
  //     lastName: lastName || ''
  //   };

  //   this.authService.register(registerData).subscribe(
  //     () => {
  //       this.toastr.success('تم تسجيل الدخول بنجاح !', 'Success');
  //       this.signUpForm.reset()
  //       // Redirect to login page
  //       this.router.navigate(['/login']);
  //     },
  //     (error) => {
  //       this.errorMessage = 'Registration failed. Please try again.';
  //       this.toastr.error(this.errorMessage, 'Error');
  //       console.error(error);
  //     }
  //   );
  // }

  }

