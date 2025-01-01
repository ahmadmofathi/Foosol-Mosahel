import { Component, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentsService } from 'src/app/services/students/students.service';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  elements: any[] = [];
  studentForm: FormGroup;
  allSkills: string[] = ['دراسات اجتماعيه', 'علوم', 'رياضيات'];
  selectedSkills: string[] = []; // Selected skills
  staticSubjectId = '9c8401cd-1e20-47a0-83ab-38d05a0f6f7e';
  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;
  
  constructor(private studentService:StudentsService,   private fb: FormBuilder){
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      subjects: [['9c8401cd-1e20-47a0-83ab-38d05a0f6f7e']]
      // subjects: this.fb.array([this.fb.control('', Validators.required)]), // subjects as an array
    });
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

  certificates = [
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
    { imgSrc: '../../../assets/images/certi (3).png', selected: false },
  ];

  submitSelection() {
    const selectedCertificates = this.certificates.filter((cert) => cert.selected);
    console.log('Selected Certificates:', selectedCertificates);
    // Perform further actions with selected certificates
  }

  // State for checkboxes
  isAllSelected = false;
  student1Selected = false;
  student2Selected = false;
  student3Selected = false;




  

  students: any[] = [
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' }

    // add more students
  ];



  // Toggle individual checkbox
  toggleCheckbox(student: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    switch (student) {
      case 'student1':
        this.student1Selected = isChecked;
        break;
      case 'student2':
        this.student2Selected = isChecked;
        break;
      case 'student3':
        this.student3Selected = isChecked;
        break;
    }

    // Update "Select All" state
    this.updateSelectAllState();
  }

  // Select/Deselect all checkboxes
  selectAllCheckboxes(event: Event): void {
    this.isAllSelected = (event.target as HTMLInputElement).checked;

    // Update all checkboxes
    this.student1Selected = this.isAllSelected;
    this.student2Selected = this.isAllSelected;
    this.student3Selected = this.isAllSelected;
  }

  // Update "Select All" state based on individual checkboxes
  private updateSelectAllState(): void {
    this.isAllSelected =
      this.student1Selected && this.student2Selected && this.student3Selected;
  }

  dropdownIndex: number | null = null; // Keeps track of the currently open dropdown

  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  get subjects() {
    return this.studentForm.get('subjects') as FormArray;
  }

  addSubject() {
    this.subjects.push(this.fb.control('', Validators.required)); // Add a new subject
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index); // Remove a subject at a given index
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

  userImage: string | ArrayBuffer | null = null; // To store the uploaded image

  // Function to handle image selection
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) { // Ensure e.target and result are not null
          this.userImage = e.target.result; // Set the uploaded image as userImage
        }
      };
      reader.readAsDataURL(input.files[0]); // Read the uploaded file as a data URL
    }
  }

   // Handle skill selection from the checkbox
   onSkillSelect(skill: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // Add skill if checked
      this.addSkill(skill);
    } else {
      // Remove skill if unchecked
      this.removeSkill(skill);
    }
  }

  // Add a skill from the input field
  addSkill(skill: string) {
    if (skill && !this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
  }

  // Remove a selected skill
  removeSkill(skill: string) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }
}
