document.addEventListener('DOMContentLoaded', function () {
    // Seleciona a tabela na qual os dados serão exibidos
    const tabela = document.querySelector('.tabela-js')

    // Faz uma requisição GET para obter a lista de tarefas
    axios
        .get(`http://127.0.0.1:5000/list`)
        .then(function (resposta) {
            // Chama a função para processar e exibir os dados
            getData(resposta.data)
        })
        .catch(function (error) {
            console.error(error)
        })

    // Função para processar e exibir os dados na tabela
    function getData(dados) {
        // Cria as linhas da tabela com os dados recebidos
        tabela.innerHTML = dados
            .map(
                item => `
                    <tr>
                        <th scope="row">${item.ID}</th>
                        <td>${item.TAREFA}</td>
                        <td>
                            <!-- Botões de exclusão e edição -->
                            <button class="btn bg-white delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalDel">
                                <span class="material-symbols-outlined text-danger">delete</span>
                            </button>
                            <button class="btn bg-white edit-btn" id="edit-tarefa-btn"  type="button" data-bs-toggle="modal" data-bs-target="#editModal">
                                <span class="material-symbols-outlined text-success">edit</span>
                            </button>
                        </td>
                    </tr>`
            )
            .join('')

        // Associa eventos aos botões de interação
        todos_Eventos()
    }

    // Função que associa eventos aos botões de interação (adicionar, excluir, editar)
    function todos_Eventos() {
        // Adiciona evento ao botão de adicionar tarefa
        document
            .querySelector('#add-tarefa')
            .addEventListener('click', function () {
                // Obtém o valor da nova tarefa a ser adicionada
                const tarefa = document.querySelector('#tarefa').value
                if (tarefa === '') {
                    // Exibe um alerta se o campo estiver vazio
                    alert('Digite uma tarefa!')
                    return
                }

                // Faz uma requisição POST para adicionar a nova tarefa
                axios
                    .post(`http://127.0.0.1:5000/add`, { Tarefa: tarefa })
                    .then(function () {
                        // Atualiza a tabela após a adição da tarefa
                        loadTasks()
                    })
                    .catch(function (error) {
                        console.error(error)
                    })
            })

        // Adiciona evento aos botões de exclusão
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                // Obtém o ID da tarefa a ser excluída
                const id = e.target.closest('tr').querySelector('th').textContent
                // Faz uma requisição DELETE para excluir a tarefa
                axios.delete(`http://127.0.0.1:5000/delete`, {
                        data: { id: parseInt(id) },
                    })
                    .then(function () {
                        // Atualiza a tabela após a exclusão da tarefa
                        loadTasks()
                    })
                    .catch(function (error) {
                        console.error(error)
                    })
            })
        })

        // Adiciona evento ao clique na tabela para editar uma tarefa
        document
            .querySelector('.tabela-js')
            .addEventListener('click', function (e) {
                const editBtn = e.target.closest('.edit-btn')
                if (editBtn) {
                    // Obtém a linha da tabela e a tarefa a ser editada
                    const row = editBtn.closest('tr')
                    const tarefa = row.querySelector('td').textContent
                    // Preenche o campo de edição com a tarefa selecionada
                    document.querySelector('#edit-tarefa').value = tarefa
                    // Armazena o ID da tarefa a ser editada no botão de salvar edição
                    document.querySelector('#save-edit-btn').dataset.id =
                        row.querySelector('th').textContent
                    // Exibe o modal de edição
                    var editModal = new bootstrap.Modal(
                        document.getElementById('editModal')
                    )
                    editModal.show()
                }
            })

        // Adiciona evento ao botão de salvar edição
        document
            .querySelector('#save-edit-btn')
            .addEventListener('click', function () {
                // Obtém a tarefa editada e o ID correspondente
                const tarefaupdate = document.querySelector('#edit-tarefa').value
                const id = this.dataset.id

                // Faz uma requisição PUT para atualizar a tarefa
                if (id) {
                    axios
                        .put(`http://127.0.0.1:5000/update`, {
                            id: parseInt(id),
                            nova_tarefa: tarefaupdate,
                        })
                        .then(function () {
                            // Atualiza a tabela após a edição da tarefa
                            loadTasks()
                        })
                        .catch(function (error) {
                            console.error(error)
                        })
                        .finally(function () {
                            // Esconde o modal após a conclusão da edição
                            var editModal = new bootstrap.Modal(
                                document.getElementById('editModal')
                            )
                            editModal.hide()
                            // Limpa o ID armazenado no botão de salvar edição
                            document.querySelector('#save-edit-btn').dataset.id = null
                        })
                }
            })

        // Função para carregar as tarefas e atualizar a tabela
        function loadTasks() {
            axios
                .get(`http://127.0.0.1:5000/list`)
                .then(function (resposta) {
                    // Chama a função para processar e exibir os dados atualizados
                    getData(resposta.data)
                })
                .catch(function (error) {
                    console.error(error)
                })
        }
    }
})
