import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MainPage } from './main.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../Pages/home/home.module').then((m) => m.HomePageModule),
        data: { id: 1, name: 'Home' }
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../Pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
        data: { id: 2, name: 'Profile' }
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./help/help.module').then((m) => m.HelpPageModule),
        data: { id: 3, name: 'Notification' }
      },
      {
        path: 'lists',
        loadChildren: () =>
          import('./generated-list/generated-list.module').then(
            (m) => m.GeneratedListPageModule
          ),
        data: { id: 4, name: 'List' }
      },
       {
          path: 'changeprofile',
          loadChildren: () => import('./modify-profile/modify-profile.module').then( m => m.ModifyProfilePageModule),
        data: { id: 5, name: 'Modify Profile' }
        },
        {
          path: 'notes',
          loadChildren: () => import('./notes/notes.module').then( m => m.NotesPageModule),
          data: { id: 6, name: 'Tour Diary' }
        },

        {
          path: 'schedule',
          loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule),
          data: { id: 7, name: 'Tour Program' }
        },
        {
          path: 'atn',
          loadChildren: () => import('./attandance/attandance.module').then( m => m.AttandancePageModule),
          data: { id: 8, name: 'Attandance'}
        },
        {
          path: '',
          redirectTo: '/main/home',
          pathMatch: 'full',
        },
    ],
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [MainPage],
})
export class MainPageModule {}
