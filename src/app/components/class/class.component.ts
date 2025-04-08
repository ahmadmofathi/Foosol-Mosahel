import { Component } from '@angular/core';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent {

  allSkills: string[] = ['دراسات اجتماعيه', 'علوم', 'رياضيات'];
  selectedSkills: string[] = []; // Selected skills
  classForm: FormGroup;


  constructor(private classService: ClassesService , private fb: FormBuilder,private modalService: NgbModal , private authService: AuthService,
     private toastr: ToastrService,
) {
  this.classForm = this.fb.group({
    className: ['', Validators.required],
  });
}

ngOnInit(): void {
  this.loadClasses()
}

classes: any[] = [];


loadClasses(): void {
  // Retrieve the grade ID from local storage
  const gradeId = localStorage.getItem('selectedGradeId');

  if (gradeId) {
    // Only proceed if gradeId is not null
    this.classService.getClassesByGradeId(gradeId).subscribe(
      (data) => {
        this.classes = data;
        console.log('Fetched Classes:', this.classes);
      },
      (error) => {
        console.error('Error fetching classes', error);
      }
    );
  } else {
    console.error('Selected grade ID is not set in local storage.');
  }
}

updateLocalStorage(classId:any) {
  localStorage.setItem('selectedClassId', classId);
}

onSubmit() {
  if (this.classForm.valid) {
    // Retrieve the saved grade ID from localStorage
    const gradeId = localStorage.getItem('selectedGradeId'); // Get the grade ID from localStorage
    if (!gradeId) {
      this.toastr.error('تاكد من اختيار الصف اولا!', 'خطأ', {
        timeOut: 2000,
      });
      return;
    }

    const userDetail = this.authService.getUserDetail();
    if (!userDetail || !userDetail.id) {
      console.error('Unable to retrieve teacher ID from token');
      this.toastr.error('لم نتمكن من الحصول علي المعلم !', 'خطأ', {
        timeOut: 2000,
      });
      return;
    }

    const teacherId = userDetail.id; // Example Teacher ID
    const formData = this.classForm.value;

    this.classService.addClass(gradeId, teacherId, formData).subscribe({
      next: (response) => {
        // Handle the plain text response
        console.log('Response:', response);
        // if (response === 'Class Added Successfully') {
          this.toastr.success('تم إضافة الفصل بنجاح!', 'نجاح', {
            timeOut: 1000,
          });

          this.classForm.reset;
          this.loadClasses();
          this.closeModalById('class');
        // } else {
          // console.error('Unexpected response:', response);
        // }
      },
      error: (error) => {
        console.error('Error adding class:', error);
        // Log the error response
        if (error.error) {
          console.error('Response details:', error.error);
        } else {
          console.error('Unknown error occurred', error);
        }
      },
    });
  } else {
    console.error('Form is invalid');
  }
}

className: string = '';


openEditModal() {
  this.classForm.reset(); // Reset the form
  this.className = ''; // Reset lesson name

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
  navOpenStates: { [key: string]: boolean } = {}; // Object to track open state per class

  toggleNav(classId: string) {
    this.navOpenStates[classId] = !this.navOpenStates[classId] || false;
  }

  isMenuVisible: boolean = false; // Initially hidden

  // toggleMenu() {
  //   this.isMenuVisible = !this.isMenuVisible; // Toggle the menu visibility
  // }


  cards = Array(9).fill({});

  // Array to track hidden cards
  hiddenCards = Array(9).fill(false);

  // Hide or delete a card by index
  hideCard(cardIndex: number) {
    this.hiddenCards[cardIndex] = true;
  }
  selectAll: boolean = false;
  option1: boolean = false;
  option2: boolean = false;
  option3: boolean = false;

  toggleSelectAll() {
    this.option1 = this.selectAll;
    this.option2 = this.selectAll;
    this.option3 = this.selectAll;
  }

  updateSelectAll() {
    this.selectAll = this.option1 && this.option2 && this.option3;
  }


  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;

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
  itemsGrouped = this.groupItems(this.classes, 4);

  groupItems(classes: any[], chunkSize: number): any[][] {
    const grouped = [];
    for (let i = 0; i < classes.length; i += chunkSize) {
      grouped.push(classes.slice(i, i + chunkSize));
    }
    return grouped;
  }

}
