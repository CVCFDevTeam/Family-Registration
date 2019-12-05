import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-thankyoupage',
    templateUrl: './thankyoupage.component.html'
})
export class ThankyoupageComponent implements OnInit {

    constructor(private router: Router, private userService: UserService, ) { }

    ngOnInit() {
        // scrolls to top of screen
        window.scrollTo(0, 0);
    }

    navigateToForm() {
        this.userService.registers = [];
        this.router.navigate(['/', 'form']);
    }

}
