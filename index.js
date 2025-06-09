const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }

    const screen = document.getElementById("screen");
    const result = document.getElementById("result");
    const progressBar = document.getElementById("progress-bar");
    const tableContainer = document.getElementById("table-container");

    let level = 0;
    const maxLevels = 5;
    let results = [];
    let isReady = false;
    let isGo = false;
    let startTime = 0;
    let timeout;

    screen.addEventListener("click", () => {
      if (!isReady) {
        startLevel();
      } else if (!isGo) {
        failLevel("Рано! Попробуй снова.");
      } else {
        endLevel();
      }
    });

    function startLevel() {
      screen.className = "ready";
      screen.textContent = `Уровень ${level + 1}: Жди зелёного...`;
      result.textContent = "";
      isReady = true;
      isGo = false;

      timeout = setTimeout(() => {
        screen.className = "go";
        screen.textContent = "ЖМИ!";
        startTime = Date.now();
        isGo = true;
      }, Math.floor(2000 + Math.random() * 3000));
    }

    function endLevel() {
      const reaction = Date.now() - startTime;
      results.push(reaction);
      updateProgress();
      isReady = false;
      isGo = false;

      if (level + 1 >= maxLevels) {
        finishGame();
      } else {
        level++;
        screen.className = "waiting";
        screen.textContent = "Нажми, чтобы начать следующий уровень";
        result.textContent = `Реакция: ${reaction} мс`;
      }
    }

    function failLevel(message) {
      clearTimeout(timeout);
      screen.className = "waiting";
      screen.textContent = "Игра окончена";
      result.textContent = message;
      isReady = false;
      isGo = false;
      showStats(true);
    }

    function finishGame() {
      screen.className = "waiting";
      screen.textContent = "Ты прошёл все уровни!";
      result.textContent = "Отлично!";
      showStats(false);
    }

    function updateProgress() {
      const percent = Math.floor(((level + 1) / maxLevels) * 100);
      progressBar.style.width = percent + "%";
    }

    function showStats(failed) {
      let html = `<h2>Статистика</h2><table><tr><th>Уровень</th><th>Время (мс)</th></tr>`;
      results.forEach((time, i) => {
        html += `<tr><td>${i + 1}</td><td>${time}</td></tr>`;
      });
      const avg = results.length ? Math.round(results.reduce((a, b) => a + b) / results.length) : 0;
      html += `<tr><th>Итог</th><th>${avg} мс</th></tr></table>`;
      if (failed) html += `<p style="color:red;">Ты проиграл. Попробуй ещё раз!</p>`;
      tableContainer.innerHTML = html;
    }