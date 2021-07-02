const image = document.getElementById('image');
const result = document.getElementById('result');
const probability = document.getElementById('probability');

ml5.imageClassifier("MobileNet")
    .then(classifier => classifier.classify(image))
    .then(results => {
        console.dir(results)
        result.innerText = results[0].label;
        probability.innerText = results[0].confidence.toFixed(4);
    });
