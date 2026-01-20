export interface Pessoa {
  id?: number; // Opcional (?) porque ao criar uma nova pessoa, ela ainda não tem ID
  nome: string;
  data_nascimento: string;
  cpf: string;
  sexo: 'M' | 'F'; // Restringe para aceitar apenas 'M' ou 'F'
  altura: number;
  peso: number;
  peso_ideal?: number; // Opcional, pois pode vir calculado do backend ou não
}
