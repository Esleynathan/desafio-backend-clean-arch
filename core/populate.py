import json
import urllib.request
import urllib.error
from datetime import date

# Configuração
API_URL = "http://127.0.0.1:8000/api/pessoas/"

# Dados Fictícios (Mock)
pessoas_mock = [
    {"nome": "João Silva", "data_nascimento": "1990-01-01", "cpf": "111.111.111-01", "sexo": "M", "altura": 1.75, "peso": 75.0},
    {"nome": "Maria Oliveira", "data_nascimento": "1992-03-15", "cpf": "222.222.222-02", "sexo": "F", "altura": 1.65, "peso": 60.0},
    {"nome": "Carlos Pereira", "data_nascimento": "1985-07-20", "cpf": "333.333.333-03", "sexo": "M", "altura": 1.80, "peso": 85.0},
    {"nome": "Ana Santos", "data_nascimento": "1995-11-10", "cpf": "444.444.444-04", "sexo": "F", "altura": 1.60, "peso": 55.0},
    {"nome": "Pedro Costa", "data_nascimento": "1988-05-05", "cpf": "555.555.555-05", "sexo": "M", "altura": 1.78, "peso": 80.0},
    {"nome": "Juliana Lima", "data_nascimento": "1998-09-25", "cpf": "666.666.666-06", "sexo": "F", "altura": 1.70, "peso": 65.0},
    {"nome": "Lucas Ferreira", "data_nascimento": "1991-12-30", "cpf": "777.777.777-07", "sexo": "M", "altura": 1.82, "peso": 88.0},
    {"nome": "Fernanda Rodrigues", "data_nascimento": "1993-02-14", "cpf": "888.888.888-08", "sexo": "F", "altura": 1.68, "peso": 62.0},
    {"nome": "Marcos Almeida", "data_nascimento": "1980-06-18", "cpf": "999.999.999-09", "sexo": "M", "altura": 1.76, "peso": 78.0},
    {"nome": "Patrícia Gomes", "data_nascimento": "1996-08-22", "cpf": "101.101.101-10", "sexo": "F", "altura": 1.62, "peso": 58.0},
    {"nome": "Rafael Barbosa", "data_nascimento": "1989-04-12", "cpf": "121.121.121-11", "sexo": "M", "altura": 1.85, "peso": 90.0},
    {"nome": "Camila Martins", "data_nascimento": "1994-10-08", "cpf": "131.131.131-12", "sexo": "F", "altura": 1.66, "peso": 61.0},
    {"nome": "Bruno Rocha", "data_nascimento": "1987-01-28", "cpf": "141.141.141-13", "sexo": "M", "altura": 1.79, "peso": 82.0},
    {"nome": "Aline Ribeiro", "data_nascimento": "1997-05-16", "cpf": "151.151.151-14", "sexo": "F", "altura": 1.64, "peso": 59.0},
    {"nome": "Gabriel Alves", "data_nascimento": "1999-12-05", "cpf": "161.161.161-15", "sexo": "M", "altura": 1.81, "peso": 76.0}
]

def popular_banco():
    print(f"🚀 Iniciando população do banco via API: {API_URL}")
    sucessos = 0
    erros = 0

    for pessoa in pessoas_mock:
        # Prepara a requisição JSON
        data = json.dumps(pessoa).encode('utf-8')
        req = urllib.request.Request(API_URL, data=data, headers={
            'Content-Type': 'application/json',
            'User-Agent': 'ScriptPopulate/1.0'
        })

        try:
            with urllib.request.urlopen(req) as response:
                if response.status == 201:
                    print(f"✅ [OK] {pessoa['nome']}")
                    sucessos += 1
                else:
                    print(f"⚠️ [AVISO] {pessoa['nome']} - Status: {response.status}")
        
        except urllib.error.HTTPError as e:
            # Tenta ler a mensagem de erro da API
            error_message = e.read().decode()
            print(f"❌ [ERRO] {pessoa['nome']}: {e.code} - {error_message}")
            erros += 1
        except urllib.error.URLError as e:
            print(f"❌ [FALHA DE CONEXÃO] Verifique se o servidor está rodando. Erro: {e.reason}")
            return

    print("-" * 30)
    print(f"🏁 Finalizado! Sucessos: {sucessos} | Erros: {erros}")

if __name__ == "__main__":
    popular_banco()