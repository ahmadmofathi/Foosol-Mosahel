import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { LevelService } from 'src/app/services/level/level.service';
import { SubjectService } from 'src/app/services/subject/subject.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent {
  isMenuOpen: boolean = false;
  grades: any[] = [];
  levels: any[] = [];
  subjects: any[] = [];
  classes :any[] =[];
  errorMessage: string = '';

  selectedLevelId: string | null = null;
  selectedGradeId: string | null = null;
  selectedSubjectId: string | null = null;
  selectedClassId: string | null = null;

  subjectPriceForm: FormGroup;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private levelService: LevelService,
    private classService :ClassesService,
    private fb: FormBuilder,   
    private toastr: ToastrService,
    


  ) {
    this.subjectPriceForm = this.fb.group({
      subjectId: ['', Validators.required],
      levelId: ['', Validators.required],
      classId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.getAllgrades();
    this.getAllLevels();
    // this.getAllSubjects();
  }

  getAllgrades() {
    const pageNumber = 1; // Example page number
    const pageSize = 100; // Example page size

    this.gradeService.getAllClasses(pageNumber, pageSize).subscribe(
      (response) => {
        this.grades = response;
        console.log('grades:', this.grades);
      },
      (error) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  getAllLevels() {
    this.levelService.getAllLevels().subscribe(
      (response) => {
        this.levels = response; // Assign the fetched Regions
        console.log('levels:', this.levels);
      },
      (error) => {
        console.error('Error fetching level section:', error);
      }
    );
  }

  // getAllSubjects() {
  //   const pageNumber = 1;
  //   const pageSize = 100;

  //   this.subjectService.getAllSub(pageNumber, pageSize).subscribe(
  //     (response) => {
  //       this.subjects = response;

  //       console.log('subjects:', this.subjects);
  //     },
  //     (error) => {
  //       console.error('Error fetching grades:', error);
  //     }
  //   );
  // }

  getGradesByLevelId(levelId: string): void {
    const pageNumber = 1;
    const itemsPerPage = 100;

    this.gradeService
      .getGradesByLevelId(levelId, pageNumber, itemsPerPage)
      .subscribe({
        next: (response) => {
          this.grades = response;
        },
        error: (error) => {
          this.handleError(error, 'Error fetching grades by level');
        },
      });
  }

  getSubjectByGradeId(gradeId: string): void {
    const pageNumber = 1;
    const itemsPerPage = 100;

    this.subjectService
      .getSubjectsByGradeId(gradeId, pageNumber, itemsPerPage)
      .subscribe({
        next: (response) => {
          this.subjects = response;
          console.log('selected subject', this.subjects);
        },
        error: (error) => {
          this.handleError(error, 'Error fetching grades by level');
        },
      });
  }

  getClassesByGrade(gradeId: string): void {
    this.classService
      .getClassesByGradeId(gradeId)
      .subscribe({
        next: (response) => {
          this.classes = response;
          console.log('classes',this.classes)
        },
        error: (error) => {
          this.handleError(error, 'Error fetching classes by grade');
        },
      });
  }


  addSubjectPrice(): void {
    if (this.subjectPriceForm.valid) {
      const formData = this.subjectPriceForm.value;

      this.subjectService.addSubjectPrice(formData).subscribe(
        (response) => {
          console.log('Price added successfully:', response);
          this.toastr.success('تم اضافه هذا السعر بنجاح!', 'تم الاضافه', { timeOut: 2000 });

          // Optionally, display a success message or reset the form
        },
        (error) => {
          console.error('Error adding price:', error);
          // Optionally, handle errors or show an error message
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  handleError(error: any, message: string): void {
    console.error(message, error);
    this.errorMessage = `${message}: ${error.message}`;
  }

  onLevelChange(event: any) {
    this.selectedLevelId = event.target.value;
    if (this.selectedLevelId) {
      this.getGradesByLevelId(this.selectedLevelId);
    }
  }
  onGradeChange(event: any) {
    this.selectedGradeId = event.target.value;
    if (this.selectedGradeId) {
      this.getSubjectByGradeId(this.selectedGradeId);
      this.getClassesByGrade(this.selectedGradeId);
    }
  }
  onSubjectChange(event: any) {
    this.selectedSubjectId = event.target.value;
  }

  onClassChange(event: any) { this.selectedClassId = event.target.value; }

  selectedGrade: any = null;

  onSelectFocus() {
    if (this.selectedGrade === null) {
      this.selectedGrade = null;
    }
  }

  onSelectBlur() {
    if (!this.selectedGrade) {
      this.selectedGrade = null;
    }
  }

  regions = [
    {
      id: 1,
      name: 'جدة',
      subscribers: 277,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
    {
      id: 2,
      name: 'الرياض',
      subscribers: 399,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
    {
      id: 3,
      name: 'مكة المكرمة',
      subscribers: 590,
      date: '2-11-2024',
      user: 'admin',
      isMenuOpen: false,
    },
    // Add more data as needed
  ];

  toggleMenu(item: any) {
    this.regions.forEach((region) => (region.isMenuOpen = false));
    item.isMenuOpen = !item.isMenuOpen;
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    this.renderer.listen('document', 'click', () => {});
  }

  // Function to toggle the dropdown menu
  showMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  currentPage = 1;
  totalPages = 10; // Replace with the actual total pages
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  goToPage(page: number) {
    this.currentPage = page;
    // Fetch or filter data based on the current page
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.goToPage(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.goToPage(this.currentPage);
    }
  }

  addContractActive: boolean = true; // Default the "إنشاء عقد جديد" button to active
  exportPdfActive: boolean = false; // Default the "تصدير PDF" button to inactive

  // Toggle the "إنشاء عقد جديد" button active/inactive state
  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false; // Make "تصدير PDF" inactive
  }

  // Toggle the "تصدير PDF" button active/inactive state
  toggleExportPdf() {
    this.exportPdfActive = true;
    this.addContractActive = false; // Make "إنشاء عقد جديد" inactive
  }
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;

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
}
