import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import {Button} from 'reactstrap';
import axios from "axios";

class Articles extends Component {
  state = {
    articles: [],
    topic: "",
    startdate: "",
    enddate: "",
    savedarticles: []
  };

  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ savedarticles: res.data })
      )
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleSave = (t, u, d) => { 
      API.saveArticle({
        title: t,
        url: u,
        date: d
      }
      )
        .then(res => this.loadArticles())
        .catch(err => console.log(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var start = this.state.startdate + "0101";
    var end = this.state.enddate + "1230";

    url += 'api-key='+"e6c4c7ac070049fab4d34eaa40c38dbf";
    url += '&q=' + this.state.topic;
    url += '&begin_date=' + start;
    url += '&end_date=' + end;

    axios.get(url).then(res =>
      {
        this.setState({ articles: res.data.response.docs })
      }
      )
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-3">
            <Jumbotron>
              <h1>What Articles are you looking for?</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.topic}
                onChange={this.handleInputChange}
                name="topic"
                placeholder="Topic (required)"
              />
              <Input
                value={this.state.startdate}
                onChange={this.handleInputChange}
                name="startdate"
                placeholder="Start Date (required)"
              />
              <Input
                value={this.state.enddate}
                onChange={this.handleInputChange}
                name="enddate"
                placeholder="End Date (required)"
              />
              <FormBtn
                disabled={!(this.state.topic && this.state.startdate && this.state.enddate)}
                onClick={this.handleFormSubmit}
              >
                Search Articles
              </FormBtn>
            </form>
          </Col>
          <Col size="md-9 sm-12">
            <div>
              <Jumbotron>
                <h1>Search Results</h1>
              </Jumbotron>
              {this.state.articles.length ?
                (
                  <List>
                    {this.state.articles.map(article => (
                      <ListItem key={article._id}>
                        <h1 href={article.web_url}>
                          <strong>
                            { 
                              article.headline.main
                            }
                          </strong>
                        </h1>
                        <h5>
                          {article.pub_date}
                          </h5>
                        <Button onClick={() => this.handleSave(article.headline.main, article.web_url, article.pub_date)}>
                          Save Button
                      </Button>
                      </ListItem>
                    ))}
                  </List>
                ) : (<h3>No Results to Display</h3>)}
            </div>

            <div>
              <Jumbotron>
                <h1>Saved Articles</h1>
              </Jumbotron>
              {this.state.savedarticles.length ? (
                <List>
                  {this.state.savedarticles.map(article => (
                    <ListItem key={article._id}>
                      <h1 href={article.url}>
                        <strong>
                          {article.title}
                        </strong>
                      </h1>
                      <h5>
                          {article.date}
                          </h5>
                      <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                  <h3>No Results to Display</h3>
                )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
