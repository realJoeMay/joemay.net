function updateLift(lift) {
	// maxInput = maxLiftInput(lift);
	max = maxLiftNumber(lift) / 0.9;
	liftClass = ".lift-" + lift;

	if (isNaN(max)) {
		console.log("Bad number");
	} else {
		document.querySelector(".week-1 " + liftClass + " .set-1.weight").textContent = Math.round(max * 0.36);
		document.querySelector(".week-1 " + liftClass + " .set-2.weight").textContent = Math.round(max * 0.45);
		document.querySelector(".week-1 " + liftClass + " .set-3.weight").textContent = Math.round(max * 0.54);
		document.querySelector(".week-1 " + liftClass + " .set-4.weight").textContent = Math.round(max * 0.585);
		document.querySelector(".week-1 " + liftClass + " .set-5.weight").textContent = Math.round(max * 0.675);
		document.querySelector(".week-1 " + liftClass + " .set-6.weight").textContent = Math.round(max * 0.765);

		document.querySelector(".week-2 " + liftClass + " .set-1.weight").textContent = Math.round(max * 0.36);
		document.querySelector(".week-2 " + liftClass + " .set-2.weight").textContent = Math.round(max * 0.45);
		document.querySelector(".week-2 " + liftClass + " .set-3.weight").textContent = Math.round(max * 0.54);
		document.querySelector(".week-2 " + liftClass + " .set-4.weight").textContent = Math.round(max * 0.630);
		document.querySelector(".week-2 " + liftClass + " .set-5.weight").textContent = Math.round(max * 0.720);
		document.querySelector(".week-2 " + liftClass + " .set-6.weight").textContent = Math.round(max * 0.810);

		document.querySelector(".week-3 " + liftClass + " .set-1.weight").textContent = Math.round(max * 0.36);
		document.querySelector(".week-3 " + liftClass + " .set-2.weight").textContent = Math.round(max * 0.45);
		document.querySelector(".week-3 " + liftClass + " .set-3.weight").textContent = Math.round(max * 0.54);
		document.querySelector(".week-3 " + liftClass + " .set-4.weight").textContent = Math.round(max * 0.675);
		document.querySelector(".week-3 " + liftClass + " .set-5.weight").textContent = Math.round(max * 0.765);
		document.querySelector(".week-3 " + liftClass + " .set-6.weight").textContent = Math.round(max * 0.855);

		document.querySelector(".week-4 " + liftClass + " .set-1.weight").textContent = Math.round(max * 0.36);
		document.querySelector(".week-4 " + liftClass + " .set-2.weight").textContent = Math.round(max * 0.45);
		document.querySelector(".week-4 " + liftClass + " .set-3.weight").textContent = Math.round(max * 0.54);
	}
}

function maxLiftNumber(lift) {
	maxInput = maxLiftInput(lift);
	return Number(maxInput.value);
}

function maxLiftInput(lift) {
	return document.getElementById("max-" + lift);
}

function updatePlan() {
	updateLift("squat");
	// updateLift("bench");
	// updateLift("deadlift");
	// updateLift("press");
}

function prefillInputs() {
	const params = new URLSearchParams(window.location.search);
	if (params.has('maxSquat')) {
		maxLiftInput('squat').value = params.get('maxSquat');
	}
	// if (params.has('maxDeadlift')) {
	// 	maxLiftInput('deadlift').value = params.get('maxDeadlift');
	// }
	// if (params.has('maxBench')) {
	// 	maxLiftInput('bench').value = params.get('maxBench');
	// }
	// if (params.has('maxPress')) {
	// 	maxLiftInput('press').value = params.get('maxPress');
	// }
}