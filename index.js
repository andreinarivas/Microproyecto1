const canvas = document.getElementById("canvas");
const button_container = document.getElementById("button_container");
const card_available=[
  {name: "der", image: "./fotos/der.png"},
  {name: "eco", image: "./fotos/eco.png"},
  {name: "est_lib", image: "./fotos/est_lib.png"},
  {name: "idiom", image: "./fotos/idiom.png"},
  {name: "ing_civil", image: "./fotos/ing_civil.png"},
  {name: "ing_elec", image: "./fotos/ing_elec.png"},
  {name: "ing_mec", image: "./fotos/ing_mec.png"},
  {name: "ing_prod", image: "./fotos/ing_prod.png"},
  {name: "ing_quim", image: "./fotos/ing_quim.png"},
  {name: "ing_sist", image: "./fotos/ing_sist.png"},
  {name: "mate_in", image: "./fotos/mate_in.png"},
  {name: "psic", image: "./fotos/psic.png"},
];

const game_won_div = `<div class="gameover_container"><h3>FIN DE LA PARTIDA</h3><div class="result_container"><h5>RESULTADO</h5><div class="result" id="result_container"></div></div><div class="table_container"><table class="table_results" id="table_score"><tr><th>usuario</th><th>puntaje</th></tr><tr></tr></table></div></div>`
const game_play_div= `<div class="play_area_container"><div class="info_container"><div class="time_container"><h3>TIEMPO:</h3><h4 id="timer">3:00</h4></div><div class="points_container" id="score"><h3>PUNTAJE</h3> <h4>0</h4></div></div><div class="card_container" id="card_container"></div></div>`;
const game_over_div= '<div class="gameover_container"><h3>FIN DE LA PARTIDA</h3><div class="text_start"><h2>¡SE ACABO EL TIEMPO!</h2><h5>Vuelve a comenzar el juego para volver a intentar <br> Intenta batir el record!</div><div class="table_container"><table class="table_results" id="table_score"><tr><th>usuario</th><th>puntaje</th></tr></table></div></div>';
const first_div='<div class="start_container"><div class="text_start"><h2>BIENVENIDO A METROMEMORY</h2><h5>Descubre los distintos centros de estudiantes de la universidad!. <br> Junta las parejas de logos lo más rápido que puedas <br> Tendrás 3 min para hacerlo, intenta romper el récord!</h5></div><div class="user_input"><label for="username">INGRESA TU NOMBRE</label><input type="text" class="username" id="username"><p class="msg" id="msg"></p></div></div>';


initialize();




function start_timer(username){
    let duration = 3*60;
    let time_left=duration;
    let inter_id = setInterval(()=>{
      time_left--;
      show_time(time_left);
      if(time_left<1){
        game_over(username, inter_id);
      }
    }, 1000)

    return inter_id;
}

function stop_timer(inter_id){
  clearInterval(inter_id);
}


function show_time(time_left){
  const timer = document.getElementById("timer");
  timer.innerHTML=find_time_left(time_left);
}

function find_time_left(duration){
  let minutes = String(Math.trunc(duration/60));
  let seconds = String(duration%60);
  if(minutes.length==1){
    minutes="0"+minutes;
  }
  if(seconds.length==1){
    seconds="0"+seconds;
  }
  return `${minutes}:${seconds}`;
}

function initialize(){
  canvas.innerHTML=first_div;
  button_container.innerHTML='<button class="button" id="start_button">INICIAR</button>';
  const start_button=document.getElementById("start_button");
  const username_input = document.getElementById("username");
  const msg = document.getElementById("msg");
  start_button.addEventListener("click", ()=>{
    const username=username_input.value;
    if(username==""){
      msg.innerHTML="<p>INGRESE UN NOMBRE</p>"
      setTimeout(()=>{
        msg.innerHTML=""
      }, 3000)

    }
    else{
      start_game(username);
    }
    }
  )
}

function start_game(username){
  canvas.innerHTML=game_play_div;
  button_container.innerHTML='<button class="button" id="restart">REINICIAR</button>';
  const restart_button = document.getElementById("restart");
  create_cards();
  let inter_id=start_timer(username);
  play(username, inter_id);
  restart_button.addEventListener("click", ()=>{
    stop_timer(inter_id);
    start_game(username);
  })
}



function random(available){
  let card_values = [];
  for (let i = 0; i < 8; i++) {
    const index = Math.floor(Math.random()*available.length)
    card_values.push(available[index]);
    card_values.push(available[index]);
    available.splice(index,1)
  }
  return card_values;
}

function create_cards(){
  const card_container = document.getElementById("card_container");
  var available = JSON.parse(JSON.stringify(card_available));
  const card_values=random(available);
  card_values.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 16; i++) {
    card_container.innerHTML+=`
      <div class="card" data-card="${card_values[i].name}">
        <div class="card_back">.</div>
        <div class="card_front">
          <img src="${card_values[i].image}" width=60px>
        </div>
      </div>
    `
  }
}
function add_score(score){
  const score_show = document.getElementById("score");
  const timer = document.getElementById("timer");
  let time = timer.innerHTML.split(":");
  let remain= (60*parseInt(time[0]))+parseInt(time[1]);
  score+=Math.floor((100*(remain/360)));
  score_show.innerHTML=`<h3>PUNTAJE</h3> <h4>${String(score)}</h4>`; 
  return score;
}

function play(username, inter_id){
  let score=0;
  let cards_matched=0;
  let first_card=false;
  let second_card=false;
  let first_card_value;
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", ()=>{
      if(!card.classList.contains("match")&&(!first_card||!second_card)){
        card.classList.add("flipped");
        if(!first_card){
          first_card=card;
           first_card_value= card.getAttribute("data-card");
        }else{
          second_card=card;
          let second_card_value=card.getAttribute("data-card");
          if(second_card_value==first_card_value){
              second_card.classList.add("match");
              first_card.classList.add("match");
              first_card=false;
              second_card=false;
              cards_matched++
              score = add_score(score);
              if(cards_matched==8){
                stop_timer(inter_id)
                game_won(username, score);
              }
          }else{
            let [temp_first, temp_second] = [first_card, second_card];
            setTimeout(()=>{},500);
            temp_first.classList.add("shake");
            temp_second.classList.add("shake");
            setTimeout(()=>{},500);
            setTimeout(()=>{
              temp_first.classList.remove( "shake", "flipped");
              temp_second.classList.remove("flipped", "shake");
              first_card=false;
              second_card=false;
            }, 500)
            
            
          }
        }
      }

    })
  });
}

function game_over(username, inter_id){
  stop_timer(inter_id);
  canvas.innerHTML=game_over_div;
  button_container.innerHTML='<button class="button" id="restart">RECOMENZAR</button>';
  const restart_button = document.getElementById("restart");
  print_scores(JSON.parse(localStorage.getItem("scores")));
  restart_button.addEventListener("click", ()=>{
    start_game(username);
  })
}

function game_won(username, score){
  canvas.innerHTML=game_won_div;
  const result_container = document.getElementById("result_container");
  result_container.innerHTML=`<h6>${username}</h6><h6>${score}</h6>`;
  button_container.innerHTML='<button class="button" id="start_game">REINICIAR</button><button class="button" id="restart">SALIR</button>';
  const quit_button = document.getElementById("restart");
  quit_button.addEventListener("click", ()=>{
    initialize();
  })
  const  restart_button = document.getElementById("start_game");
  restart_button.addEventListener("click", ()=>{
    start_game(username);
  })

  best_scores(username,score)
}

function best_scores(username,score){
  if(localStorage.getItem("scores")==null){
    const scores =[{user:`${username}`, score: `${score}`}]
    localStorage.setItem("scores", JSON.stringify(scores))
  }else{
    let scores = JSON.parse(localStorage.getItem("scores"));
    scores=check_if_add(scores, score, username);
    localStorage.setItem("scores", JSON.stringify(scores))
    print_scores(scores);
  }
}

function check_if_add(scores, score, username){
  scores.push({user:`${username}`, score: `${score}`});
  scores.sort((x,y)=>{
    if(parseInt(x.score)<parseInt(y.score)){
      return 1;
    }
    if(parseInt(x.score)>parseInt(y.score)){
      return -1;
    }else{
      return 0;
    }
  })
  if(scores.length>5){
    scores.pop();
  }
  
  return scores;

}

function print_scores(scores){
  const table = document.getElementById("table_score");
    table.innerHTML="<tr><th>username</th><th>score</th></tr>"
    scores.forEach(score=>{
      table.innerHTML+=`<tr><td>${score.user}</td><td>${score.score}</td></tr>`;
    });
}