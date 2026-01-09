const LOGO_SUS = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
const LOGO_SECRETARIA = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...";
const LOGO_HEO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...";

function cadastrarRN() {
  const rn = {
    nome: nome.value,
    cpfRN: cpfRN.value,
    dataNascimento: dataNascimento.value,
    sexo: sexo.value,
    raca: raca.value,
    peso: peso.value,
    nomeMae: nomeMae.value,
    cpfMae: cpfMae.value,
    telefone: telefone.value,
    endereco: `${rua.value}, ${numero.value} - ${bairro.value}`,
    cidadeUF: cidadeUF.value,
    cep: cep.value,
    coleta1: primeiraColeta.value,
    resultado1: resultado1.value,
    coleta2: segundaColeta.value,
    resultado2: resultado2.value,
    situacao: situacao.value,
    id: Date.now()
  };

  let dados = JSON.parse(localStorage.getItem("rns")) || [];
  dados.push(rn);
  localStorage.setItem("rns", JSON.stringify(dados));

  gerarPDF(rn);
  carregarTabela();
  cadastroForm.reset();
}

function gerarPDF(rn) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  doc.addImage(LOGO_SUS, "PNG", 10, 10, 30, 30);
  doc.addImage(LOGO_HEO, "JPEG", 90, 10, 30, 30);
  doc.addImage(LOGO_SECRETARIA, "JPEG", 170, 10, 30, 30);

  doc.setFontSize(14);
  doc.text("TESTE DO PEZINHO", 105, 50, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Nome RN: ${rn.nome}`, 20, 70);
  doc.text(`CPF RN: ${rn.cpfRN}`, 20, 78);
  doc.text(`Nascimento: ${rn.dataNascimento}`, 20, 86);
  doc.text(`Resultado 1ª Coleta: ${rn.resultado1}`, 20, 102);
  doc.text(`Resultado 2ª Coleta: ${rn.resultado2}`, 20, 110);

  doc.save(`RN_${rn.nome}_${rn.cpfRN}.pdf`);
}

function carregarTabela() {
  const dados = JSON.parse(localStorage.getItem("rns")) || [];
  tabela.innerHTML = "";

  dados.forEach(rn => {
    tabela.innerHTML += `
      <tr>
        <td>${rn.nome}</td>
        <td>${rn.cpfRN}</td>
        <td>${rn.dataNascimento}</td>
        <td><button onclick='gerarPDF(${JSON.stringify(rn)})'>🖨 PDF</button></td>
      </tr>`;
  });
}

function filtrarTabela() {
  const filtro = busca.value.toLowerCase();
  document.querySelectorAll("#tabela tr").forEach(tr => {
    tr.style.display = tr.innerText.toLowerCase().includes(filtro) ? "" : "none";
  });
}

window.onload = carregarTabela;