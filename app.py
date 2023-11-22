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
    tarefas = pd.read_csv('Tarefas.csv') 
    tarefas = tarefas.to_dict('records') 
    id = len(tarefas) + 1
    with open("Tarefas.csv", "a") as arquivo:
         arquivo.write(f"{id},{item['Tarefa']}\n")    

    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

############### UPDATE ########################
@app.route("/update/<int:id>", methods=['PUT'])
def updateTarefas(id):
    item = request.json  
    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records') 
    with open("Tarefas.csv", "w") as arquivo:
        arquivo.write("ID,TAREFA\n") 
        for tarefa in tarefas:
            if tarefa['ID'] != id:
                arquivo.write(f"{tarefa['ID']},{tarefa['TAREFA']}\n") 
            else:
                arquivo.write(f"{id},{item['Tarefa']}\n") 
    tarefas = pd.read_csv('Tarefas.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

############### DELETE ########################
@app.route("/delete", methods=['DELETE'])
def deleteTarefa():
    data = request.json
    id = data.get('id')
    if id is None:
        return jsonify({"error": "ID da tarefa não fornecido"}), 400
    tarefas = pd.read_csv('Tarefas.csv')
    if id not in tarefas['ID'].values:
        return jsonify({"error": "Tarefa não encontrada"}), 404
    tarefas = tarefas.drop(tarefas[tarefas['ID'] == id].index)
    tarefas['ID'] = range(1, len(tarefas) + 1)
    tarefas.to_csv('Tarefas.csv', index=False)
    return jsonify(tarefas.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")