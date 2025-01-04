import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-videos-viewer',
  templateUrl: './videos-viewer.component.html',
  styleUrls: ['./videos-viewer.component.css'],
})
export class VideosViewerComponent {
  @Input() videos: string[] = [];
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
