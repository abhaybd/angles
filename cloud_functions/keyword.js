// Host in Google Cloud function with node and @google-cloud/language installed
// Get all Entities in articleText and return entities with highest salience values
// Access URL: https://us-west3-angles-dh2020.cloudfunctions.net/getRelevantEntities

const language = require('@google-cloud/language');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getRelevantEntities = (req, res) => {
  // Choose the appropriate parsing method based on the type of data sent
  let text;
  switch (req.get('content-type')) {
    case 'application/json':
      text = req.body.message;
      break;

    case 'text/plain':
      text = req.body;
      break;

    case 'application/octet-stream':
      text = req.body.toString();
      break;

    case 'application/x-www-form-urlencoded':
      text = req.body.message;
      break;
  }

  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    getEntities(text).then(function(keywords) {
      res.status(200).send(keywords);
    }).catch(function(error) {
      res.status(200).send('error: ' + error);
    });
  }
};

async function getEntities(articleText) {  
  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const document = {
    content: articleText,
    type: 'PLAIN_TEXT',
  };

  // Detects the entities in the text
  const [result] = await client.analyzeEntities({document});
  var entities = result.entities;

  // Sort entities by salience
  entities.sort((a, b) => b.salience - a.salience);

  // Get keywords from the entities
  let keywords = [];
  entities.forEach(entity => {
    let name = entity.name.toLowerCase();
    if (!keywords.includes(name)) keywords.push(name);
  });
  return JSON.stringify({"keywords": keywords});
}
