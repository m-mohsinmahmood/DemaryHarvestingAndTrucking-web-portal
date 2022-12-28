import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-status-bar',
  templateUrl: './onboarding-status-bar.component.html',
  styleUrls: ['./onboarding-status-bar.component.scss']
})
export class OnboardingStatusBarComponent implements OnInit {
  @Input() items: any

  constructor() { }

  ngOnInit(): void {
  }

}
