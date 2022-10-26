import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthLoginGuard } from './Gaurds/auth-login.guard';
import { UGaurdsGuard } from './Gaurds/u-gaurds.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren:()=> import('./authentication/main.module').then(m => m.MainPageModule),
    canActivate:[AuthLoginGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./Pages/main.module').then( m => m.MainPageModule),
    canActivate:[UGaurdsGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
