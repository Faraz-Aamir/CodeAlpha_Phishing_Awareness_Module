/* ═══════════════════════════════════════════════════════
   CodeAlpha - Phishing Awareness Training
   Interactive Quiz & UI Logic
   Author: Faraz Aamir
   ═══════════════════════════════════════════════════════ */

// ─────────────────────────────────────────
// QUIZ DATA
// ─────────────────────────────────────────
const quizQuestions = [
    {
        question: "You receive an email from 'support@paypa1.com' asking you to verify your account. What should you do?",
        options: [
            "Click the link and enter your credentials",
            "Reply with your account details",
            "Delete it — the domain 'paypa1.com' is suspicious (uses '1' instead of 'l')",
            "Forward it to all your contacts as a warning"
        ],
        correct: 2,
        explanation: "The domain 'paypa1.com' uses the number '1' instead of the letter 'l'. This is a classic phishing tactic called typosquatting. Always verify the sender's domain carefully."
    },
    {
        question: "Which of the following is the STRONGEST indicator of a phishing email?",
        options: [
            "The email has a company logo",
            "The sender's email domain doesn't match the company's official domain",
            "The email is written in English",
            "The email was received during business hours"
        ],
        correct: 1,
        explanation: "A mismatched sender domain is one of the strongest phishing indicators. Phishers can easily copy logos and formatting, but they can't send from legitimate company domains."
    },
    {
        question: "What is 'spear phishing'?",
        options: [
            "A phishing attack using spyware",
            "A mass email campaign targeting random users",
            "A targeted attack customized for a specific individual or organization",
            "A type of fishing sport"
        ],
        correct: 2,
        explanation: "Spear phishing is a targeted form of phishing where attackers research their victims and craft personalized messages, making them much harder to detect than generic phishing emails."
    },
    {
        question: "You find a USB drive in the parking lot. What's the safest action?",
        options: [
            "Plug it into your work computer to find the owner",
            "Plug it into your personal computer instead",
            "Give it to IT security — never plug unknown devices into any computer",
            "Use a friend's computer to check it"
        ],
        correct: 2,
        explanation: "Unknown USB drives can contain malware that executes automatically when plugged in. This is a social engineering tactic called 'baiting'. Always hand suspicious devices to IT security."
    },
    {
        question: "A website URL reads 'http://www.arnazon.com'. What's wrong?",
        options: [
            "Nothing — it looks like a normal Amazon URL",
            "It uses 'http' instead of 'https', and 'arnazon' is a misspelling ('rn' looks like 'm')",
            "The URL is too short",
            "It needs a www prefix"
        ],
        correct: 1,
        explanation: "The URL has two red flags: (1) 'arnazon' uses 'rn' which visually resembles 'm' in 'amazon', and (2) it uses insecure 'http' instead of 'https'. Always check URLs carefully!"
    },
    {
        question: "What does enabling Two-Factor Authentication (2FA) protect against?",
        options: [
            "All types of malware",
            "Unauthorized access even if your password is stolen",
            "Phishing emails from reaching your inbox",
            "Slow internet connection"
        ],
        correct: 1,
        explanation: "2FA adds a second verification step (like a code from your phone) beyond just your password. Even if an attacker steals your password through phishing, they can't access your account without the second factor."
    },
    {
        question: "Your CEO sends an urgent email asking you to wire $50,000 to a new vendor immediately. What should you do?",
        options: [
            "Wire the money immediately — the CEO asked",
            "Verify the request through a different channel (phone call, in-person)",
            "Reply to the email asking for confirmation",
            "Forward it to your team to split the responsibility"
        ],
        correct: 1,
        explanation: "This is a classic 'whaling' or Business Email Compromise (BEC) attack. Always verify unusual financial requests through a separate communication channel. Never reply to the suspicious email itself."
    },
    {
        question: "Which of these email characteristics is NOT typically a red flag for phishing?",
        options: [
            "Generic greeting like 'Dear Customer'",
            "Spelling and grammar mistakes",
            "Email sent from the company's verified official domain",
            "Urgent tone demanding immediate action"
        ],
        correct: 2,
        explanation: "An email from a verified official domain is actually a sign of legitimacy. Generic greetings, poor grammar, and urgency tactics are all common red flags in phishing emails."
    },
    {
        question: "What is 'smishing'?",
        options: [
            "Phishing through social media",
            "Phishing through SMS text messages",
            "A type of encryption",
            "Phishing through smart home devices"
        ],
        correct: 1,
        explanation: "Smishing (SMS + phishing) is phishing conducted via text messages. Attackers send texts with malicious links or ask recipients to call fake numbers. Be cautious of unexpected texts with links!"
    },
    {
        question: "After falling victim to a phishing attack, what should be your FIRST action?",
        options: [
            "Delete the phishing email and forget about it",
            "Wait to see if anything bad happens",
            "Change compromised passwords immediately and report the incident to IT security",
            "Create a new email account"
        ],
        correct: 2,
        explanation: "Immediately change any compromised passwords and report the incident to IT/security. Quick action can prevent attackers from using stolen credentials. Also enable 2FA and monitor your accounts."
    }
];

// ─────────────────────────────────────────
// QUIZ STATE
// ─────────────────────────────────────────
let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];

// ─────────────────────────────────────────
// QUIZ FUNCTIONS
// ─────────────────────────────────────────
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    userAnswers = [];
    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    renderQuestion();
}

function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    const total = quizQuestions.length;

    // Update progress
    document.getElementById('progressFill').style.width = `${((currentQuestion) / total) * 100}%`;
    document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${total}`;

    // Render question
    document.getElementById('quizQuestion').textContent = q.question;

    // Render options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(btn);
    });

    // Hide feedback and next button
    const feedback = document.getElementById('quizFeedback');
    feedback.style.display = 'none';
    feedback.className = 'quiz-feedback';
    document.getElementById('nextBtn').style.display = 'none';
    answered = false;
}

function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');
    const isCorrect = index === q.correct;

    // Record answer
    userAnswers.push({ question: q.question, selected: index, correct: q.correct, isCorrect });

    // Disable all options
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === index && !isCorrect) opt.classList.add('incorrect');
    });

    // Show feedback
    if (isCorrect) {
        score++;
        feedback.textContent = `✅ Correct! ${q.explanation}`;
        feedback.className = 'quiz-feedback show correct-fb';
    } else {
        feedback.textContent = `❌ Incorrect. ${q.explanation}`;
        feedback.className = 'quiz-feedback show incorrect-fb';
    }

    // Show next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'flex';
    nextBtn.textContent = currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎉';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quizContent').style.display = 'none';
    const results = document.getElementById('quizResults');
    results.style.display = 'block';

    const percentage = Math.round((score / quizQuestions.length) * 100);

    // Icon and title based on score
    let icon, title, message;
    if (percentage >= 80) {
        icon = '🏆';
        title = 'Excellent! You\'re Phishing-Proof!';
        message = 'You have a strong understanding of phishing threats. Keep staying vigilant!';
    } else if (percentage >= 60) {
        icon = '👍';
        title = 'Good Job! Almost There!';
        message = 'You know the basics well. Review the topics you missed to strengthen your defenses.';
    } else if (percentage >= 40) {
        icon = '📚';
        title = 'Keep Learning!';
        message = 'You\'re on the right track but need more practice. Review the training material above.';
    } else {
        icon = '⚠️';
        title = 'Needs Improvement';
        message = 'You\'re vulnerable to phishing attacks. Please review all sections carefully and retake the quiz.';
    }

    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsScore').textContent = `${score} / ${quizQuestions.length}`;
    document.getElementById('resultsMessage').textContent = message;

    // Build breakdown
    const breakdown = document.getElementById('resultsBreakdown');
    breakdown.innerHTML = '';
    userAnswers.forEach((ans, i) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span>${ans.isCorrect ? '✅' : '❌'}</span><span>Q${i + 1}: ${ans.isCorrect ? 'Correct' : 'Incorrect'}</span>`;
        breakdown.appendChild(div);
    });
}

function restartQuiz() {
    startQuiz();
}

// ─────────────────────────────────────────
// NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─────────────────────────────────────────
// HAMBURGER MENU
// ─────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('navLinks').classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('hamburger').classList.remove('active');
        document.getElementById('navLinks').classList.remove('active');
    });
});

// ─────────────────────────────────────────
// STAT COUNTER ANIMATION
// ─────────────────────────────────────────
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            counter.textContent = formatNumber(current);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = formatNumber(target);
        }
        requestAnimationFrame(update);
    });
}

// ─────────────────────────────────────────
// INTERSECTION OBSERVER (Animations)
// ─────────────────────────────────────────
const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };

// Animate cards on scroll
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card, .type-card, .tip-card, .example-showcase').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Animate stat counters when hero is visible
let countersAnimated = false;
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// Animate danger bars when visible
const dangerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.danger-fill');
            bars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => { bar.style.width = width; }, 200);
            });
        }
    });
}, { threshold: 0.3 });

const typesSection = document.getElementById('types');
if (typesSection) dangerObserver.observe(typesSection);

// ─────────────────────────────────────────
// SMOOTH SCROLL FOR NAV LINKS
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
