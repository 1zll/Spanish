/* 音声ボタン */
function speakSpanish(text) {
    let msg = new SpeechSynthesisUtterance();
    msg.text = text;  // 直接テキストを指定
    msg.lang = "es-ES"; // スペイン語（スペイン）
    msg.rate = 0.9; // 話す速度（1.0が標準、0.5～2.0で調整可能）
    msg.pitch = 1.0; // 声の高さ（1.0が標準、0.1～2.0で調整可能）
            
    window.speechSynthesis.cancel(); // 再生中の音声をキャンセル（連続再生を防ぐ）
    window.speechSynthesis.speak(msg); // 音声を再生
}

function speakInputText() {
    let text = document.getElementById("spanishText").value;
    if (text.trim() === "") {
        alert("スペイン語の文章を入力してください！");
        return;
    }
    speakSpanish(text);
}
