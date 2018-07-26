import axios from "axios";
var baseurl = "http://localhost:4000";
export default {
  // Gets all articles
  getArticles: function() {
    return axios.get("http://localhost:4000/api/articles");
  },
  // Deletes the book with the given id
  deleteArticle: function(id) {
    return axios.delete(baseurl + "/api/articles/" + id);
  },
  // Saves a book to the database
  saveArticle: function(articleData) {
    console.log("in API.js   " + articleData);
    return axios.post(baseurl + "/api/articles", articleData);
  }
};
