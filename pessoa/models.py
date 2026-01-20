from django.db import models

class Pessoa(models.Model):
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    ]

    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    cpf = models.CharField(max_length=14, unique=True)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    altura = models.FloatField()
    peso = models.FloatField()
    is_ativo = models.BooleanField(default=True)

    class Meta:
        db_table = 'pessoa'
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'

    def __str__(self):
        return self.nome