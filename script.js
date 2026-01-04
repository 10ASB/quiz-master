/* ================= QUIZ DATA (5 QUESTIONS EACH = 50 MARKS) ================= */
const quizData = {
    coding: [
        {
            q: "Why does JavaScript feel unpredictable?",
            a: [
                { t: "Because it's loosely typed", c: true },
                { t: "Because it's fast", c: false },
                { t: "Because it hates humans", c: false }
            ]
        },
        {
            q: "console.log is mainly used to:",
            a: [
                { t: "Expose your mistakes", c: true },
                { t: "Fix bugs", c: false },
                { t: "Increase performance", c: false }
            ]
        },
        {
            q: "What does === check?",
            a: [
                { t: "Value only", c: false },
                { t: "Type only", c: false },
                { t: "Value and Type", c: true }
            ]
        },
        {
            q: "Which one is NOT a JS data type?",
            a: [
                { t: "Boolean", c: false },
                { t: "Undefined", c: false },
                { t: "Character", c: true }
            ]
        },
        {
            q: "Best way to learn JS?",
            a: [
                { t: "Tutorial hopping", c: false },
                { t: "Building projects", c: true },
                { t: "Memorising syntax", c: false }
            ]
        }
    ],

    space: [
        {
            q: "If you scream in space…",
            a: [
                { t: "Aliens hear you", c: false },
                { t: "Nothing happens", c: true },
                { t: "NASA fines you", c: false }
            ]
        },
        {
            q: "Most dramatic planet?",
            a: [
                { t: "Mars", c: false },
                { t: "Earth", c: true },
                { t: "Pluto (still angry)", c: false }
            ]
        },
        {
            q: "Largest planet?",
            a: [
                { t: "Earth", c: false },
                { t: "Jupiter", c: true },
                { t: "Saturn", c: false }
            ]
        },
        {
            q: "Sun is actually a:",
            a: [
                { t: "Planet", c: false },
                { t: "Star", c: true },
                { t: "Meteor", c: false }
            ]
        },
        {
            q: "Why is space scary?",
            a: [
                { t: "Infinite silence", c: true },
                { t: "Bad lighting", c: false },
                { t: "No WiFi", c: false }
            ]
        }
    ],

    general: [
        {
            q: "Best student superpower?",
            a: [
                { t: "Procrastination", c: true },
                { t: "Discipline", c: false },
                { t: "Sleep schedule", c: false }
            ]
        },
        {
            q: "Brain during exams:",
            a: [
                { t: "Supercomputer", c: false },
                { t: "Airplane mode", c: true },
                { t: "Wikipedia", c: false }
            ]
        },
        {
            q: "Motivation usually comes:",
            a: [
                { t: "Before exam", c: false },
                { t: "After exam", c: true },
                { t: "Never", c: false }
            ]
        },
        {
            q: "Most used word by students:",
            a: [
                { t: "Tomorrow", c: true },
                { t: "Focus", c: false },
                { t: "Consistency", c: false }
            ]
        },
        {
            q: "Real meaning of group study?",
            a: [
                { t: "Everyone confused together", c: true },
                { t: "Productivity", c: false },
                { t: "Silence", c: false }
            ]
        }
    ]
};

/* ================= STATE ================= */
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let userName = "";

/* ================= ELEMENTS ================= */
const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");

const questionEl = document.getElementById("question-text");
const answerBtns = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const scoreLive = document.getElementById("score-live");
const categoryLabel = document.getElementById("category-label");
const nameInput = document.getElementById("username");

/* ================= START QUIZ (NAME REQUIRED) ================= */
function startQuiz(category) {
    userName = nameInput.value.trim();

    if (userName === "") {
        alert("Naam daal bhai 😤 quiz bina naam ke nahi chalta");
        nameInput.focus();
        return;
    }

    currentQuestions = quizData[category];
    currentIndex = 0;
    score = 0;

    categoryLabel.innerText = category.toUpperCase();
    scoreLive.innerText = "Score: 0";
    progress.style.width = "0%";

    homeScreen.classList.add("hide");
    leaderboardScreen.classList.add("hide");
    quizScreen.classList.remove("hide");

    showQuestion();
}

/* ================= SHOW QUESTION ================= */
function showQuestion() {
    nextBtn.classList.add("hide");
    answerBtns.innerHTML = "";

    const q = currentQuestions[currentIndex];
    questionEl.innerText = q.q;

    q.a.forEach(ans => {
        const btn = document.createElement("button");
        btn.innerText = ans.t;
        if (ans.c) btn.dataset.correct = true;
        btn.onclick = selectAnswer;
        answerBtns.appendChild(btn);
    });

    progress.style.width =
        ((currentIndex + 1) / currentQuestions.length) * 100 + "%";
}

/* ================= ANSWER LOGIC ================= */
function selectAnswer(e) {
    const selected = e.target;
    const correct = selected.dataset.correct === "true";

    if (correct) {
        score += 10;
        scoreLive.innerText = `Score: ${score}`;
        selected.classList.add("correct");
    } else {
        selected.classList.add("wrong");
    }

    Array.from(answerBtns.children).forEach(btn => {
        if (btn.dataset.correct === "true") btn.classList.add("correct");
        btn.disabled = true;
    });

    nextBtn.classList.remove("hide");
}

/* ================= NEXT ================= */
nextBtn.onclick = () => {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showLeaderboard();
    }
};

/* ================= LEADERBOARD ================= */
function showLeaderboard() {
    quizScreen.classList.add("hide");
    leaderboardScreen.classList.remove("hide");

    const list = document.getElementById("leaderboard-list");
    const data = JSON.parse(localStorage.getItem("quizLeaderboard") || "[]");

    data.push({ name: userName, score });
    data.sort((a, b) => b.score - a.score);
    localStorage.setItem("quizLeaderboard", JSON.stringify(data.slice(0, 5)));

    list.innerHTML = data.map(d => `<li>${d.name}: ${d.score}</li>`).join("");
}

/* ================= PLAY AGAIN (WORKING) ================= */
document.getElementById("play-again-btn").onclick = () => {
    leaderboardScreen.classList.add("hide");
    homeScreen.classList.remove("hide");

    nameInput.value = "";
    scoreLive.innerText = "Score: 0";
    progress.style.width = "0%";
};

/* ================= CATEGORY BUTTONS ================= */
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => startQuiz(btn.dataset.cat);
});
