export const saySomething = (text, languageCode) => {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = languageCode;
    msg.text = text;
    window.speechSynthesis.speak(msg);
}