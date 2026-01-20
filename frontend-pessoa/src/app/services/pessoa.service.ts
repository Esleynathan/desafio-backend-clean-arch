import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço para toda a aplicação
})
export class PessoaService {
  // URL da API (ajuste se o prefixo no urls.py principal for diferente de 'api/pessoas')
  private apiUrl = 'http://localhost:8000/api/pessoas';

  constructor(private http: HttpClient) { }

  // 1. Listar todas (com paginação e filtros)
  listar(page: number = 1, pageSize: number = 10, termo: string = '', sexo: string = ''): Observable<PaginatedResponse<Pessoa>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (termo) params = params.set('search', termo);
    if (sexo) params = params.set('sexo', sexo);

    return this.http.get<PaginatedResponse<Pessoa>>(`${this.apiUrl}/`, { params });
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
}
