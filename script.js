const API_BASE = 'https://parallelum.com.br/fipe/api/v1';
const tipoVeiculoSelect = document.getElementById('tipoVeiculo');
const marcasSelect = document.getElementById('marcas');
const modelosSelect = document.getElementById('modelos');
const anosSelect = document.getElementById('anos');
const consultarBtn = document.getElementById('consultar');
const loading = document.querySelector('.loading');
const result = document.getElementById('result');
const errorMessage = document.getElementById('error-message');

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
        hideLoading();
        hideError();
    } catch (error) {
        showError('Erro ao consultar valor');
        hideLoading();
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
