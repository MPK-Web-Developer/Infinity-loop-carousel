const wrapper = document.querySelector(".card-wrapper");
const carousel = document.querySelector(".carousel");
const ArrowButtons = document.querySelectorAll(".custom-carousel i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

let isDragging = false,
	startX,
	startScrollLeft,
  timeoutId;

// {------ Start Infinity Scroll ------}
// get number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildrens
	.slice(-cardPerView)
	.reverse()
	.forEach((card) => {
		carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
	});

carouselChildrens
	.slice(0, cardPerView).forEach((card) => {
		carousel.insertAdjacentHTML("beforeend", card.outerHTML);
	});
// {------ End Infinity Scroll --------}

// {------ Start Arrow Button ------}
// Add event listeners for the arrow buttons to scroll the carousel left and right
ArrowButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
	});
});
// {------ End Arrow Button --------}

// {------ Start Carousel Dragging ------}

const dragStart = (e) => {
	isDragging = true;
	carousel.classList.add("dragging");
	// Records the initial cursor and scroll position of the carousel
	startX = e.pageX;
	startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
	if (!isDragging) return; // if isDragging is false return from here
	// Updates the scroll position of the carousel based on the cursor movement
	carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
	isDragging = false;
	carousel.classList.remove("dragging");
};

// {------ Start Auto Play ------}
const autoPlay = () => {
  if(window.innerWidth < 800) return; // Return if window is smaller than 800
  // Autoplay the carousel after every 2500ms
  timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();
// {------ End Auto Play --------}
// {------ End Carousel Dragging --------}

// {------ Start Infinity Scroll Function ------}
const infiniteScroll = () => {
	if (carousel.scrollLeft === 0) {
		// console.log("Left end");
		carousel.classList.add("no-transition");
		carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
		carousel.classList.remove("no-transition");
	} else if (
		Math.ceil(carousel.scrollLeft) ===
		carousel.scrollWidth - carousel.offsetWidth
	) {
		// console.log("Right End");
		carousel.classList.add("no-transition");
		carousel.scrollLeft = carousel.offsetWidth;
		carousel.classList.remove("no-transition");
	}

// {------ Start Auto Play ------}
  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if(!wrapper.matches(":hover")) autoPlay();
// {------ End Auto Play --------}
};
// {------ End Infinity Scroll Function --------}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
