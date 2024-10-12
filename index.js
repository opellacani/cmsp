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
el.id = "gabarito"
el.onclick = () => {
  el.close();
}
hk.onclick = () => {
  hk.close();
}
const selectHomework = () => {
  const cc = await getAllCategories();
  for(let i = 0;i<cc.length;i++){
    const bb = await getAllTasks(cc[i]["id"])
    for(let j = 0;j<bb.length; j++){
      const il = document.createElement("h5");
      il.innerHTML = bb[j]["title"]
      el.appendChild(il)
    }
  }
}
const genGabarito = (task) => {
  const task_i = await getTaskById(task["id"])
  const questions = getQuestions(task_i)
  el.innerHTML = "";
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

const botoes = [
  "Selecionar Tarefa",
  "Mostrar Tarefa",
]
for(let i = 0; i < botoes.length; i++){
  const btn = document.createElement("button")
  switch(i){
    case 0:
      btn.onclick = selectHomework;
      break;
    case 1:
      btn.onclick = genGabarito;
      break;
  }
  btn.innerHTML = botoes[i];
}
document.body.appendChild(el)
document.body.appendChild(hk)
hk.showModal()
