import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata valores em Real (pt-BR) sem depender de locale data do Angular (evita subpath nao compartilhado na federacao). */
@Pipe({ name: 'brl' })
export class BrlPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return fmt.format(value ?? 0);
  }
}
