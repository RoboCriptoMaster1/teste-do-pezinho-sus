const form = document.getElementById("formRN");
const tabela = document.getElementById("tabela");
const busca = document.getElementById("busca");
const importFile = document.getElementById("importFile");

let dados = JSON.parse(localStorage.getItem("rns")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();

  const rn = {
    id: Date.now(),
    nome: nomeRn.value,
    cpf: cpfRn.value,
    data: dataNascimento.value,
    sexo: sexo.value,
    raca: racaCor.value,
    peso: peso.value,
    mae: nomeMae.value,
    cpfMae: cpfMae.value,
    contato: contato.value,
    endereco: endereco.value
  };

  dados.push(rn);
  salvar();
  gerarPDF(rn);
  form.reset();
});

function salvar() {
  localStorage.setItem("rns", JSON.stringify(dados));
  render();
}

function render() {
  tabela.innerHTML = "";
  dados.filter(r =>
    r.nome.toLowerCase().includes(busca.value.toLowerCase()) ||
    r.cpf.includes(busca.value) ||
    r.data.includes(busca.value)
  ).forEach(r => {
    tabela.innerHTML += `
      <tr>
        <td>${r.nome}</td>
        <td>${r.cpf || "-"}</td>
        <td>${r.data}</td>
        <td><button onclick="gerarPDF(${r.id})">PDF</button></td>
      </tr>`;
  });
}

busca.addEventListener("input", render);

function gerarPDF(ref) {
  const rn = typeof ref === "object" ? ref : dados.find(d => d.id === ref);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  doc.setFontSize(14);
  doc.text("TESTE DO PEZINHO – SUS",105,20,{align:"center"});
  doc.setFontSize(10);

  let y = 40;
  Object.entries(rn).forEach(([k,v])=>{
    if(k!=="id"){
      doc.text(`${k.toUpperCase()}: ${v || "—"}`,20,y);
      y+=8;
    }
  });

  doc.save(`RN_${rn.nome}.pdf`);
}

importFile.addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = evt => {
    const wb = XLSX.read(evt.target.result, {type:"binary"});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    XLSX.utils.sheet_to_json(sheet).forEach(i=>{
      dados.push({
        id:Date.now()+Math.random(),
        nome:i["Nome RN"]||"",
        cpf:i["CPF RN"]||"",
        data:i["Data"]||"",
        sexo:i["Sexo"]||"",
        raca:i["Raça"]||"",
        peso:i["Peso"]||"",
        mae:i["Mãe"]||"",
        cpfMae:i["CPF Mãe"]||"",
        contato:i["Contato"]||"",
        endereco:i["Endereço"]||""
      });
    });
    salvar();
  };
  reader.readAsBinaryString(e.target.files[0]);
});

function exportarExcel(){
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "RN");
  XLSX.writeFile(wb, "teste_pezinho.xlsx");
}

render();
