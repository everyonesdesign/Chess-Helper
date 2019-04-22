const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const grammar = `
#JSGF V1.0;
grammar chessHelper.moves;

public <move> = <piece> <maybeCoord> <combinator> <coord>;

<combinator> = to | move to | moves to | then | <NULL>;
<piece> = pawn | rook | bishop | knight | queen | king;

<coordNum> = one | two | three | four | five | six | seven | eight;
<coordLet> = a | b | c | d | e | f | g | h;
<coord> = <coordLet> <coordNum>;
<maybeCoord> = <coord> | <NULL>;
`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// TEST CODE START
recognition.start();

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative
  // objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  const last = event.results.length - 1;
  const color = event.results[last][0].transcript;

  console.log('last', last);
  console.log('color', color);
  console.log('confidence', event.results[0][0].confidence);
};

recognition.onspeechend = function() {
  recognition.stop();
};

recognition.onnomatch = function(event) {
  console.log('I didn\'t recognise that color.');
};

recognition.onerror = function(event) {
  console.log('Error occurred in recognition: ' + event.error);
};
