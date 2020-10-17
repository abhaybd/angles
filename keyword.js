// Host in AWS function with node and @google-cloud/language installed
// Get all Entities in articleText and return entities with highest salience values

async function getEntities(articleText, n=5) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    const document = {
        content: articleText,
        type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [result] = await client.analyzeEntities({document});
    var entities = result.entities;
    
    // Print values of each entity (for testing)
    /*
    entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
        }
    });
    */

    // Sort entities by salience
    entities.sort((a, b) => b.salience - a.salience);

    // Return top n entities (5 default)
    // If n > entities.length, return entities
    return entities.slice(0, n);
}
