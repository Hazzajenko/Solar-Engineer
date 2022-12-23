import {Component, EnvironmentInjector, inject, OnInit} from '@angular/core';
import {AppComponentStore} from "@app-component/store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  title = 'mobile';
  private store = inject(AppComponentStore)
  public environmentInjector = inject(EnvironmentInjector)

  ngOnInit(): void {
    this.store.signIn({ username: 'string', password: 'Password1' }).unsubscribe()
  }
}
