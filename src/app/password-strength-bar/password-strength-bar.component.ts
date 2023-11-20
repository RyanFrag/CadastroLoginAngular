import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  template: `
    <div class="password-strength-container">
      <div class="password-strength-background-bar"></div>
      <div class="password-strength-bar" [ngClass]="getStrengthClass()" [style.width]="strength + '%'"></div>
    </div>
  `,
  styles: [`
    .password-strength-container {
      position: relative; /* Add position relative to the container */
      height: 10px;
      width: 100%;
      margin-bottom: 10px;
      margin-top: 20px;
      border-radius: 5px;
      overflow: hidden;
    }



    .password-strength-bar {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 2; 
    }

    .gray {
      background-color: gray; /* Color for strength 0 */
    }

    .weak {
      background-color: red; /* Color for weak strength */
    }

    .medium {
      background-color: orange; /* Color for medium strength */
    }

    .strong {
      background-color: green; /* Color for strong strength */
    }
  `]
})
export class PasswordStrengthBarComponent {
  @Input() set strength(value: number) {
    this._strength = value >= 0 ? value : 0;
  }
  get strength(): number {
    return this._strength;
  }

  private _strength: number = 0;

  getStrengthClass(): string {
    if (this.strength === 0) {
      return 'gray';
    } else if (this.strength <= 30) {
      return 'weak';
    } else if (this.strength <= 70) {
      return 'medium';
    } else {
      return 'strong';
    }
  }
}
