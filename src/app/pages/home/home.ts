import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {

  currentSlide = 0;
  private slideInterval: any;

  readonly slides = [
    'assets/image_events/maraude_mars.jpg',
    'assets/image_events/photo_groupe.jpg',
    'assets/image_events/cleanwalking1.jpg',
    'assets/image_events/cleanwalking2.jpg',
    'assets/image_events/boxe1.jpg',
    'assets/image_events/boxe2.jpg',
    'assets/image_events/bonbons.jpg',
  ];

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  setSlide(index: number): void {
    this.currentSlide = index;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.presentation-text')
      .forEach(el => observer.observe(el));

    this.slideInterval = setInterval(() => this.nextSlide(), 4500);
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }
}
