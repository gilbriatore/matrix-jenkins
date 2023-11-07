import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'atividade',
        data: { pageTitle: 'matrixApp.atividade.home.title' },
        loadChildren: () => import('./atividade/atividade.routes'),
      },
      {
        path: 'bloom',
        data: { pageTitle: 'matrixApp.bloom.home.title' },
        loadChildren: () => import('./bloom/bloom.routes'),
      },
      {
        path: 'curso',
        data: { pageTitle: 'matrixApp.curso.home.title' },
        loadChildren: () => import('./curso/curso.routes'),
      },
      {
        path: 'escola',
        data: { pageTitle: 'matrixApp.escola.home.title' },
        loadChildren: () => import('./escola/escola.routes'),
      },
      {
        path: 'matriz',
        data: { pageTitle: 'matrixApp.matriz.home.title' },
        loadChildren: () => import('./matriz/matriz.routes'),
      },
      {
        path: 'modalidade',
        data: { pageTitle: 'matrixApp.modalidade.home.title' },
        loadChildren: () => import('./modalidade/modalidade.routes'),
      },
      {
        path: 'tipo-de-curso',
        data: { pageTitle: 'matrixApp.tipoDeCurso.home.title' },
        loadChildren: () => import('./tipo-de-curso/tipo-de-curso.routes'),
      },
      {
        path: 'unidade',
        data: { pageTitle: 'matrixApp.unidade.home.title' },
        loadChildren: () => import('./unidade/unidade.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
