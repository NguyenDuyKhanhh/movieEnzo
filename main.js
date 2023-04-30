const containMovie = document.querySelector(".movie");
const clearSearch = document.querySelector(".close-btn");
const btnsPage = document.querySelector(".navbar");
const slides = document.querySelectorAll(".banner img");
const nextSlider = document.querySelector(".bx-chevron-right");
const prevSlider = document.querySelector(".bx-chevron-left");
const next = document.querySelector(".exchange-page a .next");
const prev = document.querySelector(".exchange-page a .prev");

const loader = document.querySelector(".loader");
const favourites = document.querySelector("#favourite");
const nowPage = document.querySelector("#popular-series h1");
const slider = document.querySelector(".slider");
const dots = document.querySelectorAll(".dot");

let dataHome = "";
let dataTrending = "";
let dataTopRate = "";
let scrollInterval;
let currentPage = 1;

async function movieTrending() {
  let apiTrending = `https://api.themoviedb.org/3/trending/all/day?api_key=21a74c685cbdafbea65d58ebd993168f`;
  dataTrending = await fetch(apiTrending).then((res) => res.json());
  const dataTrendingMovie = dataTrending.results;
  localStorage.setItem("saveDataTrending", JSON.stringify(dataTrendingMovie));
}
var saveDataTrending = JSON.parse(localStorage.getItem("saveDataTrending"));

async function movieTopRate() {
  let apiTopRate = `https://api.themoviedb.org/3/movie/top_rated?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1`;
  dataTopRate = await fetch(apiTopRate).then((res) => res.json());
  const dataTopRateMovie = dataTopRate.results;
  localStorage.setItem("savetoprate", JSON.stringify(dataTopRateMovie));
}
var saveDataTopRate = JSON.parse(localStorage.getItem("savetoprate"));

async function movieHome(page) {
  dataHome = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`
  ).then((response) => response.json());
  localStorage.setItem(`saveDataHome${page}`, JSON.stringify(dataHome));
}

function getDataFromLocalStorage(page) {
  const items = localStorage.getItem(`saveDataHome${page}`);
  return items ? JSON.parse(items) : null;
}

function checkData(currentPage) {
  let initPageHome = getDataFromLocalStorage(currentPage).results;
  if (initPageHome != undefined) {
    initPageHome = getDataFromLocalStorage(currentPage).results;
  } else if (initPageHome == undefined) {
    initPageHome = getDataFromLocalStorage(currentPage);
  }
  return initPageHome;
}
checkData(1);
function nextPage() {
  if (currentPage != 3) {
    currentPage++;

    checkData(currentPage);
    renderMovie();
    nowPage.innerText = "Page " + currentPage;
    next.style.display = "block";
  }
  if (currentPage == 3) {
    next.style.display = "none";
  }
  if (currentPage > 1 && currentPage <= 3) {
    prev.style.display = "block";
  }
}

function prevPage() {
  if (currentPage != 1) {
    currentPage--;

    checkData(currentPage);
    renderMovie();
    nowPage.innerText = "Page " + currentPage;
    prev.style.display = "block";
  }
  if (currentPage == 1) {
    prev.style.display = "none";
  }
  if (currentPage <= 2) {
    next.style.display = "block ";
  }
}

function handleData(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].title == undefined) {
      data[i].title = data[i].name;
    }
    if (data[i].release_date == undefined) {
      data[i].release_date = data[i].first_air_date;
    }
    data[i].poster_path =
      "https://image.tmdb.org/t/p/w500" + data[i].poster_path;
    data[i].backdrop_path =
      "https://image.tmdb.org/t/p/w500" + data[i].backdrop_path;
  }
}

function renderMovie() {
  function Render(props) {
    return (
      <div className="col l-3 m-4 c-4" key={props.id}>
        <div className="card" id={props.id}>
          <div>
            <img src={props.image} />
            <img
              className="play"
              src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
            />
          </div>
          <h1>{props.title}</h1>
          <small>{props.public}</small>
        </div>
      </div>
    );
  }
  function App({ child }) {
    handleData(child);
    return (
      <div className="row">
        {child.map((cardMovie) => (
          <Render
            key={cardMovie.id}
            id={cardMovie.id}
            image={cardMovie.poster_path}
            title={cardMovie.title}
            public={cardMovie.release_date}
          />
        ))}
      </div>
    );
  }
  if (containMovie.id == "home" || containMovie.id == null) {
    ReactDOM.render(<App child={checkData(currentPage)} />, containMovie);
  } else if (containMovie.id == "trending") {
    ReactDOM.render(<App child={saveDataTrending} />, containMovie);
  }
  if (containMovie.id == "movie") {
    ReactDOM.render(<App child={saveDataTopRate} />, containMovie);
  }

  const getCards = document.querySelectorAll(".card");
  getCards.forEach((getCard) => {
    getCard.addEventListener("click", () => {
      localStorage.setItem("idCard", JSON.stringify(getCard.id));
      window.location.href = "./play-page.html";
    });
  });
}
if (
  containMovie.id == "home" ||
  containMovie.id == "trending" ||
  containMovie.id == "movie"
) {
  renderMovie();
}

function handleSlider() {
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(scrollInterval);
      slider.scrollTo({ left: index * slider.offsetWidth, behavior: "smooth" });
      setSliderInterval();
      setActiveDot(index);
    });
  });

  function setSliderInterval() {
    scrollInterval = setInterval(() => {
      const currentIndex = Array.from(dots).findIndex((dot) =>
        dot.classList.contains("active")
      );
      const nextIndex = (currentIndex + 1) % dots.length;
      slider.scrollTo({
        left: nextIndex * slider.offsetWidth,
        behavior: "smooth",
      });
      setActiveDot(nextIndex);
    }, 3000);
  }

  function setActiveDot(index) {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  setSliderInterval();
}
handleSlider();

function getDataAllPage() {
  let arrayAllMovies = [];
  for (let i = 1; i <= 3; i++) {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}&with_watch_monetization_types=flatrate`
    )
      .then((res) => res.json())
      .then((data) => {
        data.results.forEach((component) => {
          handleData(component);
          arrayAllMovies.push(component);
          localStorage.setItem("save", JSON.stringify(arrayAllMovies));
        });
      });
  }
}

function getDataTemporary() {
  const checkDataTemporary = localStorage.getItem("save");
  if (checkDataTemporary) {
    loader.style.display = "none";
    return JSON.parse(checkDataTemporary);
  } else if (!checkDataTemporary) {
    loader.style.display = "block";
    return null;
  }
}
let saveArrayTemporary = getDataTemporary();

let saveId = [];

for (let i = 0; i < saveArrayTemporary.length; i++) {
  saveId.push(saveArrayTemporary[i].id);
}
saveDataTrending.forEach((item, index) => {
  if (!saveId.includes(item.id)) {
    saveArrayTemporary.push(item);
  }
});
saveDataTopRate.forEach((item, index) => {
  if (!saveId.includes(item.id)) {
    saveArrayTemporary.push(item);
  }
});

handleData(saveArrayTemporary);
localStorage.setItem("saveMovie", JSON.stringify(saveArrayTemporary));

var saveArray = JSON.parse(localStorage.getItem("saveMovie"));

const resultsSearch = document.querySelector(".results-search");
const containResults = document.querySelectorAll(".contain-results");
const close = document.querySelector(".close i");
const inputSearch = document.querySelector("#input-search");

function searchMovie() {
  let valueInput = inputSearch.value.toLowerCase().trim();
  let MoviesSearch = saveArray.filter((comp) => {
    return comp.title.toLowerCase().includes(valueInput);
  });

  if (valueInput.length != 0) {
    close.style.opacity = "1";
  }
  const RenderMoviesSearch = () => {
    if (valueInput.length == 0) {
      close.style.opacity = "0";
      return <div></div>;
    } else if (MoviesSearch.length == 0) {
      return (
        <div className="contain-movies" id="no-result">
          No movies for this result!
        </div>
      );
    } else {
      return (
        <div className="contain-movies">
          {MoviesSearch.map((item) => (
            <div className="contain-results" id={item.id} key={item.id}>
              <img src={item.poster_path} />
              <ul>
                <li>{item.title}</li>
                <p>{item.release_date}</p>
              </ul>
            </div>
          ))}
        </div>
      );
    }
  };

  ReactDOM.render(<RenderMoviesSearch />, resultsSearch);
  containResults.forEach((containResult) => {
    containResult.addEventListener("click", () => {
      localStorage.setItem("idCard", JSON.stringify(containResult.id));
      window.location.href = "./play-page.html";
    });
  });
}
close.addEventListener("click", () => {
  inputSearch.value = "";
  searchMovie();
});

const inputToggle = document.querySelector("#toggle-mode");
const logo = document.querySelector(".header img");
function lightMode() {
  inputToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    logo.classList.toggle("contrast");
  });
}
lightMode();
