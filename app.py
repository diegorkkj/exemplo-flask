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
@app.route('/updateTarefa', methods=['PUT'])
def update_tarefa():
    data = request.json
    
    if 'TAREFA_ANTIGA' in data and 'TAREFA_NOVA' in data:
        tarefa_antiga = data['TAREFA_ANTIGA']
        tarefa_nova = data['TAREFA_NOVA']

        tarefas = pd.read_csv('Tarefas.csv') 
        tarefas.replace(tarefa_antiga, tarefa_nova, inplace=True, regex=True)
        tarefas.to_csv('Tarefas.csv', index=False)
        
        return jsonify({"message": f"Tarefa alterada: {tarefa_antiga} -> {tarefa_nova}"})
    
    return jsonify({"error": "Dados inválidos para atualizar a tarefa"})

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