const { jsPDF } = window.jspdf;
let dados = JSON.parse(localStorage.getItem('rns')) || [];

const lista = document.getElementById('lista');
const busca = document.getElementById('busca');

document.getElementById('formRN').addEventListener('submit', e => {
  e.preventDefault();

  const rn = {
    nome: rnNome.value,
    cpf: rnCpf.value,
    nasc: rnNascimento.value,
    raca: rnRaca.value,
    c1: resultado1.value || '-',
    c2: resultado2.value || '-',
    data: new Date().toLocaleDateString()
  };

  dados.push(rn);
  localStorage.setItem('rns', JSON.stringify(dados));
  gerarPDF(rn);
  render();
  e.target.reset();
});

function render(filtro = '') {
  lista.innerHTML = '';
  dados
    .filter(r => JSON.stringify(r).toLowerCase().includes(filtro.toLowerCase()))
    .forEach((r, i) => {
      lista.innerHTML += `
        <tr>
          <td>${r.nome}</td>
          <td>${r.cpf}</td>
          <td>${r.nasc}</td>
          <td>${r.raca}</td>
          <td>${r.c1}</td>
          <td>${r.c2}</td>
          <td><button onclick="gerarPDF(dados[${i}])">PDF</button></td>
        </tr>`;
    });
}

busca.addEventListener('input', e => render(e.target.value));

function gerarPDF(r) {
  const pdf = new jsPDF('p', 'mm', 'a4');

  pdf.setFontSize(12);
  pdf.text('TESTE DO PEZINHO - SUS', 105, 20, { align: 'center' });

  pdf.text(`RN: ${r.nome}`, 20, 40);
  pdf.text(`CPF: ${r.cpf}`, 20, 50);
  pdf.text(`Nascimento: ${r.nasc}`, 20, 60);
  pdf.text(`Raça: ${r.raca}`, 20, 70);
  pdf.text(`1ª Coleta: ${r.c1}`, 20, 80);
  pdf.text(`2ª Coleta: ${r.c2}`, 20, 90);

  pdf.save(`RN_${r.nome}.pdf`);
}

function exportarExcel() {
  let csv = 'RN,CPF,Nascimento,Raça,1ª,2ª\n';
  dados.forEach(r => {
    csv += `${r.nome},${r.cpf},${r.nasc},${r.raca},${r.c1},${r.c2}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'teste-pezinho.csv';
  link.click();
}

function importarArquivo(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const linhas = reader.result.split('\n').slice(1);
    linhas.forEach(l => {
      const [nome, cpf, nasc, raca, c1, c2] = l.split(',');
      if (nome) dados.push({ nome, cpf, nasc, raca, c1, c2 });
    });
    localStorage.setItem('rns', JSON.stringify(dados));
    render();
  };
  reader.readAsText(file);
}

render();
