document.getElementById("predictionForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const data = {
        age: Number(document.getElementById("age").value),
        sex: Number(document.getElementById("sex").value),
        cp: Number(document.getElementById("cp").value),
        trestbps: Number(document.getElementById("trestbps").value),
        chol: Number(document.getElementById("chol").value),
        fbs: Number(document.getElementById("fbs").value),
        restecg: Number(document.getElementById("restecg").value),
        thalach: Number(document.getElementById("thalach").value),
        exang: Number(document.getElementById("exang").value),
        oldpeak: Number(document.getElementById("oldpeak").value),
        slope: Number(document.getElementById("slope").value),
        ca: Number(document.getElementById("ca").value),
        thal: Number(document.getElementById("thal").value)
    };

    document.getElementById("result").innerHTML = "🧠 AI is analyzing...";


    fetch("https://heart-disease-prediction-1-ziqj.onrender.com/predict", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })


    .then(response => response.json())

    .then(result => {

        const resultCard = document.getElementById("resultCard");

        resultCard.style.display = "block";


        const resultElement = document.getElementById("result");

        resultElement.innerHTML =
            result.prediction;


        const confidenceBar =
            document.getElementById("confidenceBar");


        confidenceBar.style.width =
            result.confidence + "%";


        if (result.prediction === "Heart Disease Risk Detected") {

            resultCard.className = "result-card risk";

        } 
        else {

            resultCard.className = "result-card safe";

        }

    })



    .catch(error => {

        document.getElementById("result").innerHTML =
            "Error connecting to server";

        console.log(error);

    });

});



document.getElementById("historyBtn").addEventListener("click", function () {

    fetch("https://heart-disease-prediction-1-ziqj.onrender.com/history")

    .then(response => response.json())

    .then(data => {

        const tableBody = document.querySelector("#historyTable tbody");

        tableBody.innerHTML = "";

        data.forEach(item => {

            tableBody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.age}</td>
                <td>${item.sex}</td>
                <td>${item.prediction}</td>
                <td>${item.confidence}%</td>
                <td>${item.date}</td>
            </tr>
            `;

        });

    })

    .catch(error => {
        console.log("History error:", error);
    });

});
document.getElementById("resetBtn").addEventListener("click", function () {

    document.getElementById("result").innerHTML = "";

    document.getElementById("confidenceBar").style.width = "0%";

});

document.getElementById("historyBtn").addEventListener("click", function () {

    fetch("https://heart-disease-prediction-1-ziqj.onrender.com/history")

    .then(response => response.json())

    .then(data => {

        const tableBody = document.querySelector("#historyTable tbody");

        tableBody.innerHTML = "";

        data.forEach(item => {

            tableBody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.age}</td>
                <td>${item.sex}</td>
                <td>${item.prediction}</td>
                <td>${item.confidence}%</td>
                <td>${item.date}</td>
            </tr>
            `;

        });

    })

    .catch(error => {
        console.log("History error:", error);
    });

});