import { Component } from '@angular/core';
import { RegionService } from 'src/app/services/region/region.service';
import { LevelService } from 'src/app/services/level/level.service';
import { GradeService } from 'src/app/services/grade/grade.service';
import { SubjectService } from 'src/app/services/subject/subject.service';

interface Region {
  id: string;
  regionName: string;
  createdOn: string;
  teacherCount: number;
  medalType?: 'gold' | 'silver' | 'bronze' | 'none'; // Optional medal type
}

interface Subject {
  subjectId: string;
  subjectName: string;
  createdOn: string;
  gradeId: string;
  gradeName: string;
  levelId: string;
  levelName: string;
}

interface Grade {
  id: string;
  gradeName: string;
  subjectCount: number;
  levelId: string;
  levelName: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  elements: any[] = [];
  levels: any[] = [];
  grades: { [key: string]: any[] } = {};
  subjects: any[] = [];
  displayedGrades: { [key: string]: boolean } = {};
  displayedSubjects: { [key: string]: boolean } = {};
  selectedGrades: any[] = [];
  isHeaderShow: boolean = false;
  isHeaderMAterialShow: boolean = false;
  isMaterailShow: boolean = false;
  errorMessage: string = '';
  private readonly pageNumber: number = 1;
  private readonly itemsPerPage: number = 1000;
  // grades: { [key: string]: any[] } = {};

  constructor(
    private regionService: RegionService,
    private levelService: LevelService,
    private gradeService: GradeService,
    private subjectService: SubjectService
  ) {}
  ngOnInit() {
    this.getAllRegions();
    this.getAllLevels();
  }

  medals = {
    gold: '../../../assets/images/first.png',
    silver: '../../../assets/images/sec.png',
    bronze: '../../../assets/images/third.png',
    none: '',
  };

  toggleGrade(gradeId: string) {
    console.log(`Toggled grade: ${gradeId}`);
    // Add any specific grade logic here
  }

  getMedalType(teacherCount: number): 'gold' | 'silver' | 'bronze' | 'none' {
    if (teacherCount > 0 && teacherCount <= 100) {
      return 'gold';
    } else if (teacherCount > 100 && teacherCount <= 200) {
      return 'silver';
    } else if (teacherCount > 200 && teacherCount <= 300) {
      return 'bronze';
    } else {
      return 'none'; // No medal
    }
  }

  getAllRegions() {
    this.regionService.getAllRe(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.elements = response.map((region: Region) => ({
          ...region,
          medalType: this.getMedalType(region.teacherCount), // Use the medal type method here
        }));

        console.log('Regions:', this.elements);
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }

  getAllLevels() {
    this.levelService.getAllLevels().subscribe(
      (response) => {
        this.levels = response;

        // Initialize states for levels
        this.levels.forEach((level) => {
          this.displayedGrades[level.id] = false;
        });
      },
      (error) => {
        console.error('Error fetching levels:', error);
      }
    );
  }

  getGradesByLevelId(levelId: string): void {
    const pageNumber = 1;
    const itemsPerPage = 1000;

    this.gradeService
      .getGradesByLevelId(levelId, pageNumber, itemsPerPage)
      .subscribe({
        next: (response) => {
          this.grades[levelId] = response; // Store grades for the specific level
          this.displayedGrades[levelId] = true; // Show grades for the selected level
          this.isHeaderShow = true; // Show the header
        },
        error: (error) => {
          console.error(`Error fetching grades for level ${levelId}:`, error);
        },
      });
  }

  getSubjectsByGradeId(gradeId: string): void {
    this.subjectService.getSubjectsByGradeId(gradeId, 1, 1000).subscribe(
      (response) => {
        this.subjects = [...this.subjects, ...response]; 
        this.isHeaderMAterialShow = true; // Show subjects header after fetching subjects
      },
      (error) => {
        console.error('Error fetching subjects for grade:', error);
      }
    );
  }


filterSubjectsByGrade(gradeId: string) {
    return this.subjects.filter(subject => subject.gradeId === gradeId);
  }

  onSubjectChange(subjectId: string, event: any): void {
    const isChecked = event.target.checked;
    for (const grade of this.selectedGrades) {
      const subject = grade.subjects.find(
        (sub: any) => sub.subjectId === subjectId
      );
      if (subject) {
        subject.isChecked = isChecked;
        console.log(
          `Subject ${subject.subjectName} is ${
            isChecked ? 'checked' : 'unchecked'
          }`
        );
      }
    }
  }

  toggleLevel(levelId: string) {
    if (!this.displayedGrades[levelId]) {
      // Fetch grades if not already fetched
      this.getGradesByLevelId(levelId);
    } else {
      // Toggle visibility of grades
      this.displayedGrades[levelId] = !this.displayedGrades[levelId];
      this.isHeaderShow = Object.values(this.displayedGrades).some(
        (displayed) => displayed
      );
    }
  }

  currentIcons = {
    bell: '../../../assets/images/bell.svg',
    settings: '../../../assets/images/settings.svg',
    home: '../../../assets/images/home.svg',
  };

  selectedRegion: string | null = null;

  isDropdownOpen = false;

  // regions = [
  //   { name: 'منطقة الرياض', subscribers: 57, medal: '../../../assets/images/first.png' },
  //   { name: 'منطقة مكة المكرمة', subscribers: 203, medal: '../../../assets/images/sec.png' },
  //   { name: 'منطقة الشرقية', subscribers: 470, medal: '../../../assets/images/third.png' },
  //   { name: 'منطقة المدينة', subscribers: 765, medal: ' ' }
  // ];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRegion(region: any) {
    this.selectedRegion = region.name;
    this.isDropdownOpen = false;
  }

  // Track hover state
  isHovered = {
    bell: false,
    settings: false,
    home: false,
  };

  isSecChecked = false;
  isPrepChecked = false;
  isPrimaryChecked = false;

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
  // isHeaderShow=false;
  isPrimaryClick = false;
  isPrepClick = false;
  isSecClick = false;

  // isMaterailShow=false;
  // isHeaderMAterialShow=false;

  // isSubscriptionShow = false;
  // isSubHeaderShow = false;
  // isSbubButtonShow = false

  togglePrimary() {
    this.isPrimaryChecked = !this.isPrimaryChecked;
    this.isPrimaryClick = this.isPrimaryChecked; // Show grades only if checked
    this.isHeaderShow = true;
  }

  togglePrep() {
    this.isPrepChecked = !this.isPrepChecked;
    this.isPrepClick = this.isPrepChecked;
    this.isHeaderShow = true;
  }

  toggleSec() {
    this.isSecChecked = !this.isSecChecked;
    this.isSecClick = this.isSecChecked;
    this.isHeaderShow = true;
  }

  thirdChecked = false;
  secondChecked = false;
  firstChecked = false;

  thirdPrepChecked = false;
  secondPrepChecked = false;
  firstPrepChecked = false;

  sexPriChecked = false;
  fifthPriChecked = false;
  foutrhPriChecked = false;
  thirdPriChecked = false;
  secondPriChecked = false;
  firstPriChecked = false;

  isMenuOpen = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;
  menuOpen = false;

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

  toggleMatrial1() {
    this.isMaterailShow = true;
    this.isHeaderMAterialShow = true;
  }

  toggleMatrial(type: string) {
    switch (type) {
      case 'third':
        this.thirdChecked = !this.thirdChecked;
        break;
      case 'second':
        this.secondChecked = !this.secondChecked;
        break;
      case 'first':
        this.firstChecked = !this.firstChecked;
        break;
      case 'firstPrep':
        this.firstPrepChecked = !this.firstPrepChecked;
        break;
      case 'secondPrep':
        this.secondPrepChecked = !this.secondPrepChecked;
        break;
      case 'thirdPrep':
        this.thirdPrepChecked = !this.thirdPrepChecked;
        break;
      case 'sexPri':
        this.sexPriChecked = !this.sexPriChecked;
        break;
      case 'fifthPri':
        this.fifthPriChecked = !this.fifthPriChecked;
        break;
      case 'fourthPri':
        this.foutrhPriChecked = !this.fifthPriChecked;
        break;
      case 'thirdPri':
        this.thirdPriChecked = !this.thirdPriChecked;
        break;
      case 'secPri':
        this.secondPriChecked = !this.secondPriChecked;
        break;
      case 'firstPri':
        this.firstPriChecked = !this.firstPriChecked;
        break;
    }
  }

  // toggleSub(){
  //   this.isSubscriptionShow = true;
  //   this.isSubHeaderShow = true;
  //   this.isSbubButtonShow = true;
  // }
}
