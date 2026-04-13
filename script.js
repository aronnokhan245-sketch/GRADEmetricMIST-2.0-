let selectedCredit = 3;
const inputs = ['ct1', 'ct2', 'ct3', 'midterm', 'attendance', 'performance', 'targetGPA'];

// Persistence Logic
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        localStorage.setItem(id, document.getElementById(id).value);
    });
});

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
    
    document.getElementById('midLabel').innerText = `MID TERM (Max ${val === 2 ? 20 : 30})`;
    document.getElementById('attLabel').innerText = `ATTENDANCE (Max ${val === 2 ? 10 : 15})`;
    document.getElementById('perfLabel').innerText = `CLASS PERF. (Max ${val === 2 ? 10 : 15})`;
}

function calculate() {
    const resDiv = document.getElementById('displayResult');
    
    // Pick the best 2 CT marks
    const ctArray = [
        parseFloat(document.getElementById('ct1').value) || 0,
        parseFloat(document.getElementById('ct2').value) || 0,
        parseFloat(document.getElementById('ct3').value) || 0
    ];

    if (ctArray.some(mark => mark > 20)) {
        resDiv.innerHTML = "❌ CT marks cannot exceed 20!";
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetGPA').value);

    // MIST Logic: Best 2 CTs average (Weight 20%)
    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;

    let midP = (selectedCredit === 2) ? (mid / 20) * 10 : (mid / 30) * 10;
    let attP = (selectedCredit === 2) ? (att / 10) * 5 : (att / 15) * 5;
    let perfP = (selectedCredit === 2) ? (perf / 10) * 5 : (perf / 15) * 5;

    let currentTotal = bestTwoAvg + midP + attP + perfP;
    let needed = target - currentTotal;
    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalMark = (needed / 60) * maxFinal;

    if (finalMark > maxFinal) {
        resDiv.innerHTML = "Status: Target Unreachable";
    } else {
        const result = Math.max(0, finalMark).toFixed(2);
        resDiv.innerHTML = `Need: ${result} / ${maxFinal} in Finals`;
    }
}

function resetForm() {
    inputs.forEach(id => {
        document.getElementById(id).value = '';
        localStorage.removeItem(id);
    });
    document.getElementById('displayResult').innerHTML = '';
}
