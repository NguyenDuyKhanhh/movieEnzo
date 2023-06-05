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

let skeletonArrayIndex = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
let scrollInterval;
let currentPage = 1;

function handleData(data) {
  data.forEach((item) => {
    if (item.title == undefined) {
      item.title = item.name;
    }
    if (item.release_date == undefined) {
      item.release_date = item.first_air_date;
    }
    item.poster_path = "https://image.tmdb.org/t/p/w500" + item.poster_path;
    item.backdrop_path = "https://image.tmdb.org/t/p/w500" + item.backdrop_path;
  });
}
async function movieTrending() {
  renderError()
  let apiTrending = `https://api.themoviedb.org/3/trending/all/day?api_key=21a74c685cbdafbea65d58ebd993168f`;
  await fetch(apiTrending)
    .then((res) => res.json())
    .then((data) => {
      renderMovie(data.results);
      saveID(".card");
    })
    .catch(error=>
      renderError()
      )
}
containMovie.id == "trending" ? movieTrending() : null;

async function movieTopRate() {
  renderError()
  let apiTopRate = `https://api.themoviedb.org/3/movie/top_rated?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1`;
  await fetch(apiTopRate)
    .then((res) => res.json())
    .then((data) => {
      renderMovie(data.results);
      saveID(".card");
    })
    .catch(error=>
      renderError()
      )
    
}
containMovie.id == "movie" ? movieTopRate() : null;

async function movieHome(page) {
  renderError()
  await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`
  )
    .then((res) => res.json())
    .then((data) => {
      renderMovie(data.results);
      saveID(".card");
    })
    .catch(error=>
      renderError()
      )
}
containMovie.id == "home" ? movieHome(currentPage) : null;

function nextPage() {
  if (currentPage != 3) {
    currentPage++;
    movieHome(currentPage);
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
    movieHome(currentPage);
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
 function renderMovie(data) {
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

  ReactDOM.render(<App child={data} />, containMovie);
}
function renderError(){
  function Loader(props) {
    return (
      <div className="col l-3 m-4 c-4" key={props.index}>
        <div className=" card-recss" id={props.index}>
          <div>
            <div className="card-loader">
              <div className="content">
                <img src ="	https://www.solidbackgrounds.com/images/2480x3508/2480x3508-dark-slate-gray-solid-color-background.jpg"/>
              </div>
            </div>
          </div>
            <h1 className="loader-text">{props.title}</h1>
            <small className="loader-text">{props.public}</small>
        </div>
      </div>
    );
  }
  function RenderLoader() {
    return (
      <div className="row">
        {skeletonArrayIndex.map((item, index) => (
          <Loader
            key={item}
            id={item}
            title="Loading title..."
            public= "Loading release date..."
          />
        ))}
      </div>
    );
  }
  ReactDOM.render(<RenderLoader />, containMovie);

}
function saveID(selector) {
  const getCards = document.querySelectorAll(selector);
  getCards.forEach((getCard) => {
    getCard.addEventListener("click", () => {
      localStorage.setItem("idCard", JSON.stringify(getCard.id));
      console.log(getCard)
      window.location.href = "./play-page.html";
    });
  });
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
let getAllDataPopular = [];
let getId = [];

function gatherAllPage(data) {
  data.forEach((item) => getAllDataPopular.push(item));
}
// Tạo đối tượng JSON rỗng
function getAllIdToCheck(data) {
  for (let i = 0; i < data.length; i++) {
    getId.push(data[i].id);
  }
}

function checkAndPushMovie(data) {
  data.forEach((item) => {
    if (!getId.includes(item.id)) {
      getAllDataPopular.push(item);
    }
  });
}

// Gọi các API và gộp kết quả vào đối tượng JSON
Promise.all([
  fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
  ),
  fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=2&with_watch_monetization_types=flatrate"
  ),
  fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=3&with_watch_monetization_types=flatrate"
  ),
  fetch(
    "https://api.themoviedb.org/3/trending/all/day?api_key=21a74c685cbdafbea65d58ebd993168f"
  ),
  fetch(
    "https://api.themoviedb.org/3/movie/top_rated?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1"
  ),
])
  .then((responses) => {
    // Chuyển đổi phản hồi của các API sang đối tượng JSON
    return Promise.all(responses.map((response) => response.json()));
  })
  .then((data) => {
    loader.style.display = "none";
    // Gộp kết quả từ các đối tượng JSON vào đối tượng JSON chung
    for (let i = 0; i < 3; i++) {
      gatherAllPage(data[i].results);
    }
    getAllDataPopular ? getAllIdToCheck(getAllDataPopular) : null;

    data[3].results ? checkAndPushMovie(data[3].results) : getAllDataPopular;
    data[4].results ? checkAndPushMovie(data[4].results) : getAllDataPopular;
    handleData(getAllDataPopular);
    localStorage.setItem("allDataMovies", JSON.stringify(getAllDataPopular));
  })
  .catch((error) => {
    loader.style.display = "block";
  });

const resultsSearch = document.querySelector(".results-search");
const close = document.querySelector(".close i");
const inputSearch = document.querySelector("#input-search");

let checkGetData = false;
let allDataMovies;
function searchMovie() {
  if (!checkGetData) {
    checkGetData = true;
    allDataMovies = JSON.parse(localStorage.getItem("allDataMovies"));
  }
  let valueInput = inputSearch.value.toLowerCase().trim();
  let MoviesSearch = allDataMovies.filter((item) => {
    return item.title.toLowerCase().includes(valueInput);
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
         There are no movies !
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
  saveID(".contain-results");
}

close.addEventListener("click", () => {
  inputSearch.value = "";
  searchMovie();
});

const inputToggle = document.querySelector("#toggle-mode");
const logo = document.querySelector(".header img");
function applyDarkMode(isDarkMode) {
  if(isDarkMode){
    document.body.classList.add('dark')
    logo.classList.add("contrast")
  }else{
    document.body.classList.remove('dark');
    logo.classList.remove("contrast")
  }
 }
inputToggle.addEventListener('change', function() {
  applyDarkMode(this.checked);

  localStorage.setItem('darkMode', this.checked);
});
var isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
inputToggle.checked =  isDarkModeEnabled
applyDarkMode(isDarkModeEnabled);

let saveTab = containMovie.id
containMovie.id == saveTab ? document.querySelector("#tab-"+ `${saveTab}`).style.color = "var(--text-color)" : {}


// Hàm áp dụng trạng thái Dark Mode vào giao diện

