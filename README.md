# HW1
## Devops Homework-1 Provisioning and Configuring Servers

This repository is mainly aimed at providing instructions to Provision and configure servers on remote VM's using serice providers such as DigitalOcean and Amazon AWS. This is currently beind done as part of HW-1 for CSC 591 Devops course at NC State. 

## Instructions on getting started
1. To get started, you need to sign up with [DigitalOcean](https://cloud.digitalocean.com/registrations/new) and [Amazon AWS] (https://aws.amazon.com/premiumsupport/signup) 
2. Once you sign up with DigitalOcean, generate a token for your account and make sure to keep a record of the token. The instructions to that can be found [here](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2).
3. Similarly you will need the Access and Secret token for AWS. The instructions to download these tokens can be found [here](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html).
4. You need to set these tokens as environment variables. The names of the environment variables are - 
```
DIG_OCEAN_TOKEN
AWS_ACCESS_KEY
AWS_SECRET_KEY
```
5. You need to generate ssh keys for DigitalOcean. The instructions are available [here](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets). In this project "dg.key" is the name given to the ssh key. You either need to use the same name or change it in the code.
6. Next for AWS you need to generate a key-pair and a security group in the region in which you would like to deploy the instance. In this project "us-west-2" is the selected region. Also "devops.pem" is the name given to the key and "devops" is the name of the security group. You either need to use the same name or change it in the code. the instructions to to download the key-pair can be found [here] (http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html).


## Requirements for the repository
This project need npm, node.js and ansible in order to work. These dependencies can be installed by running the InstallDeps.sh shell script. 

##Steps to follow in order to provision the VM's
a. Clone this repository into your local system.

b. Run the following script to install the dependencies:
```
bash InstallDeps.sh
```
This will install npm, node.js and ansible in your system. 

c. Now in order to download the needle node.js module required for DigitalOcean and the AWS SDK required for AWS, run the DownloadModules script:
```
bash DownloadModules.sh
```
This will download the required modules mentioned in "package.json" into the "node_modules" folder.

d. Make a new folder called "keys" and copy the "dg.key" and "devops.pem" mentioned previously into the keys folder. Move this folder into the ansible folder in the downloaded repo. Also make sure you have set the environment variables for the tokens as mentioned previously.

e. In order to provision the VM's simply run the script:
```
bash ProvisionServers.sh
```

f. Go to the management consoles and verify that the VM's have been provisioned.

##Installing nginx via ansible
1. In order to install and run the nginx server on these servers we need to use ansible.
2. The provisioning script also adds the inventory file to the ansible folder. 
3. This is the file which has the information about the VM's. 
4. The nginx.yml file in the ansible folder is playbook which has code to install nginx based on the inventory file it receives as an argument. 
5. In order to install nginx run the following script:
```
bash InstallNginx.sh
```

Once the playbook installs and starts nginx service, go to the IP of the VM in order to verify that nginx is working properly. e.g. - http://192.168.1.103

Once this is done, we have met all the requirements and the servers have been installed.
