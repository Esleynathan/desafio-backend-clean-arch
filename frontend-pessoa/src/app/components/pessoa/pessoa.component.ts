import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService, PaginatedResponse } from '../../services/pessoa.service';
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
  filtroSexo: string = ''; // Novo filtro
  
  // Paginação
  paginaAtual: number = 1;
  tamanhoPagina: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;
  
  pesquisaRealizada: boolean = false;

  // Objeto para o formulário (criação ou edição)
  pessoa: Pessoa = {
    nome: '',
    data_nascimento: '',
    cpf: '',
    sexo: 'M',
    altura: 0,
    peso: 0
  };

  // Sistema de notificações toast
  toast: { show: boolean; message: string; type: 'success' | 'error' | 'info' } = {
    show: false,
    message: '',
    type: 'success'
  };

  // Modal de confirmação
  confirmModal: { show: boolean; title: string; message: string; onConfirm: () => void } = {
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  };

  // Modal de peso ideal
  pesoIdealModal: { show: boolean; nome: string; pesoIdeal: number; mensagem: string } = {
    show: false,
    nome: '',
    pesoIdeal: 0,
    mensagem: ''
  };

  // Modal de feedback (sucesso/erro)
  feedbackModal: { show: boolean; type: 'success' | 'error'; title: string; messages: string[] } = {
    show: false,
    type: 'success',
    title: '',
    messages: []
  };

  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Lista inicia vazia - usuário deve clicar em Pesquisar
  }

  // Exibe toast de notificação
  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toast = { show: true, message, type };
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toast.show = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  // Abre modal de confirmação
  openConfirmModal(title: string, message: string, onConfirm: () => void): void {
    this.confirmModal = { show: true, title, message, onConfirm };
  }

  // Fecha modal de confirmação
  closeConfirmModal(): void {
    this.confirmModal.show = false;
  }

  // Confirma ação do modal
  confirmAction(): void {
    this.confirmModal.onConfirm();
    this.closeConfirmModal();
  }

  // Fecha modal de peso ideal
  closePesoIdealModal(): void {
    this.pesoIdealModal.show = false;
  }

  // Abre modal de feedback
  showFeedbackModal(type: 'success' | 'error', title: string, messages: string[]): void {
    this.feedbackModal = { show: true, type, title, messages };
    this.cdr.markForCheck();
  }

  // Fecha modal de feedback
  closeFeedbackModal(): void {
    this.feedbackModal.show = false;
  }

  // Busca a lista do backend
  listar(): void {
    this.pessoaService.listar(this.paginaAtual, this.tamanhoPagina, this.termoBusca, this.filtroSexo).subscribe({
      next: (resposta: PaginatedResponse<Pessoa>) => {
        this.pessoas = resposta.data;
        this.totalRegistros = resposta.pagination.total;
        this.totalPaginas = resposta.pagination.total_pages;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao listar pessoas:', erro);
        this.showToast('Erro ao carregar lista de pessoas', 'error');
      }
    });
  }

  // Extrai mensagens de erro do backend e exibe no modal
  private tratarErro(erro: any, titulo: string): void {
    const mensagens: string[] = [];

    if (erro.error) {
      // Se for objeto com campos de validação (ex: {cpf: ["mensagem"], nome: ["mensagem"]})
      if (typeof erro.error === 'object' && !erro.error.detail) {
        for (const campo in erro.error) {
          if (Array.isArray(erro.error[campo])) {
            erro.error[campo].forEach((msg: string) => mensagens.push(msg));
          } else if (typeof erro.error[campo] === 'string') {
            mensagens.push(erro.error[campo]);
          }
        }
      }
      // Se for mensagem direta (ex: {detail: "mensagem"})
      if (erro.error.detail) {
        mensagens.push(erro.error.detail);
      }
      if (typeof erro.error === 'string') {
        mensagens.push(erro.error);
      }
    }

    if (mensagens.length === 0) {
      mensagens.push('Erro desconhecido. Tente novamente.');
    }

    this.showFeedbackModal('error', titulo, mensagens);
  }

  // Decide se cria ou atualiza baseado na presença do ID
  salvar(): void {
    console.log('=== SALVAR CLICADO ===');
    console.log('Dados sendo enviados:', JSON.stringify(this.pessoa, null, 2));
    if (this.pessoa.id) {
      this.pessoaService.atualizar(this.pessoa).subscribe({
        next: () => {
          console.log('=== ATUALIZAR: SUCESSO ===');
          this.limparFormulario();
          this.showFeedbackModal('success', 'Sucesso', ['Pessoa atualizada com sucesso!']);
          console.log('=== MODAL SUCESSO CHAMADO ===', this.feedbackModal);
        },
        error: (erro) => {
          console.error('=== ATUALIZAR: ERRO ===', erro);
          this.tratarErro(erro, 'Erro ao atualizar');
          console.log('=== MODAL ERRO CHAMADO ===', this.feedbackModal);
        }
      });
    } else {
      this.pessoaService.criar(this.pessoa).subscribe({
        next: () => {
          console.log('=== CRIAR: SUCESSO ===');
          this.limparFormulario();
          this.showFeedbackModal('success', 'Sucesso', ['Pessoa cadastrada com sucesso!']);
          console.log('=== MODAL SUCESSO CHAMADO ===', this.feedbackModal);
        },
        error: (erro) => {
          console.error('=== CRIAR: ERRO ===', erro);
          this.tratarErro(erro, 'Erro ao cadastrar');
          console.log('=== MODAL ERRO CHAMADO ===', this.feedbackModal);
        }
      });
    }
  }

  // Preenche o formulário para edição
  editar(p: Pessoa): void {
    this.pessoa = { ...p };
    this.showToast(`Editando: ${p.nome}`, 'info');
    // Scroll suave para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Abre modal de confirmação para exclusão
  excluir(id: number): void {
    const pessoa = this.pessoas.find(p => p.id === id);
    this.openConfirmModal(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${pessoa?.nome}"? Esta ação não pode ser desfeita.`,
      () => {
        this.pessoaService.excluir(id).subscribe({
          next: () => {
            this.listar();
            this.showToast('Pessoa excluída com sucesso!', 'success');
          },
          error: (erro) => {
            console.error('Erro ao excluir:', erro);
            this.showToast('Erro ao excluir pessoa', 'error');
          }
        });
      }
    );
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
          p.peso_ideal = dados.peso_ideal;
          // Abre modal com resultado
          this.pesoIdealModal = {
            show: true,
            nome: p.nome,
            pesoIdeal: dados.peso_ideal,
            mensagem: dados.mensagem
          };
          this.cdr.markForCheck();
        },
        error: (erro) => {
          console.error('Erro ao calcular peso ideal:', erro);
          this.showToast('Erro ao calcular peso ideal', 'error');
        }
      });
    }
  }

  pesquisar(): void {
    console.log('=== PESQUISAR CLICADO ===');
    this.paginaAtual = 1; // Volta para a primeira página ao filtrar
    
    this.pessoaService.listar(this.paginaAtual, this.tamanhoPagina, this.termoBusca, this.filtroSexo).subscribe({
      next: (resposta: PaginatedResponse<Pessoa>) => {
        this.pessoas = resposta.data;
        this.totalRegistros = resposta.pagination.total;
        this.totalPaginas = resposta.pagination.total_pages;
        this.pesquisaRealizada = true;
        this.cdr.markForCheck();
        
        if (this.pessoas.length === 0) {
          this.showToast('Nenhum resultado encontrado', 'info');
        } else {
          this.showToast(`${this.totalRegistros} pessoa(s) encontrada(s)`, 'success');
        }
        console.log('=== TOAST CHAMADO ===', this.toast);
      },
      error: (erro) => {
        console.error('=== PESQUISAR: ERRO ===', erro);
        this.showToast('Erro ao pesquisar', 'error');
      }
    });
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.filtroSexo = '';
    this.paginaAtual = 1;
    this.pesquisaRealizada = false;
    this.listar(); // Recarrega a lista completa
    this.showToast('Pesquisa limpa', 'info');
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.paginaAtual = novaPagina;
      this.listar();
    }
  }

  // Máscara para CPF: 000.000.000-00
  formatarCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    // Aplica a máscara
    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    this.pessoa.cpf = valor;
    input.value = valor;
  }

  // Máscara para Altura: aceita formato 0.00 ou 0,00
  formatarAltura(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(',', '.'); // Troca vírgula por ponto

    // Remove caracteres inválidos (permite apenas números e um ponto)
    valor = valor.replace(/[^\d.]/g, '');

    // Garante apenas um ponto decimal
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }

    // Limita a 1 dígito antes do ponto e 2 depois
    if (partes.length === 2) {
      partes[1] = partes[1].substring(0, 2);
      valor = partes[0] + '.' + partes[1];
    }

    const numero = parseFloat(valor);
    if (!isNaN(numero) && numero >= 0 && numero <= 3) {
      this.pessoa.altura = numero;
    }
    input.value = valor;
  }

  // Máscara para Peso: aceita formato 000.0 ou 000,0
  formatarPeso(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(',', '.'); // Troca vírgula por ponto

    // Remove caracteres inválidos
    valor = valor.replace(/[^\d.]/g, '');

    // Garante apenas um ponto decimal
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }

    // Limita a 3 dígitos antes do ponto e 1 depois
    if (partes.length === 2) {
      partes[0] = partes[0].substring(0, 3);
      partes[1] = partes[1].substring(0, 1);
      valor = partes[0] + '.' + partes[1];
    } else {
      valor = valor.substring(0, 3);
    }

    const numero = parseFloat(valor);
    if (!isNaN(numero) && numero >= 0 && numero <= 500) {
      this.pessoa.peso = numero;
    }
    input.value = valor;
  }
}
