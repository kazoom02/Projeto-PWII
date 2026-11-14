"use strict";


function criarElemento(tag, classe = "", texto = "") {
    const el = document.createElement(tag);
    if (classe) {
        el.className = classe;
    }
    if (texto !== "") {
        el.appendChild(document.createTextNode(texto));
    }
    return el;
}

const UI = {
    seccaoPlaneamento: null,
    seccaoConfiguracao: null,
    selectEventoConfig: null,
    selectEventoPlan: null,
    selectDataPlan: null,
    painelDetalhesConfig: null,
    contentorNome: null,
    contentorDatas: null,
    contentorPeriodos: null,
    contentorTarefas: null,
    contentorPessoas: null,
    contentorRestricoes: null,
    tabelaTarefas: null,
    tabelaPessoas: null,
    botoesEdicaoPlan: null
};

window.addEventListener("DOMContentLoaded", () => {
    // [Siqueira - models.js]: Instanciar aqui a classe principal/coleção de Eventos passando a variável global `data` (do data.js)
    
    iniciarInterface();
});

function iniciarInterface() {
    const body = document.body;

    const nav = criarElemento("nav", "barra-navegacao");
    const btnPlan = criarElemento("button", "btn-nav ativo", "Planeamento");
    const btnConfig = criarElemento("button", "btn-nav", "Configuração");

    btnPlan.addEventListener("click", () => alternarEcra("planeamento", btnPlan, btnConfig));
    btnConfig.addEventListener("click", () => alternarEcra("configuracao", btnConfig, btnPlan));

    nav.append(btnPlan, btnConfig);
    body.appendChild(nav);

    UI.seccaoPlaneamento = construirEcraPlaneamento();
    UI.seccaoConfiguracao = construirEcraConfiguracao();
    UI.seccaoConfiguracao.classList.add("oculto");

    body.append(UI.seccaoPlaneamento, UI.seccaoConfiguracao);

    carregarVistaInicial();
}

function alternarEcra(ecraDestino, btnAtivo, btnInativo) {
    btnAtivo.classList.add("ativo");
    btnInativo.classList.remove("ativo");

    if (ecraDestino === "planeamento") {
        UI.seccaoPlaneamento.classList.remove("oculto");
        UI.seccaoConfiguracao.classList.add("oculto");
        // [Siqueira - models.js]: Chamar atualização das grelhas do Planeamento com os dados atuais do evento
    } else {
        UI.seccaoConfiguracao.classList.remove("oculto");
        UI.seccaoPlaneamento.classList.add("oculto");
    }
}

/* ==========================================================================

   ========================================================================== */
function construirEcraConfiguracao() {
    const seccao = criarElemento("section", "seccao");
    const titulo = criarElemento("h1", "titulo-seccao", "Configuração");

    UI.selectEventoConfig = criarElemento("select", "select-evento");
    UI.selectEventoConfig.addEventListener("change", (e) => {
        const indiceEvento = Number(e.target.value);
        // [Siqueira - models.js]: Mudar o evento selecionado para `indiceEvento` e atualizar as 6 linhas abaixo
    });

    const barraAcoes = criarElemento("div", "barra-acoes-evento");
    
    const divCriar = criarElemento("div", "separador");
    const btnCriarEvento = criarElemento("button", "btn-icone", "+");
    btnCriarEvento.title = "Criar novo evento";
    btnCriarEvento.addEventListener("click", () => {
        // [Siqueira - models.js]: Criar nova instância de Evento no models.js e limpar os contentores visuais
        abrirInputNomeEvento("");
    });
    divCriar.appendChild(btnCriarEvento);

    const divApagar = criarElemento("div", "separador");
    const btnApagarEvento = criarElemento("button", "btn-icone", "🗑️");
    btnApagarEvento.title = "Apagar evento";
    btnApagarEvento.addEventListener("click", () => {
        // [Siqueira - models.js]: Remover o evento atual da coleção no models.js e atualizar as Combo Boxes
    });
    divApagar.appendChild(btnApagarEvento);

    barraAcoes.append(divCriar, divApagar);

    UI.painelDetalhesConfig = criarElemento("div");

    UI.contentorNome = criarElemento("div", "lista-elementos");
    const linhaNome = criarLinhaConfig("Nome", UI.contentorNome, null);

    UI.contentorDatas = criarElemento("div", "lista-elementos");
    const linhaDatas = criarLinhaConfig("Datas", UI.contentorDatas, () => abrirFormularioData());

    UI.contentorPeriodos = criarElemento("div", "lista-elementos");
    const linhaPeriodos = criarLinhaConfig("Períodos", UI.contentorPeriodos, () => abrirFormularioTexto(UI.contentorPeriodos, "periodo"));

    UI.contentorTarefas = criarElemento("div", "lista-elementos");
    const linhaTarefas = criarLinhaConfig("Tarefas", UI.contentorTarefas, () => abrirFormularioTarefa());

    UI.contentorPessoas = criarElemento("div", "lista-elementos");
    const linhaPessoas = criarLinhaConfig("Pessoas", UI.contentorPessoas, () => abrirFormularioTexto(UI.contentorPessoas, "pessoa"));

    UI.contentorRestricoes = criarElemento("div", "lista-elementos");
    const linhaRestricoes = criarLinhaConfig("Restrições", UI.contentorRestricoes, () => abrirFormularioRestricao());

    UI.painelDetalhesConfig.append(
        linhaNome,
        linhaDatas,
        linhaPeriodos,
        linhaTarefas,
        linhaPessoas,
        linhaRestricoes
    );

    seccao.append(titulo, UI.selectEventoConfig, barraAcoes, UI.painelDetalhesConfig);
    return seccao;
}

function criarLinhaConfig(textoLabel, contentorLista, callbackBotaoMais) {
    const linha = criarElemento("div", "linha-config");
    const label = criarElemento("label", "label-config", textoLabel);
    const caixa = criarElemento("div", "caixa-itens");

    caixa.appendChild(contentorLista);

    if (callbackBotaoMais) {
        const btnMais = criarElemento("button", "btn-icone", "+");
        btnMais.addEventListener("click", callbackBotaoMais);
        caixa.appendChild(btnMais);
    }

    linha.append(label, caixa);
    return linha;
}

// --- Funções de Edição e Formulários da Configuração ---

function renderizarNomeEvento(nomeAtual) {
    UI.contentorNome.replaceChildren();
    const spanNome = criarElemento("span", "item-config", nomeAtual || "<indicar nome>");
    spanNome.title = '"Clique" para editar';
    spanNome.addEventListener("click", () => abrirInputNomeEvento(nomeAtual));
    UI.contentorNome.appendChild(spanNome);
}

function abrirInputNomeEvento(valorInicial = "") {
    UI.contentorNome.replaceChildren();
    const form = criarElemento("div", "form-inline");
    const input = criarElemento("input", "input-inline");
    input.type = "text";
    input.value = valorInicial;
    input.placeholder = "Nome do evento...";

    const btnCancelar = criarElemento("button", "btn-icone", "🚫");
    btnCancelar.addEventListener("click", () => renderizarNomeEvento(valorInicial));

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const novoNome = input.value.trim();
            // [Siqueira - models.js]: Guardar `novoNome` na instância do Evento (setter) e atualizar os <select> de eventos
            renderizarNomeEvento(novoNome);
        }
    });

    form.append(input, btnCancelar);
    UI.contentorNome.appendChild(form);
    input.focus();
}

function criarEtiquetaEditavel(textoVisivel, aoClicarParaEditar) {
    const item = criarElemento("span", "item-config", textoVisivel);
    item.title = '"Clique" para editar';
    item.addEventListener("click", aoClicarParaEditar);
    return item;
}

function abrirFormularioData(valorAntigo = null, elementoSubstituir = null) {
    const form = criarElemento("div", "form-inline");
    const inputData = criarElemento("input", "input-inline");
    inputData.type = "date";
    if (valorAntigo) inputData.value = valorAntigo;

    const btnCancelar = criarElemento("button", "btn-icone", "🚫");
    btnCancelar.addEventListener("click", () => {
        // [Siqueira - models.js]: Voltar a desenhar a lista de datas sem guardar alterações
        form.remove();
    });

    form.append(inputData, btnCancelar);

    if (valorAntigo) {
        const btnApagar = criarElemento("button", "btn-icone", "🗑️");
        btnApagar.addEventListener("click", () => {
            // [Siqueira - models.js]: Apagar data na classe em models.js (propagando às restrições e planeamento)
            form.remove();
        });
        form.appendChild(btnApagar);
    }

    inputData.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inputData.value) {
            // [Siqueira - models.js]: Adicionar/editar data (`inputData.value`) no models.js impedindo duplicados
            form.remove();
        }
    });

    if (elementoSubstituir) {
        UI.contentorDatas.replaceChild(form, elementoSubstituir);
    } else {
        UI.contentorDatas.appendChild(form);
    }
    inputData.focus();
}

function abrirFormularioTexto(contentor, tipo, valorAntigo = null, elementoSubstituir = null) {
    const form = criarElemento("div", "form-inline");
    const input = criarElemento("input", "input-inline");
    input.type = "text";
    if (valorAntigo) input.value = valorAntigo;

    const btnCancelar = criarElemento("button", "btn-icone", "🚫");
    btnCancelar.addEventListener("click", () => {
        // [Siqueira - models.js]: Redesenhar lista de períodos ou pessoas sem alterar
        form.remove();
    });

    form.append(input, btnCancelar);

    if (valorAntigo) {
        const btnApagar = criarElemento("button", "btn-icone", "🗑️");
        btnApagar.addEventListener("click", () => {
            // [Siqueira - models.js]: Apagar período ou pessoa (`tipo`) no models.js e propagar a restrições/planeamento
            form.remove();
        });
        form.appendChild(btnApagar);
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const novoValor = input.value.trim();
            // [Siqueira - models.js]: Guardar `novoValor` (período ou pessoa) no models.js garantindo que não é duplicado
            form.remove();
        }
    });

    if (elementoSubstituir) {
        contentor.replaceChild(form, elementoSubstituir);
    } else {
        contentor.appendChild(form);
    }
    input.focus();
}

function abrirFormularioTarefa(nomeAntigo = "", minAntigo = 1, elementoSubstituir = null) {
    const form = criarElemento("div", "form-inline");
    
    const inputNome = criarElemento("input", "input-inline");
    inputNome.type = "text";
    inputNome.placeholder = "Tarefa";
    inputNome.value = nomeAntigo;

    const inputMin = criarElemento("input", "input-inline input-numero");
    inputMin.type = "number";
    inputMin.min = "0";
    inputMin.value = minAntigo;

    const btnCancelar = criarElemento("button", "btn-icone", "🚫");
    btnCancelar.addEventListener("click", () => {
        // [Siqueira - models.js]: Redesenhar lista de tarefas sem alterar
        form.remove();
    });

    form.append(inputNome, inputMin, btnCancelar);

    if (nomeAntigo) {
        const btnApagar = criarElemento("button", "btn-icone", "🗑️");
        btnApagar.addEventListener("click", () => {
            // [Siqueira - models.js]: Apagar tarefa no models.js e propagar a restrições/planeamento
            form.remove();
        });
        form.appendChild(btnApagar);
    }

    const gravarTarefa = (e) => {
        if (e.key === "Enter" && inputNome.value.trim() !== "") {
            const nome = inputNome.value.trim();
            const minPessoas = parseInt(inputMin.value, 10) || 0;
            // [Siqueira - models.js]: Guardar/atualizar Tarefa(nome, minPessoas) no models.js sem duplicados
            form.remove();
        }
    };

    inputNome.addEventListener("keydown", gravarTarefa);
    inputMin.addEventListener("keydown", gravarTarefa);

    if (elementoSubstituir) {
        UI.contentorTarefas.replaceChild(form, elementoSubstituir);
    } else {
        UI.contentorTarefas.appendChild(form);
    }
    inputNome.focus();
}

function abrirFormularioRestricao(opcoes = { datas: [], periodos: [], tarefas: [], pessoas: [] }) {
    // [Siqueira - models.js]: Ao clicar no (+), passar os arrays atuais do evento (datas, períodos, tarefas e pessoas)
    const form = criarElemento("div", "form-inline");

    const selData = criarSelectOpcoes(opcoes.datas);
    const selPeriodo = criarSelectOpcoes(opcoes.periodos);
    const selTarefa = criarSelectOpcoes(opcoes.tarefas);
    const selPessoa = criarSelectOpcoes(opcoes.pessoas);

    const btnCancelar = criarElemento("button", "btn-icone", "🚫");
    btnCancelar.addEventListener("click", () => form.remove());

    const gravarRestricao = (e) => {
        if (e.key === "Enter") {
            // [Siqueira - models.js]: Ler os índices de selData, selPeriodo, selTarefa e selPessoa e criar a Restrição no models.js
            form.remove();
        }
    };

    [selData, selPeriodo, selTarefa, selPessoa].forEach((sel) => {
        sel.addEventListener("keydown", gravarRestricao);
    });

    form.append(selData, selPeriodo, selTarefa, selPessoa, btnCancelar);
    UI.contentorRestricoes.appendChild(form);
    selData.focus();
}

function criarSelectOpcoes(listaItens) {
    const select = criarElemento("select", "input-inline");
    const opcaoVazia = criarElemento("option", "", "");
    opcaoVazia.value = "";
    select.appendChild(opcaoVazia);

    listaItens.forEach((texto, indice) => {
        const opt = criarElemento("option", "", texto);
        opt.value = indice;
        select.appendChild(opt);
    });
    return select;
}

/* ==========================================================================
   
   ========================================================================== */
function construirEcraPlaneamento() {
    const seccao = criarElemento("section", "seccao");
    const titulo = criarElemento("h1", "titulo-seccao", "Planeamento");

    UI.selectEventoPlan = criarElemento("select", "select-evento");
    UI.selectEventoPlan.addEventListener("change", (e) => {
        const indiceEvento = Number(e.target.value);
        // [Siqueira - models.js]: Selecionar o evento `indiceEvento`, atualizar `UI.selectDataPlan` e redesenhar as 2 tabelas
    });

    const divSelectData = criarElemento("div", "contentor-select-data");
    UI.selectDataPlan = criarElemento("select", "select-data");
    UI.selectDataPlan.addEventListener("change", (e) => {
        const indiceData = Number(e.target.value);
        // [Siqueira - models.js]: Mudar para o dia `indiceData` e redesenhar as tabelas de Tarefas e Pessoas
    });
    divSelectData.appendChild(UI.selectDataPlan);

    const subTarefas = criarElemento("h2", "subtitulo-seccao", "Tarefas");
    const contentorTabTarefas = criarElemento("div", "contentor-tabela");
    UI.tabelaTarefas = criarElemento("table", "tabela-planeamento");
    contentorTabTarefas.appendChild(UI.tabelaTarefas);

    UI.botoesEdicaoPlan = criarElemento("div", "contentor-botoes-planeamento oculto");
    const btnAceitar = criarElemento("button", "btn-aceitar", "Aceitar");
    const btnCancelar = criarElemento("button", "btn-cancelar", "Cancelar");

    btnAceitar.addEventListener("click", () => {
        // [Siqueira - models.js]: Ler as checkboxes marcadas na tabela de Pessoas, guardar a alocação no models.js e redesenhar as tabelas
        UI.botoesEdicaoPlan.classList.add("oculto");
    });

    btnCancelar.addEventListener("click", () => {
        // [Siqueira - models.js]: Descartar a edição atual e redesenhar as tabelas no estado normal
        UI.botoesEdicaoPlan.classList.add("oculto");
    });

    UI.botoesEdicaoPlan.append(btnAceitar, btnCancelar);

    const subPessoas = criarElemento("h2", "subtitulo-seccao", "Pessoas");
    const contentorTabPessoas = criarElemento("div", "contentor-tabela");
    UI.tabelaPessoas = criarElemento("table", "tabela-planeamento");
    contentorTabPessoas.appendChild(UI.tabelaPessoas);

    seccao.append(
        titulo,
        UI.selectEventoPlan,
        divSelectData,
        subTarefas,
        contentorTabTarefas,
        UI.botoesEdicaoPlan,
        subPessoas,
        contentorTabPessoas
    );

    return seccao;
}

/**
 * Desenha a Grelha de Tarefas. O colega chama esta função passando os dados do models.js.
 */
function desenharTabelaTarefas(periodos, tarefas, obterDadosCelulaTarefa) {
    UI.tabelaTarefas.replaceChildren();

    const thead = criarElemento("thead");
    const trHead = criarElemento("tr");
    trHead.appendChild(criarElemento("th", "", ""));

    tarefas.forEach((tarefa, idxTarefa) => {
        const textoCabecalho = `${tarefa.nome} (${tarefa.minimo})`;
        const th = criarElemento("th", "cabecalho-clicavel", textoCabecalho);
        th.addEventListener("click", () => {
            // [Siqueira - models.js]: Destacar a amarelo vibrante (.estado-destaque) as pessoas associadas a `idxTarefa`
        });
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = criarElemento("tbody");
    periodos.forEach((periodo, idxPeriodo) => {
        const tr = criarElemento("tr");
        tr.appendChild(criarElemento("td", "coluna-periodo", periodo));

        tarefas.forEach((tarefa, idxTarefa) => {
            const infoCelula = obterDadosCelulaTarefa(idxPeriodo, idxTarefa);
            const td = criarElemento("td", `celula-interativa ${infoCelula.classeEstado}`, infoCelula.textoPessoas);

            if (infoCelula.classeEstado !== "estado-restrita") {
                td.addEventListener("click", () => {
                    // [Siqueira - models.js]: Marcar célula (idxPeriodo, idxTarefa) em edição (.estado-edicao) e ativar checkboxes nas Pessoas disponíveis
                    UI.botoesEdicaoPlan.classList.remove("oculto");
                });
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    UI.tabelaTarefas.append(thead, tbody);
}

/**
 * Desenha a Grelha de Pessoas. O colega chama esta função passando os dados do models.js.
 */
function desenharTabelaPessoas(periodos, pessoas, obterDadosCelulaPessoa) {
    UI.tabelaPessoas.replaceChildren();

    const thead = criarElemento("thead");
    const trHead = criarElemento("tr");
    trHead.appendChild(criarElemento("th", "", ""));

    pessoas.forEach((nomePessoa, idxPessoa) => {
        const th = criarElemento("th", "cabecalho-clicavel", nomePessoa);
        th.addEventListener("click", () => {
            // [Siqueira - models.js]: Destacar a amarelo vibrante (.estado-destaque) as tarefas atribuídas a `idxPessoa`
        });
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    const tbody = criarElemento("tbody");
    periodos.forEach((periodo, idxPeriodo) => {
        const tr = criarElemento("tr");
        tr.appendChild(criarElemento("td", "coluna-periodo", periodo));

        pessoas.forEach((nomePessoa, idxPessoa) => {
            const info = obterDadosCelulaPessoa(idxPeriodo, idxPessoa);
            const td = criarElemento("td", info.classeEstado || "");

            if (info.mostrarCheckbox) {
                const checkbox = criarElemento("input");
                checkbox.type = "checkbox";
                checkbox.checked = info.selecionada;
                checkbox.disabled = info.desativada;
                checkbox.dataset.indicePessoa = idxPessoa;
                td.appendChild(checkbox);
            } else if (info.nomeTarefaAtribuida) {
                td.appendChild(document.createTextNode(info.nomeTarefaAtribuida));
            }

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    UI.tabelaPessoas.append(thead, tbody);
}

/* ==========================================================================

   ========================================================================== */
function carregarVistaInicial() {
    if (typeof data === "undefined" || data.length === 0) return;
    const ev = data[0];

    [UI.selectEventoConfig, UI.selectEventoPlan].forEach((sel) => {
        sel.replaceChildren();
        const opt = criarElemento("option", "", ev.description);
        opt.value = 0;
        sel.appendChild(opt);
    });

    UI.selectDataPlan.replaceChildren();
    ev.dates.forEach((d, idx) => {
        const opt = criarElemento("option", "", d);
        opt.value = idx;
        UI.selectDataPlan.appendChild(opt);
    });

    renderizarNomeEvento(ev.description);
    ev.dates.forEach((d) => UI.contentorDatas.appendChild(criarEtiquetaEditavel(d, (e) => abrirFormularioData(d, e.target))));
    ev.periods.forEach((p) => UI.contentorPeriodos.appendChild(criarEtiquetaEditavel(p, (e) => abrirFormularioTexto(UI.contentorPeriodos, "periodo", p, e.target))));
    ev.tasks.forEach((t) => UI.contentorTarefas.appendChild(criarEtiquetaEditavel(`${t[0]} (${t[1]})`, (e) => abrirFormularioTarefa(t[0], t[1], e.target))));
    ev.persons.forEach((pes) => UI.contentorPessoas.appendChild(criarEtiquetaEditavel(pes, (e) => abrirFormularioTexto(UI.contentorPessoas, "pessoa", pes, e.target))));

    const tarefasFormatadas = ev.tasks.map((t) => ({ nome: t[0], minimo: t[1] }));

    desenharTabelaTarefas(ev.periods, tarefasFormatadas, (idxPeriodo, idxTarefa) => {
        const min = tarefasFormatadas[idxTarefa].minimo;
        return {
            textoPessoas: "",
            classeEstado: min === 0 ? "estado-completa" : ""
        };
    });

    desenharTabelaPessoas(ev.periods, ev.persons, () => {
        return {
            classeEstado: "",
            mostrarCheckbox: false,
            selecionada: false,
            desativada: false,
            nomeTarefaAtribuida: ""
        };
    });
}