import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  students: any[] = [
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    { name: 'أسامة علي ال سعود', image: '../../../assets/images/human.png' },
    // add more students
  ];

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
}
