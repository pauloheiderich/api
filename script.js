const API_BASE = 'https://parallelum.com.br/fipe/api/v1';
const tipoVeiculoSelect = document.getElementById('tipoVeiculo');
const marcasSelect = document.getElementById('marcas');
const modelosSelect = document.getElementById('modelos');
const anosSelect = document.getElementById('anos');
const consultarBtn = document.getElementById('consultar');
const loading = document.querySelector('.loading');
const result = document.getElementById('result');
const errorMessage = document.getElementById('error-message');

const favoritosMenu = document.querySelector('.nav-item:nth-child(2) .dropdown-content'); 
// seleciona o dropdown do menu "FAVORITOS"

// Cria botão "Adicionar aos Favoritos" e adiciona ao resultado da consulta
const btnFavorito = document.createElement('button');
btnFavorito.textContent = 'Adicionar aos Favoritos';
btnFavorito.className = 'btn btn-warning mt-3';
btnFavorito.style.display = 'none';  // só aparece quando tem resultado
btnFavorito.addEventListener('click', adicionarFavorito);
result.querySelector('.card-body').appendChild(btnFavorito);

tipoVeiculoSelect.addEventListener('change', async () => {
    resetSelects('marcas');
    if (tipoVeiculoSelect.value) {
        await fetchMarcas();
    }
});

marcasSelect.addEventListener('change', async () => {
    resetSelects('modelos');
    if (marcasSelect.value) {
        await fetchModelos();
    }
});

modelosSelect.addEventListener('change', async () => {
    resetSelects('anos');
    if (modelosSelect.value) {
        await fetchAnos();
    }
});

anosSelect.addEventListener('change', () => {
    consultarBtn.disabled = !anosSelect.value;
});

consultarBtn.addEventListener('click', async () => {
    await fetchValor();
});

// Ao carregar a página, atualiza a lista de favoritos no menu
document.addEventListener('DOMContentLoaded', atualizarMenuFavoritos);

async function fetchMarcas() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/${tipoVeiculoSelect.value}/marcas`);
        const data = await response.json();

        marcasSelect.innerHTML = '<option value="">Selecione a marca</option>';
        data.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.codigo;
            option.textContent = marca.nome;
            marcasSelect.appendChild(option);
        });

        marcasSelect.disabled = false;
        hideLoading();
        hideError();
    } catch (error) {
        showError('Erro ao carregar marcas');
        hideLoading();
    }
}

async function fetchModelos() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/${tipoVeiculoSelect.value}/marcas/${marcasSelect.value}/modelos`);
        const data = await response.json();

        modelosSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        data.modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.codigo;
            option.textContent = modelo.nome;
            modelosSelect.appendChild(option);
        });

        modelosSelect.disabled = false;
        hideLoading();
        hideError();
    } catch (error) {
        showError('Erro ao carregar modelos');
        hideLoading();
    }
}

async function fetchAnos() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/${tipoVeiculoSelect.value}/marcas/${marcasSelect.value}/modelos/${modelosSelect.value}/anos`);
        const data = await response.json();

        anosSelect.innerHTML = '<option value="">Selecione o ano</option>';
        data.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano.codigo;
            option.textContent = ano.nome;
            anosSelect.appendChild(option);
        });

        anosSelect.disabled = false;
        hideLoading();
        hideError();
    } catch (error) {
        showError('Erro ao carregar anos');
        hideLoading();
    }
}

async function fetchValor() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/${tipoVeiculoSelect.value}/marcas/${marcasSelect.value}/modelos/${modelosSelect.value}/anos/${anosSelect.value}`);
        const data = await response.json();

        document.getElementById('result-marca').textContent = data.Marca;
        document.getElementById('result-modelo').textContent = data.Modelo;
        document.getElementById('result-ano').textContent = data.AnoModelo;
        document.getElementById('result-combustivel').textContent = data.Combustivel;
        document.getElementById('result-valor').textContent = data.Valor;
        document.getElementById('result-fipe').textContent = data.CodigoFipe;
        document.getElementById('result-referencia').textContent = data.MesReferencia;

        result.style.display = 'block';
        btnFavorito.style.display = 'inline-block'; // mostra o botão de favorito

        hideLoading();
        hideError();
    } catch (error) {
        showError('Erro ao consultar valor');
        hideLoading();
        btnFavorito.style.display = 'none';
    }
}

function resetSelects(startFrom) {
    if (startFrom === 'marcas') {
        marcasSelect.innerHTML = '<option value="">Selecione a marca</option>';
        marcasSelect.disabled = true;
        resetSelects('modelos');
    }

    if (startFrom === 'modelos' || startFrom === 'marcas') {
        modelosSelect.innerHTML = '<option value="">Selecione o modelo</option>';
        modelosSelect.disabled = true;
        resetSelects('anos');
    }

    if (startFrom === 'anos' || startFrom === 'modelos' || startFrom === 'marcas') {
        anosSelect.innerHTML = '<option value="">Selecione o ano</option>';
        anosSelect.disabled = true;
        consultarBtn.disabled = true;
        result.style.display = 'none';
        btnFavorito.style.display = 'none';
    }
}

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// ------- FUNÇÕES DE FAVORITOS -----------

function adicionarFavorito() {
    const tipo = tipoVeiculoSelect.value;
    const marca = marcasSelect.value;
    const modelo = modelosSelect.value;
    const ano = anosSelect.value;

    if (!tipo || !marca || !modelo || !ano) return;

    // Dados legíveis para exibir no menu
    const texto = `${tipoVeiculoSelect.options[tipoVeiculoSelect.selectedIndex].text} - ${marcasSelect.options[marcasSelect.selectedIndex].text} - ${modelosSelect.options[modelosSelect.selectedIndex].text} - ${anosSelect.options[anosSelect.selectedIndex].text}`;

    const favorito = { tipo, marca, modelo, ano, texto };

    // Recupera lista atual de favoritos do localStorage
    let favoritos = JSON.parse(localStorage.getItem('fipeFavoritos') || '[]');

    // Evita duplicados
    if (favoritos.some(f => 
        f.tipo === tipo && 
        f.marca === marca && 
        f.modelo === modelo && 
        f.ano === ano)) {
        alert('Este favorito já está salvo.');
        return;
    }

    favoritos.push(favorito);
    localStorage.setItem('fipeFavoritos', JSON.stringify(favoritos));
    alert('Favorito adicionado!');
    atualizarMenuFavoritos();
}

function atualizarMenuFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('fipeFavoritos') || '[]');
    favoritosMenu.innerHTML = '';

    if (favoritos.length === 0) {
        favoritosMenu.innerHTML = '<p style="padding:10px; color:#ccc;">Nenhum favorito salvo</p>';
        return;
    }

    favoritos.forEach((fav, index) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '5px 10px';
        item.style.borderBottom = '1px solid #333';

        const link = document.createElement('a');
        link.href = '#';
        link.textContent = fav.texto;
        link.style.color = '#fff';
        link.style.textDecoration = 'none';
        link.style.flex = '1';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            carregarFavorito(fav);
        });

        const btnRemove = document.createElement('button');
        btnRemove.textContent = '×';
        btnRemove.title = 'Remover favorito';
        btnRemove.style.background = 'transparent';
        btnRemove.style.border = 'none';
        btnRemove.style.color = '#ff6b6b';
        btnRemove.style.fontSize = '16px';
        btnRemove.style.cursor = 'pointer';
        btnRemove.style.marginLeft = '8px';
        btnRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            removerFavorito(index);
        });

        item.appendChild(link);
        item.appendChild(btnRemove);
        favoritosMenu.appendChild(item);
    });
}

function removerFavorito(index) {
    let favoritos = JSON.parse(localStorage.getItem('fipeFavoritos') || '[]');
    favoritos.splice(index, 1);
    localStorage.setItem('fipeFavoritos', JSON.stringify(favoritos));
    atualizarMenuFavoritos();
}

async function carregarFavorito(fav) {
    // Ajusta selects e ativa os selects conforme o favorito
    tipoVeiculoSelect.value = fav.tipo;
    await fetchMarcas();
    marcasSelect.value = fav.marca;
    await fetchModelos();
    modelosSelect.value = fav.modelo;
    await fetchAnos();
    anosSelect.value = fav.ano;
    consultarBtn.disabled = false;
    await fetchValor();
}
