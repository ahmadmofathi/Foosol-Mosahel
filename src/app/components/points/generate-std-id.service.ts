import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenerateStdIdService {
  private counter = 0;

  generateUniqueID(): string {
    const randomPart = Math.floor(100 + Math.random() * 900); // 3-digit random number
    const timestampPart = Date.now().toString().slice(-4); // Last 4 digits of the timestamp
    this.counter = (this.counter + 1) % 100; // Increment and wrap counter at 100
    return `${randomPart}${this.counter}${timestampPart}`.slice(-4); // Ensure it's 4 digits
  }
}
