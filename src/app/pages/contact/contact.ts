import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import emailjs from '@emailjs/browser';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {

  contactForm: FormGroup;
  isSending = false;
  sendOk: boolean | null = null;

  // 👉 mets tes vrais IDs ici
  private serviceId = 'service_muzfpf8';
  private templateId = 'template_u6lnfqt';
  private publicKey = 'DBOGlECxYLOPZ4IFj';


  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    this.sendOk = null;

    const data = this.contactForm.value;

    emailjs.send(
      this.serviceId,
      this.templateId,
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      },
      { publicKey: this.publicKey }
    )
      .then(() => {
        this.isSending = false;
        this.sendOk = true;
        this.contactForm.reset();
      })
      .catch(() => {
        this.isSending = false;
        this.sendOk = false;
      });
  }
}
