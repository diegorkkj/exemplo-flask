const tabela = document.querySelector('.tabela-js')

// Faz uma requisição a um usuarío com um ID expecifico
axios.get('http://127.0.0.1:5000/list').then(function (resposta) {
    // manipula o sucesso da requisição
    console.log(resposta.data);
    getData(resposta.data)
  }).catch(function(error){ // Tratamento de erro caso dê problema na requisição
    console.log(error)
  })

  // Percorrer o objeto de uma array e imprimindo uma propriedade (nome)
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