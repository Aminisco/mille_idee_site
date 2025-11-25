import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit{

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    const texts = document.querySelectorAll('.presentation-text');
    const images = document.querySelectorAll('.img-accueil');

    texts.forEach(el => observer.observe(el));
    images.forEach(el => observer.observe(el));
  }

}
