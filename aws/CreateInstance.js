var AWS = require('aws-sdk');
var fs = require("fs");

var aws_access_key = process.env.AWS_ACCESS_KEY
var aws_secret_key = process.env.AWS_SECRET_KEY

AWS.config.region = 'us-west-2';
AWS.config.update({accessKeyId: aws_access_key, secretAccessKey: aws_secret_key});

var ec2 = new AWS.EC2();
//var instanceId;

var params = {
  ImageId: 'ami-cd2f2afd', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't2.micro',
  MinCount: 1, MaxCount: 1,
  KeyName: "devops",
  SecurityGroups: ["devops"]
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  getInstanceData(instanceId);
  //console.log("Created instance", instanceId);
});

function getInstanceData(instanceID) {
  var interval = setInterval(function() {
    ec2.describeInstances({InstanceIds:[instanceID]}, function(err, data) {
      if(err) {
        console.log("ERROR - " + err);
      }
      else {
        //console.log(data)
        
          if(data.Reservations && data.Reservations[0].Instances) {
            if(data.Reservations[0].Instances.length > 0 && data.Reservations[0].Instances[0].State.Name == "running") {
              var instance = data.Reservations[0].Instances[0];
              //console.log(instance.PublicIpAddress)
              //console.log('\t'+instance.InstanceId+'\t'+instance.PublicIpAddress+'\t'+instance.InstanceType+'\t'+instance.ImageId+'\t'+instance.State.Name);
              fs.appendFile(__dirname + "/../ansible/inventory", "aws ansible_ssh_host=" + instance.PublicIpAddress + " ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/devops.pem" + "\n")
              console.log("===================================== Successfully Created an AWS EC2 Instance =====================================");
              clearInterval(interval);
            }
          }
        }
      });
  }, 5000);
}