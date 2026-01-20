from typing import List, Optional
from pessoa.models import Pessoa
from pessoa.dtos import PessoaDTO


class PessoaTask:
    
    def incluir(self, dto: PessoaDTO) -> Pessoa:
        pessoa = Pessoa.objects.create(
            nome=dto.nome,
            data_nascimento=dto.data_nascimento,
            cpf=dto.cpf,
            sexo=dto.sexo,
            altura=dto.altura,
            peso=dto.peso
        )
        return pessoa

    def alterar(self, dto: PessoaDTO) -> Pessoa:
        pessoa = Pessoa.objects.get(id=dto.id)
        pessoa.nome = dto.nome
        pessoa.data_nascimento = dto.data_nascimento
        pessoa.cpf = dto.cpf
        pessoa.sexo = dto.sexo
        pessoa.altura = dto.altura
        pessoa.peso = dto.peso
        pessoa.save()
        return pessoa

    def excluir(self, id: int) -> bool:
        pessoa = Pessoa.objects.get(id=id)
        pessoa.delete()
        return True

    def pesquisar(self, id: Optional[int] = None) -> List[Pessoa]:
        if id:
            return [Pessoa.objects.get(id=id)]
        return list(Pessoa.objects.all())

    def calcular_peso_ideal(self, id: int) -> float:
        pessoa = Pessoa.objects.get(id=id)
        if pessoa.sexo == 'M':
            peso_ideal = (72.7 * pessoa.altura) - 58
        else:
            peso_ideal = (62.1 * pessoa.altura) - 44.7
        return round(peso_ideal, 2)