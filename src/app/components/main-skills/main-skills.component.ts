import { Component } from '@angular/core';

@Component({
  selector: 'app-main-skills',
  templateUrl: './main-skills.component.html',
  styleUrls: ['./main-skills.component.css']
})
export class MainSkillsComponent {

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

  tableData = Array(1).fill(null).map(() =>
    Array(9).fill(null).map(() => ({ status: 'false', dropdownOpen: false }))
  );
  
  toggleDropdown(event: MouseEvent, rowIndex: number, colIndex: number): void {
    event.stopPropagation();
    // Toggle dropdown open state for the specific cell
    this.tableData[rowIndex][colIndex].dropdownOpen = !this.tableData[rowIndex][colIndex].dropdownOpen;
  }
  
  setStatus(rowIndex: number, colIndex: number, status: string): void {
    // Update the cell's status and close the dropdown
    this.tableData[rowIndex][colIndex].status = status;
    this.tableData[rowIndex][colIndex].dropdownOpen = false;
  }
}
