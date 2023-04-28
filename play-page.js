let idCard = JSON.parse(localStorage.getItem("idCard"));
const containPlayPage = document.querySelector(".play-page");
var saveArray = JSON.parse(localStorage.getItem("saveMovie"));
const cardMovie = document.querySelector("#playpage");
let currentImgSearch = "";
let currentTitleSearch = "";
let currentLanguageSearch = "";
let currentOverviewSearch = "";
let currentReleaseSearch = "";
let currentVoteSearch = "";
let dataVideos = "";
let keyVideo = "";
let dataSimilar = "";
function checkIdCard() {
  saveArray.forEach((item) => {
    if (idCard == item.id) {
      {

        currentImgSearch = item.poster_path;
        currentTitleSearch = item.title;
        currentLanguageSearch = item.original_language;
        currentOverviewSearch = item.overview;
        currentReleaseSearch = item.release_date;
        currentVoteSearch = item.vote_average;
      }
    }
  });
}

async function handleVideo(idCard) {
  let apiMovie = `https://api.themoviedb.org/3/movie/${idCard}/videos?api_key=21a74c685cbdafbea65d58ebd993168f`;
  dataVideos = await fetch(apiMovie)
    .then((res) => res.json())
    .then((dataVideos) => {

      dataVideos.results[0].key =
        "https://www.youtube.com/embed/" + dataVideos.results[0].key;
      keyVideo = dataVideos.results[0].key;
      checkIdCard();
      function ReRenderSuccess() {
        return (
          <div className="row">
            <div className="reference">
              <div className="col l-4 m-12 c-12">
                <img src={currentImgSearch} alt="" />
              </div>
              <div className="col l-8 m-12 c-12">
                <h1>
                  <span>{currentTitleSearch}</span>
                </h1>
                <p>
                  <span>Status:</span> Trailer
                </p>
                <h2>  
                  <span>language:</span> {currentLanguageSearch}
                </h2>
                <h3>
                  <span>Overview:</span> {currentOverviewSearch}
                </h3>
                <h4>
                  <span>Release date:</span> {currentReleaseSearch}
                </h4>
                <small>
                  <span>Vote average:</span> {currentVoteSearch}
                </small>
              </div>
            </div>
            <iframe
              className="grid wide"
              title="Video player"
              frameBorder="0"
              src={keyVideo}
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      ReactDOM.render(<ReRenderSuccess />, containPlayPage);
   
    })
    .catch(() => {
      function ReRenderSearch() {
        return (
          <div className="row">
            <div className="reference">
              <div className="col l-4 m-12 c-12">
                <img src={currentImgSearch} alt="" />
              </div>
              <div className="col l-8 m-12 c-12">
                <h1>
                  <span>{currentTitleSearch}</span>
                </h1>
                <p>
                  <span>Status:</span> Trailer
                </p>
                <h2>
                  <span>language:</span> {currentLanguageSearch}
                </h2>
                <h3>
                  <span>Overview:</span> {currentOverviewSearch}
                </h3>
                <h4>
                  <span>Release date:</span> {currentReleaseSearch}
                </h4>
                <small>
                  <span>Vote average:</span> {currentVoteSearch}
                </small>
              </div>
            </div>
          </div>
        );
      }
      ReactDOM.render(<ReRenderSearch />, containPlayPage);
    });
}

handleVideo(idCard);

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

async function handleSimilar() {
  const apiSimilarMovies = `https://api.themoviedb.org/3/movie/${idCard}/similar?api_key=21a74c685cbdafbea65d58ebd993168f&language=en-US&page=1`;
  dataSimilar = await fetch(apiSimilarMovies)
    .then((res) => res.json())
    .then((dataSimilar) => {
      const dataSimilarMovies = dataSimilar.results;
      dataSimilarMovies.forEach((item) => {
        saveArray.push(item);
        
      });
    
      function RenderSimilarMovies() {
        if (cardMovie.id == "playpage") {
          handleData(dataSimilarMovies);
          return (
            <div className="row">
              {dataSimilarMovies.map((item, index) => (
                <div className="col l-3 m-4 c-4" key={item.id}>
                  <div className="card similar" id={item.id}>
                    <div>
                      <a href="#">
                        {" "}
                        <img src={item.poster_path} />{" "}
                      </a>
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
      ReactDOM.render(<RenderSimilarMovies />, cardMovie);

      const getMoviesSimilar = document.querySelectorAll(".similar");
      getMoviesSimilar.forEach((movie, index) => {
        movie.addEventListener("click", () => {
          idCard = movie.id;
          checkIdCard();
          handleVideo(idCard);
        });
      });
    });
   
}
handleSimilar();
