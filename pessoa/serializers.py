from rest_framework import serializers
from pessoa.models import Pessoa


class PessoaSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Pessoa
        fields = ['id', 'nome', 'data_nascimento', 'cpf', 'sexo', 'altura', 'peso']


class PesoIdealSerializer(serializers.Serializer):
    peso_atual = serializers.FloatField()
    peso_ideal = serializers.FloatField()
    diferenca = serializers.FloatField()
    mensagem = serializers.CharField()
