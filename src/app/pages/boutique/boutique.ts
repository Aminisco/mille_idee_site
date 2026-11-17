import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, InjectionToken, Injector, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { isHttpsUrl, isPlaceholder } from '../../config/values';
import { formatPrice, PRODUCTS, Product } from '../../data/products';
import { OrderPayload, submitOrder } from './order';

/** Produits affichés. Injectable pour pouvoir tester avec d'autres données. */
export const SHOP_PRODUCTS = new InjectionToken<Product[]>('SHOP_PRODUCTS', { factory: () => PRODUCTS });

/** Envoi de la commande. Injectable pour simuler le réseau dans les tests. */
export const ORDER_SUBMITTER = new InjectionToken<(order: OrderPayload) => Promise<void>>('ORDER_SUBMITTER', {
  factory: () => (order: OrderPayload) => submitOrder(order),
});

type OrderStatus = 'idle' | 'success' | 'error';
type OrderField = 'nom' | 'email' | 'quantite';

function wholeNumber(control: AbstractControl): ValidationErrors | null {
  const value = control.value as number | null;
  return value === null || Number.isInteger(value) ? null : { integer: true };
}

@Component({
  selector: 'app-boutique',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './boutique.html',
  styleUrl: './boutique.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Boutique {
  protected readonly products = inject(SHOP_PRODUCTS);
  private readonly submitter = inject(ORDER_SUBMITTER);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('orderDialog');

  protected readonly formatPrice = formatPrice;
  protected readonly shapes = ['shape-pebble', 'shape-leaf', 'shape-arch'];

  protected readonly selected = signal<Product | null>(null);
  protected readonly sending = signal(false);
  protected readonly status = signal<OrderStatus>('idle');
  /** Vrai après un envoi invalide : fait apparaître les erreurs de tous les champs. */
  protected readonly submitted = signal(false);

  protected readonly paymentUrl = computed(() => {
    const link = this.selected()?.paymentLink;
    return link !== undefined && !isPlaceholder(link) && isHttpsUrl(link) ? link : null;
  });

  protected readonly form = new FormGroup({
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    quantite: new FormControl<number | null>(1, [Validators.required, Validators.min(1), Validators.max(99), wholeNumber]),
    remarque: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    'bot-field': new FormControl('', { nonNullable: true }),
  });

  private opener: HTMLElement | null = null;
  /** Change à chaque ouverture : un envoi qui finit après une fermeture ne touche plus l'écran. */
  private session = 0;

  private focusAfterRender(selector: string): void {
    afterNextRender(() => this.dialog().nativeElement.querySelector<HTMLElement>(selector)?.focus(), { injector: this.injector });
  }

  protected showError(field: OrderField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  // showModal() seulement au clic : le prérendu n'a pas de DOM interactif
  protected open(product: Product, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.selected.set(product);
    this.session++;
    this.status.set('idle');
    this.submitted.set(false);
    this.form.reset({ nom: '', email: '', quantite: 1, remarque: '', 'bot-field': '' });
    // `sending` n'est pas remis à zéro ici : un envoi encore en cours garde le verrou anti double envoi
    this.dialog().nativeElement.showModal();
    // Si la fenêtre affichait encore la vue « merci », le focus du navigateur tombe sur un élément qui disparaît au rendu
    this.focusAfterRender('#order-nom');
  }

  protected cancel(): void {
    if (this.sending()) {
      return;
    }
    this.dialog().nativeElement.close();
  }

  // Échap pendant l'envoi fermerait la fenêtre avant de savoir si la commande est partie
  protected onEscape(event: Event): void {
    if (this.sending()) {
      event.preventDefault();
    }
  }

  // Appelé à la fermeture, y compris par Échap : le focus revient au bouton qui a ouvert
  protected onClose(): void {
    this.opener?.focus();
    this.opener = null;
  }

  protected async send(): Promise<void> {
    if (this.sending()) {
      return;
    }
    if (this.form.invalid) {
      this.submitted.set(true);
      this.form.markAllAsTouched();
      setTimeout(() => this.dialog().nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const product = this.selected();
    if (!product) {
      return;
    }

    const session = this.session;
    this.sending.set(true);
    this.status.set('idle');
    const value = this.form.getRawValue();
    const order: OrderPayload = {
      produit: product.name,
      nom: value.nom.trim(),
      email: value.email.trim(),
      quantite: Number(value.quantite),
      remarque: value.remarque.trim(),
      'bot-field': value['bot-field'],
    };
    let result: OrderStatus = 'success';
    try {
      await this.submitter(order);
    } catch {
      result = 'error';
    }
    this.sending.set(false);
    if (session !== this.session) {
      return;
    }
    this.status.set(result);
    // Le bouton d'envoi (ou le formulaire) vient de disparaître ou d'être désactivé : on place le focus sur la suite
    this.focusAfterRender(result === 'success' ? '#order-success' : 'button[type=submit]');
  }
}
