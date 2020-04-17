import boto3
import json

dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
table = dynamodb.Table('gss')


def create(event, context):
    body = json.loads(event['body'])
    customer_id = body['customer_id']
    profile_data = body['profile_data']
    item = {
        'pk': 'CUSTOMER#' + customer_id,
        'sk': 'PROFILE#' + customer_id,
        'profile_data': profile_data
    }
    table.put_item(Item=item)
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(item)
    }


def get(event, body):
    print(event)
    customer_id = event['pathParameters']['id']
    item = table.get_item(
        Key={
            'pk': 'CUSTOMER#' + customer_id,
            'sk': 'PROFILE#' + customer_id
        }
    )['Item']
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(item)
    }