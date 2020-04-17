// Load the AWS SDK for JS
var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB Document Client
var dynamodb = new AWS.DynamoDB.DocumentClient();
var tableName = process.env.DYNAMODB_TABLE

module.exports.create = async function(event, context) {
    const body = JSON.parse(event['body'])
    const customer_id = body['customer_id']
    const profile_data = body['profile_data']
    const putParams = {
        TableName: tableName,
        Item: {
            'pk': 'CUSTOMER#' + customer_id,
            'sk': 'PROFILE#' + customer_id,
            'profile_data': profile_data
        }
    }
    try {
        await dynamodb.put(putParams).promise()
        return  {
            "statusCode": 200,
            "body": JSON.stringify(putParams.Item)
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

module.exports.get = async function(event, context) {
    const customer_id = event['pathParameters']['id']
    const getParams = {
        TableName: tableName,
        Key: {
            'pk': 'CUSTOMER#' + customer_id,
            'sk': 'PROFILE#' + customer_id,
        }
    }
    let getResult
    try {
        getResult = await dynamodb.get(getParams).promise()
        return {
            "statusCode": 200,
            "body": JSON.stringify(getResult)
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}