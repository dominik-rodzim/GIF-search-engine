var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "3ZZOktKzjDWWULQ31nfDCfOVDukGGKmC";

App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: "",
      gif: {}
    };
  },

  handleSearch: function(searchingText) {
    this.setState({
      loading: true
    });
    this.getGif(
      searchingText,
      function(gif) {
        this.setState({
          loading: false,
          gif: gif,
          searchingText: searchingText
        });
      }.bind(this)
    );
  },

  getGif: searchingText => {
      const url =
      GIPHY_API_URL +
      "/v1/gifs/random?api_key=" +
      GIPHY_PUB_KEY +
      "&tag=" +
      searchingText;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (this.status === 200) {
          var data = JSON.parse(this.responseText).data;
          var gif = {
            url: data.fixed_width_downsampled_url,
            sourceUrl: data.url
          };
          resolve(gif);
        } else {
          reject(new Error(this.statusText));
        }
      };
      xhr.onerror = function() {
        reject(new Error(
          `XMLHttpRequest Error: ${this.statusText}`));
      };
      xhr.open("GET", url);
      xhr.send();
    });
  },

  render: function() {
    var styles = {
      margin: "0 auto",
      textAlign: "center",
      width: "90%"
    };
    
    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFów!</h1>
        <p>
          Znajdź gifa na <a href="http://giphy.com">giphy</a>. Naciskaj Enter
          aby pobierać kolejne gify
        </p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
