import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';

@Component({
  selector: 'app-hotro',
  templateUrl: './hotro.component.html',
  styleUrls: ['./hotro.component.scss']
})
export class HotroComponent implements OnInit {
  @ViewChild('supportNgForm') supportNgForm: NgForm;

  alert: any;
  supportForm: FormGroup;

  /**
   * Constructor
   */
  constructor(
      private _formBuilder: FormBuilder,
      private _helpCenterService: HelpCenterService
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Create the support form
      this.supportForm = this._formBuilder.group({
          name   : ['', Validators.required],
          email  : ['', [Validators.required, Validators.email]],
          subject: ['', Validators.required],
          message: ['', Validators.required]
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Clear the form
   */
  clearForm(): void
  {
      // Reset the form
      this.supportNgForm.resetForm();
  }

  /**
   * Send the form
   */
  sendForm(): void
  {
      // Send your form here using an http request
      console.log('Your message has been sent!');

      // Show a success message (it can also be an error message)
      // and remove it after 5 seconds
      this.alert = {
          type   : 'success',
          message: 'Your request has been delivered! A member of our support staff will respond as soon as possible.'
      };

      setTimeout(() => {
          this.alert = null;
      }, 7000);

      // Clear the form
      this.clearForm();
  }
}
