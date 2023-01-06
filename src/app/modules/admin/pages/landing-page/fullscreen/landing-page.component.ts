import { ApplyNowComponent } from './../apply-now/apply-now.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'landing-page-classic',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LandingPageFullscreenComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    register(): void {
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
    //#endregion
}
