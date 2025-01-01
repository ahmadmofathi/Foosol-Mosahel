import { Component, ElementRef, Renderer2, OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionService } from 'src/app/services/region/region.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
})
export class SubscriptionComponent implements OnInit, OnDestroy, AfterViewInit {
  elements: any[] = [];
  regionForm: FormGroup;
  isDeleteModalOpen: boolean = false;
  selectedItemId: number | null = null;
  isMenuOpen: { [key: number]: boolean } = {};
  private globalClickListener!: () => void;
  isEditMode = false;
  currentRegionId: string | null = null;
  currentPage = 1;
  totalPages = 10;
  pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  addContractActive: boolean = true;
  exportPdfActive: boolean = false;
  isNavbarOpen = false;
  isIconShow = false;
  isSettingBarOpen = false;

  pageNumber = 1; // Current page
  itemsPerPage = 8; // Items per page
  totalItems = 9; // Initial total items
  maxVisiblePages = 5; // Maximum number of visible pages
  hasMoreData = true; // Flag to check if more data exists

  @ViewChild('createModal', { static: true }) createModal!: ElementRef;
  private modalInstance!: Modal;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private regionService: RegionService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.regionForm = this.fb.group({
      regionName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllRegions();
    this.globalClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.handleOutsideClick(event);
    });
  }

  ngAfterViewInit(): void {
    this.initializeModal();
  }

  ngOnDestroy() {
    if (this.globalClickListener) {
      this.globalClickListener();
    }
  }

  initializeModal(): void {
    const modalElement = this.createModal.nativeElement;
    this.modalInstance = new Modal(modalElement, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  getAllRegions() {
    this.regionService.getAllRe(this.pageNumber, this.itemsPerPage).subscribe(
      (response) => {
        this.elements = response;
        console.log('Regions:', this.elements);
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }

  onSubmitAdd() {
    if (this.regionForm.valid) {
      const newRegion = this.regionForm.value;
      this.regionService.addRegion(newRegion).subscribe(
        (response) => {
          this.elements.push(response); // Add the new region to the list
          this.toastr.success('تم إضافة المنطقة بنجاح!', 'نجاح', { timeOut: 2000 });
          this.getAllRegions();

          // Close the modal programmatically
          this.closeModal();
        },
        (error) => {
          this.toastr.error('خطأ أثناء إضافة المنطقة', 'خطأ', { timeOut: 2000 });
          console.error('Add region error:', error);
        }
      );
    }
  }

  cleanUpModalStyles(): void {
    // Remove any backdrop divs from the page.
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
  
    // Remove the 'modal-open' class from the body, which prevents scrolling when the modal is open.
    document.body.classList.remove('modal-open');
  
    // Remove any inline styles for overflow and padding-right that Bootstrap adds to the body.
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  

  closeModal(): void {
    this.modalInstance.hide();  // Close the modal using the Bootstrap modal instance
    this.cleanUpModalStyles();
  }
  

  onSubmitUpdate() {
    if (this.regionForm.valid && this.currentRegionId) {
      const updatedRegion = { id: this.currentRegionId, ...this.regionForm.value };
      this.regionService.updateRegion(this.currentRegionId, updatedRegion).subscribe(
        (response) => {
          const index = this.elements.findIndex((item) => item.id === this.currentRegionId);
          if (index !== -1) {
            this.elements[index] = response; // Update the region in the list
          }
          this.toastr.success('تم تحديث المنطقة بنجاح!', 'نجاح', { timeOut: 2000 });
          this.getAllRegions();
  
          // Close the edit modal programmatically
          this.closeModalById('editModal');
        },
        (error) => {
          this.toastr.error('خطأ أثناء تحديث المنطقة', 'خطأ', { timeOut: 2000 });
          console.error('Update region error:', error);
        }
      );
    } else {
      this.toastr.error('خطأ: لم يتم تحديد المنطقة للتحديث', 'خطأ', { timeOut: 2000 });
    }
  }



  // deleteRegion(id: number): void {
  //   this.regionService.deleteRegion(id).subscribe(
  //     () => {
  //       this.elements = this.elements.filter(item => item.id !== id);
  //       this.toastr.success('تم مسح هذه المنطقة بنجاح!', 'تم المسح', { timeOut: 2000 });
  //     },
  //     (error) => {
  //       this.toastr.error('خطأ في مسح المنطقة', 'خطأ', { timeOut: 2000 });
  //       console.error('Delete region error:', error);
  //     }
  //   );
  // }

  // deleteRegion(id: number): void {
  //   const userConfirmed = confirm('هل أنت متأكد أنك تريد مسح هذه المنطقة؟');
  //   if (userConfirmed) {
  //     this.regionService.deleteRegion(id).subscribe(
  //       () => {
  //         this.elements = this.elements.filter(item => item.id !== id);
  //         this.toastr.success('تم مسح هذه المنطقة بنجاح!', 'تم المسح', { timeOut: 2000 });
  //       },
  //       (error) => {
  //         this.toastr.error('خطأ في مسح المنطقة', 'خطأ', { timeOut: 2000 });
  //         console.error('Delete region error:', error);
  //       }
  //     );
  //   }
  // }
  isModalOpen: boolean = false;
  selectedRegionId: number | null = null;
  
  openConfirmModal(id: number): void {
    this.selectedRegionId = id;
  }

  confirmDelete(): void {
    if (this.selectedRegionId != null) {
      this.regionService.deleteRegion(this.selectedRegionId).subscribe(
        () => {
          this.elements = this.elements.filter(item => item.id !== this.selectedRegionId);
          this.toastr.success('تم مسح هذه المنطقة بنجاح!', 'تم المسح', { timeOut: 2000 });

          // Close the modal using imported Bootstrap Modal
         this.closeModalById('deleteModal')

          this.selectedRegionId = null;
        },
        (error) => {
          this.toastr.error('خطأ في مسح المنطقة', 'خطأ', { timeOut: 2000 });
          console.error('Delete region error:', error);
          this.selectedRegionId = null;
        }
      );
    }
  }

  openEditModal(region: any) {
    this.isEditMode = true;
    this.currentRegionId = region.id; // Set the current region ID for updating
    this.regionForm.patchValue({ regionName: region.regionName }); // Populate the form
  
    const modal = document.getElementById('editModal');
    if (modal) {
      const modalInstance = new Modal(modal);
      modalInstance.show(); // Show the modal
    }
  }
  


  openAddModal() {
    this.regionForm.reset();
  
    // Set the flag to false since this is "Add" mode, not "Edit"
    this.isEditMode = false;
  
    // Clear any selected grade ID, if any
    this.currentRegionId = ''; 
  
    // Open the modal using Bootstrap modal API
    const modalElement = document.getElementById('addModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Get or create instance
      modalInstance.show(); // Show the modal
    } else {
      console.error('Add modal element not found.');
    }
  }

  closeModalById(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // Close the modal properly
      }
    }
  
    // Clean up Bootstrap modal styles
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  

  // toggleMenu(item: any): void {
  //   this.elements.forEach(region => (region.isMenuOpen = false)); // Close other menus
  //   item.isMenuOpen = !item.isMenuOpen; // Toggle current menu
  // }
  

  toggleAddContract() {
    this.addContractActive = true;
    this.exportPdfActive = false;
    this.openAddModal();   }

  toggleExportPdf() {
    this.exportPdfActive = true;
    this.addContractActive = false;
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

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  toggleMenu(item: any): void {
    this.elements.forEach(region => (region.isMenuOpen = false));
    item.isMenuOpen = !item.isMenuOpen;
  }

  handleOutsideClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = {};
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menus = document.querySelectorAll('.dropdown-menu');
    const buttons = document.querySelectorAll('.ellipsis-btn');

    let clickedInside = false;
    menus.forEach((menu, index) => {
      if (menu.contains(target) || buttons[index]?.contains(target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      this.elements.forEach(region => (region.isMenuOpen = false));
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
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

  showMenu(index: number): void {
    this.elements.forEach((region, i) => {
      region.isMenuOpen = i === index ? !region.isMenuOpen : false;
    });
  }
}
