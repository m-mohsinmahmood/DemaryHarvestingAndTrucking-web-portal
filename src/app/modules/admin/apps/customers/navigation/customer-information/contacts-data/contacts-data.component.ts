import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'contacts-data',
  templateUrl: './contacts-data.component.html',
  styleUrls: ['./contacts-data.component.scss'],
})
export class ContactsDataComponent implements OnInit {

  @Input() customers: any;
  @Input() isContactData: boolean;
  @Output() toggleCustomerContacts: EventEmitter <any> = new EventEmitter<any>();


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}


  backHandler() {
      this.toggleCustomerContacts.emit();
  }
}
