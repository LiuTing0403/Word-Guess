$(function(){
  var $word = $("#word");
  var $guesses = $("#guesses");
  var game;
  var Game = function(){
    this.target = randomWord();
    if (this.target === undefined) {
      this.displayMessage("Sorry! I've run out of words");
      $("#message").find("a").hide();
      $("span").remove();
      return;
    }
    this.incorrectCount = 0;
    this.correctCount = 0;
    this.guesses = [];
    this.blankCount = this.target.length;
    this.init();
  };
  Game.prototype = {
    creatBlank: function(){
      var chars = this.target.split("");
      $("span").remove();
      $("#message").hide();
      $("body").removeClass();
      chars.forEach(function(char){
        var $char = $("<span class='char'" + "data-id=" + char + "></span>");
        $word.append($char);
      });
    },
    displayMessage: function(text){
      $("#message").find("p").text(text);
    },
    charCounting: function(){
      var result = {};
      var chars = this.target.split("");
      chars.forEach(function(item){
        if (result[item] === undefined) { result[item] = 1; }
        else { result[item] += 1; }
      });
      this.charCounts = result;
    },
    incorrectGuess: function(){
      this.incorrectCount += 1;
      this.displayApple();
      if (this.incorrectCount === 6){ this.lose(); }
    },
    correctGuess: function(charInput){
      this.correctCount += this.charCounts[charInput];
      this.blankCount -= this.charCounts[charInput];
      this.fillBlank(charInput);
      if (this.blankCount === 0) { this.win();}
    },
    processGame: function (event){
      if (!this.isValidChar(event.which)) { return; }
      var charInput = String.fromCharCode(event.which);
      if (this.guesses.indexOf(charInput)===-1) {
        this.guesses.push(charInput);
        this.displayGuessChar(charInput); 
        if (this.charCounts[charInput] === undefined){
          this.incorrectGuess();
        } else {
          this.correctGuess(charInput);
        }
      }
    },
    isValidChar: function(code) {
      return code > 97 && code < 122;
    },
    displayGuessChar: function(charInput){
      var $char = $("<span class='char'>" + charInput + "</span>");
      $guesses.append($char);
    },
    fillBlank: function(charInput) {
      $word.find("[data-id="+charInput + "]").text(charInput);
    },

    displayApple: function(){
      $("#apple").css({
        "backgroundPosition":"0 " + (-322) * this.incorrectCount + "px"
      });
    },
    bind: function() {
      $(document).on("keypress", this.processGame.bind(this));
    },
    unbind: function() {
      $(document).off("keypress");
    },
    win: function() {
      this.displayMessage("You win!");
      $("#message").show();
      $("body").addClass("win");
      this.unbind();
    },
    lose: function() {
      this.displayMessage("Sorry! You're out of guesses");
      $("#message").show();
      $("body").addClass("lose");
      this.unbind();
    },
    init: function(){
      this.creatBlank();
      this.charCounting();
      this.displayApple();
      this.unbind();
      this.bind();
    }
  }

  var randomWord = (function(){
    var words = ["prototype", "append", "event", "hide", "push"];
    function without(){
      var args = Array.prototype.slice.call(arguments);
      var new_arr = [];
      words.forEach(function(el){
        if ( args.indexOf(el) === -1) {new_arr.push(el)}
      });
      return new_arr;
    }
    return function(){
      var random = Math.floor(Math.random()*(words.length));
      var word = words[random];
      words = without(word);
      return word;
    }
  })();

  game = new Game();
  console.log(game.target);

  $("a").on("click", function(e){
    e.preventDefault();
    game = new Game();
  });
});