const Soup = imports.gi.Soup;

class CockboxApi {
  constructor() {
    this.soup_session = new Soup.Session({user_agent: 'CockliServerStatus@one'});
  }
  
  async getInfo(id, apikey, callback) {
    let url = `https://cockbox.org/api/1.0/service/${id}`;
    let message = new Soup.Message({method: 'GET', uri: new Soup.URI(url)});
    message.request_headers.append('X-Api-Key', apikey);

    return new Promise((resolve, reject) => {
      this.soup_session.queue_message(message, (session, message) => {
        resolve(JSON.parse(message.response_body.data));
      });
    });
  }
}
