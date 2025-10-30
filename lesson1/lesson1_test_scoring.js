/**
 * スペイン語学習サイト - Lessión1_Test 採点スクリプト
 */
document.addEventListener("DOMContentLoaded", (event) => {
  // ----------------------------------------------------
  // 正解の定義 (CORRECT_ANSWERS)
  // name属性またはid属性のどちらで判定するかを考慮
  // ----------------------------------------------------
  const CORRECT_ANSWERS = {
    // Q1. アルファベットの発音 (1) -> B (id: q1_1_opt1)
    q1_1_radio: "q1_1_opt1",
    // Q1. アルファベットの発音 (2) -> M (id: q1_2_opt2)
    q1_2_radio: "q1_2_opt2",
    // Q2. Hの発音 -> 発音をしない (id: q2_opt2)
    q2_radio: "q2_opt2",
    // Q3. 弱母音 -> i,u (id: q3_opt4)
    q3_radio: "q3_opt4",
    // Q4. Zの発音 -> THの音(ス) (id: q4_opt3)
    q4_radio: "q4_opt3",
    // Q5. 二重母音を形成する誤っている条件 -> 2つの強母音が並ぶ場合 (id: q5_opt1)
    q5_radio: "q5_opt1",
    // Q6. llの音節区切り -> 「ll」全体で一つの子音として、音節を分離しない (HTML value: 無し, id: q6_opt3)
    q6_radio: "q6_opt3", // HTMLにvalueが無いため、idで判定するように修正
    // Q7. profesor の音節区切り -> pro-fe-sor (id: q7_opt4)
    q7_radio: "q7_opt4",
    // Q8. アクセント符号による区別 -> tú / tu (id: q8_opt1)
    q8_radio: "q8_opt1",
    // Q9. 末尾がN/S以外の子音で終わる単語のアクセント -> 最後の音節から2番目 (id: q9_opt2)
    q9_radio: "q9_opt2",
  };

  // フォーム要素とボタンの取得
  // document全体から要素を取得します
  const scoreButton = document.getElementById("score-btn");
  const resultArea = document.getElementById("result-display-area"); //親要素
  const nextLessonButton = document.getElementById("next-lesson-btn");

  // 質問グループのname属性リスト（回答チェック用）
  const questionNames = Object.keys(CORRECT_ANSWERS);

  // question IDとCORRECT_ANSWERSのnameの対応付け
  const questionIdMap = {
    q1_1_radio: "question_1",
    q1_2_radio: "question_2",
    q2_radio: "question_3",
    q3_radio: "question_4",
    q4_radio: "question_5",
    q5_radio: "question_6",
    q6_radio: "question_7",
    q7_radio: "question_8",
    q8_radio: "question_9",
    q9_radio: "question_10",
  };

  /**
   * テスト結果を計算し、表示するメイン関数
   */
  function calculateAndDisplayScore() {
    let score = 0;
    const totalQuestions = questionNames.length;
    let unansweredQuestions = [];

    // 以前の結果表示があれば削除
    const oldResult = document.getElementById("test-result");
    if (oldResult) {
      oldResult.remove(); //ここで削除してる
    }

    // 全ての質問からハイライトと赤枠をクリア
    clearAllHighlights();

    // ----------------------------------------------------
    // 採点処理と未回答チェック
    // ----------------------------------------------------
    for (const name of questionNames) {
      const correctValue = CORRECT_ANSWERS[name];
      let isCorrect = false;
      let isAnswered = false; //回答したらフラグ立つ

      // ラジオボタンの選択状態を確認
      const selectedRadio = document.querySelector(
        `input[name="${name}"]:checked`
      );

      if (selectedRadio) {
        isAnswered = true;

        // 判定値: idを優先的に使用 (HTMLでvalueが設定されていても、idで一貫して判定する)
        const userAnswer = selectedRadio.id;

        // 正解判定
        isCorrect = correctValue === userAnswer; //correctValueとuserAnswerが完全一致したらisCorrectに代入

        // スコア加算とハイライト
        if (isCorrect) {
          score++;
          highlightQuestion(name, true);
        } else {
          highlightQuestion(name, false);
        }
      }

      // 未回答の場合、リストに追加
      if (!isAnswered) {
        unansweredQuestions.push(name);
      }
    }

    // ----------------------------------------------------
    // 未回答チェック (100%回答必須)
    // ----------------------------------------------------
    if (unansweredQuestions.length > 0) {
      displayUnansweredError(unansweredQuestions);
      nextLessonButton.classList.add("d-none"); //Nextボタンを出さない
      return; // 採点を中断
    }

    // ----------------------------------------------------
    // 結果の表示とNextボタンの制御
    // ----------------------------------------------------
    scoreButton.classList.add("d-none"); //採点ボタンを非表示

    displayResult(score, totalQuestions); //結果を表示

    nextLessonButton.classList.remove("d-none"); //Nextボタンを表示

    // 100%正解しないとNextボタンを有効化しない
    if (score === totalQuestions) {
      nextLessonButton.classList.remove("disabled", "btn-outline-success");
      nextLessonButton.classList.add("btn-success");
    } else {
      nextLessonButton.classList.add("disabled", "btn-outline-success");
      nextLessonButton.classList.remove("btn-success");
    }
  }

  /**
   * 質問に対して視覚的なフィードバック（正解/不正解）を表示する関数
   * @param {string} name 質問のname属性
   * @param {boolean} isCorrect 正解かどうか
   */
  function highlightQuestion(name, isCorrect) {
    const questionDivId = questionIdMap[name];
    const questionDiv = document.getElementById(questionDivId);

    if (questionDiv) {
      // 既存のハイライトと未回答時の赤枠をクリア
      questionDiv.classList.remove(
        "bg-danger-subtle",
        "bg-success-subtle",
        "border",
        "border-3",
        "border-danger"
      );

      // 背景色でフィードバック
      if (isCorrect) {
        questionDiv.classList.add("bg-success-subtle");
      } else {
        questionDiv.classList.add("bg-danger-subtle");
      }
    }
  }

  /**
   * 未回答の質問がある場合のエラーメッセージ表示
   * @param {string[]} unansweredNames 未回答の質問のname属性配列
   */
  function displayUnansweredError(unansweredNames) {
    //採点ボタンを再表示（エラー解除後に再採点できるように）
    scoreButton.classList.remove("d-none");
    const resultHtml = `
      <div id="test-result" class="alert alert-warning mt-4" role="alert">
        <h4 class="alert-heading">⚠️ 未回答の問題があります</h4>
        <p class="mb-0">すべての問題に回答を入力してから、採点ボタンを押してください。</p>
      </div>
    `;

    resultArea.insertAdjacentHTML("afterbegin", resultHtml);

    // 未回答の質問を赤枠でハイライト
    unansweredNames.forEach((name) => {
      const questionDivId = questionIdMap[name];
      const questionDiv = document.getElementById(questionDivId);
      if (questionDiv) {
        questionDiv.classList.add("border", "border-3", "border-danger");
      }
    });
  }

  /**
   * 最終的な結果をプログレスバー付きで表示する
   * @param {number} score 獲得点数
   * @param {number} totalQuestions 総質問数
   */
  function displayResult(score, totalQuestions) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const resultHtml = `
      <div id="test-result" class="alert alert-info mt-4" role="alert">
          <h4 class="alert-heading">テスト結果: ${score} / ${totalQuestions} 問正解！</h4>
          <p class="fs-4 fw-bold mb-1">${percentage}% ${
      percentage === 100 ? "Perfect!" : "もうちょっと！頑張れ！"
    }</p>
          
          <div class="progress mb-3" role="progressbar" aria-label="正答率" aria-valuemin="0" aria-valuemax="100" style="height: 16px;">
            <div class="progress-bar ${
              percentage === 100 ? "bg-success" : "bg-primary"
            }" style="width: ${percentage}%; font-weight: bold; font-size: 1rem;">
            </div>
          </div>
          
          <hr>
          <p class="mb-0">各問題の正誤判定がハイライト表示されています。</p>
      </div>
    `;

    resultArea.insertAdjacentHTML("afterbegin", resultHtml);
  }

  /**
   * 全ての質問からハイライト（正誤判定の背景色と未回答時の赤枠）をクリアする
   */
  function clearAllHighlights() {
    for (const key in questionIdMap) {
      const questionDiv = document.getElementById(questionIdMap[key]);
      if (questionDiv) {
        questionDiv.classList.remove(
          "bg-danger-subtle",
          "bg-success-subtle",
          "border",
          "border-3",
          "border-danger"
        );
      }
    }
  }

  // ----------------------------------------------------
  // イベントリスナーの設定
  // ----------------------------------------------------
  if (scoreButton) {
    scoreButton.addEventListener("click", function (event) {
      event.preventDefault(); // 採点ボタンはフォーム送信のように動作させない
      calculateAndDisplayScore();
    });
  }
});
