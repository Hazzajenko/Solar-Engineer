import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "@auth/api";
import {AppComponentStore} from "./app.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'web';
  private store = inject(AppComponentStore)

  ngOnInit() {
    this.signIn()
  }

  signIn() {
    this.store.signIn({ username: 'string', password: 'Password1' }).unsubscribe()
  }
}
