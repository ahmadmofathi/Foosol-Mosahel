import { Component, OnInit } from '@angular/core';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent implements OnInit {
  pdfData: Blob | null = null;
  currentPage = 1;
  totalPages = 1;
  zoomLevel = 100;
  loadingError = false;
  errorMessage = '';

  constructor(private pdfService: PdfService) {}

  ngOnInit() {
    this.pdfService.getPDF().subscribe(
      (data: Blob) => {
        this.pdfData = data;
        // Example placeholder: Set total pages (replace with real logic)
        this.totalPages = this.getPdfTotalPages();
      },
      (error) => {
        this.loadingError = true;
        this.errorMessage = 'Failed to load PDF. Please try again.';
        console.error('Error fetching PDF:', error);
      }
    );
  }

  getPdfTotalPages(): number {
    // Implement logic to get the total number of pages
    return 10; // Replace with actual logic if needed
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  zoomIn(): void {
    this.zoomLevel += 10;
  }

  zoomOut(): void {
    if (this.zoomLevel > 10) {
      this.zoomLevel -= 10;
    }
  }

  goToPage(): void {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    // Trigger page rendering logic here
  }
}
