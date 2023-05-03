import pathlib
import json
import pprint
from flask import Flask, request
import requests
import json
import google.auth
from google.cloud import compute_v1
from google.oauth2 import service_account


app = Flask(__name__)
parent_dir = pathlib.Path(__file__).parent.resolve()
credentials = service_account.Credentials.from_service_account_file(
        '{0}/cred.json'.format(parent_dir)
)

@app.route('/create_instance', methods=['POST'])
def create_instance():
    try:
        # Set the project and zone where you want to create the instance
        project = request.args.get('project')
        zone = request.args.get('zone')

        # Set the desired SKU ID for the instance
        sku_id = request.args.get('sku_id')

        machine_type = request.args.get('machine_type')
        instance_name = request.args.get('instance_name')
        boot_disk_name = request.args.get('boot_disk_name')

        # Initialize the Compute Engine client
        compute_client = compute_v1.InstancesClient(credentials=credentials)

        # Create the instance configuration
        config = compute_v1.Instance()
        config.machine_type = f"zones/{zone}/machineTypes/{machine_type}"

        # Set any other desired instance configuration options
        config.name = instance_name
        config.network_interfaces = [compute_v1.NetworkInterface()]
        config.scheduling.provisioning_model = "SPOT"
        config.source_machine_image
        
        # Set the boot disk configuration
        boot_disk = compute_v1.AttachedDisk()
        boot_disk.auto_delete = True
        boot_disk.boot = True
        boot_disk.initialize_params = compute_v1.AttachedDiskInitializeParams(source_image='projects/debian-cloud/global/images/family/debian-11')
        boot_disk.mode = 'READ_WRITE'
        boot_disk.type_ = 'PERSISTENT'
        boot_disk.device_name = boot_disk_name
        config.disks = [boot_disk]

        # Create the instance
        response = compute_client.insert(project=project, zone=zone, instance_resource=config)

        return (f"Instance created: {response.name}")
    except Exception as e:
        return str(e)

@app.route('/delete_instance', methods=['DELETE'])
def delete_instance():
    try:
        # Set the project and zone where the instance is located
        project = request.args.get('project')
        zone = request.args.get('zone')

        # Set the name of the instance to delete
        instance_name = request.args.get('instance_name')

        # Initialize the Compute Engine client
        compute_client = compute_v1.InstancesClient(credentials=credentials)

        # Delete the instance
        operation = compute_client.delete(project=project, zone=zone, instance=instance_name)
        return operation.result()
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(port=8888,host='0.0.0.0')