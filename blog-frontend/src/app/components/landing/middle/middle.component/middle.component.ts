import { Component , OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
// import {} from '@angular/animations'
@Component({
  selector: 'app-middle',
  imports: [RouterLink],
  templateUrl: './middle.component.html',
  styleUrl: './middle.component.scss',
})
export class MiddleComponent implements OnInit {
  headline = 'Welcome to Our Blog Platform';
  subheadline = 'Discover, Share, and Connect with Amazing Stories';
  ctaText = 'Get Started';
  ctaLink = '/signup';
  isVisible = true;

  currentHeadline = '';
  private headlineIndex = 0;
  private charIndex = 0;

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
    this.animateHeadline();
  }
  animateHeadline(): void {
    this.currentHeadline = '';
    this.charIndex = 0;
    this.typeHeadline();
  }
  typeHeadline(): void {
    if (this.charIndex < this.headline.length) {
      this.currentHeadline += this.headline.charAt(this.charIndex);
      this.charIndex++;
      setTimeout(() => this.typeHeadline(), 100); // typing speed
    }
    else {
      setTimeout(() => this.eraseHeadline(), 2000); // wait before erasing
    }
  }
  eraseHeadline(): void {
    if (this.charIndex > 0) {
      this.currentHeadline = this.currentHeadline.slice(0, -1);
      this.charIndex--;
      setTimeout(() => this.eraseHeadline(), 50); // erasing speed
    }
    else {
      this.headlineIndex = (this.headlineIndex + 1) % 1; // only one headline for now
      setTimeout(() => this.typeHeadline(), 500); // wait before typing next headline
    }
  }
}
