from typing import List, Optional
from pessoa.models import Pessoa
from pessoa.dtos import PessoaDTO
from pessoa.tasks import PessoaTask


class PessoaService:    
    def __init__(self):
        self.task = PessoaTask()

    def incluir(self, dto: PessoaDTO) -> Pessoa:
        return self.task.incluir(dto)

    def alterar(self, dto: PessoaDTO) -> Pessoa:
        return self.task.alterar(dto)

    def excluir(self, id: int) -> bool:
        return self.task.excluir(id)

    def pesquisar(self, id: Optional[int] = None, termo: Optional[str] = None) -> List[Pessoa]:
        return self.task.pesquisar(id, termo)

    def calcular_peso_ideal(self, id: int) -> float:
        return self.task.calcular_peso_ideal(id)