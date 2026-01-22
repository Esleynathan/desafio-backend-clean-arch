from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/pessoas/', include('pessoa.urls')),
]

# Em produção, serve o index.html do Angular para todas as rotas não-API
if not settings.DEBUG:
    urlpatterns += [
        re_path(r'^(?!api|admin|static).*$', TemplateView.as_view(template_name='index.html')),
    ]
