import { Routes } from '@angular/router';
import { PessoaComponent } from './components/pessoa/pessoa.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pessoas', pathMatch: 'full' }, // Redireciona a raiz para /pessoas
  { path: 'pessoas', component: PessoaComponent }
];
