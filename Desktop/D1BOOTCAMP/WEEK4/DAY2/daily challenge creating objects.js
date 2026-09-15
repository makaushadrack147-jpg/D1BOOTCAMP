class Video {
	constructor(title, uploader, time) {
		this.title = title;
		this.uploader = uploader;
		this.time = time;
	}

	watch() {
		console.log(`${this.uploader} watched all ${this.time} of ${this.title}!`);
	}
}

const firstVideo = new Video('JavaScript Basics', 'mike', 120);
firstVideo.watch();

const secondVideo = new Video('Object-Oriented Programming', 'alex', 300);
secondVideo.watch();

// Bonus: store the data as objects so each value has a descriptive property name.
const videoData = [
	{ title: 'HTML Introduction', uploader: 'ken', time: 180 },
	{ title: 'CSS Layouts', uploader: 'thomas', time: 240 },
	{ title: 'JavaScript Arrays', uploader: 'shadrack', time: 360 },
	{ title: 'DOM Manipulation', uploader: 'juma', time: 420 },
	{ title: 'Async JavaScript', uploader: 'mike', time: 540 }
];

const videos = videoData.map(({ title, uploader, time }) => {
	return new Video(title, uploader, time);
});

videos.forEach((video) => video.watch());
