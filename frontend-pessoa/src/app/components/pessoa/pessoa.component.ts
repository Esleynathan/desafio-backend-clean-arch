import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa.component.html',
  styleUrl: './pessoa.component.css'
})
export class PessoaComponent implements OnInit {
  // Lista de pessoas para exibir na tabela
  pessoas: Pessoa[] = [];
  termoBusca: string = '';
  
  // Objeto para o formulário (criação ou edição)
  pessoa: Pessoa = {
    nome: '',
    data_nascimento: '',
    cpf: '',
    sexo: 'M',
    altura: 0,
    peso: 0
  };

  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Lista inicia vazia - usuário deve clicar em Pesquisar
  }

  // Busca a lista do backend
  listar(): void {
    this.pessoaService.listar().subscribe({
      next: (dados) => this.pessoas = dados,
      error: (erro) => console.error('Erro ao listar pessoas:', erro)
    });
  }

  // Decide se cria ou atualiza baseado na presença do ID
  salvar(): void {
    if (this.pessoa.id) {
      this.pessoaService.atualizar(this.pessoa).subscribe(() => {
        this.listar();
        this.limparFormulario();
        alert('Pessoa atualizada com sucesso!');
      });
    } else {
      this.pessoaService.criar(this.pessoa).subscribe(() => {
        this.listar();
        this.limparFormulario();
        alert('Pessoa cadastrada com sucesso!');
      });
    }
  }

  // Preenche o formulário para edição
  editar(p: Pessoa): void {
    this.pessoa = { ...p }; // Cria uma cópia para não alterar a tabela em tempo real
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.pessoaService.excluir(id).subscribe(() => {
        this.listar();
      });
    }
  }

  limparFormulario(): void {
    this.pessoa = {
      nome: '', data_nascimento: '', cpf: '',
      sexo: 'M', altura: 0, peso: 0
    };
  }

  calcularPeso(p: Pessoa): void {
    if (p.id) {
      this.pessoaService.calcularPesoIdeal(p.id).subscribe({
        next: (dados) => {
          // Atualiza o peso ideal na tela e mostra a mensagem do backend
          p.peso_ideal = dados.peso_ideal;
          alert(dados.mensagem);
        },
        error: (erro) => alert('Erro ao calcular peso ideal.')
      });
    }
  }

  pesquisar(): void {
    this.pessoaService.pesquisar(this.termoBusca).subscribe({
      next: (dados) => {
        this.pessoas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro na busca:', erro)
    });
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.pessoas = [];
  }
}
