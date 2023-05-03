from google.cloud import billing_v1
from google.oauth2 import service_account
import pathlib
import json
import pprint
from flask import Flask, request
import requests
import json


def gcp_collect_cheapest(response,usage):
    # Collect Core, Ram, GPU
    suggested_spec = {"core" : {}, "ram" : {}, "gpu" : {}}

    # Print the pricing information
    for sku in response:
        sku = billing_v1.Sku(sku)

        # Extract the pricing information
        pricing_info = sku.pricing_info[0]
        tiered_rates = pricing_info.pricing_expression.tiered_rates

        # Calculate the price
        usage_amount = usage if usage else 1000
        total_price = 0

        # if len(tiered_rates) == 1:
        unit_price = 0
        if tiered_rates:
            if tiered_rates[0].unit_price.units:
                unit_price = tiered_rates[0].unit_price.units
            if tiered_rates[0].unit_price.nanos:
                unit_price = unit_price + (tiered_rates[0].unit_price.nanos / 1000000000)
            total_price = usage_amount * unit_price

            """
            if total_price == 0:
                print(tiered_rates)
                print(f"SKU ID: {sku.sku_id}")
                print(f"Description: {sku.description}")
            """
            
            if "Spot Preemptible" in sku.description:
                if "Ram running" in sku.description:
                    if suggested_spec["ram"]:
                        if suggested_spec["ram"]["price"] >  total_price:
                            suggested_spec["ram"]["id"] = sku.sku_id
                            suggested_spec["ram"]["description"] = sku.description
                            suggested_spec["ram"]["price"] = total_price
                    else:
                        suggested_spec["ram"]["id"] = sku.sku_id
                        suggested_spec["ram"]["description"] = sku.description
                        suggested_spec["ram"]["price"] = total_price
                if "Core running" in sku.description:
                    if suggested_spec["core"]:
                        if suggested_spec["core"]["price"] >  total_price:
                            suggested_spec["core"]["id"] = sku.sku_id
                            suggested_spec["core"]["description"] = sku.description
                            suggested_spec["core"]["price"] = total_price
                    else:
                        suggested_spec["core"]["id"] = sku.sku_id
                        suggested_spec["core"]["description"] = sku.description
                        suggested_spec["core"]["price"] = total_price
                if "GPU attached " in sku.description:
                    if suggested_spec["gpu"]:
                        if suggested_spec["gpu"]["price"] >  total_price:
                            suggested_spec["gpu"]["id"] = sku.sku_id
                            suggested_spec["gpu"]["description"] = sku.description
                            suggested_spec["gpu"]["price"] = total_price
                    else:
                        suggested_spec["gpu"]["id"] = sku.sku_id
                        suggested_spec["gpu"]["description"] = sku.description
                        suggested_spec["gpu"]["price"] = total_price

            #print(f"SKU ID: {sku.sku_id}")
            #print(f"Description: {sku.description}")
            #print(f"Price: {total_price} {pricing_info.pricing_expression.tiered_rates[0].unit_price.currency_code}")
        """
        else:
            for i in range(len(tiered_rates)):
                unit_price = 0
                if tiered_rates[i].start_usage_amount and usage_amount > tiered_rates[i].start_usage_amount:
                        usage_in_tier = usage_amount - tiered_rates[i].start_usage_amount
                if tiered_rates[0].unit_price.units:
                    price = tiered_rates[0].unit_price.units
                if tiered_rates[0].unit_price.nanos:
                    price = price + (tiered_rates[0].unit_price.nanos / 1000000000)
                total_price += usage_in_tier * price
                usage_amount -= usage_in_tier
        """
    return suggested_spec

def gcp_collect_matching_instance(response,location,usage):
    # Collect Core, Ram, GPU
    suggested_spec = {"core" : {}, "ram" : {}, "gpu" : {}}

    # Print the pricing information
    for sku in response:
        sku = billing_v1.Sku(sku)

        if location in sku.description:
            # Extract the pricing information
            pricing_info = sku.pricing_info[0]
            tiered_rates = pricing_info.pricing_expression.tiered_rates

            # Calculate the price
            usage_amount = usage if usage else 1000
            total_price = 0

            # if len(tiered_rates) == 1:
            unit_price = 0
            if tiered_rates:
                if tiered_rates[0].unit_price.units:
                    unit_price = tiered_rates[0].unit_price.units
                if tiered_rates[0].unit_price.nanos:
                    unit_price = unit_price + (tiered_rates[0].unit_price.nanos / 1000000000)
                total_price = usage_amount * unit_price

                if "Spot Preemptible" in sku.description:
                    if "Ram running" in sku.description:
                        if suggested_spec["ram"]:
                            if suggested_spec["ram"]["price"] >  total_price:
                                suggested_spec["ram"]["id"] = sku.sku_id
                                suggested_spec["ram"]["description"] = sku.description
                                suggested_spec["ram"]["price"] = total_price
                        else:
                            suggested_spec["ram"]["id"] = sku.sku_id
                            suggested_spec["ram"]["description"] = sku.description
                            suggested_spec["ram"]["price"] = total_price
                    if "Core running" in sku.description:
                        if suggested_spec["core"]:
                            if suggested_spec["core"]["price"] >  total_price:
                                suggested_spec["core"]["id"] = sku.sku_id
                                suggested_spec["core"]["description"] = sku.description
                                suggested_spec["core"]["price"] = total_price
                        else:
                            suggested_spec["core"]["id"] = sku.sku_id
                            suggested_spec["core"]["description"] = sku.description
                            suggested_spec["core"]["price"] = total_price
                    if "GPU attached " in sku.description:
                        if suggested_spec["gpu"]:
                            if suggested_spec["gpu"]["price"] >  total_price:
                                suggested_spec["gpu"]["id"] = sku.sku_id
                                suggested_spec["gpu"]["description"] = sku.description
                                suggested_spec["gpu"]["price"] = total_price
                        else:
                            suggested_spec["gpu"]["id"] = sku.sku_id
                            suggested_spec["gpu"]["description"] = sku.description
                            suggested_spec["gpu"]["price"] = total_price
    return suggested_spec            

def gcp_get_spot_instance_price(location,usage=1000):
    result = {"cheapest" : None, "location_based" : None}

    # path to parent and src directory
    parent_dir = pathlib.Path(__file__).parent.resolve()
    src_dir = pathlib.Path(__file__).parent.parent.resolve()

    # Set up the credentials
    credentials = service_account.Credentials.from_service_account_file(
        '{0}/cred.json'.format(parent_dir),
        scopes=['https://www.googleapis.com/auth/cloud-billing']
    )

    # Create the client
    client = billing_v1.CloudCatalogClient(credentials=credentials)

    #sku_id = "DD90-547C-2AAA"
    service_id = "6F81-5844-456A"
    parent = f'services/{service_id}'
    request = billing_v1.ListSkusRequest(parent=parent,currency_code="USD")

    # Send the request and get the response
    response = client.list_skus(request)
    cheapest = gcp_collect_cheapest(response,usage)

    result["cheapest"] = cheapest

    response = client.list_skus(request)
    if location:
        location_based = gcp_collect_matching_instance(response,location,usage)
        result["location_based"] = location_based

    return result


def aws_get_spot_instance_price(location,usage=1000):
    url = "https://spot-price.s3.amazonaws.com/spot.js"
    
    response = requests.get(url)
    json_data = json.loads(response.text[9:-2])
    cheapest = {}

    for r in json_data['config']['regions']:
        if r['region'] == location:
            for i in r['instanceTypes']:
                for j in i["sizes"]:
                    for k in j['valueColumns']:
                        if k["name"] == "linux":
                            if cheapest:
                                if cheapest["price"] > k["prices"]["USD"]:
                                    cheapest["instance"] = j["size"]
                                    cheapest["price"] = k["prices"]["USD"]
                            else:
                                cheapest["instance"] = j["size"]
                                cheapest["price"] = k["prices"]["USD"]
            break
    if cheapest["price"]:
        cheapest["price"] = float(cheapest["price"]) * usage
    cheapest["location"] = location
    
    return cheapest

app = Flask(__name__)

@app.route('/get_instance', methods=['GET'])
def get_instance():
    result = {"gcp" : None, "aws": None}

    gcp_location = request.args.get('gcp_location')
    aws_location = request.args.get('aws_location')
    usage = int(request.args.get('usage'))
    
    result["gcp"] = gcp_get_spot_instance_price(gcp_location if gcp_location else None, usage)
    result["aws"] = aws_get_spot_instance_price(aws_location if aws_location else "us-east",usage=usage)

    return result

if __name__ == '__main__':
    app.run(port=7777,host='0.0.0.0')