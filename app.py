############### GET #########################
from flask import Flask, jsonify, request

app = Flask(__name__)

user = {
    "ID" : 10,
    "Nome" : "Carlos",
    "idade": "23",
    "Cidade" : "Jundiai"
}

nome = "Carlos"

userList = [
    {
        "Nome" : "Carlos",
        "idade": "23",
        "Cidade" : "Jundiai"
    },
    {
        "Nome" : "Thiago",
        "idade": "29",
        "Cidade" : "Louveira"
    }
]

@app.route('/', methods=['GET'])
def index():
    return userList

################# POST ########################

@app.route('/user', methods=['POST'])
def login():
    item = request.json
    userList.append(item)
    return userList

############### UPDATE ########################

@app.route('/update/<string:nomeAntigo>/<string:nomeNovo>', methods=['PUT'])
def update_user(nomeAntigo, nomeNovo):
    for dicionario in userList:
        if dicionario["Nome"] == nomeAntigo:
            dicionario["Nome"] = nomeNovo
            return "Nome Alterado"
    return "Nome não encontrado"

############### DELETE ########################

@app.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if user_id == user["ID"]:
        user.pop("ID")
        return "Id deletado da lista"
    return "Id Não encontrado"

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
