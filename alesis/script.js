document.addEventListener('DOMContentLoaded', () => {
	const bpmInput = document.getElementById('bpm');
	const playButton = document.getElementById('play');
	const stopButton = document.getElementById('stop');
	const trackLabelsContainer = document.querySelector('.track-labels');
	const trackGridContainer = document.querySelector('.track-grid');
	
	const numberOfSteps = 16;
	
	let isPlaying = false;
	let interval;
	let currentStep = 0;
	let lastUpdateTime = Date.now();

	// Массив объектов треков с именами и путями к файлам
	const tracks = [
			{ name: 'Бочка', path: 'sounds/kick.wav' },
			{ name: 'Рабочий 1', path: 'sounds/snare1.wav' },
			{ name: 'Рабочий 2', path: 'sounds/snare2.wav' },
			{ name: 'Том 1', path: 'sounds/tom1.wav' },
			{ name: 'Том 2', path: 'sounds/tom2.wav' },
			{ name: 'Том 3', path: 'sounds/tom3.wav' },
			{ name: 'Крэш', path: 'sounds/crash.wav' },
			{ name: 'Райд', path: 'sounds/ride.wav' },
			{ name: 'Хайхэт', path: 'sounds/hihate.wav' },
			{ name: 'Электро', path: 'sounds/electro.wav' }
	];

	// Создаём массив звуков с конкретными путями
	const sounds = tracks.map(track => {
			const audio = new Audio(track.path);
			audio.preload = 'auto';
			return audio;
	});

	// Создаём структуру расписания (по умолчанию все ячейки выключены)
	const schedule = Array.from({ length: tracks.length }, () => Array(numberOfSteps).fill(false));

	function createTrack(trackIndex) {
			const track = tracks[trackIndex];
			
			// Создание подписей трека
			const labelDiv = document.createElement('div');
			labelDiv.className = 'track-name';
			labelDiv.textContent = track.name;
			trackLabelsContainer.appendChild(labelDiv);

			// Создание дорожки
			const trackDiv = document.createElement('div');
			trackDiv.className = 'track';
			
			for (let i = 0; i < numberOfSteps; i++) {
					const cellDiv = document.createElement('div');
					cellDiv.className = 'cell';
					cellDiv.dataset.track = trackIndex;
					cellDiv.dataset.step = i;
					
					cellDiv.addEventListener('click', () => {
							const isActive = cellDiv.classList.toggle('active');
							schedule[trackIndex][i] = isActive;
					});
					
					trackDiv.appendChild(cellDiv);
			}
			
			trackGridContainer.appendChild(trackDiv);
	}

	function startPlaying() {
			if (isPlaying) return;
			isPlaying = true;

			const bpm = parseInt(bpmInput.value, 10);
			const intervalTime = 240000 / bpm / numberOfSteps;
			
			console.log(`BPM: ${bpm}`);
			console.log(`Interval Time (ms): ${intervalTime}`);
			
			interval = setInterval(() => {
					const now = Date.now();
					const elapsed = now - lastUpdateTime;

					if (elapsed >= intervalTime) {
							// Убираем подсветку с предыдущего шага
							document.querySelectorAll('.cell.highlight').forEach(cell => cell.classList.remove('highlight'));
							
							// Обновляем текущий шаг
							currentStep = (currentStep + 1) % numberOfSteps;
							
							// Подсвечиваем ячейки текущего шага и проигрываем звук
							schedule.forEach((track, trackIndex) => {
									const cell = document.querySelector(`.track:nth-child(${trackIndex + 1}) .cell:nth-child(${currentStep + 1})`);
									if (track[currentStep]) {
											sounds[trackIndex].currentTime = 0;
											sounds[trackIndex].play();
											cell.classList.add('highlight');
									}
							});
							
							lastUpdateTime = now;
					}
			}, 1);
	}

	function stopPlaying() {
			if (!isPlaying) return;
			isPlaying = false;
			clearInterval(interval);

			// Убираем подсветку, когда остановлено
			document.querySelectorAll('.cell.highlight').forEach(cell => cell.classList.remove('highlight'));
	}

	playButton.addEventListener('click', startPlaying);
	stopButton.addEventListener('click', stopPlaying);

	// Создаём треки и ячейки
	for (let i = 0; i < tracks.length; i++) {
			createTrack(i);
	}
});
