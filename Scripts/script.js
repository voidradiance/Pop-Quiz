function recordCandidateList(candidateList, keyName){
  if(typeof(Storage) != undefined){
    localStorage.setItem(keyName, candidateList);
  }
}
function loadCandidateList(keyName){
  if(typeof(Storage) != undefined){
    var candidateString =localStorage.getItem(keyName);
    if(candidateString != null){
      var candidateList = candidateString.split(","); /*Secara otomatis array akan ditulis dengan comma, dan sekarang harus displit dengan comma*/
      return candidateList;
    }else{
      return false;
    }
  }
}
function mergeExistingPendingCandidateList(){
  var existingCandidateList = loadCandidateList("pendingCandidate");
  var newCandidateList = enterNewPendingCandidate();
  if(existingCandidateList === false){
    return newCandidateList;
  }else{
    var combinedCandidateList = existingCandidateList.concat(newCandidateList);
    return combinedCandidateList;
  }
}
function saveCorrectCandidateList(candidateName){
  var existingCandidateList = loadCandidateList("correctCandidate");
  if(existingCandidateList !== false){
    existingCandidateList.push(candidateName);
  }else{
    existingCandidateList = [candidateName];
  }
  if(typeof(Storage) != undefined){
    localStorage.removeItem("correctCandidate");
  }
  recordCandidateList(existingCandidateList, "correctCandidate");
}
function saveWrongCandidateList(candidateName){
  var existingCandidateList = loadCandidateList("wrongCandidate");
  if(existingCandidateList !== false){
    existingCandidateList.push(candidateName);
  }else{
    existingCandidateList = [candidateName];
  }
  if(typeof(Storage) != undefined){
    localStorage.removeItem("wrongCandidate");
  }
  recordCandidateList(existingCandidateList, "wrongCandidate");
}
function populatePendingCandidate(){
  var pendingCandidateNode = document.querySelector(".list-container .left-container");
  var pendingCandidateList = loadCandidateList("pendingCandidate");
  if(pendingCandidateList !== undefined && pendingCandidateList !== false){
    for(index = 0; index < pendingCandidateList.length; index++){
      var spanNode = document.createElement("span");
      var textNode = document.createTextNode(pendingCandidateList[index]);
      spanNode.appendChild(textNode);
      pendingCandidateNode.appendChild(spanNode);
    }
  }
}
function populatePassedCorrectCandidate(){
  var passedCandidateNode = document.querySelector(".list-container .right-container");
  var passedCorrectCandidateList = loadCandidateList("correctCandidate");
  if(passedCorrectCandidateList !== undefined && passedCorrectCandidateList !== false){
    for(index = 0; index < passedCorrectCandidateList.length; index++){
      var spanNode = document.createElement("span");
      spanNode.setAttribute("class", "correct"); /*cukup set class, CSS yang label kan*/
      var textNode = document.createTextNode(passedCorrectCandidateList[index]);
      spanNode.appendChild(textNode);
      passedCandidateNode.appendChild(spanNode);
    }
  }
}
function populatePassedWrongCandidate(){
  var passedCandidateNode = document.querySelector(".list-container .right-container");
  var passedWrongCandidateList = loadCandidateList("wrongCandidate");
  if(passedWrongCandidateList !== undefined && passedWrongCandidateList != false){
    for(index = 0; index < passedWrongCandidateList.length; index++){
      var spanNode = document.createElement("span");
      spanNode.setAttribute("class", "wrong"); /*cukup set class, CSS yang label kan*/
      var textNode = document.createTextNode(passedWrongCandidateList[index]);
      spanNode.appendChild(textNode);
      passedCandidateNode.appendChild(spanNode);
    }
  }
}
function enterNewPendingCandidate(){
  alert("Please enter all candidates name one by one into the prompt window after");
  var newCandidates = new Array();
  var confirmation;
  do{
    var newCandidate = prompt("Enter new candidate name");
    newCandidates.push(newCandidate);
    confirmation = confirm("Do you wish to enter new candidate?");
  }while(confirmation === true)
  return newCandidates;
}
function initialization(){
  /*
    Apabila oldData,
    True: Akan pakai seluruh local Storage yang ada sebelumnya termasuk pending candidate, passed correct candidate dan passed wrong candidate.
    False: Seluruh local Storage akan di clear.
  */
  var oldData = confirm("Do you wish to continue the old list?");
  var pendingCandidateList;
  if(oldData === true){
    var additionalCandidate = confirm("Do you wish to add new pending candidates?"); /*Cuma pakai yang lama saja*/
    if(additionalCandidate === true){
      pendingCandidateList = mergeExistingPendingCandidateList();
    }else{
      pendingCandidateList = loadCandidateList("pendingCandidate");
    }
    populatePassedCorrectCandidate();
    populatePassedWrongCandidate();
  }else{
    if(typeof(Storage) != undefined){
      localStorage.clear();
    }
    pendingCandidateList = enterNewPendingCandidate();
  }
  recordCandidateList(pendingCandidateList, "pendingCandidate");
  populatePendingCandidate();
}
function resetQuiz(){
  resetQuestionButtons();
  resetQuestionDisplay();
  var modalNode = document.querySelector(".modal-wrapper");
  modalNode.removeAttribute("style");
  var remainingPendingCandidate = loadCandidateList("pendingCandidate");
  if(remainingPendingCandidate.length < 1 || remainingPendingCandidate == false){
    alert("GAME OVER");
  }else{
    startTheTimer();
  }
}
function resetQuestionButtons(){
  /*Muncul kan kembali begin button dan hilangkan correct and wrong button.*/
  var correctButtonNode = document.getElementById("correct-button");
  var wrongButtonNode = document.getElementById("wrong-button");
  var beginButtonNode = document.getElementById("begin-button");
  correctButtonNode.removeAttribute("style");
  wrongButtonNode.removeAttribute("style");
  beginButtonNode.removeAttribute("style");
}
function resetQuestionDisplay(){
  /*Muncul kan kembali kalimat pemilihan employee*/
  var questionNode = document.getElementById("question");
  var sentenceNode = document.getElementsByClassName("sentence")[0];
  var candidateNode = document.getElementById("candidate");
  while(questionNode.firstChild){
    questionNode.removeChild(questionNode.firstChild);
  }
  while(candidateNode.firstChild){
    candidateNode.removeChild(candidate.firstChild);
  }
  questionNode.removeAttribute("style");
  sentenceNode.removeAttribute("style");
}
function showCurrentQuestion(questionSentence){
  var questionNode = document.getElementById("question");
  var sentenceNode = document.getElementsByClassName("sentence")[0];
  var questionTextNode = document.createTextNode(questionSentence);
  questionNode.appendChild(questionTextNode);
  questionNode.style.display = "block";
  sentenceNode.style.display = "none";
}
function getAllFirstJSQuestions(){
  var questionList = []; /*List semua pertanyaan*/
  questionList[0] = "Question 0";
  questionList[1] = "Question 1";
  questionList[2] = "Question 2";
  questionList[3] = "Question 3";
  questionList[4] = "Question 4";
  questionList[5] = "Question 5";
  questionList[6] = "Question 6";
  questionList[7] = "Question 7";
  questionList[8] = "Question 8";
  questionList[9] = "Question 9";
  questionList[10] = "Question 10";
  questionList[11] = "Question 11";
  questionList[12] = "Question 12";
  questionList[13] = "Question 13";
  questionList[14] = "Question 14";
  questionList[15] = "Question 15";
  questionList[16] = "Question 16";
  questionList[17] = "Question 17";
  questionList[18] = "Question 18";
  questionList[19] = "Question 19";
  questionList[20] = "Question 20";
  return questionList;
}
function setQuestionButtons(){
  var correctButtonNode = document.getElementById("correct-button");
  var wrongButtonNode = document.getElementById("wrong-button");
  var beginButtonNode = document.getElementById("begin-button");
  beginButtonNode.style.display = "none";
  correctButtonNode.style.display = "inline-block";
  wrongButtonNode.style.display = "inline-block";
}
function refreshPendingCandidateNode(){
  var pendingCandidateNode = document.querySelector(".list-container .left-container");
  while(pendingCandidateNode.firstChild){
    pendingCandidateNode.removeChild(pendingCandidateNode.firstChild);
  }
  populatePendingCandidate();
}
function refreshPassedCandidate(){
  var passedCandidateNode = document.querySelector(".list-container .right-container");
  while(passedCandidateNode.firstChild){
    passedCandidateNode.removeChild(passedCandidateNode.firstChild);
  }
  populatePassedCorrectCandidate();
  populatePassedWrongCandidate();
}
function displayPopUp(candidateName){
  var candidateNode = document.getElementById("candidate");
  var candidateTextNode = document.createTextNode(candidateName);
  candidateNode.appendChild(candidateTextNode);
  var modalNode = document.querySelector(".modal-wrapper");
  modalNode.style.display = "flex";
}
function getRandomIndex(maxIndex){
  var randomValue = Math.random();
  var floatingRandomValue = randomValue * maxIndex;
  var randomIndex = Math.floor(floatingRandomValue);
  return randomIndex;
}
function getRandomQuestion(questionList){
  var randomIndex = getRandomIndex(questionList.length);
  var randomQuestion = questionList[randomIndex];
  questionList.splice(randomIndex, 1);
  return randomQuestion;
}
function getRandomPendingCandidate(candidateList){
  var randomIndex = getRandomIndex(candidateList.length);
  var randomPendingCandidate = candidateList[randomIndex];
  candidateList.splice(randomIndex, 1);
  recordCandidateList(candidateList, "pendingCandidate");
  return randomPendingCandidate;
}
function playQuiz(){
  var currentPendingCandidateList = loadCandidateList("pendingCandidate");
  if(playQuiz.currentQuestionList === null || playQuiz.currentQuestionList === undefined){
    playQuiz.currentQuestionList = getAllFirstJSQuestions();
  }
  playQuiz.selectedRandomPendingCandidate = getRandomPendingCandidate(currentPendingCandidateList);
  refreshPendingCandidateNode();
  displayPopUp(playQuiz.selectedRandomPendingCandidate);
}
var updateTimerNode = function(secondsLeft){
  /*function ini dipanggil setiap satu detik*/
  var secondNode = document.getElementById("seconds-left");
  var secondInString = secondsLeft.toString();
  var secondTextNode = document.createTextNode(secondInString);
  secondNode.removeChild(secondNode.childNodes[0]);
  secondNode.appendChild(secondTextNode);
  startTheTimer(secondsLeft - 1); /*Recursive*/
}
function startTheTimer(seconds){
  if(seconds === null || seconds === undefined){ /*Dengan menggunakan function property, akan melacak apakah function ini cuma di invoke pada saat recurive*/
    seconds = startTheTimer.seconds; /*Waktu di countdown ulang lagi*/
    startTheTimer.secondsLeft = seconds; /*ulang sisa waktu yang masih ada*/
  }
  if(startTheTimer.seconds === null || startTheTimer.seconds === undefined){
    startTheTimer.seconds = seconds; /*Apabila function property masih kosong, berarti ini pertamakali set waktu di new game.*/
  }
  if(startTheTimer.secondsLeft === null || startTheTimer.secondsLeft === undefined || startTheTimer.secondsLeft > seconds){ /*Dengan menggunakan function property, akan melacak apakah function ini cuma di invoke pada saat recurive*/
    startTheTimer.secondsLeft = seconds; /*mengupdate sisa waktu apabila property secondsLeft ketinggalan*/
  }
  if(startTheTimer.secondsLeft < 0){
    playQuiz();/*waktu habis, mainkan quiznya*/
  }else{
    setTimeout(updateTimerNode, 1000, startTheTimer.secondsLeft); /*Set timeout cuma di set setiap satu detik saja, karena setiap detik digunakan untuk update label*/
  }
}
function getTimerDelayInSeconds(){
  var secondsInput = prompt("How many seconds do you wish to set your timer?");
  return parseInt(secondsInput);
}
function main(){
  var seconds = getTimerDelayInSeconds();
  startTheTimer(seconds);
}
document.addEventListener("DOMContentLoaded", function(){
    initialization();
    main();
    var beginButtonNode = document.getElementById("begin-button");
    var correctButtonNode = document.getElementById("correct-button");
    var wrongButtonNode = document.getElementById("wrong-button");
    beginButtonNode.addEventListener("click", function(event){
      setQuestionButtons();
      var selectedRandomQuestion = getRandomQuestion(playQuiz.currentQuestionList);
      showCurrentQuestion(selectedRandomQuestion);
    });
    correctButtonNode.addEventListener("click", function(event){
      saveCorrectCandidateList(playQuiz.selectedRandomPendingCandidate);
      refreshPassedCandidate();
      resetQuiz();
    });
    wrongButtonNode.addEventListener("click", function(event){
      saveWrongCandidateList(playQuiz.selectedRandomPendingCandidate);
      refreshPassedCandidate();
      resetQuiz();
    });
});