document.addEventListener('DOMContentLoaded', function () {
  const tabela = document.querySelector(".tabela-js");

  // Obtenha tarefas da API e preencha a tabela ao carregar a página
  axios.get(`http://127.0.0.1:5000/list`)
      .then(function (resposta) {
          getData(resposta.data);
      })
      .catch(function (error) {
          console.error(error);
      });

  // Função para popular a tabela com tarefas
  function getData(dados) {
      tabela.innerHTML = dados.map(item => `
      <tr>
      <th scope="row">${item.ID}</th>
      <td>${item.TAREFA}</td>
      <td><button class="btn bg-white delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalDel"><span class="material-symbols-outlined text-danger">
      delete
      </span></button> <button class="btn bg-white edit-btn" id="edit-tarefa-btn"  type="button" data-bs-toggle="modal" data-bs-target="#editModal"><span class="material-symbols-outlined text-success">
      edit
      </span></button></td>
  </tr>`
      ).join('');

      todos_Eventos();
  };

  function todos_Eventos() {
      // Adicione uma nova tarefa
      document.querySelector("#add-tarefa").addEventListener("click", function () {
          const tarefa = document.querySelector("#tarefa").value;
          if (tarefa === "") {
              alert("Digite uma tarefa!");
              return;
          }

          axios.post(`http://127.0.0.1:5000/add`, { Tarefa: tarefa })
              .then(function () {
                  loadTasks();
              })
              .catch(function (error) {
                  console.error(error);
              });
      });

      // Exclua uma tarefa
      document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", function (e) {
              const id = e.target.closest("tr").querySelector("th").textContent;
              axios.delete(`http://127.0.0.1:5000/delete`, { data: { id: parseInt(id) } })
                  .then(function () {
                      loadTasks();
                  })
                  .catch(function (error) {
                      console.error(error);
                  });
          });
      });

      // Defina o ID e a tarefa quando o botão de edição é clicado
      document.addEventListener("DOMContentLoaded", function () {
        // Adicione aqui o código anterior para adicionar tarefas à tabela
      
        // Abrir modal de edição quando o botão de edição é clicado
        document.querySelector(".tabela-js").addEventListener("click", function (e) {
          const editBtn = e.target.closest(".edit-btn");
          if (editBtn) {
            const row = editBtn.closest("tr");
            const tarefa = row.querySelector("td").textContent;
            document.querySelector("#edit-tarefa").value = tarefa;
            document.querySelector("#save-edit-btn").dataset.id = row.querySelector("th").textContent; // Armazena o ID no botão de salvar edição
            var editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();
          }
        });
      
        // Salvar alterações ao clicar no botão "Salvar Alterações"
        document.querySelector("#save-edit-btn").addEventListener("click", function () {
          const tarefaupdate = document.querySelector("#edit-tarefa").value;
          const id = this.dataset.id; // Obtém o ID armazenado no botão de salvar edição
      
          if (id) {
            axios.put(`http://127.0.0.1:5000/update`, { id: parseInt(id), nova_tarefa: tarefaupdate })
              .then(function () {
                loadTasks();
              })
              .catch(function (error) {
                console.error(error);
              })
              .finally(function () {
                var editModal = new bootstrap.Modal(document.getElementById('editModal'));
                editModal.hide();
                document.querySelector("#save-edit-btn").dataset.id = null; // Limpa o ID armazenado
              });
          }
        });
      
        function loadTasks() {
          axios.get(`http://127.0.0.1:5000/list`)
            .then(function (resposta) {
              getData(resposta.data);
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      });