let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
const containMovie = document.querySelector("#favourites")
function handleFavourite(){
    function RenderSimilarMovies() {
        return (
          <div className="row">
            {favoriteMovies.map((item) => (
              <div className="col l-3 m-4 c-4" key={item.id}>
                <div className="card similar" id={item.id}>
                  <div>
                    <a href="#">
                        <img src={item.image} />
                      
                    </a>
                    <img
                      className="play"
                      src="https://cdn-icons-png.flaticon.com/512/189/189638.png"
                    />
                  </div>
                  <h1>{item.name}</h1>
                  <small>{item.date}</small>
                </div>
              </div>
            ))}
          </div>
        );
      }
      ReactDOM.render(<RenderSimilarMovies />, containMovie)
}
containMovie.id == "favourites" ? handleFavourite() : null
function saveID(selector) {
    const getCards = document.querySelectorAll(selector);
    getCards.forEach((getCard) => {
      getCard.addEventListener("click", () => {
        localStorage.setItem("idCard", JSON.stringify(getCard.id));
        window.location.href = "./play-page.html";
      });
    });
  }
  saveID(".card")