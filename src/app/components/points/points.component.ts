import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject/subject.service';
import { ToastrService } from 'ngx-toastr';
import { StudentsService } from 'src/app/services/students/students.service';
import { Modal } from 'bootstrap';
import { ClassesService } from 'src/app/services/classes/classes.service';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css'],
})
export class PointsComponent {
  elements: any[] = [];
  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;
  pageNumber = 1;
  itemsPerPage = 100;
  classesStudents :any[] = [];

  addStudentForm!: FormGroup;
  existForm!:FormGroup;
  allSubjects: any[] = []; // Array to hold fetched subjects
  selectedSubjects: any[] = [];

  selectedFormType: string = 'new'; // Initialize with empty or default value

  switchFormType2(type: string): void {
    this.selectedFormType = type; // Update the active button
  }

  genders = [
    { value: 1, label: 'ذكر' },
    { value: 0, label: 'أنثي' },
  ];

  students: any[] = [
    {
      name: 'أسامة علي ال سعود',
      image: '../../../assets/images/human.png',
      code: '1365',
      phone: '011234567',
    },
    {
      name: 'أسامة علي ال سعود',
      image: '../../../assets/images/human.png',
      code: '1365',
      phone: '011234567',
    },
    {
      name: 'أسامة علي ال سعود',
      image: '../../../assets/images/human.png',
      code: '1365',
      phone: '011234567',
    },
    // add more students
  ];

  constructor(
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private studentService: StudentsService,
    private classService :ClassesService
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      code: [{ value: this.generateCode(), disabled: true }, Validators.required] ,
      profileImage: [null],
    });

    this.existForm = this.fb.group({
      studentPhoneNumber: ['', [Validators.required]],

    })
  
  }

  studentForm!: FormGroup;
  selectedFile: File | null = null;
  userImage: string | ArrayBuffer | null = '';

  studentFormType: 'new' | 'existing' = 'new'; // Define the form type

  switchFormType(type: 'new' | 'existing'): void {
    this.studentFormType = type;
    this.studentForm.reset(); // Reset the form when switching
    this.switchFormType2(type)
  }

  generateCode(): string {
    // Generate a 6-digit random number as a string
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  onSubmit(): void {
    if (this.studentFormType === 'new') {
      this.submitNewStudent();
    } else {
      this.submitExistingStudent();
    }
  }

  submitNewStudent() {
    if (this.studentForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.studentForm.get('firstName')?.value);
      formData.append('lastName', this.studentForm.get('lastName')?.value);
      formData.append(
        'phoneNumber',
        this.studentForm.get('phoneNumber')?.value
      );
      formData.append('code', this.studentForm.get('code')?.value);

      const levelId = localStorage.getItem('selectedLevelId');
      const gradeId = localStorage.getItem('selectedGradeId');
      const classId = localStorage.getItem('selectedClassId');
      const subjectIds = localStorage.getItem('selectedSubjectIds');

      if (levelId) formData.append('levelId', levelId);
      if (gradeId) formData.append('gradeId', gradeId);
      if (classId) formData.append('classId', classId);
      if (subjectIds)
        formData.append('subjectIds', JSON.stringify(subjectIds.split(',')));

      if (this.selectedFile) {
        formData.append(
          'profileImage',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      this.studentService.addStudent(formData).subscribe({
        next: (response) => {
          console.log('Student added successfully:', response);
          this.toastr.success('تم إضافة الطالب بنجاح!', 'نجاح', {
            timeOut: 1000,
          });

          this.studentForm.reset;
          this.closeModalById('studentProfile');
          this.getStudentInClass();

        },
        error: (error) => {
          console.error('Error adding student:', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  submitExistingStudent(): void {
    if (this.existForm.valid) {
      const studentPhoneNumber = this.existForm.get('studentPhoneNumber')?.value; // Use existForm here
      const classId = localStorage.getItem('selectedClassId');
      const subjectIds = localStorage.getItem('selectedSubjectId');
  
      if (!classId || !subjectIds) {
        console.error('Class ID or Subject IDs are missing');
        return; // or handle the error appropriately
      }
  
      const body = {
        studentPhoneNumber: studentPhoneNumber,
        classId: classId,
        subjectIds: subjectIds.split(','), // Convert string to array
      };
  
      this.studentService.addExitStudent(body).subscribe({
        next: (response) => {
          console.log('Student assigned to class successfully:', response);
          this.toastr.success('تم اضافه الطالب الي الفصل!');
          this.existForm.reset(); // Optionally reset the form after submission
          this.closeModalById('studentProfile');
          this.getStudentInClass();
        },
        error: (error) => {
          console.error('Error assigning student to class:', error);
          this.toastr.error('Error assigning student to class.');
        },
      });
    } else {
      console.error('Form is invalid');
      this.existForm.markAllAsTouched(); // Highlight invalid fields
    }
  }


  firstName: string = '';
  lastName: string ='';

  openEditModal() {
    this.studentForm.reset(); // Reset the form
    this.firstName = ''; // Reset lesson name
    this.lastName =''
  
  }
  
  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide(); // Close the modal
    }
  
    // Clean up Bootstrap modal styles and backdrops
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  
  

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.studentForm.patchValue({
        profileImage: file,
      });
    }
  }

  studentData: any[] = [];

  getStudentInClass() {
    const classId = localStorage.getItem('selectedClassId');

    // Fetch student data
    if (classId) {
      this.studentService.getStudentByClassId(classId).subscribe(
        (data) => {
          this.studentData = data;
          console.log('Student Data:', this.studentData);
        },
        (error) => {
          console.error('Error fetching student data:', error);
        }
      );
    }
  }




  className: string | null = '';
  gradeName: string | null = '';

  ngOnInit(): void {
    this.getAllSubjects();
    this.getStudentInClass();

    this.className = localStorage.getItem('selectedClassName');
    this.gradeName = localStorage.getItem('selectedGradeName');
  }

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

  getAllSubjects() {
    this.subjectService.getAllSub(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.elements = response; // Make sure response contains 'id' field
        console.log('Fetched elements:', this.elements);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  onSubjectChange(event: any): void {
    const selectedSubjectId = event.target.value;
    const selectedSubject = this.allSubjects.find(
      (subject) => subject.subjectId === selectedSubjectId
    );

    if (selectedSubject && !this.selectedSubjects.includes(selectedSubject)) {
      this.selectedSubjects.push(selectedSubject); // Add selected subject to the list
    }
  }

  removeSubject(subjectToRemove: any): void {
    this.selectedSubjects = this.selectedSubjects.filter(
      (subject) => subject !== subjectToRemove
    );
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menu Open State:', this.menuOpen); // Debugging
  }

  dropdownIndex: number | null = null; // Keeps track of the currently open dropdown

  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleDropdown(index: number): void {
    this.dropdownIndex = this.dropdownIndex === index ? null : index; // Toggle the dropdown
  }

  // Optional: Close the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.student-info')) {
      this.dropdownIndex = null; // Close the dropdown if the click is outside
    }
  }

  // Function to handle image selection
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.userImage = reader.result;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }
}
