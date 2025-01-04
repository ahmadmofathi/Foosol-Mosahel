import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-images-viewer',
  templateUrl: './images-viewer.component.html',
  styleUrls: ['./images-viewer.component.css'],
})
export class ImagesViewerComponent {
  @Input() images: string[] = [];
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
