const cookie = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith("device_data="))?.split("=")[1]);
const myHeader = new Headers();
myHeader.append("x-api-key", cookie["auth_token"]);
const myJSONHeader = new Headers();
myJSONHeader.append("x-api-key", cookie["auth_token"]);
myJSONHeader.append("Content-Type", "application/json");
async function urlGet(url){
const a = await fetch(url, {
  method: 'GET',
  headers: myHeader
}).then(res => res.json());
return a;
};
async function getTaskById(id){
const url = `https://edusp-api.ip.tv/tms/task/${id}/apply?preview_mode=false`
const q = await urlGet(url)
return q
};
async function getAllTasks(id){
const url = `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&publication_target[]=rb40721df38fe95b01-l&publication_target[]=763&publication_target[]=1080&limit=100&filter_expired=true&category_id=${id}&offset=0`
const q = await urlGet(url)
return q
};
function getQuestions(task){
  let questions = []
  if(task["questions"]){
    task["questions"].forEach(function(it, i){
      if( it["type"] != "info"){
        questions.push(it)
      }
    })
  }
  return questions
};

async function getCorrect(task, question){
  const a = await fetch(`https://edusp-api.ip.tv/tms/task/${task["id"]}/question/${question["id"]}/correct`, {
    method: "POST",
    body: JSON.stringify({
      "answer" : {}
    }),
    headers: myJSONHeader
  }).then(res => res.json());
  return a;
}
async function getAllCategories(){
  const url = "https://edusp-api.ip.tv/tms/task/todo/categories?publication_target[]=rb40721df38fe95b01-l&publication_target[]=763&publication_target[]=1080"
  const a = await urlGet(url)
  return a
}


const el = document.createElement("dialog")
const hk = document.createElement("dialog")
const buttonH = document.createElement("button")
buttonH.style["z-index"] = "999999999";
buttonH.onclick = () => hk.showModal();
buttonH.innerHTML = "Gabarito";
buttonH.style["background-color"] = "black";
buttonH.style["position"] = "absolute";
el.id = "gabarito"
el.style = "border: none;"
el.onclick = () => {
  el.close();
}
hk.onclick = () => {
  hk.close();
}

const botoes = [
  "Selecionar Tarefa",
  "Mostrar Gabarito",
]
const selectHomework = () => {
  el.innerHTML = "Tarefas aq kk"
  el.showModal()
}
const genGabarito = () => {
  el.innerHTML = "gabarito"
  el.showModal()
}
for(let i = 0; i < botoes.length; i++){
  const btn = document.createElement("button")
  btn.style = "margin: 10px;"
  switch(i){
    case 0:
      btn.onclick = selectHomework;
      break;
    case 1:
      btn.onclick = genGabarito;
      break;
  }
  btn.innerHTML = botoes[i];
  hk.appendChild(btn)
}
document.body.appendChild(el)
document.body.appendChild(hk)
document.body.appendChild(buttonH)

async function initPELADINHO(){
  if(prompt("Usar Gabarito Anterior(sim/nao)") == "sim"){
    el.showModal()
    return
  }
  const task_author = prompt("Professor: ")
  let task = 0;
  el.innerHTML = ""
  const cc = await getAllCategories();
  for(let i = 0;i<cc.length;i++){
    if(task != 0){
      break;
    }
    const bb = await getAllTasks(cc[i]["id"])
    for(let j = 0;j<bb.length;j++){
      if(bb[j]["author"] == task_author){
        const yn = prompt(`${bb[j]["title"]}`)
        if(yn == "sim"){
          task = bb[j]
          break;
        }
      }
    }
  }
  if(task == 0){
    initPELADINHO();
  }
  const task_i = await getTaskById(task["id"])
  const questions = getQuestions(task_i)
  for(let i = 0; i<questions.length; i++){
    el.innerHTML += "<div style=\"border: 2px solid black\">"
    el.innerHTML += `<h3>Questão ${i+1}:</h3>`
    const response = await getCorrect(task_i, questions[i])
    const str = response["comment"].replaceAll("correta", "<b>correta</b>")
    el.innerHTML += str
    el.innerHTML += "</div>"
  }
  el.showModal()
}
