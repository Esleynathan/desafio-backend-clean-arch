import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço para toda a aplicação
})
export class PessoaService {
  // URL da API (ajuste se o prefixo no urls.py principal for diferente de 'api/pessoas')
  private apiUrl = 'http://localhost:8000/api/pessoas';

  constructor(private http: HttpClient) { }

  // 1. Listar todas
  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/`);
  }

  // 2. Buscar por ID
  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}/`);
  }

  // 3. Criar
  criar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}/`, pessoa);
  }

  // 4. Atualizar
  atualizar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${pessoa.id}/`, pessoa);
  }

  // 5. Excluir
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  // 6. Calcular Peso Ideal
  calcularPesoIdeal(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/peso-ideal/`);
  }

  // 7. Pesquisar
  pesquisar(termo: string): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}/?search=${termo}`);
  }
}
