import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApplyNowComponent } from '../landing-page/apply-now/apply-now.component';

@Component({
  selector: 'app-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss']
})
export class EmploymentPageComponent implements OnInit {


  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _matDialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.playPauseVideo();

  }

  openDialog() {
    // this.router.navigateByUrl('pages/applicant');
    const dialogRef = this._matDialog.open(ApplyNowComponent, {
      data: {},
    });
    dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
      //Call this function only when success is returned from the create API call//
    });
  }
  //#region play and pause vidoe sound

  playPauseVideo() {
    let videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      // We can only control playback without insteraction if video is mute
      video.muted = true;
      // Play is a promise so we need to check we have it
      let playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {
          let observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (
                  entry.intersectionRatio !== 1 &&
                  !video.paused
                ) {
                  video.pause();
                } else if (video.paused) {
                  video.play();
                }
              });
            },
            { threshold: 0.2 }
          );
          observer.observe(video);
        });
      }
    });
  }
  //#ndregion
}
