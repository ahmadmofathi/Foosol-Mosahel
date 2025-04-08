import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
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
    this.showIcon();
  }

  showIcon() {
    this.isIconShow = true;
  }

  openSetting() {
    this.isSettingBarOpen = !this.isSettingBarOpen;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menu Open State:', this.menuOpen); // Debugging
  }
}