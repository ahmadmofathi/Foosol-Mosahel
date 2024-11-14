import { Component } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface BorderTemplate {
  src: string;
  content: string;
}

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent {
  certificates = [
    { image: '../../../assets/images/certi (3).png', altText: 'Certificate 1' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (7).png', altText: 'Certificate 2' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (2).png', altText: 'Certificate 3' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (1).png', altText: 'Certificate 1' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (5).png', altText: 'Certificate 2' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (4).png', altText: 'Certificate 3' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (6).png', altText: 'Certificate 1' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (5).png', altText: 'Certificate 2' ,activeButton: '', isMenuOpen: false},
    { image: '../../../assets/images/certi (5).png', altText: 'Certificate 3' ,activeButton: '', isMenuOpen: false},
    // Add more certificates as needed
  ];

  onButtonClick(certificate: any, buttonType: string): void {
    // Toggle active button type for the certificate
    certificate.activeButton = buttonType;
  }

  toggleMenu(certificate: { isMenuOpen: boolean }): void {
    certificate.isMenuOpen = !certificate.isMenuOpen;
  }

  menuAction(action: string): void {
    console.log(`Menu action selected: ${action}`);
    // Implement your menu action logic here (e.g., edit, delete)
  }

  // create certificate 

  public Editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'
      ]
    },
    // Custom style configurations for the editing area
    editorConfig: {
      editorConfig: {
        content: {
          inlineStyles: {
            'background-color': '#e9e9e9',
            'border-bottom': 'none',
            'border-right': 'none',
            'border-left': 'none',
            'width': '100%'
          }
        }
      }
    }
  };
  public certificateContent: string = '';  // CKEditor content (should be a string)
  public selectedBorder: string = ''; 

  // List of border image URLs and associated certificate template content
  public borders: BorderTemplate[] =[
    { src: '../../../assets/images/certi (3).png', content: '<h2>Certificate of Achievement</h2><p>This certificate is awarded to...</p>' },
    { src: '../../../assets/images/certi (4).png', content: '<h2>Certificate of Appreciation</h2><p>This is to recognize...</p>' },
    { src: '../../../assets/images/certi (5).png', content: '<h2>Volunteer Certificate</h2><p>Thank you for your valuable time...</p>' },
    // Add more borders with template content as needed
  ];

  selectBorder(border: BorderTemplate) {
    this.selectedBorder = border.src;         // Assign only the URL to selectedBorder
    this.certificateContent = border.content; // Assign only the content to CKEditor
  }

  saveCertificate() {
    console.log("Certificate Content:", this.certificateContent);
    console.log("Selected Border:", this.selectedBorder);
    // Handle saving the certificate content and selected border
  }

  public isBorderSelectionLocked = true;

  // Optional: Unlock the border selection area based on certain conditions
  unlockBorderSelection(): void {
    this.isBorderSelectionLocked = false;
  }
  public certificateContent2: string = `

  <p><img src="../../../assets/images/certi (5).png" alt="Certificate Image" style="width:100%;  border:1px solid #ddd; padding:10px;"></p>

`;

  saveChanges() {
    console.log('Content saved:', this.certificateContent);
    // Implement your save functionality here
  }

  deleteCertificate() {
    this.certificateContent = '';  // Clear the content in the CKEditor
    console.log('Content deleted');
  }
}
