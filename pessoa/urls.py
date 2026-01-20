from django.urls import path
from pessoa.views import PessoaController, PessoaDetailController, PesoIdealController


urlpatterns = [
    path('', PessoaController.as_view(), name='pessoa-list'),
    path('<int:id>/', PessoaDetailController.as_view(), name='pessoa-detail'),
    path('<int:id>/peso-ideal/', PesoIdealController.as_view(), name='pessoa-peso-ideal'),
]
