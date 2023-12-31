function updateTimerAndProgressBar() {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const schoolStartTime = new Date();
    schoolStartTime.setHours(7, 24, 0); // School starts at 7:24 AM

    let schoolEndTime = new Date();
    schoolEndTime.setHours(14, 18, 0); // School ends at 2:18 PM

    let titleText = "";
    let timeText = "";
    let progressBarValue = 0;

    if (
        currentDayOfWeek >= 1 &&
        currentDayOfWeek <= 5 &&
        now >= schoolStartTime &&
        now <= schoolEndTime
    ) {
        // It's a weekday between 7:24 AM and 2:18 PM (during school hours)
        titleText = "Time until school ends";
        progressBarValue = calculateProgressBarValue(
            now,
            schoolStartTime,
            schoolEndTime
        );
    } else if (currentDayOfWeek === 5 && now > schoolEndTime) {
        // It's a Friday after school hours, show the time until Monday
        titleText = "Time until school starts";
        const nextSchoolDay = 1; // Next school day is Monday
        const nextSchoolStartTime = new Date(schoolStartTime);
        nextSchoolStartTime.setDate(schoolStartTime.getDate() + nextSchoolDay);
        schoolEndTime = nextSchoolStartTime; // Update schoolEndTime
        progressBarValue = calculateProgressBarValue(
            now,
            schoolStartTime,
            schoolEndTime
        );
    } else if (
        currentDayOfWeek >= 1 &&
        currentDayOfWeek <= 4 &&
        now > schoolEndTime
    ) {
        // It's a weekday after school hours, show the time until the next school day
        titleText = "Time until school starts";
        const nextSchoolDay = currentDayOfWeek === 4 ? 3 : 1; // If it's Thursday, wait for Monday; otherwise, it's the next day
        const nextSchoolStartTime = new Date(schoolStartTime);
        nextSchoolStartTime.setDate(schoolStartTime.getDate() + nextSchoolDay);
        schoolEndTime = nextSchoolStartTime; // Update schoolEndTime
        progressBarValue = calculateProgressBarValue(
            now,
            schoolStartTime,
            schoolEndTime
        );
    } else {
        // It's the weekend
        titleText = "Time until school starts";
        const nextSchoolDay =
            currentDayOfWeek === 5 ? 3 : currentDayOfWeek === 6 ? 2 : 1; // Calculate days until next school day
        const nextSchoolStartTime = new Date(schoolStartTime);
        nextSchoolStartTime.setDate(schoolStartTime.getDate() + nextSchoolDay);
        schoolEndTime = nextSchoolStartTime; // Update schoolEndTime
        progressBarValue = calculateProgressBarValue(
            now,
            schoolStartTime,
            schoolEndTime
        );
    }

    const totalMilliseconds = schoolEndTime - now;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;

    const hours = Math.floor(totalSeconds / secondsInHour);
    const minutes = Math.floor((totalSeconds % secondsInHour) / secondsInMinute);
    const seconds = totalSeconds % secondsInMinute;

    const timeParts = [];

    if (hours > 0) {
        timeParts.push(hours + "h");
    }

    if (minutes > 0) {
        timeParts.push(minutes + "m");
    }

    timeParts.push(seconds + "s");
    timeText = timeParts.join(" ");

    document.getElementById("title").textContent = titleText;
    document.getElementById("time").textContent = timeText;
    document.getElementById("progress-bar").style.width = progressBarValue + "%";
}

function calculateProgressBarValue(now, startTime, endTime) {
    const totalMilliseconds = endTime - startTime;
    const elapsedMilliseconds = now - startTime;
    return (elapsedMilliseconds / totalMilliseconds) * 100;
}

setInterval(updateTimerAndProgressBar, 1000);

updateTimerAndProgressBar();

// Tabs
const tabLinks = document.querySelectorAll(".nav-link[data-tab]");
const tabContents = document.querySelectorAll(".tab-pane");

function setActiveTabInLocalStorage(tabId) {
    localStorage.setItem("activeTab", tabId);
}

function getActiveTabFromLocalStorage() {
    return localStorage.getItem("activeTab");
}

function showSavedActiveTab() {
    const activeTabId = getActiveTabFromLocalStorage();
    if (activeTabId) {
        const activeTabLink = document.querySelector(`[data-tab="${activeTabId}"]`);
        if (activeTabLink) {
            activeTabLink.click();
        }
    }
}

tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
        tabLinks.forEach((tabLink) => tabLink.classList.remove("active"));
        tabContents.forEach((tabContent) => tabContent.classList.remove("active"));
        link.classList.add("active");
        const targetTab = document.getElementById(link.dataset.tab);
        targetTab.classList.add("active");
        setActiveTabInLocalStorage(link.dataset.tab);
    });
});

showSavedActiveTab();

// Upcoming
function createCountdownElement(event) {
    const container = document.createElement("div");
    container.className = "countdown-card";
    container.id = event.idPrefix + "-container";

    const countdownHTML = `
        <div class="card bg-gray-900">
            <div class="card-body">
                <h6 class="card-title text-white mb-2">${event.name}</h6>
                <div class="row align-items-center">
                    <div class="col">
                        <div class="row align-items-center no-gutters">
                            <div class="col-auto">
                                <div class="icon gradient-text icon-sm">
                                    ${event.icon}
                                </div>
                            </div>
                            <div class="col-auto">
                                <span class="h5 text-white mr-2" id="time">
                                    <span class="countdown__timer__item" id="${event.idPrefix}-days">0</span>
                                    <span class="countdown__timer__label">Days</span>
                                    <span class="countdown__timer__item" id="${event.idPrefix}-hours">0</span>
                                    <span class="countdown__timer__label">Hours</span>
                                    <span class="countdown__timer__item" id="${event.idPrefix}-minutes">0</span>
                                    <span class="countdown__timer__label">Mins</span>
                                    <span class="countdown__timer__item" id="${event.idPrefix}-seconds">0</span>
                                    <span class="countdown__timer__label">Secs</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
    `;

    container.innerHTML = countdownHTML;

    document.getElementById("countdownContainer").appendChild(container);
}

function createCountdown(targetDate, idPrefix) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const countdownDays = document.querySelector(`#${idPrefix}-days`);
    const countdownHours = document.querySelector(`#${idPrefix}-hours`);
    const countdownMinutes = document.querySelector(`#${idPrefix}-minutes`);
    const countdownSeconds = document.querySelector(`#${idPrefix}-seconds`);

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        countdownDays.innerText = Math.floor(distance / day);
        countdownHours.innerText = Math.floor((distance % day) / hour);
        countdownMinutes.innerText = Math.floor((distance % hour) / minute);
        countdownSeconds.innerText = Math.floor((distance % minute) / second);

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDays.innerText = 0;
            countdownHours.innerText = 0;
            countdownMinutes.innerText = 0;
            countdownSeconds.innerText = 0;
        }
    }, second);
}

function initializeCountdowns() {
    // <i class='bi bi-calendar'></i>
    const events = [
        {
            name: "End of 1st quarter",
            date: "October 31, 2023 00:00:00",
            icon: "<i class='bi bi-calendar-check'></i>",
            idPrefix: "countdown1"
        },
        {
            name: "Thanks Giving Break",
            date: "November 22, 2023 00:00:00",
            icon: "<i class='bi bi-calendar-minus'></i>",
            idPrefix: "countdown2"
        },
        {
            name: "Winter Break",
            date: "December 21, 2023 00:00:00",
            icon: "<i class='bi bi-calendar-minus'></i>",
            idPrefix: "countdown3"
        },
        {
            name: "Last Day of 1st Semester",
            date: "January 23, 2024 00:00:00",
            icon: "<i class='bi bi-calendar-check'></i>",
            idPrefix: "countdown4"
        },
        {
            name: "Spring Break",
            date: "March 25, 2024 00:00:00",
            icon: "<i class='bi bi-calendar-minus'></i>",
            idPrefix: "countdown5"
        },
        {
            name: "Last Day of 3rd Quarter",
            date: "April 9, 2024 00:00:00",
            icon: "<i class='bi bi-calendar-check'></i>",
            idPrefix: "countdown6"
        },
        {
            name: "Last Day of School",
            date: "June 12, 2024 00:00:00",
            icon: "<i class='bi bi-calendar-check'></i>",
            idPrefix: "countdown7"
        }
    ];

    events.forEach((event) => {
        createCountdownElement(event);
        const targetDate = new Date(event.date);
        createCountdown(targetDate, event.idPrefix);
    });
}

document.addEventListener("DOMContentLoaded", initializeCountdowns);

// Weather Display
$(document).ready(function () {
    const API_KEY = "ff657dfbd069450db51234921231009";

    var location = "Apex";
    var unit = "f";

    $.get(
        "https://api.weatherapi.com/v1/current.json?key=" +
        API_KEY +
        "&q=" +
        location +
        "&unit=" +
        unit,
        function (response) {
            console.log(response);
            $("#temperature").text(response.current.temp_f + " °F");
        }
    );
});

// Tools Tab
// SQUARE ROOT CALCULATOR
const sqrt = {
    numberInput: document.getElementById("sqrtCalcInput"),
    resultBox: document.getElementById("sqrtCalcResult"),
    submitButton: document.getElementById("sqrtSubmitBtn"),
    feedback: {
        box: document.getElementById("sqrtCalcFeedback"),
        message: document.getElementById("sqrtCalcFeedbackMsg"),
    },
    error: {
        box: document.getElementById("sqrtCalcError"),
        message: document.getElementById("sqrtCalcErrorMsg"),
    },
};

sqrt.submitButton.addEventListener("click", function () {
    let number = parseFloat(sqrt.numberInput.value);

    if (isNaN(number)) {
        sqrt.feedback.box.style.display = "none";
        sqrt.error.box.style.display = "block";
        sqrt.error.message.innerText = "Please enter a valid number.";
    } else if (number < 0) {
        sqrt.feedback.box.style.display = "none";
        sqrt.error.box.style.display = "block";
        sqrt.error.message.innerText = "Please enter a positive number.";
    } else {
        sqrt.feedback.box.style.display = "none";
        sqrt.error.box.style.display = "none";
        let result = Math.sqrt(number);
        sqrt.resultBox.innerText = `√${number} = ${result}`;
    }
});

// TRIANGLE AREA CALCULATOR
const tri = {
    baseInput: document.getElementById("triCalcBaseInput"),
    heightInput: document.getElementById("triCalcHeightInput"),
    resultBox: document.getElementById("triCalcResult"),
    submitButton: document.getElementById("triCalcSubmitBtn"),
    feedback: {
        box: document.getElementById("triCalcFeedback"),
        message: document.getElementById("triCalcFeedbackMsg"),
    },
    error: {
        box: document.getElementById("triCalcError"),
        message: document.getElementById("triCalcErrorMsg"),
    },
};

tri.submitButton.addEventListener("click", function () {
    let base = parseFloat(tri.baseInput.value);
    let height = parseFloat(tri.heightInput.value);

    if (isNaN(base) || isNaN(height)) {
        tri.feedback.box.style.display = "none";
        tri.error.box.style.display = "block";
        tri.error.message.innerText = "Please enter valid numbers.";
    } else if (base < 0 || height < 0) {
        tri.feedback.box.style.display = "none";
        tri.error.box.style.display = "block";
        tri.error.message.innerText = "Please enter positive numbers.";
    } else if (base == 0 || height == 0) {
        tri.feedback.box.style.display = "none";
        tri.error.box.style.display = "block";
        tri.error.message.innerText = "Base and height cannot be 0.";
    } else {
        tri.feedback.box.style.display = "none";
        tri.error.box.style.display = "none";
        let area = (base * height) / 2;
        tri.resultBox.innerText = `(${base} * ${height}) / 2 = ${area}`;
    }
});

// TRIANGLE AREA CALCULATOR 2
const tri2 = {
    side1Input: document.getElementById("tri2CalcSide1Input"),
    side2Input: document.getElementById("tri2CalcSide2Input"),
    side3Input: document.getElementById("tri2CalcSide3Input"),
    resultBox: document.getElementById("tri2CalcResult"),
    submitButton: document.getElementById("tri2CalcSubmitBtn"),
    feedback: {
        box: document.getElementById("tri2CalcFeedback"),
        message: document.getElementById("tri2CalcFeedbackMsg"),
    },
    error: {
        box: document.getElementById("tri2CalcError"),
        message: document.getElementById("tri2CalcErrorMsg"),
    },
};

tri2.submitButton.addEventListener("click", function () {
    let side1 = parseFloat(tri2.side1Input.value);
    let side2 = parseFloat(tri2.side2Input.value);
    let side3 = parseFloat(tri2.side3Input.value);

    if (isNaN(side1) || isNaN(side2) || isNaN(side3)) {
        tri2.feedback.box.style.display = "none";
        tri2.error.box.style.display = "block";
        tri2.error.message.innerText = "Please enter valid numbers.";
    } else if (side1 <= 0 || side2 <= 0 || side3 <= 0) {
        tri2.feedback.box.style.display = "none";
        tri2.error.box.style.display = "block";
        tri2.error.message.innerText = "Please enter positive numbers.";
    } else if (side1 + side2 <= side3 || side2 + side3 <= side1 || side1 + side3 <= side2) {
        tri2.feedback.box.style.display = "none";
        tri2.error.box.style.display = "block";
        tri2.error.message.innerText = "These side lengths cannot form a triangle.";
    } else {
        tri2.feedback.box.style.display = "none";
        tri2.error.box.style.display = "none";
        let s = (side1 + side2 + side3) / 2;
        let area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
        tri2.resultBox.innerText = `(${s} * (${s} - ${side1}) * (${s} - ${side2}) * (${s} - ${side3})) = ${area}`;
    }
});