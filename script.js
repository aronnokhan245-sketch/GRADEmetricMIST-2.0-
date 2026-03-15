let selectedCredit = 3;
const inputIDs = ['ctMarks', 'midterm', 'attendance', 'performance', 'targetPerc'];

// 1. Persistence Logic (Save as you type)
inputIDs.forEach(id => {
    const el = document.getElementById(id);
    if(el) {
        el.addEventListener('input', () => {
            localStorage.setItem(id, el.value);
        });
    }
});

// 2. Load Logic (Restore on refresh)
window.onload = () => {
    inputIDs.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved) document.getElementById(id).value = saved;
    });
};

function setCredit(val) {
    selectedCredit = val;
    document.getElementById('btn2').classList.toggle('active', val === 2);
    document.getElementById('btn3').classList.toggle('active', val === 3);
    
    document.getElementById('midLabel').innerText = val === 2 ? "MID TERM (Max 20)" : "MID TERM (Max 30)";
    document.getElementById('attLabel').innerText = val === 2 ? "ATTENDANCE (Max 10)" : "ATTENDANCE (Max 15)";
    document.getElementById('perfLabel').innerText = val === 2 ? "CLASS PERF. (Max 10)" : "CLASS PERF. (Max 15)";
}

function calculate() {
    const resDiv = document.getElementById('displayResult');
    const ctString = document.getElementById('ctMarks').value;
    const ctArray = ctString.split(' ').filter(n => n !== '').map(Number);
    
    // Validation
    if (ctArray.length < 2) { alert("Please enter at least 2 CT marks"); return; }
    if (ctArray.some(m => m > 20)) {
        resDiv.innerHTML = "<span style='color:#ff4d4d'>❌ CT limit (20) exceeded</span>";
        return;
    }

    const mid = parseFloat(document.getElementById('midterm').value) || 0;
    const att = parseFloat(document.getElementById('attendance').value) || 0;
    const perf = parseFloat(document.getElementById('performance').value) || 0;
    const target = parseFloat(document.getElementById('targetPerc').value) || 80;

    const maxMid = selectedCredit === 2 ? 20 : 30;
    const maxAP = selectedCredit === 2 ? 10 : 15;

    if (mid > maxMid || att > maxAP || perf > maxAP) {
        resDiv.innerHTML = "<span style='color:#ff4d4d'>❌ Invalid Score Limits</span>";
        return;
    }

    // Calculations
    ctArray.sort((a, b) => b - a);
    const bestTwoAvg = (ctArray[0] + ctArray[1]) / 2.0;
    const midP = (mid / maxMid) * 10;
    const attP = (att / maxAP) * 5;
    const perfP = (perf / maxAP) * 5;

    const currentTotal = bestTwoAvg + midP + attP + perfP;
    const neededPerc = target - currentTotal;
    const maxFinal = selectedCredit === 2 ? 120 : 180;
    const finalScore = (neededPerc / 60) * maxFinal;

    // UI Progress Update
    document.getElementById('progSection').style.display = 'block';
    const progress = Math.min(100, (currentTotal / 0.4)).toFixed(0);
    document.getElementById('fill').style.width = progress + "%";
    document.getElementById('progValue').innerText = progress + "% secured";

    if (finalScore > maxFinal) {
        resDiv.innerHTML = "<span style='color:#ff4d4d; font-size:14px;'>Target Impossible with current marks</span>";
    } else {
        const result = Math.max(0, finalScore).toFixed(2);
        resDiv.innerHTML = `Need <b style='color:#D4AF37; font-size:22px;'>${result}</b> / ${maxFinal}`;
    }
}

function resetForm() {
    if(confirm("Clear all marks?")) {
        inputIDs.forEach(id => {
            document.getElementById(id).value = '';
            localStorage.removeItem(id);
        });
        document.getElementById('displayResult').innerHTML = '';
        document.getElementById('progSection').style.display = 'none';
    }
}
