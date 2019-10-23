/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5db01466bcbe47264d81f942
*
* You will get 10% discount for each one of your friends
* 
*/
// Import Libraries
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { SHA3 } from 'sha3';

// Security
import { SecurityService } from '../services/security.service';
import { AuthenticationService } from '../authentication.service';
import { User } from 'src/app/domain/test_db/user';
import { UserService } from 'src/app/services/user.service';
import { store } from 'src/app/security/current-user';

/**
 * Edit my profile
 */
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

    user: User;
    passwordOld: string;
    passwordNew: string;
    passwordNewConfirm: string;
    showError: boolean;
    @ViewChild('closeModal') closeModal: ElementRef;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private securityService: SecurityService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            // Get logged user
            this.authenticationService.getUser().subscribe(user => this.user = user);
        });
    }

    /**
     * Save User
     *
     * @param {boolean} valid Form validity
     */
    save(valid: boolean) {
        if (valid)
            this.userService.update(this.user).subscribe(data => {
                this.userService.get(this.user._id).subscribe(user => {
                    store.setUser(user);
                    this.router.navigateByUrl('/home');
                });
            });
    }

    /**
     * Change password of user
     */
    changePassword() {
        this.showError = false;

        // Convert passwords in SHA-3
        const hashNewPwd = new SHA3(512);
        hashNewPwd.update(this.passwordNew);
        const passwordNew = hashNewPwd.digest('hex');

        const hash = new SHA3(512);
        hash.update(this.passwordOld);
        const passwordOld = hash.digest('hex');

        // Change password
        this.securityService.changePassword(passwordNew, passwordOld).subscribe(data => {
            this.passwordOld = null;
            this.passwordNew = '';
            this.passwordNewConfirm = '';
            this.showError = false;
            this.closeModal.nativeElement.click();
        }, err => {
            this.showError = true;
        });
    }
}

