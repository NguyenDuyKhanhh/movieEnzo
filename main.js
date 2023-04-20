const containMovie = document.querySelector(".movie");
const clearSearch = document.querySelector(".close-btn");
const btnsPage = document.querySelector(".navbar");
const slides = document.querySelectorAll(".banner img");
const nextSlider = document.querySelector(".bx-chevron-right");
const prevSlider = document.querySelector(".bx-chevron-left");
const loader = document.querySelector(".loader");
const favourites = document.querySelector("#favourite");
const nowPage = document.querySelector("#popular-series h1");
const slider = document.querySelector(".slider");
const dots = document.querySelectorAll(".dot");
let data = "";
let dataTrending = "";
let dataTopRate = "";
let scrollInterval;


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

async function movieMain(keyPage) {
  let api = `https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${keyPage}&with_watch_monetization_types=flatrate`;
  data = await fetch(api).then((res) => res.json());
  const dataMovie = data.results;

  let apiTrending = `https://api.themoviedb.org/3/trending/all/day?api_key=21a74c685cbdafbea65d58ebd993168f`;
  dataTrending = await fetch(apiTrending).then((res) => res.json());
  const dataTrendingMovie = dataTrending.results;
  localStorage.setItem("saveDataTrending", JSON.stringify(dataTrendingMovie));

  let apiTopRate = `https://api.themoviedb.org/3/movie/top_rated?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1`;
  dataTopRate = await fetch(apiTopRate).then((res) => res.json());
  const dataTopRateMovie = dataTopRate.results;
  localStorage.setItem("savetoprate", JSON.stringify(dataTopRateMovie));

  function Render() {
    if (containMovie.id === "home" || containMovie.id == null) {
      handleData(dataMovie);
      return (
        <div className="row">
          {dataMovie.map((item, index) => (
            <div className="col l-3 m-4 c-4" key={item.id}>
           
                        <div className="card" id={item.id}>
                            <div>
                            <img src={item.poster_path} />
                            <img
                                className="play"
                                src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
                            />
                            </div>
                            <h1>{item.title}</h1>
                            <small>{item.release_date}</small>
                        </div>
             

            </div>
          ))}
        </div>
      );
    }
    if (containMovie.id == "trending") {
      handleData(dataTrendingMovie);
      return (
        <div className="row">
          {dataTrendingMovie.map((item, index) => (
            <div className="col l-3 m-4 c-4" key={item.id}>
              <div className="card" id={item.id}>
                <div>
                  <img src={item.poster_path} />
                  <img
                    className="play"
                    src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
                  />
                </div>
                <h1>{item.title}</h1>
                <small>{item.release_date}</small>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (containMovie.id == "movie") {
      handleData(dataTopRateMovie);
      return (
        <div className="row">
          {dataTopRateMovie.map((item, index) => (
            <div className="col l-3 m-4 c-4" key={item.id}>
              <div className="card" id={item.id}>
                <div>
                  <img src={item.poster_path} />
                  <img
                    className="play"
                    src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
                  />
                </div>
                <h1>{item.title}</h1>
                <small>{item.release_date}</small>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  if (containMovie.id == "home" ||containMovie.id == "trending" ||containMovie.id == "movie"){
    ReactDOM.render(<Render />, containMovie);
  }

  const getCards = document.querySelectorAll(".card");
  getCards.forEach((getCard) => {
    getCard.addEventListener("click", () => {
      localStorage.setItem("idCard", JSON.stringify(getCard.id));
      window.location.href = "./play-page.html";
    });
  });
}
movieMain();

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
  const nextPage = document.querySelector(".next-page a .next");
  const prevPage = document.querySelector(".next-page a .prev");
  let currentPage = 1;
  function checkCurrentPage(){
    if (currentPage == 1) {
        nextPage.style.display = "block";
        prevPage.style.display = "none";
      } else if (currentPage == 2) {
        nextPage.style.display = "block";
        prevPage.style.display = "block";
      } else if (currentPage == 3) {
        nextPage.style.display = "none";
        prevPage.style.display = "block";
      }
  }
function handlePage() {
  nextPage.addEventListener("click", () => {
    currentPage += 1;
    nowPage.innerText = "Page: " + currentPage;
    movieMain(currentPage);
    checkCurrentPage()
  });


  prevPage.addEventListener("click", () => {
    currentPage -= 1;
    nowPage.innerText = "Page:" + currentPage;
    movieMain(currentPage);
    checkCurrentPage()
  });
}
handlePage();

function getDataAllPage() {
    let arrayAllMovies = [];
    for (let i = 1; i <= 3; i++) {
        fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&sort_by=popularity.desc&include_adult=false&page=${i}&with_watch_monetization_types=flatrate`
        )
        .then((res) => res.json())
        .then((data) => {
          loader.style.display = "none"
            data.results.forEach((component, index) => {
            component.poster_path =
                "https://image.tmdb.org/t/p/w500" + component.poster_path;
            arrayAllMovies.push(component);
            localStorage.setItem("save", JSON.stringify(arrayAllMovies));
            });
        })
        .catch(()=>{
          loader.style.display = "block"
        })
        
    }

    var saveArrayTemporary = JSON.parse(localStorage.getItem("save"));
    var saveDataTrending = JSON.parse(localStorage.getItem("saveDataTrending"));
    var saveDataTopRate = JSON.parse(localStorage.getItem("savetoprate"));
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
}
getDataAllPage()

var saveArray = JSON.parse(localStorage.getItem("saveMovie"));

const resultsSearch = document.querySelector(".results-search");
const containResults = document.querySelectorAll(".contain-results");
const close = document.querySelector(".close i")
const inputSearch = document.querySelector("#input-search")

 

function searchMovie() {


  let valueInput = inputSearch.value.toLowerCase().trim();

console.log(valueInput)
  let MoviesSearch = saveArray.filter((comp) => {
    return comp.title.toLowerCase().includes(valueInput);
  });

  if (valueInput.length != 0) {
    close.style.opacity = "1";
  }
  const RenderMoviesSearch = ()=> {
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
  }

  ReactDOM.render(<RenderMoviesSearch/>, resultsSearch);
  containResults.forEach((containResult) => {
    containResult.addEventListener("click", () => {
      localStorage.setItem("idCard", JSON.stringify(containResult.id));
      window.location.href = "./play-page.html";
    });
  });

}
  close.addEventListener("click",()=>{
    inputSearch.value = ''
    searchMovie()
  })

const inputToggle = document.querySelector("#toggle-mode");
const logo = document.querySelector(".header img");
function lightMode(){
    inputToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark");
      logo.classList.toggle("contrast");
    });
}
lightMode()