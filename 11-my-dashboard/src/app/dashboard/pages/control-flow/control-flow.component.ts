import { Component, signal } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';

type Grade = 'A' | 'B' | 'F';

@Component({
  selector: 'app-control-flow',
  imports: [TitleComponent],
  templateUrl: './control-flow.component.html',
  styles: ``,
})
export default class ControlFlowComponent {
  /*
  ! Para "convertir" una señal a una de solo lectura, y evitar modificaciones de la misma, se hace lo siguiente:
  ¡¿   public showContent = signal(false).asReadonly
 */
  public showContent = signal(false);
  public grades = signal<Grade[]>(['A', 'B', 'F']);
  public grade = signal<Grade>('A');
  public frameworks = signal(['Angular', 'Vue', 'Svelte', 'Qwik', 'React']);
  public frameworks2 = signal<string[]>([]);

  public toggleContent() {
    this.showContent.update((value) => !value);
  }

  public setGrade(grade: string) {
    this.grade.set(this.grades().find((x) => x === grade) ?? 'A');
  }
}
