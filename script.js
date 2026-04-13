let selectedCredit = 3;
const inputs = ['ct1', 'ct2', 'ct3', 'midterm', 'attendance', 'performance', 'targetGPA'];

// Persistence
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
    
    // Collect CTs
    const ct1 = parseFloat(document.getElementById('ct1').value) || 0;
    const ct2 = parseFloat(document.getElementById('ct2').value) || 0;
    const ct3 = parseFloat(document.getElementById('ct3').value) || 0;
    const ctArray = [ct1, ct2, ct3];

    // Validation
    if (ctArray.some(m => m > 20)) {
        resDiv.innerHTML = "❌ CT marks cannot exceed 20";
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const targetPerc = parseFloat(document.getElementById('targetGPA').value);

    // MIST Calculation Logic
    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;

    let midWeight = (selectedCredit === 2) ? (mid / 20) * 10 : (mid / 30) * 10;
    let attWeight = (selectedCredit === 2) ? (att / 10) * 5 : (att / 15) * 5;
    let perfWeight = (selectedCredit === 2) ? (perf / 10) * 5 : (perf / 15) * 5;

    let currentTotal = bestTwoAvg + midWeight + attWeight + perfWeight;
    let neededPerc = targetPerc - currentTotal;
    
    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalMark = (neededPerc / 60) * maxFinal;

    if (finalMark > maxFinal) {
        resDiv.innerHTML = "STATUS: Target GPA Unreachable";
        resDiv.style.color = "#ff4d4d";
    } else {
        resDiv.innerHTML = `NEED: ${Math.max(0, finalMark).toFixed(2)} / ${maxFinal} in Finals`;
        resDiv.style.color = "#d4af37";
    }
}

function resetForm() {
    inputs.forEach(id => {
        document.getElementById(id).value = '';
        localStorage.removeItem(id);
    });
    document.getElementById('displayResult').innerHTML = '';
}
