import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly menuOpen = signal(false);

  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly drawer = viewChild.required<ElementRef<HTMLElement>>('drawer');

  constructor(router: Router) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu(true);
      return;
    }
    this.menuOpen.set(true);
    this.syncBodyLock();
    // Le tiroir n'est plus inert qu'après le rendu
    setTimeout(() => this.drawer().nativeElement.querySelector<HTMLElement>('a')?.focus());
  }

  closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.syncBodyLock();
    if (restoreFocus) this.menuButton().nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu(true);
  }

  private syncBodyLock(): void {
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }
}
