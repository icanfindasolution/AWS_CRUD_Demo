const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    
    console.info("event data: " + JSON.stringify(event))
    
    switch (event.httpMethod + " " + event.resource) {
      
      
      //Delete a single item by id
      case "DELETE /items/{id}":
        await dynamo
          .delete({
            TableName: "crud-demo",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
        
      //Get a single item by id  
      case "GET /items/{id}":
        body = await dynamo
          .get({
            TableName: "crud-demo",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
        
      //Get all items in the table  
      case "GET /items":
        body = await dynamo.scan({ TableName: "crud-demo" }).promise();
        break;
        
      //Put a single item in the table  
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "crud-demo",
            Item: {
              id: requestJSON.id,
              price: requestJSON.price,
              name: requestJSON.name
            }
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
        
        
      //If no route found output message with all even   
      default:
        throw new Error(`Unsupported route: "${event.httpMethod + " " + event.resource + " - EVENT: " + JSON.stringify(event)}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
