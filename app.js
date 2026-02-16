/**
 * MoodChecker - Daily Mental Wellness Check-In
 *
 * Analysis engine based on validated academic scales:
 * - WHO-5 Well-Being Index (Topp et al., 2015)
 * - PHQ-2 Depression Screening (Kroenke et al., 2003)
 * - GAD-2 Anxiety Screening (Kroenke et al., 2007)
 *
 * Scoring thresholds derived from peer-reviewed literature.
 */

(function () {
  "use strict";

  // ===== DOM References =====
  const disclaimerBanner = document.getElementById("disclaimer-banner");
  const acceptBtn = document.getElementById("accept-disclaimer");
  const mainApp = document.getElementById("main-app");
  const currentDateEl = document.getElementById("current-date");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const sectionWellbeing = document.getElementById("section-wellbeing");
  const sectionMood = document.getElementById("section-mood");
  const sectionAnxiety = document.getElementById("section-anxiety");
  const sectionResults = document.getElementById("section-results");

  const btnNext1 = document.getElementById("btn-next-1");
  const btnNext2 = document.getElementById("btn-next-2");
  const btnSubmit = document.getElementById("btn-submit");
  const btnRestart = document.getElementById("btn-restart");

  const reflectionText = document.getElementById("reflection-text");

  // ===== State =====
  let currentSection = 0;
  const sections = [sectionWellbeing, sectionMood, sectionAnxiety, sectionResults];

  // ===== Initialisation =====
  function init() {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    currentDateEl.textContent = now.toLocaleDateString("en-GB", options);

    acceptBtn.addEventListener("click", handleAccept);
    btnNext1.addEventListener("click", () => goToSection(1));
    btnNext2.addEventListener("click", () => goToSection(2));
    btnSubmit.addEventListener("click", handleSubmit);
    btnRestart.addEventListener("click", handleRestart);

    setupRadioListeners();
  }

  function handleAccept() {
    disclaimerBanner.classList.add("hidden");
    mainApp.classList.remove("hidden");
  }

  // ===== Navigation =====
  function goToSection(index) {
    sections[currentSection].classList.remove("active");
    sections[index].classList.add("active");
    currentSection = index;
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateProgress() {
    const pct = ((currentSection + 1) / 3) * 100;
    progressBar.style.width = Math.min(pct, 100) + "%";
    if (currentSection < 3) {
      progressText.textContent = "Section " + (currentSection + 1) + " of 3";
    } else {
      progressText.textContent = "Complete";
      progressBar.style.width = "100%";
    }
  }

  // ===== Radio Listeners =====
  function setupRadioListeners() {
    document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        // Mark card as answered
        var card = this.closest(".question-card");
        if (card) card.classList.add("answered");

        // Check if section is complete
        checkSectionComplete();
      });
    });
  }

  function checkSectionComplete() {
    // WHO-5: 5 questions
    var who5Done = true;
    for (var i = 0; i < 5; i++) {
      if (!document.querySelector('input[name="who5_' + i + '"]:checked')) {
        who5Done = false;
        break;
      }
    }
    btnNext1.disabled = !who5Done;

    // PHQ-2: 2 questions
    var phq2Done = true;
    for (var j = 0; j < 2; j++) {
      if (!document.querySelector('input[name="phq2_' + j + '"]:checked')) {
        phq2Done = false;
        break;
      }
    }
    btnNext2.disabled = !phq2Done;

    // GAD-2: 2 questions
    var gad2Done = true;
    for (var k = 0; k < 2; k++) {
      if (!document.querySelector('input[name="gad2_' + k + '"]:checked')) {
        gad2Done = false;
        break;
      }
    }
    btnSubmit.disabled = !gad2Done;
  }

  // ===== Scoring Engine =====

  /**
   * WHO-5 scoring: raw sum (0-25) multiplied by 4 = percentage score (0-100).
   * Thresholds per Topp et al. (2015):
   *   >= 72: High well-being
   *   50-71: Moderate well-being
   *   29-49: Low well-being
   *   <= 28: Very low well-being (possible depression screening)
   */
  function scoreWHO5() {
    var raw = 0;
    for (var i = 0; i < 5; i++) {
      var checked = document.querySelector('input[name="who5_' + i + '"]:checked');
      if (checked) raw += parseInt(checked.value, 10);
    }
    return raw * 4; // percentage score
  }

  /**
   * PHQ-2 scoring: sum of 2 items (0-6).
   * Thresholds per Kroenke et al. (2003):
   *   >= 3: Positive screen for depression (sensitivity 83%, specificity 92%)
   *   0-2: Negative screen
   */
  function scorePHQ2() {
    var total = 0;
    for (var i = 0; i < 2; i++) {
      var checked = document.querySelector('input[name="phq2_' + i + '"]:checked');
      if (checked) total += parseInt(checked.value, 10);
    }
    return total;
  }

  /**
   * GAD-2 scoring: sum of 2 items (0-6).
   * Thresholds per Kroenke et al. (2007):
   *   >= 3: Positive screen for anxiety (sensitivity 86%, specificity 83%)
   *   0-2: Negative screen
   */
  function scoreGAD2() {
    var total = 0;
    for (var i = 0; i < 2; i++) {
      var checked = document.querySelector('input[name="gad2_' + i + '"]:checked');
      if (checked) total += parseInt(checked.value, 10);
    }
    return total;
  }

  // ===== Interpretation =====

  function interpretWHO5(score) {
    if (score >= 72) {
      return {
        label: "High Well-Being",
        color: "var(--status-good)",
        detail: "Your responses suggest a good level of psychological well-being over the past two weeks.",
      };
    } else if (score >= 50) {
      return {
        label: "Moderate Well-Being",
        color: "var(--status-moderate)",
        detail: "Your well-being is in a moderate range. Some areas could benefit from attention.",
      };
    } else if (score >= 29) {
      return {
        label: "Low Well-Being",
        color: "var(--status-concern)",
        detail: "Your responses suggest reduced well-being. Consider reaching out to a professional.",
      };
    } else {
      return {
        label: "Very Low Well-Being",
        color: "var(--status-high)",
        detail:
          "Your score is below the threshold that may indicate depressive symptoms. We recommend speaking with a healthcare professional.",
      };
    }
  }

  function interpretPHQ2(score) {
    if (score <= 1) {
      return {
        label: "Minimal Symptoms",
        color: "var(--status-good)",
        detail: "Your responses suggest minimal depressive symptoms over the past two weeks.",
      };
    } else if (score === 2) {
      return {
        label: "Mild Symptoms",
        color: "var(--status-moderate)",
        detail: "Your responses suggest some low mood. Monitoring your mood may be helpful.",
      };
    } else if (score <= 4) {
      return {
        label: "Positive Screen",
        color: "var(--status-concern)",
        detail:
          "Your score meets the clinical threshold (>=3). A fuller assessment with a professional is recommended.",
      };
    } else {
      return {
        label: "Elevated Symptoms",
        color: "var(--status-high)",
        detail:
          "Your score is significantly elevated. We strongly recommend consulting a mental health professional.",
      };
    }
  }

  function interpretGAD2(score) {
    if (score <= 1) {
      return {
        label: "Minimal Anxiety",
        color: "var(--status-good)",
        detail: "Your responses suggest minimal anxiety symptoms over the past two weeks.",
      };
    } else if (score === 2) {
      return {
        label: "Mild Anxiety",
        color: "var(--status-moderate)",
        detail: "Your responses indicate some anxious feelings. Self-care strategies may help.",
      };
    } else if (score <= 4) {
      return {
        label: "Positive Screen",
        color: "var(--status-concern)",
        detail:
          "Your score meets the clinical threshold (>=3). A fuller assessment with a professional is recommended.",
      };
    } else {
      return {
        label: "Elevated Anxiety",
        color: "var(--status-high)",
        detail:
          "Your score is significantly elevated. We strongly recommend consulting a mental health professional.",
      };
    }
  }

  // ===== Advice Generation =====

  function generateAdvice(who5Score, phq2Score, gad2Score) {
    var advice = [];

    // General well-being advice
    if (who5Score >= 72) {
      advice.push({
        icon: "&#127793;",
        bg: "var(--green-50)",
        title: "Maintain your routine",
        text: "Your well-being is strong. Continue the habits and routines that support you. Regular physical activity, social connection, and sleep hygiene are protective factors (Firth et al., 2020, The Lancet Psychiatry).",
      });
    } else if (who5Score >= 50) {
      advice.push({
        icon: "&#128161;",
        bg: "var(--blue-50)",
        title: "Small adjustments can help",
        text: "Consider whether sleep, physical activity, or social connection could be improved. Behavioural activation \u2014 scheduling enjoyable activities \u2014 is an evidence-based strategy for improving mood (Cuijpers et al., 2019, World Psychiatry).",
      });
    } else {
      advice.push({
        icon: "&#128172;",
        bg: "#FFF7ED",
        title: "Consider professional support",
        text: "Your well-being score is below average. Speaking with a GP or mental health professional can help identify what\u2019s affecting your well-being and what support is available to you.",
      });
    }

    // Depression-specific
    if (phq2Score >= 3) {
      advice.push({
        icon: "&#129657;",
        bg: "#FFF7ED",
        title: "Your mood may need attention",
        text: "Your PHQ-2 score suggests possible depressive symptoms. This is a screening result, not a diagnosis. A full PHQ-9 assessment or consultation with a qualified professional can provide a clearer picture (Kroenke et al., 2003).",
      });
    } else if (phq2Score >= 1) {
      advice.push({
        icon: "&#127774;",
        bg: "var(--blue-50)",
        title: "Look after your mood",
        text: "Even mild low mood benefits from proactive self-care. Maintaining a regular routine, gentle exercise, and connecting with others are evidence-based protective strategies.",
      });
    }

    // Anxiety-specific
    if (gad2Score >= 3) {
      advice.push({
        icon: "&#127744;",
        bg: "#FFF7ED",
        title: "Your anxiety may need attention",
        text: "Your GAD-2 score suggests possible anxiety symptoms. Breathing exercises and grounding techniques can provide immediate relief, but professional support from a qualified therapist can offer lasting strategies (Kroenke et al., 2007).",
      });
    } else if (gad2Score >= 1) {
      advice.push({
        icon: "&#129702;",
        bg: "var(--lavender-50)",
        title: "Manage everyday stress",
        text: "Some anxiety is normal. Mindfulness-based stress reduction (MBSR) has strong evidence for reducing everyday anxiety and worry (Khoury et al., 2013, Clinical Psychology Review).",
      });
    }

    // Combined high scores
    if (phq2Score >= 3 && gad2Score >= 3) {
      advice.push({
        icon: "&#128222;",
        bg: "#FEF2F2",
        title: "Dual screening positive",
        text: "Scoring above the threshold on both mood and anxiety measures is not uncommon \u2014 they often co-occur. An integrated assessment with a mental health professional is particularly recommended in this case (L\u00f6we et al., 2010, Journal of Affective Disorders).",
      });
    }

    // Always include a self-care suggestion
    advice.push({
      icon: "&#128218;",
      bg: "var(--neutral-50)",
      title: "Track your patterns",
      text: "Completing this check-in regularly can help you notice patterns over time. If you observe a consistent decline, share your results with a healthcare provider to facilitate discussion.",
    });

    return advice;
  }

  // ===== Render Results =====

  function renderResults(who5Score, phq2Score, gad2Score) {
    var who5Interp = interpretWHO5(who5Score);
    var phq2Interp = interpretPHQ2(phq2Score);
    var gad2Interp = interpretGAD2(gad2Score);

    // Date
    var now = new Date();
    var opts = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    document.getElementById("results-date").textContent = now.toLocaleDateString("en-GB", opts);

    // WHO-5
    document.getElementById("value-who5").textContent = who5Score;
    document.getElementById("label-who5").textContent = who5Interp.label;
    document.getElementById("label-who5").style.color = who5Interp.color;
    document.getElementById("detail-who5").textContent = who5Interp.detail;
    animateCircle("circle-who5", who5Score / 100, who5Interp.color);

    // PHQ-2
    document.getElementById("value-phq2").textContent = phq2Score;
    document.getElementById("label-phq2").textContent = phq2Interp.label;
    document.getElementById("label-phq2").style.color = phq2Interp.color;
    document.getElementById("detail-phq2").textContent = phq2Interp.detail;
    // For PHQ-2, higher = worse, so invert for visual (show as concern)
    animateCircle("circle-phq2", phq2Score / 6, phq2Interp.color);

    // GAD-2
    document.getElementById("value-gad2").textContent = gad2Score;
    document.getElementById("label-gad2").textContent = gad2Interp.label;
    document.getElementById("label-gad2").style.color = gad2Interp.color;
    document.getElementById("detail-gad2").textContent = gad2Interp.detail;
    animateCircle("circle-gad2", gad2Score / 6, gad2Interp.color);

    // Advice
    var adviceList = generateAdvice(who5Score, phq2Score, gad2Score);
    var adviceContainer = document.getElementById("advice-list");
    adviceContainer.innerHTML = "";
    adviceList.forEach(function (item) {
      var div = document.createElement("div");
      div.className = "advice-item";
      div.innerHTML =
        '<div class="advice-icon" style="background:' +
        item.bg +
        '">' +
        item.icon +
        "</div>" +
        '<div class="advice-text"><strong>' +
        item.title +
        "</strong>" +
        item.text +
        "</div>";
      adviceContainer.appendChild(div);
    });

    // Reflection
    var reflectionVal = reflectionText.value.trim();
    var reflectionDisplay = document.getElementById("reflection-display");
    if (reflectionVal) {
      document.getElementById("reflection-output").textContent = reflectionVal;
      reflectionDisplay.classList.remove("hidden");
    } else {
      reflectionDisplay.classList.add("hidden");
    }

    // Crisis box visibility: show more prominently if high scores
    var crisisBox = document.getElementById("crisis-box");
    if (phq2Score >= 3 || gad2Score >= 3 || who5Score <= 28) {
      crisisBox.style.borderColor = "#F87171";
      crisisBox.style.background = "#FEF2F2";
    }
  }

  function animateCircle(circleId, fraction, color) {
    var circle = document.getElementById(circleId);
    var circumference = 2 * Math.PI * 54; // r=54
    circle.style.stroke = color;
    // Delay animation for visual effect
    setTimeout(function () {
      circle.style.strokeDashoffset = circumference * (1 - fraction);
    }, 200);
  }

  // ===== Collect Individual Answers =====
  function collectAnswers() {
    var who5Labels = [
      "I have felt cheerful and in good spirits",
      "I have felt calm and relaxed",
      "I have felt active and vigorous",
      "I woke up feeling fresh and rested",
      "My daily life has been filled with things that interest me",
    ];
    var who5Options = ["At no time", "Some of the time", "Less than half the time", "More than half the time", "Most of the time", "All of the time"];
    var phq2Labels = [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
    ];
    var gad2Labels = [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
    ];
    var freqOptions = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

    var who5Answers = [];
    for (var i = 0; i < 5; i++) {
      var checked = document.querySelector('input[name="who5_' + i + '"]:checked');
      var val = checked ? parseInt(checked.value, 10) : null;
      who5Answers.push({ question: who5Labels[i], value: val, label: val !== null ? who5Options[val] : null });
    }

    var phq2Answers = [];
    for (var j = 0; j < 2; j++) {
      var checked2 = document.querySelector('input[name="phq2_' + j + '"]:checked');
      var val2 = checked2 ? parseInt(checked2.value, 10) : null;
      phq2Answers.push({ question: phq2Labels[j], value: val2, label: val2 !== null ? freqOptions[val2] : null });
    }

    var gad2Answers = [];
    for (var k = 0; k < 2; k++) {
      var checked3 = document.querySelector('input[name="gad2_' + k + '"]:checked');
      var val3 = checked3 ? parseInt(checked3.value, 10) : null;
      gad2Answers.push({ question: gad2Labels[k], value: val3, label: val3 !== null ? freqOptions[val3] : null });
    }

    return { who5: who5Answers, phq2: phq2Answers, gad2: gad2Answers };
  }

  // ===== Build Markdown Report =====
  function buildMarkdown(who5Score, phq2Score, gad2Score) {
    var now = new Date();
    var dateStr = now.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    var timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    var answers = collectAnswers();
    var reflectionVal = reflectionText.value.trim();

    var who5Interp = interpretWHO5(who5Score);
    var phq2Interp = interpretPHQ2(phq2Score);
    var gad2Interp = interpretGAD2(gad2Score);

    var md = "";
    md += "# MoodChecker - Daily Check-In Results\n\n";
    md += "**Date:** " + dateStr + " at " + timeStr + "\n\n";
    md += "---\n\n";

    // Scores summary
    md += "## Scores Summary\n\n";
    md += "| Scale | Score | Interpretation |\n";
    md += "|-------|-------|----------------|\n";
    md += "| WHO-5 Well-Being | " + who5Score + " / 100 | " + who5Interp.label + " |\n";
    md += "| PHQ-2 Mood | " + phq2Score + " / 6 | " + phq2Interp.label + " |\n";
    md += "| GAD-2 Anxiety | " + gad2Score + " / 6 | " + gad2Interp.label + " |\n\n";

    // WHO-5 detail
    md += "## Well-Being (WHO-5)\n\n";
    md += "> " + who5Interp.detail + "\n\n";
    answers.who5.forEach(function (a, i) {
      md += "- **Q" + (i + 1) + ":** " + a.question + " — *" + a.label + "* (" + a.value + ")\n";
    });
    md += "\n";

    // PHQ-2 detail
    md += "## Mood (PHQ-2)\n\n";
    md += "> " + phq2Interp.detail + "\n\n";
    answers.phq2.forEach(function (a, i) {
      md += "- **Q" + (i + 1) + ":** " + a.question + " — *" + a.label + "* (" + a.value + ")\n";
    });
    md += "\nClinical threshold: >= 3" + (phq2Score >= 3 ? " **(above threshold)**" : "") + "\n\n";

    // GAD-2 detail
    md += "## Anxiety (GAD-2)\n\n";
    md += "> " + gad2Interp.detail + "\n\n";
    answers.gad2.forEach(function (a, i) {
      md += "- **Q" + (i + 1) + ":** " + a.question + " — *" + a.label + "* (" + a.value + ")\n";
    });
    md += "\nClinical threshold: >= 3" + (gad2Score >= 3 ? " **(above threshold)**" : "") + "\n\n";

    // Reflection
    if (reflectionVal) {
      md += "## Personal Reflection\n\n";
      md += reflectionVal + "\n\n";
    }

    // Disclaimer
    md += "---\n\n";
    md += "## Disclaimer\n\n";
    md += "This report was generated by MoodChecker, a self-assessment screening tool for **informational and educational purposes only**. ";
    md += "It does **not** constitute medical advice, psychological counselling, diagnosis, or treatment. ";
    md += "It is **not** intended to establish a therapist-patient or doctor-patient relationship and is **not** a substitute for professional care. ";
    md += "Always seek the advice of a qualified mental health professional with any questions regarding a mental health condition.\n\n";
    md += "**Scales used:** WHO-5 Well-Being Index (Topp et al., 2015) | PHQ-2 (Kroenke et al., 2003) | GAD-2 (Kroenke et al., 2007)\n";

    return md;
  }

  // ===== Download Markdown File =====
  function downloadMarkdown(who5Score, phq2Score, gad2Score) {
    var now = new Date();
    var timestamp = now.toISOString().replace(/[:.]/g, "-");
    var filename = "moodchecker-" + timestamp + ".md";
    var md = buildMarkdown(who5Score, phq2Score, gad2Score);

    var blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ===== Submit =====
  var lastScores = null;

  function handleSubmit() {
    var who5 = scoreWHO5();
    var phq2 = scorePHQ2();
    var gad2 = scoreGAD2();

    lastScores = { who5: who5, phq2: phq2, gad2: gad2 };

    renderResults(who5, phq2, gad2);
    showDownloadPrompt();
    goToSection(3);

    // Hide progress for results
    document.querySelector(".progress-container").style.display = "none";
    document.querySelector(".progress-text").style.display = "none";
  }

  // ===== Download Prompt =====
  function showDownloadPrompt() {
    var banner = document.getElementById("download-prompt");
    banner.classList.remove("hidden");
    var btnDownload = document.getElementById("btn-download-md");
    var btnDismiss = document.getElementById("btn-dismiss-download");

    btnDownload.onclick = function () {
      if (lastScores) {
        downloadMarkdown(lastScores.who5, lastScores.phq2, lastScores.gad2);
      }
      banner.classList.add("hidden");
    };

    btnDismiss.onclick = function () {
      banner.classList.add("hidden");
    };
  }

  // ===== Restart =====
  function handleRestart() {
    // Clear all radios
    document.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.checked = false;
    });

    // Clear answered states
    document.querySelectorAll(".question-card").forEach(function (c) {
      c.classList.remove("answered");
    });

    // Clear reflection
    reflectionText.value = "";

    // Reset buttons
    btnNext1.disabled = true;
    btnNext2.disabled = true;
    btnSubmit.disabled = true;

    // Show progress
    document.querySelector(".progress-container").style.display = "block";
    document.querySelector(".progress-text").style.display = "block";

    // Go to first section
    goToSection(0);
  }

  // ===== Init =====
  init();
})();
