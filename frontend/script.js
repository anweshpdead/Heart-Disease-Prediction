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


    fetch("http://127.0.0.1:5000/predict", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })


    .then(response => response.json())

    .then(result => {

        const resultElement = document.getElementById("result");

        resultElement.innerHTML =
            result.prediction +
            "<br>Confidence: " +
            result.confidence +
            "%";

        if (result.prediction === "Heart Disease Risk Detected") {
            resultElement.style.color = "red";
        } else {
            resultElement.style.color = "green";
        }

    })


    .catch(error => {

        document.getElementById("result").innerHTML =
            "Error connecting to server";

        console.log(error);

    });

});

document.getElementById("historyBtn").addEventListener("click", function () {

    fetch("http://127.0.0.1:5000/history")

        .then(response => response.json())

        .then(data => {

            let table = document.querySelector("#historyTable tbody");

            table.innerHTML = "";

            data.forEach(record => {

                table.innerHTML += `
                    <tr>
                        <td>${record.id}</td>
                        <td>${record.age}</td>
                        <td>${record.sex == 1 ? "Male" : "Female"}</td>
                        <td>${record.prediction}</td>
                        <td>${record.confidence}%</td>
                        <td>${record.date}</td>
                    </tr>
                `;

            });

        });

});

document.getElementById("resetBtn").addEventListener("click", function () {

    document.getElementById("result").innerHTML = "";

    document.getElementById("confidenceBar").style.width = "0%";

});