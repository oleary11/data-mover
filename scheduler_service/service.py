import pathlib
import json
import pprint
from flask import Flask, request
import requests
import json
import google.auth
from google.cloud import compute_v1
from google.oauth2 import service_account
import os
import subprocess


app = Flask(__name__)
parent_dir = pathlib.Path(__file__).parent.resolve()
credentials = service_account.Credentials.from_service_account_file(
        '{0}/cred.json'.format(parent_dir)
)
container_image = "gcr.io/data-mover-beta/connections-service:latest"

@app.route('/create_instance', methods=['POST'])
def create_instance():
    try:
        # Set the project and zone where you want to create the instance
        project = request.args.get('project')
        zone = request.args.get('zone')
        sku_id = request.args.get('sku_id')
        machine_type = request.args.get('machine_type')
        instance_name = request.args.get('instance_name')

        # Initialize the Compute Engine client
        compute_client = compute_v1.InstancesClient(credentials=credentials)

        instance_template_client = compute_v1.InstanceTemplatesClient(credentials=credentials)

        # Retrieve an instance template by name.
        instance_template = instance_template_client.get(
            project=project, instance_template="spot-instance-template"
        )

        # Adjust diskType field of the instance template to use the URL formatting required by instances.insert.diskType
        # For instance template, there is only a name, not URL.
        for disk in instance_template.properties.disks:
            if disk.initialize_params.disk_type:
                disk.initialize_params.disk_type = (
                    f"zones/{zone}/diskTypes/{disk.initialize_params.disk_type}"
                )

        # Create the instance configuration
        config = compute_v1.Instance()
        config.machine_type = f"zones/{zone}/machineTypes/{machine_type}"

        # Set any other desired instance configuration options
        config.name = instance_name

        # Create the access config object for the external IP
        access_config = compute_v1.AccessConfig(name="External NAT",
                                                type_="ONE_TO_ONE_NAT",
                                                )

        # Create the network interface object and add the access config to it
        nat_interface = compute_v1.NetworkInterface(access_configs=[access_config])
        config.network_interfaces = [nat_interface]
        config.scheduling.provisioning_model = "SPOT"
        config.disks = list(instance_template.properties.disks)

        #boot_disk_name = request.args.get('boot_disk_name')
        # read = subprocess.run(['cat', 'script.sh'], stdout=subprocess.PIPE)
        # config.metadata = config.metadata = {
        #     'items': [{
        #         'key': 'startup-script',
        #         'value': f"sudo docker pull {container_image}\n"
        #                  f"sudo docker run -d {container_image}"
        #     }]
        # }

        # Set the boot disk configuration
        # boot_disk = compute_v1.AttachedDisk()
        # boot_disk.auto_delete = True
        # boot_disk.boot = True
        # boot_disk.initialize_params = compute_v1.AttachedDiskInitializeParams(source_image='projects/cos-cloud/global/images/family/cos-101-lts')
        # # AttachedDiskInitializeParams(source_image='projects/debian-cloud/global/images/family/debian-11')
        # boot_disk.mode = 'READ_WRITE'
        # boot_disk.type_ = 'PERSISTENT'
        # boot_disk.device_name = boot_disk_name
        # config.disks = [boot_disk]

        # Create the instance
        # response = compute_client.insert(project=project, zone=zone, instance_resource=config)


        instance_insert_request = compute_v1.InsertInstanceRequest()
        instance_insert_request.project = project
        instance_insert_request.zone = zone
        instance_insert_request.instance_resource = config
        instance_insert_request.source_instance_template = instance_template.self_link

        operation = compute_client.insert(instance_insert_request)

        return (f"Instance created: {operation.name}")
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
        operation.result()
        return f"Instance {instance_name} deleted successfully."
    except Exception as e:
        return str(e)

@app.route('/external_ip', methods=['GET'])
def external_ip():
    try:
        # Set the project and zone where the instance is located
        project = request.args.get('project')
        zone = request.args.get('zone')

        # Set the name of the instance to delete
        instance_name = request.args.get('instance_name')

        # Initialize the Compute Engine client
        compute_client = compute_v1.InstancesClient(credentials=credentials)
        instance = compute_client.get(project=project, zone=zone, instance=instance_name)
        
        # Print the external IP address
        return instance.network_interfaces[0].access_configs[0].nat_i_p
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(port=8888,host='0.0.0.0')