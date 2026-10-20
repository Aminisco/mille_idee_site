import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const SITE_URL = 'https://mille-idees.be';

/**
 * Remplace la stratégie de titre du routeur : en plus du <title>, chaque page reçoit
 * sa description, son adresse canonique et ses balises de partage (Open Graph).
 * Au prérendu, tout ça est écrit dans le HTML de chaque page.
 */
@Injectable({ providedIn: 'root' })
export class SeoStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;

    // Sans titre ni description sur la route, on garde ceux d'index.html
    const title = this.buildTitle(snapshot) ?? this.title.getTitle();
    const description: string = route.data['description'] ?? this.meta.getTag('name="description"')?.content ?? '';
    const url = SITE_URL + snapshot.url.split(/[?#]/)[0];

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });

    // Page introuvable : ni canonique ni indexation
    if (route.data['noindex']) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.meta.removeTag('property="og:url"');
      this.setCanonical(null);
    } else {
      this.meta.removeTag('name="robots"');
      this.meta.updateTag({ property: 'og:url', content: url });
      this.setCanonical(url);
    }
  }

  private setCanonical(url: string | null): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
