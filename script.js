const tabela = document.querySelector('.tabela-js')

// Faz uma requisição a um usuarío com um ID expecifico
axios.get('https://api--diegosenaisp.repl.co/list').then(function (resposta) {
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
        <td><span class="material-symbols-outlined text-danger">
        delete
        </span><span class="material-symbols-outlined text-success">
        edit
        </span></td>
      </tr>
      `
    })

  }