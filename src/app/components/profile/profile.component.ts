import { Component, ElementRef, ViewChild } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public Editor = ClassicEditor;
  public editorData = ''; // CKEditor content
  public editorConfig = {
    placeholder: '.... قم بالكتابة هنا',
    toolbar: {
      items: [
        'bold', 'italic', '|', 'undo', 'redo', '|', 'blockQuote', 'insertTable', 'mediaEmbed'
      ]
    }
  };

  isInternShipModalOpen = false; // For the first modal
  isNewModalOpen = false; // For the new modal

  constructor(private location: Location) {}


  goBack(): void {
    this.location.back();
  }

  // Method to open the new modal and close the current one
  openNewModal() {
    this.isNewModalOpen = true;
    this.isInternShipModalOpen = false; // Close the current modal
    // Optionally, you can also use jQuery or Bootstrap modal methods to handle this
    // $('#internShip').modal('hide'); // Close current modal if using jQuery
    // $('#newModal').modal('show'); // Show new modal if using jQuery
  }

  closeCurrentModal() {
    this.isInternShipModalOpen = false;
    // Handle modal close logic here if needed
  }

  private editorInstance: any; // Stores the CKEditor instance

  // @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef;

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  showFileUploadContent = false;
  showEditor = false;
  uploadedFileUrl: string | null = null;

  capturedImage: string | ArrayBuffer | null = null;
  public cameraOpen: boolean = false;
  private videoStream: MediaStream | null = null;

  // Method to trigger file input dialog
  // triggerFileUpload(): void {
  //   if (this.fileInput) {
  //     this.fileInput.nativeElement.click();
  //   }
  // }

  // Method to handle file selection

  // Goals
  
  onFileSelected(event: any): void {
    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.capturedImage = e.target.result; 
    //     this.insertImageIntoEditor(this.capturedImage as string);
    //   };
    //   reader.readAsDataURL(file); // Read file as base64
    // }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedFileUrl = reader.result as string; // Set the file URL
      };
      reader.readAsDataURL(file);
    }
  }



  // Method called when CKEditor is ready
  onReady(editor: any): void {
    this.editorInstance = editor; // Store the CKEditor instance
  }

  // Method to insert the image into CKEditor
  insertImageIntoEditor(imageSrc: string): void {
    if (this.editorInstance) {
      this.editorInstance.model.change((writer: any) => {
        const imageElement = writer.createElement('imageBlock', {
          src: imageSrc
        });
        this.editorInstance.model.insertContent(imageElement, this.editorInstance.model.document.selection);
      });
    }
  }

  // Opens the camera
  openCamera(): void {
    this.cameraOpen = true; // Show camera feed
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoStream = stream;
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }

  // Capture the photo from the camera stream
  capturePhoto(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;

      // Create canvas to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        // Draw video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas content to a base64 image
        this.capturedImage = canvas.toDataURL('image/png');
        this.insertImageIntoEditor(this.capturedImage); // Insert into CKEditor
        this.stopCamera(); // Stop camera after capturing photo
      }
    }
  }

  // Stop the camera stream
  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
      this.cameraOpen = false;
    }
  }


  showMoreData = false;
  whichClick = true;

  toggleMoreData() {
    this.showMoreData = !this.showMoreData;
    this.whichClick = !this.whichClick;
  }

  showEditorContent() {
    this.showEditor = true;
    this.showFileUploadContent = false;
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
    this.showFileUploadContent = true;
    this.showEditor = false;
  }

  
  
}
