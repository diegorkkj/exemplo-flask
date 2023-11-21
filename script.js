const tabela = document.querySelector('.tabela-js')
axios.get('http://127.0.0.1:5000/list').then(function (resposta) {
    console.log(resposta.data);
    getData(resposta.data)
  }).catch(function(error){
    console.log(error)
  })
  function getData(dados){
    dados.map((item)=>{
      tabela.innerHTML += `
      <tr>
        <th scope="row">${item.ID}</th>
        <td>${item.TAREFA}</td>
        <td><button class="btn bg-white" type="button" data-bs-toggle="modal" data-bs-target="#modalDel"><span class="material-symbols-outlined text-danger">
        delete
        </span></button> <button class="btn bg-white" type="button" data-bs-toggle="modal" data-bs-target="#modalEdit"><span class="material-symbols-outlined text-success">
        edit
        </span></button></td>
      </tr>
      `
    })
  }
const inputValor = document.getElementById('recipient-name').value;
const data = {
  tarefa: inputValor
};
axios.post('http://127.0.0.1:5000/add', data)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Erro na requisição POST', error);
  });

axios.put('http://127.0.0.1:5000/updateTarefa', updatedData)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Erro na requisição PUT', error);
  });

axios.delete('http://127.0.0.1:5000/delete')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Erro na requisição DELETE', error);
  });

