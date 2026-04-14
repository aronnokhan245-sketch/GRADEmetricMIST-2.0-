let selectedCredit = 3;
const inputs = ['ct1', 'ct2', 'ct3', 'midterm', 'attendance', 'performance', 'targetGPA'];

inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', () => {
            localStorage.setItem(id, element.value);
        });
    }
});

window.onload = () => {
    inputs.forEach(id => {
        const savedValue = localStorage.getItem(id);
        const element = document.getElementById(id);
        if (savedValue && element) element.value = savedValue;
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
    const resBox = document.getElementById('resultBox');
    
    const c1 = parseFloat(document.getElementById('ct1').value);
    const c2 = parseFloat(document.getElementById('ct2').value);
    const c3 = parseFloat(document.getElementById('ct3').value);
    
    let ctArray = [c1, c2, c3].filter(num => !isNaN(num));
    
    if (ctArray.length < 2) {
        alert("Please enter at least 2 CT marks");
        return;
    }

    if (ctArray.some(mark => mark > 20)) {
        resBox.style.display = "block";
        resDiv.innerHTML = "❌ CT marks cannot exceed 20!";
        resDiv.style.color = "#ff4d4d";
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetGPA').value);

    let maxMid = (selectedCredit === 2) ? 20 : 30;
    let maxAttPerf = (selectedCredit === 2) ? 10 : 15;

    if (mid > maxMid || att > maxAttPerf || perf > maxAttPerf) {
        resBox.style.display = "block";
        resDiv.innerHTML = "❌ Marks exceed maximum limit!";
        resDiv.style.color = "#ff4d4d";
        return;
    }
    
    resDiv.style.color = "#D4AF37"; 
    resBox.style.display = "block";

    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;

    let midP = (selectedCredit === 2) ? (mid / 20) * 10 : (mid / 30) * 10;
    let attP = (selectedCredit === 2) ? (att / 10) * 5 : (att / 15) * 5;
    let perfP = (selectedCredit === 2) ? (perf / 10) * 5 : (perf / 15) * 5;

    let currentTotal = bestTwoAvg + midP + attP + perfP; 
    let needed = target - currentTotal; 
    
    let maxFinal = (selectedCredit === 2) ? 120 : 180;
    let finalMark = (needed / 60) * maxFinal;

    const fill = document.getElementById('fill');
    document.getElementById('progBar').style.display = 'block';
    fill.style.width = (currentTotal / 40 * 100) + "%";

    if (finalMark > maxFinal) {
        resDiv.innerHTML = "STATUS: Target GPA Unreachable!";
    } else {
        const result = Math.max(0, finalMark).toFixed(2);
        resDiv.innerHTML = `NEED: ${result} / ${maxFinal}`;
    }
}

function resetForm() {
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if(element) element.value = (id === 'targetGPA') ? '80' : '';
        localStorage.removeItem(id);
    });
    document.getElementById('resultBox').style.display = 'none';
    document.getElementById('progBar').style.display = 'none';
}
