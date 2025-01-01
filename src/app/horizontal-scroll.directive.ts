import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHorizontalScroll]'
})
export class HorizontalScrollDirective {

  constructor(private el: ElementRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault(); // Prevent default vertical scrolling

    const container = this.el.nativeElement;
    
    // Adjust scrolling based on direction
    const isRTL = getComputedStyle(container).direction === 'rtl';
    const scrollAmount = isRTL ? -event.deltaX : event.deltaX;

    container.scrollLeft += scrollAmount; // Scroll horizontally
  }
}
