from flask import Flask, jsonify, request 
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

try:
    open('Tarefas.csv', 'x')
    with open("Tarefas.csv", "w") as arquivo:
         arquivo.write("ID,TAREFA\n") 
except Exception as e:
    pass

@app.route("/")
def homepage():
  return("API ONLINE")

############### GET ########################
@app.route("/list", methods=['GET'])
def listarTarefas():    
    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records')    
    return jsonify(tarefas)

############### POST ########################
@app.route("/add", methods=['POST'])
def addTarefas():
    item = request.json 
    tarefa_name = item["Tarefa"].replace(" ", "_") 
    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records')
    id = len(tarefas) + 1
    with open("Tarefas.csv", "a") as arquivo:
         arquivo.write(f"{id},{tarefa_name}\n")

    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

############### UPDATE ########################
@app.route('/updateTarefa/<string:tarefa_antiga>/<string:tarefa_nova>', methods=['PUT'])
def update_user(tarefa_antiga, tarefa_nova):
    tarefas = pd.read_csv('Tarefas.csv') 
    if tarefa_antiga in tarefas['TAREFA'].values: 
        tarefas.loc[tarefas['TAREFA'] == tarefa_antiga, 'TAREFA'] = tarefa_nova 
        tarefas.to_csv('Tarefas.csv', index=False)
        tarefas = pd.read_csv('Tarefas.csv') 
        tarefas = tarefas.to_dict('records') 
        return f"Tarefa alterada: {tarefa_antiga} -> {tarefa_nova}"
    return "Tarefa não encontrada"

############### DELETE ########################
@app.route('/delete/<int:tarefa_id>', methods=['DELETE'])
def delete_tarefa(tarefa_id):    
    tarefas = pd.read_csv('Tarefas.csv')
    if tarefa_id in tarefas["ID"].values:
        tarefas = tarefas[tarefas["ID"] != tarefa_id]
        tarefas["ID"] = range(1, len(tarefas) + 1)
        tarefas.to_csv('Tarefas.csv', index=False)
        return f"Tarefa com ID {tarefa_id} excluída"
    return f"Tarefa com ID {tarefa_id} não encontrada"

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")