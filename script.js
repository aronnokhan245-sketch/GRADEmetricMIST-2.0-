let selectedCredit = 3;
const inputs = ['ctMarks', 'midterm', 'attendance', 'performance', 'targetPerc'];

// 1. Persist data: Save to localStorage on input
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        localStorage.setItem(id, document.getElementById(id).value);
    });
});

// 2. Load data: Restore from localStorage on page load
window.onload = () => {
    inputs.forEach(id => {
        const savedValue = localStorage.getItem(id);
        if (savedValue) document.getElementById(id).value = savedValue;
    });
};

function setCredit(val) {
    selectedCredit = val;
    document.getElementById('btn2').classList.toggle('active', val === 2);
    document.getElementById('btn3').classList.toggle('active', val === 3);

    const midLabel = document.getElementById('midLabel');
    const attLabel = document.getElementById('attLabel');
    const perfLabel = document.getElementById('perfLabel');

    if (val === 2) {
        midLabel.innerText = "MID TERM (Max 20)";
        attLabel.innerText = "ATTENDANCE (Max 10)";
        perfLabel.innerText = "CLASS PERF. (Max 10)";
    } else {
        midLabel.innerText = "MID TERM (Max 30)";
        attLabel.innerText = "ATTENDANCE (Max 15)";
        perfLabel.innerText = "CLASS PERF. (Max 15)";
    }
}

function calculate() {
    const resDiv = document.getElementById('displayResult');
    const ctString = document.getElementById('ctMarks').value;
    const ctArray = ctString.split(' ').filter(s => s !== '').map(Number);
    
    // Logic for CT Validation
    if (ctArray.length < 2) {
        alert("Please enter at least 2 CT marks");
        return;
    }

    // Check if any CT exceeds 20
    const hasInvalidCT = ctArray.some(mark => mark > 20);
    if (hasInvalidCT) {
        resDiv.innerHTML = "❌ Error: CT marks cannot exceed 20!";
        resDiv.style.color = "#ff4d4d";
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetPerc').value) || 80;

    let maxMid = (selectedCredit === 2) ? 20 : 30;
    let maxAttPerf = (selectedCredit === 2) ? 10 : 15;

    // Logic for Invalid Input (Max limits)
    if (mid > maxMid || att > maxAttPerf || perf > maxAttPerf) {
        resDiv.innerHTML = "❌ Error: Marks exceed maximum limit!";
        resDiv.style.color = "#ff4d4d";
        return;
    }
    
    resDiv.style.color = "#D4AF37"; 

    // Sort and get Best Two
    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;

    // Weight Calculations
    let midP = (selectedCredit === 2) ? (mid / 20) * 10 : (mid / 30) * 10;
    let attP = (selectedCredit === 2) ? (att / 10) * 5 : (att / 15) * 5;
    let perfP = (selectedCredit === 2) ? (perf / 10) * 5 : (perf / 15) * 5;

    let currentTotal = bestTwoAvg + midP + attP + perfP;
    let needed = target - currentTotal;
    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalMark = (needed / 60) * maxFinal;

    // Update Progress Bar (currentTotal is out of 40%)
    const progBar = document.getElementById('progBar');
    const fill = document.getElementById('fill');
    progBar.style.display = 'block';
    fill.style.width = (currentTotal / 0.4) + "%";

    if (finalMark > maxFinal) {
        resDiv.innerHTML = "Status: Impossible to reach target!";
    } else {
        const result = Math.max(0, finalMark).toFixed(2);
        resDiv.innerHTML = `Need: ${result} / ${maxFinal}`;
    }
}

function resetForm() {
    inputs.forEach(id => {
        document.getElementById(id).value = '';
        localStorage.removeItem(id);
    });
    document.getElementById('displayResult').innerHTML = '';
    document.getElementById('progBar').style.display = 'none';
}