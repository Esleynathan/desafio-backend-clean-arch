from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pessoa.serializers import PessoaSerializer, PesoIdealSerializer
from pessoa.services import PessoaService
from pessoa.dtos import PessoaDTO


class PessoaController(APIView):
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = PessoaService()

    def get(self, request):
        """Pesquisar - Lista todas as pessoas"""
        termo = request.query_params.get('search')
        pessoas = self.service.pesquisar(termo=termo)
        serializer = PessoaSerializer(pessoas, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Incluir - Cria nova pessoa"""
        serializer = PessoaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        dto = PessoaDTO(
            nome=serializer.validated_data['nome'],
            data_nascimento=serializer.validated_data['data_nascimento'],
            cpf=serializer.validated_data['cpf'],
            sexo=serializer.validated_data['sexo'],
            altura=serializer.validated_data['altura'],
            peso=serializer.validated_data['peso']
        )
        
        pessoa = self.service.incluir(dto)
        return Response(PessoaSerializer(pessoa).data, status=status.HTTP_201_CREATED)


class PessoaDetailController(APIView):
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = PessoaService()

    def get(self, request, id):
        """Pesquisar - Busca pessoa por ID"""
        try:
            pessoas = self.service.pesquisar(id)
            serializer = PessoaSerializer(pessoas[0])
            return Response(serializer.data)
        except:
            return Response({'erro': 'Pessoa não encontrada'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        """Alterar - Atualiza pessoa existente"""
        try:
            pessoa_existente = self.service.pesquisar(id)[0]
        except:
            return Response({'erro': 'Pessoa não encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PessoaSerializer(pessoa_existente, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        dto = PessoaDTO(
            id=id,
            nome=serializer.validated_data['nome'],
            data_nascimento=serializer.validated_data['data_nascimento'],
            cpf=serializer.validated_data['cpf'],
            sexo=serializer.validated_data['sexo'],
            altura=serializer.validated_data['altura'],
            peso=serializer.validated_data['peso']
        )

        pessoa = self.service.alterar(dto)
        return Response(PessoaSerializer(pessoa).data)

    def delete(self, request, id):
        """Excluir - Remove pessoa"""
        try:
            self.service.excluir(id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'erro': 'Pessoa não encontrada'}, status=status.HTTP_404_NOT_FOUND)


class PesoIdealController(APIView):
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = PessoaService()

    def get(self, request, id):
        """Bônus - Calcula peso ideal"""
        try:
            pessoas = self.service.pesquisar(id)
            pessoa = pessoas[0]
            peso_ideal = self.service.calcular_peso_ideal(id)
            diferenca = pessoa.peso - peso_ideal
            
            if diferenca > 0:
                mensagem = f"Você está {diferenca:.2f}kg acima do peso ideal"
            elif diferenca < 0:
                mensagem = f"Você está {abs(diferenca):.2f}kg abaixo do peso ideal"
            else:
                mensagem = "Você está no peso ideal!"
            
            data = {
                'peso_atual': pessoa.peso,
                'peso_ideal': peso_ideal,
                'diferenca': round(diferenca, 2),
                'mensagem': mensagem
            }
            return Response(data)
        except:
            return Response({'erro': 'Pessoa não encontrada'}, status=status.HTTP_404_NOT_FOUND)
